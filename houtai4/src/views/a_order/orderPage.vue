<style scoped>
    @import '../../styles/common.less';
    #map-container{
        margin-left: 8px;
        width: 100%;
        height: 400px;
    }
    .content{position:relative;width:100%;height:100%;}
    .loadbox{position:absolute;width:100%;height:100%;
        background:rgba(0,0,0,.2);
        z-index: 9999999;}
    .loadbox img{width:100px;height:100px;position:absolute;top:50%;left:50%;margin-left:-50px;margin-top:-50px;}
	.rowflex{display: flex;display: -webkit-flex;flex-flow: row nowrap;}
    .tree-left{margin-top:5px;width:12%;}
</style>
<template>
    <div class="content">
        <div class="loadbox" :hidden="imgshow" >
            <img src="../../images/d161165956e23.gif"  class="loadingimg" />
        </div>
        <div class="rowflex">
        	<div class="tree-left">
				<Card>
					<!--show-checkbox-->
					<Tree :data="baseData" ref="tree" @on-select-change="choice" ></Tree>
				</Card>
			</div>
		    <div style="padding: 5px;width:88%">
		        <Card>
		            <Row>
		                <!--<Row>
		                    <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入客户手机..." v-model="queryBody.req.memberMobile" style="width: 200px;padding: 3px" /></span>
		                    <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入客户名称..." v-model="queryBody.req.memberName" style="width: 200px;padding: 3px" clearable/></span>
		                    <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入保洁员名称..." v-model="queryBody.req.cleanerName" style="width: 200px;padding: 3px" clearable/></span>
		                    <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入保洁员手机号码..." v-model="queryBody.req.cleanerMobile" style="width: 200px;padding: 3px" clearable/></span>
		
		                    <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入订单号..." v-model="queryBody.req.orderSn" style="width: 200px;padding: 3px" clearable/></span>
		
		                    <Select placeholder="订单状态" v-model="queryBody.req.status" style="width:200px;padding: 3px" clearable>
		                        <Option v-for="item in statusSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
		                    </Select>
		                    <Select placeholder="保洁类型" v-model="queryBody.req.cleanType" style="width:200px;padding: 3px" clearable>
		                        <Option v-for="item in cleanType" :value="item.value" :key="item.value">{{ item.label }}</Option>
		                    </Select>
		                </Row>
		-->
		                <!--<Row style="padding: 3px" id="address_row">
		                    <span>服务地区: </span>
		                    <Select placeholder="请选择省份" v-model="cityCode.province" style="width:200px;padding: 3px" clearable @on-change="selProvince">
		                        <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
		                    </Select>
		                    <Select placeholder="请选择城市" v-model="cityCode.city" style="width:200px;padding: 3px" clearable @on-change="selCity">
		                        <Option v-for="item in cityList" :value="item.id" :key="item.id">{{item.name}}</Option>
		                    </Select>
		                    <Select placeholder="请选择区" v-model="cityCode.town" style="width:200px;padding: 3px" clearable>
		                        <Option v-for="item in townList" :value="item.id" :key="item.id">{{item.name}}</Option>
		                    </Select>
		                </Row>-->
		
		
		                <div style="padding: 3px">
		                    <!--<Row>
		                        下单时间:
		                        <DatePicker type="datetime" placement="bottom-end" v-model="queryBody.req.startTime" style="width: 150px;padding: 3px" placeholder="开始时间" clearable></DatePicker>
		                        -
		                        <DatePicker type="datetime" @on-change="placeChange" placement="bottom-end" v-model="queryBody.req.endTime" style="width: 150px;padding: 3px" placeholder="截止时间" clearable></DatePicker>
		                        保洁时间:
		                        <DatePicker type="datetime" placeholder="开始时间" v-model="queryBody.req.startCompletionTime" style="width: 150px;padding: 3px" clearable/>
		                        -
		                        <DatePicker type="datetime" @on-change="completionChange" placeholder="截止时间" v-model="queryBody.req.endCompletionTime" style="width: 150px;padding: 3px" clearable/>
		
		                        服务时间:
		                        <DatePicker type="datetime" placeholder="开始时间" v-model="queryBody.req.startAppointmentTime" style="width: 150px;padding: 3px" clearable/>
		                        -
		                        <DatePicker type="datetime" @on-change="appointChange" placeholder="截止时间" v-model="queryBody.req.endAppointmentTime" style="width: 150px;padding: 3px" clearable/>
		                    </Row>-->
		
		
		                    <!--<span @click="queryMyListClick" style="margin-left: 3px;"><Button type="primary" icon="search">查询</Button></span>
		                    <span @click="timeoutList" style="margin-left: 3px;"><Button type="error" icon="search">超时预警订单</Button></span>
		                    -->
		                    <span style="margin-left: 3px;"><Button type="success" @click="exportExcel">导出excel</Button></span>
		                </div>
		            </Row>
		            <Row class="margin-top-10 searchable-table-con1">
		                <Table border
		                       :columns="columns"
		                       :data="myList"
		                       :loading="tableLoading"
		                       no-data-text="暂无数据"
		                ></Table>
		                <Page style="margin-top: 5px" show-total
		                      :total="queryBody.pagination.total"
		                      :current="queryBody.pagination.page"
		                      :page-size="queryBody.pagination.size"
		                      @on-change="changePage"
		                      show-elevator>
		                </Page>
		            </Row>
		        </Card>
		
		        <Modal v-model="editShow" title="订单详情" @on-ok="ok" @on-cancel="cancel" 
		        	width="700" :mask-closable=false>
		            <Form :model="viewModel" :labelWidth="120" inline>
		                <Row>
		                    <FormItem prop="orderSn" label="订单编号" >
		                        <Input type="text" v-model="viewModel.orderSn" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="cleanPeriod" label="保洁时长(小时)" >
		                        <Input type="text" v-model="viewModel.realCleanPeriod === null? viewModel.cleanPeriod:viewModel.realCleanPeriod" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="cleanArea" label="保洁面积(平方)" >
		                        <Input type="text" v-model="viewModel.cleanArea" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="deposit" label="原保洁费用(元)" >
		                        <Input type="text" v-model="viewModel.originalFee" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="deposit" label="折后保洁费用(元)" >
		                        <Input type="text" v-model="viewModel.discount > 0? (viewModel.originalFee * viewModel.discount / 100).toFixed(2):viewModel.originalFee" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="平台抽成(元)" >
		                        <Input type="text" v-model="viewModel.platformBonus" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="保洁员收入(元)" >
		                        <Input type="text" v-model="viewModel.cleanerSalary" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="deposit" label="下单时间" >
		                        <Input type="datetime" placement="bottom-end" v-model="new Date(viewModel.createTime).formatDef()" placeholder="下单时间"  :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="deposit" label="服务时间" >
		                        <Input type="datetime" placement="bottom-end"  v-model="viewModel.appointmentTime == null? '':new Date(viewModel.appointmentTime).formatDef()" :readonly="disableEdit"></Input>
		                    </FormItem>
		
		                    <FormItem prop="payType" label="服务类型" >
		                        <Input type="text" v-model="viewModel.cleanType=='00'?'个人日常':viewModel.cleanType=='01'?'个人开荒':viewModel.cleanType=='10'?'公司日常':'公司开荒'" readonly></Input>
		                    </FormItem>
		                    <FormItem prop="payType" label="支付类型" >
		                        <Select readonly v-model="viewModel.payType" :style="{width: $util.width}" clearable :disabled="disableEdit">
		                            <Option :value=1>微信</Option>
		                            <Option :value=2>支付宝</Option>
		                            <Option :value=3>银行</Option>
		                        </Select>
		                    </FormItem>
		
		                    <FormItem prop="addr" label="地址" >
		                        <Input type="text" v-model="viewModel.addr" :readonly="disableEdit"></Input>
		                    </FormItem>
		
		                    <FormItem prop="distance" label="客户与保洁员的距离(米)" >
		                        <Input type="text" v-model="viewModel.distance" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="交通费(元)" >
		                        <Input type="text" v-model="viewModel.distanceFee" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="定金(元)" >
		                        <Input type="text" v-model="viewModel.deposit" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="保洁员电话" >
		                        <Input type="text" v-model="viewModel.cleanerMobile" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="会员电话" >
		                        <Input type="text" v-model="viewModel.memberMobile" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <Row>
		                        <p style="margin-left: 60px"><b>订金支付</b></p>
		                        <div v-for="item in depositList">
		                            <FormItem label="商户订单号" >
		                                <Input type="text" v-model="item.payOrderNo" :readonly="disableEdit"></Input>
		                            </FormItem>
		                            <FormItem :label="item.tradeTypeName" >
		                                <Input type="text" v-model="item.payId" :readonly="disableEdit"></Input>
		                            </FormItem>
		                        </div>
		                    </Row>
		                    <Row>
		                        <p style="margin-left: 60px"><b>订单支付</b></p>
		                        <div v-for="item in payOrderList">
		                            <FormItem label="商户订单号" >
		                                <Input type="text" v-model="item.payOrderNo" :readonly="disableEdit"></Input>
		                            </FormItem>
		                            <FormItem :label="item.tradeTypeName" >
		                                <Input type="text" v-model="item.payId" :readonly="disableEdit"></Input>
		                            </FormItem>
		                        </div>
		                    </Row>
		                    <Row>
		                        <FormItem label="时间进度">
		                            <Steps :current=currentStep direction="vertical">
		                                <Step v-for="(item, idx) in hisArr" :key="idx" :title="item.time" :content="item.value"></Step>
		                            </Steps>
		                        </FormItem>
		                    </Row>
		                </Row>
		                <Row>
		                    <FormItem prop="memberRemark" label="客户备注" style="width: 576px">
		                        <Input v-model="viewModel.memberRemark" readonly type="textarea" :rows="3"></Input>
		                    </FormItem>
		                </Row>
		                <Row>
		                    <FormItem prop="remark" label="历史备注" style="width: 576px">
		                        <Input readonly v-model="viewModel.orderRemark" type="textarea" placeholder="暂无历史备注" :rows="5"></Input>
		                    </FormItem>
		                </Row>
		
		                <Row v-if="$util.getAccess('order_remark')">
		                    <FormItem prop="remark" label="追加备注" style="width: 400px">
		                        <Input v-model="appendOrderRemark" type="textarea" placeholder="请追加备注..." :rows="5"></Input>
		                    </FormItem>
		                    <Button type="success" @click="subRemark">提交</Button>
		                </Row>
		                <FormItem v-if="(viewModel.status != 99 && viewModel.status != 10 && viewModel.status != 9) && $util.getAccess('order_cancel')">
		                    <Button type="error" @click="changeStatus">取消订单</Button>
		                </FormItem>
		            </Form>
		            <div slot="footer">
		                <Button type="ghost" @click="cancel">返回</Button>
		            </div>
		        </Modal>
		
		        <Modal v-model="deliverShow" title="在线订单派送" @on-ok="ok" @on-cancel="cancel" width="1100" cancel-text="" :mask-closable=false :closable=false>
		            <Row style="margin-left: 5px; font-size: 14px">
		                <b>标注颜色的意义:
		                    <span style="color: brown">棕色:不接单</span>
		                    <span style="color: green">绿色:正在接单</span>
		                    <span style="color: #666">灰色:工作中</span>
		                </b>
		            </Row>
		            <Row :gutter="12">
		                <Col span="11">
		                    <div id="map-container"></div>
		                    <Spin size="large" fix v-if="spinShow"></Spin>
		                </Col>
		                <Col span="13">
		                    <div>
		                        <Table border :columns="cleanerColumns" :data="cleanerList" :loading="cleanerListLoading" no-data-text="暂无数据" height="400"></Table>
		                    </div>
		                </Col>
		            </Row>
		            <Row style="margin-top: 10px">
		                <Form :model="viewModel" :labelWidth="90" inline>
		                    <FormItem  label="订单编号" >
		                        <Input type="text" v-model="viewModel.orderSn" :readonly="disableEdit"></Input>
		                    </FormItem>
		
		                    <FormItem prop="payType" label="支付类型" >
		                        <Select readonly v-model="viewModel.payType" style="width: 162px" disabled>
		                            <Option :value=1>微信</Option>
		                            <Option :value=2>支付宝</Option>
		                            <Option :value=3>银行</Option>
		                        </Select>
		                    </FormItem>
		
		                    <FormItem  label="保洁类型">
		                        <Select style="width: 162px" disabled v-model="viewModel.cleanType">
		                            <Option value="00">个人日常</Option>
		                            <Option value="01">个人开荒</Option>
		                            <Option value="10">公司日常</Option>
		                            <Option value="11">公司开荒</Option>
		                        </Select>
		                    </FormItem>
		                    <FormItem  label="保洁地址">
		                        <Input type="text" v-model="viewModel.addr" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem  label="保洁面积">
		                        <Input type="text" v-model="viewModel.cleanArea" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem  label="保洁时长(小时)">
		                        <Input type="text" v-model="viewModel.cleanPeriod" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem  label="折后保洁费用">
		                        <Input type="text" v-model="viewModel.cleanFee" :readonly="disableEdit"></Input>
		                    </FormItem>
		
		                    <FormItem  label="客户名称">
		                        <Input type="text" v-model="viewModel.memberName" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem  label="客户手机">
		                        <Input type="text" v-model="viewModel.memberMobile" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem  label="客户备注">
		                        <Input type="text" v-model="viewModel.memberRemark" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem  label="下单时间">
		                        <Input type="text" v-model="new Date(viewModel.createTime).formatDef()" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem  label="预约时间">
		                        <Input type="text" v-model="new Date(viewModel.appointmentTime).formatDef()" :readonly="disableEdit"></Input>
		                    </FormItem>
		                </Form>
		            </Row>
		            <div slot="footer">
		                <Button type="ghost" @click="deliverShow = false;mapObj.remove(orderMarker);mapObj.remove(orderSubMarker);">返回</Button>
		            </div>
		
		
		        </Modal>
		
		        <Modal :width="700" v-model="cleanerShow" title="保洁员详情" @on-ok="ok" @on-cancel="cancel" ok-text="返回" cancel-text="" :closable=false :mask-closable=false>
		            <Row type="flex" justify="center" align="middle">
		                <Col span="11">
		                    <div style="width: 100px;height: 100px;margin: 5px auto;">
		                        <img style="height: 100%; width: 100%" :src="cleanerModel.picLogo" alt="">
		                    </div>
		                </Col>
		                <Col span="11" style="height: 100%">
		                    <Select :placeholder="cleanerModel.level === null || cleanerModel.level === ''? '暂无等级':cleanerModel.level" style="width:200px;padding: 3px" :disabled="disableEdit" clearable>
		
		                    </Select>
		                </Col>
		            </Row>
		            <Row>
		                <Form :model="cleanerModel" :labelWidth="90" inline>
		                    <FormItem prop="user" label="姓名" >
		                        <Input type="text" v-model="cleanerModel.name" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="user" label="身份证">
		                        <Input type="text" v-model="cleanerModel.idNum" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="user" label="手机号码">
		                        <Input type="text" v-model="cleanerModel.mobile" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="user" label="公司名称">
		                        <Input type="text" v-model="cleanerModel.companyName" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="user" label="营业执照">
		                        <Input type="text" v-model="cleanerModel.idBusinessLicense" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="user" label="公司地址">
		                        <Input type="text" v-model="cleanerModel.addr" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="user" label="开户行">
		                        <Input type="text" v-model="cleanerModel.bankName" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="user" label="基本帐号">
		                        <Input type="text" v-model="cleanerModel.bankAccountNo" :readonly="disableEdit"></Input>
		                    </FormItem>
		
		                    <FormItem prop="presentAddr" label="现住址">
		                        <Input type="text" v-model="viewModel.presentAddr" ></Input>
		                    </FormItem>
		                    <FormItem prop="emergencyName" label="紧急联系人">
		                        <Input type="text" v-model="viewModel.emergencyName" ></Input>
		                    </FormItem>
		                    <FormItem prop="emergencyMobile" label="紧急联系电话">
		                        <Input type="text" v-model="viewModel.emergencyMobile" ></Input>
		                    </FormItem>
		
		                    <FormItem prop="user" label="审核状态">
		                        <Select v-model="cleanerModel.auditStatus" style="width:162px" :disabled="disableEdit">
		                            <Option v-for="item in auditSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
		                        </Select>
		                    </FormItem>
		
		                    <FormItem prop="user" label="保洁员类型">
		                        <Select placeholder="暂无" v-model="cleanerModel.type" style="width:162px" :disabled="disableEdit">
		                            <Option v-for="item in typeSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
		                        </Select>
		                    </FormItem>
		
		                    <FormItem prop="user" label="状态">
		                        <Select v-model="cleanerModel.status" style="width:162px" :disabled="disableEdit">
		                            <Option v-for="item in cleanerStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
		                        </Select>
		                    </FormItem>
		
		                    <FormItem prop="user" label="注册时间">
		                        <Input type="text" v-model="cleanerModel.ctime" :readonly=true></Input>
		                    </FormItem>
		                    <!--123123123-->
		                    <FormItem prop="user" label="修改时间">
		                        <Input type="text" v-model="cleanerModel.utime" :readonly=true></Input>
		                    </FormItem>
		                </Form>
		            </Row>
		
		            <Row v-if="disableEdit">
		                <p style="margin:5px"><b>身份证照片</b></p>
		                <div v-for="pic in idPic" style="width: 100px;height: 100px;float: left;margin:5px">
		                    <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt=""/>
		                </div>
		            </Row>
		
		            <Row v-if="disableEdit">
		                <p style="margin:5px"><b>营业执照</b></p>
		                <div v-for="pic in BusLicPic" style="width: 100px;height: 100px;float: left;margin:5px">
		                    <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt=""/>
		                </div>
		            </Row>
		
		            <Row v-if="disableEdit">
		                <p style="margin:5px"><b>公司合同</b></p>
		                <div v-for="pic in contactPic" style="width: 100px;height: 100px;float: left;margin:5px">
		                    <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt=""/>
		                </div>
		            </Row>
		
		            <Row v-if="disableEdit">
		                <p style="margin:5px"><b>其他资质</b></p>
		                <div v-for="pic in otherPic" style="width: 100px;height: 100px;float: left;margin:5px">
		                    <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt=""/>
		                </div>
		            </Row>
		
		            <div slot="footer">
		                <Button type="text" size="large" @click="cleanerShow = false">返回</Button>
		            </div>
		        </Modal>
		
		        <!--照片大图模块-->
		        <Modal v-model="picModal" title="图片" cancel-text="" >
		            <img style="width: 100%;height: 100%;padding: 5px 5px" :src="viewingPic" alt="">
		        </Modal>
		
		
		        <!-------------------------------分------------------------------割---------------------------------------线-------------------->
		
		
		        <Modal v-model="modifyShow" title="修改订单" @on-ok="ok" @on-cancel="cancel" width="700" :mask-closable=true :closable=false>
		            <Form :model="modifyFormModel" :labelWidth="120" inline>
		                <Row id="modifiedDomain">
		                    <FormItem prop="orderSn" label="订单编号" >
		                        <Input type="text" v-model="modifyFormModel.orderSn" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="cleanPeriod" label="保洁时长(小时)" >
		                        <Input type="text" v-model="modifyFormModel.realCleanPeriod === null? modifyFormModel.cleanPeriod:modifyFormModel.realCleanPeriod" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="cleanArea" label="保洁面积(平方)" >
		                        <Input type="text" v-model="modifyFormModel.cleanArea" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="deposit" label="原保洁费用(元)" >
		                        <Input type="text" v-model="modifyFormModel.originalFee" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="deposit" label="折后保洁费用(元)" >
		                        <Input type="text" v-model="modifyFormModel.discount > 0? (modifyFormModel.originalFee * modifyFormModel.discount / 100).toFixed(2):modifyFormModel.originalFee" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="平台抽成(元)" >
		                        <Input type="text" v-model="modifyFormModel.platformBonus" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="保洁员收入(元)" >
		                        <Input type="text" v-model="modifyFormModel.cleanerSalary" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="deposit" label="下单时间" >
		                        <DatePicker type="datetime" placement="bottom-end" v-model="new Date(modifyFormModel.createTime).formatDef()" placeholder="下单时间" @on-change="detectionChange" :readonly="disableEdit"></DatePicker>
		                    </FormItem>
		                    <FormItem prop="deposit" label="服务时间" >
		                        <DatePicker type="datetime" placement="bottom-end"  v-model="modifyFormModel.appointmentTime" @on-change="detectionChange" clearable></DatePicker>
		                    </FormItem>
		
		                    <FormItem prop="payType" label="服务类型" >
		                        <Input type="text" v-model="modifyFormModel.cleanType=='00'?'个人日常':modifyFormModel.cleanType=='01'?'个人开荒':modifyFormModel.cleanType=='10'?'公司日常':'公司开荒'" readonly></Input>
		                    </FormItem>
		                    <FormItem prop="payType" label="支付类型" >
		                        <Select readonly v-model="modifyFormModel.payType" :style="{width: $util.width}" clearable :disabled="disableEdit">
		                            <Option :value=1>微信</Option>
		                            <Option :value=2>支付宝</Option>
		                            <Option :value=3>银行</Option>
		                        </Select>
		                    </FormItem>
		
		                    <FormItem prop="addr" label="地址" >
		                        <Input type="text" v-model="modifyFormModel.addr" @on-change="detectionChange"></Input>
		                    </FormItem>
		
		                    <FormItem prop="distance" label="客户与保洁员的距离(米)" >
		                        <Input type="text" v-model="modifyFormModel.distance" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="交通费(元)" >
		                        <Input type="text" v-model="modifyFormModel.distanceFee" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="定金(元)" >
		                        <Input type="text" v-model="modifyFormModel.deposit" :readonly="disableEdit"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="保洁员电话" >
		                        <Input type="text" v-model="modifyFormModel.cleanerMobile" @on-change="detectionChange"></Input>
		                    </FormItem>
		                    <FormItem prop="distanceFee" label="会员电话" >
		                        <Input type="text" v-model="modifyFormModel.memberMobile" @on-change="detectionChange"></Input>
		                    </FormItem>
		                </Row>
		                <Row>
		                    <FormItem prop="remark" style="width: 400px">
		                        <Button type="success" @click="subModify">提交</Button>
		                    </FormItem>
		                </Row>
		            </Form>
		            <div slot="footer">
		                <Button type="ghost" @click="closeModify">返回</Button>
		            </div>
		        </Modal>
		
		    </div>
        </div>
    </div>
</template>
<script>
    import AMap from 'AMap';
    import AMapUI from 'AMapUI';
    import au from '../../libs/accessUtils.js';
    import Cookies from 'js-cookie';
    var disposable = true;
    var isSaveStatus = true;
    export default {
        data () {
            return {
                queryUrl: '/order/list', // 获取列表
                timeoutUrl: '/order/timeout',
                remarkUrl: '/order/remark',
                cleanerUrl: '/cleaner/listOnlineCleaner',
                oneCleanerUrl: '/cleaner/',
                oneOrderUrl: '/order/',
                dispatcherUrl: '/order/dispatcher',
                cancelUrl: '/order/cancel/',
                commUrl: '/comment/detail/',
                eventUrl: '/order/event/',
                payRemindUrl: '/order/payRemind', // 提醒支付余额
                reassignmentUrl: '/order/reassignment', // 改派
                exportUrl: '/order/export',
                describeSettingUrl: '/order/describeSetting', // 修改订单详情

                provinceList: [],
                cityList: [],
                townList: [],
                cityCode: {
                    province: null,
                    city: null,
                    town: null
                },
                editCityCode: {
                    province: null,
                    city: null,
                    town: null
                },

                queryBody: {// 请求体
                    pagination: {
                        page: 1,
                        total: 10,
                        size: 10
                    },
                    req: {}
                },
                tableLoading: true,
                cleanerList: [],
                depositList: [],
                payOrderList: [],
                startTime: '',
                endTime: '',

                cleanerShow: false,
                cleanerModel: {},
                idPic: [],
                BusLicPic: [],
                contactPic: [],
                otherPic: [],
                picModal: false,
                viewingPic: '',

                modifyShow: false,

                spinShow: true,
                cleanerListLoading: true,

                isTimeout: false,
                isFirstTimeout: true,
                currentStep: 0,

                isSurvey: false,

                cleanType: [
                    {value: '00', label: '个人日常'},
                    {value: '01', label: '个人开荒'},
                    {value: '10', label: '公司日常'},
                    {value: '11', label: '公司开荒'}
                ],

                verifySelector: [
                    {value: 1, label: '自注册'},
                    {value: 2, label: '邀请入驻'}
                ],
                auditSel: [
                    {value: 0, label: '未审核'},
                    {value: 1, label: '已提交待审核'},
                    {value: 2, label: '通过'},
                    {value: 3, label: '不通过'}
                ],
                typeSelector: [
                    {value: 1, label: '个人'},
                    {value: 2, label: '公司'}
                ],

                funSelector: [
                    {value: 1, label: '没接单'},
                    {value: 2, label: '正在接单'},
                    {value: 3, label: '工作中'}
                ],

                cleanerStatus: [
                    {value: 1, label: '正常'},
                    {value: 2, label: '停用'}
                ],

                confirmSel: [
                    {value: 0, label: '未审核'},
                    {value: 1, label: '提交资料待审核'},
                    {value: 2, label: '审核通过'},
                    {value: 3, label: '审核不通过'}
                ],

                statusSelector: [
                    {value: 1, label: '订单已创建'},
                    {value: 2, label: '定金已经支付'},
                    {value: 3, label: '已经派单'},
                    {value: 4, label: '保洁员已接单'},
                    {value: 5, label: '保洁员已出发'},
                    {value: 6, label: '保洁员已到达'},
                    {value: 7, label: '保洁员已开始清洁'},
                    {value: 8, label: '余款待支付'},
                    {value: 9, label: '订单已支付'},
                    {value: 10, label: '订单完成'},
                    {value: 11, label: '保洁拒绝接单'},
                    {value: 12, label: '定金支付中'},
                    {value: 13, label: '订单支付中'},
                    {value: 14, label: '定金待支付'},
                    {value: 15, label: '保洁员已完成'},
                    {value: 99, label: '订单取消'}
                ],
                disableEdit: true,
                editShow: false,
                viewModel: {}, // 编辑单个的实体
                appendOrderRemark: '',

                modifyFormModel: {}, // 修改订单实体

                deliverShow: false,
                deliverModal: {},
                mapObj: null,

                cleanerColumns: [
                    {title: 'id', key: 'id', align: 'center', minWidth: 110},
                    {title: '姓名', key: 'name', align: 'center', minWidth: 110},
                    {title: '手机号码', key: 'mobile', align: 'center', minWidth: 120},
                    {title: '工作年龄', key: 'workingYears', align: 'center', minWidth: 110},
                    {title: '状态',
                        key: 'orderStatus',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                            let type = params.row.orderStatus;
                            let status = params.row.status;
                            if (type === 1) type = h('div', {attrs: {style: 'color:brown'}}, '不接单');
                            else if (status === 1 && type === 2) type = h('div', {attrs: {style: 'color:green'}}, '空闲中');
                            else if (status === 1 && type === 3) type = h('div', {attrs: {style: 'color:red'}}, '工作中');
                            else type = h('div', {attrs: {style: 'color:brown'}}, '未知');
                            return type;
                        }},
                    {title: '操作',
                        className: 'actionColumn',
                        key: 'action',
                        width: 130,
                        align: 'center',
                        fixed: 'right', // 操作
                        render: (h, params) => {
                            let arr = [];
                            let dis = true;
                            let status = params.row.status;
                            if (status === 1 && params.row.orderStatus === 2) dis = false;
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => { this.moveTo(params.row.id); }}}, '查看'));
                            if (this.reFlag) {
                                arr.push(h('Button', {props: {type: 'success', size: 'small', disabled: dis}, on: {click: () => { this.ressign(params.row.id); }}}, '改派'));
                            } else {
                                arr.push(h('Button', {props: {type: 'success', size: 'small', disabled: dis}, on: {click: () => { this.dd(params.row.id); }}}, '派单'));
                            }


                            return h('div', arr);
                        }
                    }
                ],

                columns: [// 字段
                    // {title: '订单号', key: 'orderSn', minWidth:100, fixed:'left', align: 'center'},
                    {title: '订单号', key: 'orderSn', width: 160, minWidth: 160, fixed: 'left', align: 'center'},
                    // {title: '客户手机号', key: 'memberMobile', minWidth:100, align: 'center'},
                    {title: '客户手机号', key: 'memberMobile', width: 140, align: 'center'},
                    {title: '状态',
                        key: 'status',
                        minWidth: 100,
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            let self = this;
                            let obj = self.myList[params.index].status;
                            if (obj === 1) obj = h('div', {attrs: {style: 'color:blue'}}, '订单已创建');
                            else if (obj === 2) obj = h('div', {attrs: {style: 'color:blue'}}, '定金已经支付');
                            else if (obj === 3) obj = h('div', {attrs: {style: 'color:blue'}}, '已经派单');
                            else if (obj === 4) obj = h('div', {attrs: {style: 'color:blue'}}, '保洁员已接单');
                            else if (obj === 5) obj = h('div', {attrs: {style: 'color:blue'}}, '保洁员已出发');
                            else if (obj === 6) obj = h('div', {attrs: {style: 'color:blue'}}, '保洁员已到达');
                            else if (obj === 7) obj = h('div', {attrs: {style: 'color:green'}}, '保洁员已开始清洁');
                            else if (obj === 8) obj = h('div', {attrs: {style: 'color:green'}}, '余款待支付');
                            else if (obj === 9) obj = h('div', {attrs: {style: 'color:blue'}}, '订单已支付');
                            else if (obj === 10) obj = h('div', {attrs: {style: 'color:blue'}}, '订单完成');
                            else if (obj === 11) obj = h('div', {attrs: {style: 'color:blue'}}, '保洁拒绝接单');
                            else if (obj === 12) obj = h('div', {attrs: {style: 'color:blue'}}, '定金支付中');
                            else if (obj === 13) obj = h('div', {attrs: {style: 'color:blue'}}, '订单支付中');
                            else if (obj === 14) obj = h('div', {attrs: {style: 'color:blue'}}, '定金待支付');
                            else if (obj === 15) obj = h('div', {attrs: {style: 'color:green'}}, '保洁员已完成');
                            else if (obj === 99) obj = h('div', {attrs: {style: 'color:red'}}, '订单取消');
                            else obj = h('div', {attrs: {style: 'color:brown'}}, '未知');
                            return obj;
                        }
                    },
                    {title: '下单时间',
                        key: 'createTime',
                        minWidth: 165,
                        width: 165,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', new Date(params.row.createTime).formatDef());
                        }
                    },
                    {title: '预约服务时间',
                        key: 'appointmentTime',
                        minWidth: 165,
                        width: 165,
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.appointmentTime !== null) {
                                return h('div', new Date(params.row.appointmentTime).formatDef());
                            } else {
                                return h('div', '暂无服务');
                            }
                        }
                    },

                    {title: '支付余额时间',
                        key: 'payTime',
                        minWidth: 165,
                        width: 165,
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.payTime !== null) {
                                return h('div', new Date(params.row.payTime).formatDef());
                            } else {
                                return h('div', '');
                            }
                        }
                    },

                    {title: '地址', key: 'address', minWidth: 50, width: 200, align: 'center'},
                    {title: '保洁类型',
                        key: 'cleanType',
                        width: 120,
                        align: 'center', // minWidth:100
                        render: (h, params) => {
                            let cleanType = params.row.cleanType;
                            if (cleanType === '00') return h('div', '个人日常');
                            else if (cleanType === '01') return h('div', '个人开荒');
                            else if (cleanType === '10') return h('div', '公司日常');
                            else if (cleanType === '11') return h('div', '公司开荒');
                            else return h('div', '未知');
                        }
                    },
                    {title: '保洁面积(平方)', key: 'cleanArea', minWidth: 100, width: 120, align: 'center'},
                    {title: '保洁员收入(元)',
                        key: 'cleanArea',
                        minWidth: 100,
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            // 计算保洁员收入;
                            let cleanerSalary = params.row.realIncome;
                            if(cleanerSalary>0){
                               cleanerSalary = params.row.realIncome;
                            }else{
                                cleanerSalary = '0.00';
                            }
                            // let percent = params.row.platformBonusPercent;
                            // let cleanerSalary = '';
                            // if (platformBonus > 0) {
                            //     let sumFee = platformBonus / percent * 100;
                            //     cleanerSalary = (sumFee - platformBonus).toFixed(2);
                            // } else {
                            //     cleanerSalary = '0.00';
                            // }
                            return h('div', cleanerSalary);
                        }
                    },
                    {title: '保洁时长(小时)',
                        key: 'cleanPeriod',
                        minWidth: 100,
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            let period = params.row.realCleanPeriod;
                            if (period === null) {
                                return h('div', params.row.cleanPeriod);
                            } else {
                                return h('div', period);
                            }
                        }
                    },
                    {title: '保洁员名称', key: 'cleanerName', width: 120, align: 'center'}, // minWidth:70
                    {title: '保洁员号码', key: 'cleanerMobile', minWidth: 100, width: 140, align: 'center'},
                    {title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 130, // 操作
                        render: (h, params) => {
                            let arr = [];
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => { this.view(params.index); }}}, '详情'));
                            // 1,2,11
                            let dis = true;
                            let access = this.$util.getAccess('order_delivery');
                            if (access) {
                                if (params.row.status === 2) dis = false;
                                arr.push(h('Button', {props: {type: 'success', size: 'small', disabled: dis}, on: {click: () => { this.deliver(params.index, false); }}}, '派送'));
                                if (params.row.status === 3 || params.row.status === 4) {
                                    arr.push(h('Button', {props: {type: 'success', size: 'small'}, on: {click: () => { this.deliver(params.index, true); }}}, '改派'));
                                }
                            }
                            if(Cookies.get('refType') === '3' ) {
                                if (params.row.status === 8 || params.row.status === 15) {
                                    arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => { this.payRemind(params.row.orderSn); }}}, '短信'));
                                }

                                // 创建订单和 定金已支付的才可以修改信息
                                // if (params.row.status === 1 || params.row.status === 2){
                                //
                                // }
                                arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => { this.resetOrder(params.row.orderSn); }}}, '修改'));
                            }



                            return h('div', arr);
                        }
                    }
                ],
                myList: [],
                reFlag: false, // 改派的标识, true为改派
                markers: [],
                orderMarker: {},
                orderSubMarker: {},
                hisArr: [],
                subMarkers: [],
                imgshow:true,
                baseData: [{
                    expand: true,
                    title: '全部',
                    id:'11',
                    children: [{
                        name: '东莞',
                        citycode:'22',
                        expand: true,
                        children: [{
                            title: '南城',
                            id:'33'
                        }, {
                            name: '东城',
                            citycode:'33'
                        }]
                    }, {
                        name: '广州市',
                        citycode:'22',
                        expand: true,//是否展示子节点
                        children: [{
                            name: '增城',
                            citycode:'33'
                        },
                        {
                            name: '天河',
                            citycode:'33'
                        },
                        ]
                    }]
                
                },
                {
                    expand: true,
                    name: '浙江',
                    citycode:'11',
                    children: [{
                        name: '杭州',
                        citycode:'22',
                        expand: true,
                        children: [{
                            name: '余杭',
                            citycode:'22',
                        }, {
                            name: '大扫把',
                            citycode:'22',
                        }]
                    }]
                }],
                
            };
        },
        created () {
            let self = this;
            let cityCode = 100000;
            let levelType = 1;
            let prop = 'provinceList';
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);

            let memberName = self.$route.params.memberName;
            let cleanerName = self.$route.params.cleanerName;
            if (memberName !== null && memberName !== undefined && memberName !== '')self.queryBody.req.memberName = memberName;
            if (cleanerName !== null && cleanerName !== undefined && cleanerName !== '')self.queryBody.req.cleanerName = cleanerName;
        },
        mounted () {
            let self = this;
            self.queryMyList();
        },
        methods: {
            // 省份确定城市
            selProvince (val) {
                let self = this;

                if (self.editShow) {
                    // 非搜索列表情况下
                    self.editCityCode.city = null;
                    self.editCityCode.town = null;
                } else {
                    // 搜索列表情况下
                    self.cityCode.city = null;
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 2, 'cityList');
            },
            selCity (val) {
                let self = this;

                if (self.editShow) {
                    // 非搜索列表情况下
                    self.editCityCode.town = null;
                } else {
                    // 搜索列表情况下
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 3, 'townList');
            },

            exportExcel () {
                let self = this;



                if (self.$util.isEmpty(self.queryBody.req.startTime)) {
                    self.$Message.error({content: '请选择下单时间的开始日期!'});
                    return;
                }
                if (self.$util.isEmpty(self.queryBody.req.endTime)) {
                    self.$Message.error({content: '请选择下单时间的结束日期!'});
                    return;
                }

                let queryBody = {req: {}};
                queryBody.req.startTime = self.queryBody.req.startTime.formatDef();
                queryBody.req.endTime = self.queryBody.req.endTime.formatDef();
                queryBody.req.cleanerName=self.queryBody.req.cleanerName;
                if (self.$util.isEmpty(self.cityCode.town) && !self.$util.isEmpty(self.cityCode.city)) {
                    queryBody.req.cityCodes = [self.cityCode.city];
                } else if (!self.$util.isEmpty(self.cityCode.town)) {
                    queryBody.req.cityCodes = [self.cityCode.town];
                } else {
                    delete queryBody.req.cityCodes;
                }

                // 数据分割
                let cityCodes = Cookies.get('cityCode');


                if (cityCodes !== undefined) {
                    let cityList = self.$util.strConvertArray(cityCodes);
                    if (cityList[0] != 'null') {
                        queryBody.req.cityCodes = cityList;
                    }
                }
                    let axios = self.$axios.create({
                    baseURL: self.$axios.defaults.baseURL
                });
                this.imgshow=false;
                axios({ // 用axios发送post请求
                    method: 'post',
                    url: 'order/export', // 请求地址
                    data: queryBody, // 参数
                    responseType: 'blob' // 表明返回服务器返回的数据类型
                }).then((res) => { // 处理返回的文件流
                    let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
                    // if (blob.size > 114) {
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob); // 创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = '订单明细.xls'; // 下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); // 点击下载
                        document.body.removeChild(downloadElement); // 下载完成移除元素
                        window.URL.revokeObjectURL(href); // 释放掉blob对象
                    self.imgshow=true
                    // } else {
                    //     self.$Message.error({content: '导出订单的结束下单时间只允许到昨天!'});
                    // }
                });
            },
            // 服务改变日期
            appointChange (formatedDate, date) {
                let self = this;
                self.baseChange(formatedDate, 'endAppointmentTime');
            },
            // 保洁改变的日期
            completionChange (formatedDate, date) {
                let self = this;
                self.baseChange(formatedDate, 'endCompletionTime');
            },
            // 下单改变的日期
            placeChange (formatedDate, date) {
                let self = this;
                self.baseChange(formatedDate, 'endTime');
            },
            baseChange (date, property) {
                let self = this;
                if (!self.$util.isEmpty(date)) {
                    let split = date.split(' ');
                    if (split[1] !== '00:00:00') {
                        self.queryBody.req[property] = new Date(date);
                    } else {
                        self.queryBody.req[property] = new Date(split[0] + ' 23:59:59');
                    }
                }
            },
            // 发送提示支付短信
            payRemind (orderSn) {
                let self = this;
                self.$Modal.confirm({title: '发送短信',
                    content: '确定发送提示支付余额的消息?',
                    onOk: () => {
                        self.$axios.post(self.payRemindUrl, {orderSn: orderSn}).then(res => {
                            self.$Notice.success({title: '发送短信', desc: '发送成功!'});
                        });
                    }});
            },
            resetOrder (index) { // 修改信息
                let self = this;
                let queryBody = {};
                queryBody.req = {};
                queryBody.loginSession = {};

                let userId = Cookies.get('userId');
                let refType = Cookies.get('refType');
                let token = Cookies.get('token');
                let agentStatus = Cookies.get('agentStatus');
                queryBody.req.orderSn = index;
                // 驗證登錄信息
                queryBody.loginSession.refId = userId;
                queryBody.loginSession.refType = refType;
                queryBody.loginSession.loginToken = token;
                queryBody.req.agentStatus = agentStatus;

                self.$axios.post(self.queryUrl, queryBody).then((res) => {
                    // self.queryBody.pagination = res.pagination;
                    // delete self.queryBody.pagination.currentIndex;
                    // self.myList = res.list;
                    // self.tableLoading = false;
                    // if (!self.$util.isEmpty(self.queryBody.req.startTime)) self.queryBody.req.startTime = new Date(self.queryBody.req.startTime);
                    // if (!self.$util.isEmpty(self.queryBody.req.endTime)) self.queryBody.req.endTime = new Date(self.queryBody.req.endTime);
                    // if (!self.$util.isEmpty(self.queryBody.req.startCompletionTime)) self.queryBody.req.startCompletionTime = new Date(self.queryBody.req.startCompletionTime);
                    // if (!self.$util.isEmpty(self.queryBody.req.endCompletionTime)) self.queryBody.req.endCompletionTime = new Date(self.queryBody.req.endCompletionTime);
                    // if (!self.$util.isEmpty(self.queryBody.req.startAppointmentTime)) self.queryBody.req.startAppointmentTime = new Date(self.queryBody.req.startAppointmentTime);
                    // if (!self.$util.isEmpty(self.queryBody.req.endAppointmentTime)) self.queryBody.req.endAppointmentTime = new Date(self.queryBody.req.endAppointmentTime);
                    // 数据绑定
                    self.bindModifyModel(res.list);
                    self.modifyShow = true;
                    self.appendOrderRemark = '';
                });
            },
            bindModifyModel (list) {
                let self = this;
                let listElement = list[0];
                self.modifyFormModel.orderSn = listElement.orderSn;

                self.modifyFormModel.cleanerId = listElement.cleanerId;
                self.modifyFormModel.cleanerName = listElement.cleanerName;
                self.modifyFormModel.memberId = listElement.memberId;
                self.modifyFormModel.memberName = listElement.memberName;
                self.modifyFormModel.deposit = listElement.deposit;
                self.modifyFormModel.payType = listElement.payType;
                self.modifyFormModel.status = listElement.status;
                self.modifyFormModel.cleanFee = listElement.cleanFee;
                self.modifyFormModel.realCleanFee = listElement.realCleanFee;
                self.modifyFormModel.originalFee = listElement.originalFee;
                self.modifyFormModel.sumFee = listElement.sumFee;
                self.modifyFormModel.realIncome = listElement.realIncome;
                self.modifyFormModel.addr = listElement.addr;

                self.modifyFormModel.cleanArea = listElement.cleanArea;
                self.modifyFormModel.distance = listElement.distance;
                self.modifyFormModel.distanceFee = listElement.distanceFee;
                self.modifyFormModel.memberRemark = listElement.memberRemark;
                self.modifyFormModel.orderRemark = listElement.orderRemark;
                self.modifyFormModel.createTime = listElement.createTime;
                self.modifyFormModel.appointmentTime = listElement.appointmentTime;
                self.modifyFormModel.payTime = listElement.payTime;
                self.modifyFormModel.cleanerReceiveOrderTime = listElement.cleanerReceiveOrderTime;
                self.modifyFormModel.cleanerArriveTime = listElement.cleanerArriveTime;
                self.modifyFormModel.cleanerSetOutTime = listElement.cleanerSetOutTime;
                self.modifyFormModel.startCleanTime = listElement.startCleanTime;
                self.modifyFormModel.endCleanTime = listElement.endCleanTime;

                self.modifyFormModel.cancelTime = listElement.cancelTime;
                self.modifyFormModel.discountId = listElement.discountId;
                self.modifyFormModel.discount = listElement.discount;
                self.modifyFormModel.platformSharePercentage = listElement.platformSharePercentage;
                self.modifyFormModel.userSharePercentage = listElement.userSharePercentage;
                self.modifyFormModel.cleanPeriod = listElement.cleanPeriod;
                self.modifyFormModel.realCleanPeriod = listElement.realCleanPeriod;
                self.modifyFormModel.cleanType = listElement.cleanType;
                self.modifyFormModel.memberMobile = listElement.memberMobile;
                self.modifyFormModel.cleanerMobile = listElement.cleanerMobile;
                self.modifyFormModel.latitude = listElement.latitude;
                self.modifyFormModel.latitude = listElement.longitude;

                self.modifyFormModel.discountFee = listElement.discountFee;
                self.modifyFormModel.platformShareDiscountFee = listElement.platformShareDiscountFee;
                self.modifyFormModel.platformBonusPercent = listElement.platformBonusPercent;
                self.modifyFormModel.minFee = listElement.minFee;
                self.modifyFormModel.hoursPer100Square = listElement.hoursPer100Square;
                self.modifyFormModel.perHourFee = listElement.perHourFee;
                self.modifyFormModel.platformBonus = listElement.platformBonus;
                self.modifyFormModel.payOrderList = listElement.payOrderList;
            },
            // 改派
            ressign (id) {
                let self = this;
                let entity = {};
                self.$Modal.confirm({title: '派单',
                    content: '确定要改派给这位保洁员吗?',
                    onOk: () => {
                        entity.cleanerId = id;
                        entity.orderSn = self.viewModel.orderSn;
                        self.$axios.post(self.reassignmentUrl, entity).then((res) => {
                            self.$Notice.success({title: '订单派送', desc: '改派成功!'});
                            self.deliverShow = false;
                            self.queryMyList();
                        });
                    }
                });
            },

            changeStatus () {
                let self = this;
                self.$Modal.confirm({title: '订单取消',
                    content: '确定要取消该订单吗?',
                    onOk: () => {
                        self.$axios.post(self.cancelUrl + self.viewModel.orderSn).then(res => {
                            self.$Notice.success({title: '订单取消', desc: '取消成功!'});
                            self.editShow = false;
                            self.queryMyList();
                        });
                    }});
            },
            showOne (id) {
                let self = this;
                self.$axios.get(self.oneCleanerUrl + id).then((res) => {
                    self.cleanerShow = true;
                    self.cleanerModel = res;
                    self.idPic = self.$util.strToPicArr(self.cleanerModel.picId0);
                    self.idPic = self.idPic.concat(self.$util.strToPicArr(self.cleanerModel.picId1));
                    self.BusLicPic = self.$util.strToPicArr(self.cleanerModel.picBusinessLicense);
                    self.contactPic = self.$util.strToPicArr(self.cleanerModel.picContract);
                    self.otherPic = self.$util.strToPicArr(self.cleanerModel.picOther);
                });
            },
            moveTo (id) {
                let self = this;
                let x = 0;

                for (x in self.markers) {
                    if (self.markers[x].F.extData === id) {
                        self.mapObj.setZoom(15);
                        self.mapObj.setCenter([ self.markers[x].F.position.lng, self.markers[x].F.position.lat]);
                    }
                }
            },
            dd (id) {
                let self = this;
                let entity = {};
                self.$Modal.confirm({title: '派单',
                    content: '确定要派单给这位保洁员吗?',
                    onOk: () => {
                        entity.cleanerId = id;
                        entity.orderSn = self.viewModel.orderSn;
                        self.$axios.post(self.dispatcherUrl, entity).then((res) => {
                            self.$Notice.success({title: '订单派送', desc: '派送成功!'});
                            self.deliverShow = false;
                            self.queryMyList();
                        });
                    }
                });
            },
            changePage (val) {
                let self = this;
                self.queryBody.pagination.page = val;

                if (self.isTimeout) {
                    self.timeoutList();
                } else {
                    self.queryMyList();
                }
            },
            timeoutList () {
                let self = this;
                self.tableLoading = true;
                self.isTimeout = true;

                if (self.isFirstTimeout) self.queryBody.pagination = {page: 1, total: 10, size: 10};

                self.$axios.get(self.timeoutUrl + self.$util.objToStr(self.queryBody.pagination)).then((res) => {
                    self.queryBody.pagination = res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.isFirstTimeout = false;
                    self.tableLoading = false;
                });
            },
            queryMyListClick () {
                let self = this;
                self.queryBody.pagination = {page: 1, total: 10, size: 10};
                self.queryMyList();
            },
            queryMyList: function () {
                let self = this;
                self.isTimeout = false;

                if (self.$util.isEmpty(self.cityCode.town) && !self.$util.isEmpty(self.cityCode.city)) {
                    self.queryBody.req.cityCodes = [self.cityCode.city];
                } else if (!self.$util.isEmpty(self.cityCode.town)) {
                    self.queryBody.req.cityCodes = [self.cityCode.town];
                } else {
                    delete self.queryBody.req.cityCodes;
                }

                if (!self.$util.isEmpty(self.cityCode.province) && (self.$util.isEmpty(self.queryBody.req.cityCodes))) {
                    self.$Message.error({content: '请选择城市或者区!'});
                    throw Promise.reject(self.cityCode);
                }

                self.tableLoading = true;
                self.isFirstTimeout = true;

                self.$util.deleteBlankProp(self.queryBody.req);

                if (!self.$util.isEmpty(self.queryBody.req.startTime)) {
                    self.queryBody.req.startTime = self.queryBody.req.startTime.formatDef();
                }
                if (!self.$util.isEmpty(self.queryBody.req.endTime)) {
                    self.queryBody.req.endTime = self.queryBody.req.endTime.formatDef();
                }
                if (!self.$util.isEmpty(self.queryBody.req.startCompletionTime)) {
                    self.queryBody.req.startCompletionTime = self.queryBody.req.startCompletionTime.formatDef();
                }
                if (!self.$util.isEmpty(self.queryBody.req.endCompletionTime)) {
                    self.queryBody.req.endCompletionTime = self.queryBody.req.endCompletionTime.formatDef();
                }
                if (!self.$util.isEmpty(self.queryBody.req.startAppointmentTime)) {
                    self.queryBody.req.startAppointmentTime = self.queryBody.req.startAppointmentTime.formatDef();
                }
                if (!self.$util.isEmpty(self.queryBody.req.endAppointmentTime)) {
                    self.queryBody.req.endAppointmentTime = self.queryBody.req.endAppointmentTime.formatDef();
                }

                if (!self.$util.isEmpty(self.queryBody.req.payTime)) {
                    self.queryBody.req.payTime = self.queryBody.req.payTime.formatDef();
                }

                let userId = Cookies.get('userId');
                let refType = Cookies.get('refType');
                let token = Cookies.get('token');
                let agentStatus = Cookies.get('agentStatus');

                // 数据分割
                let cityCodes = Cookies.get('cityCode');

                if (cityCodes !== undefined) {
                    let cityList = self.$util.strConvertArray(cityCodes);
                    if (cityList[0] !== 'null' && cityList[0] !== '') {
                        self.queryBody.req.cityCodes = cityList;
                        // 删除元素
                        if (cityList.length > 0) {
                            let canvas = document.querySelector('#address_row');
                            if (cityCodes !== null && canvas !== null) {
                                canvas.remove();
                            }
                        }
                    }
                }
                // 驗證登錄信息
                self.queryBody.loginSession = {};
                self.queryBody.loginSession.refId = userId;
                self.queryBody.loginSession.refType = refType;
                self.queryBody.loginSession.loginToken = token;
                self.queryBody.req.agentStatus = agentStatus;
                self.queryBody.req.refType = refType;
                self.queryBody.req.refId = userId;

                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination = res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.tableLoading = false;
                    if (!self.$util.isEmpty(self.queryBody.req.startTime)) self.queryBody.req.startTime = new Date(self.queryBody.req.startTime);
                    if (!self.$util.isEmpty(self.queryBody.req.endTime)) self.queryBody.req.endTime = new Date(self.queryBody.req.endTime);
                    if (!self.$util.isEmpty(self.queryBody.req.startCompletionTime)) self.queryBody.req.startCompletionTime = new Date(self.queryBody.req.startCompletionTime);
                    if (!self.$util.isEmpty(self.queryBody.req.endCompletionTime)) self.queryBody.req.endCompletionTime = new Date(self.queryBody.req.endCompletionTime);
                    if (!self.$util.isEmpty(self.queryBody.req.startAppointmentTime)) self.queryBody.req.startAppointmentTime = new Date(self.queryBody.req.startAppointmentTime);
                    if (!self.$util.isEmpty(self.queryBody.req.endAppointmentTime)) self.queryBody.req.endAppointmentTime = new Date(self.queryBody.req.endAppointmentTime);
                    if (!self.$util.isEmpty(self.queryBody.req.payTime)) self.queryBody.req.payTime = new Date(self.queryBody.req.payTime);
                });
            },
            subRemark () {
                let self = this;
                let entity = {};

                entity.orderSn = self.viewModel.orderSn;
                if (self.$util.isEmpty(self.appendOrderRemark)) {
                    self.$Message.error('请输入追加备注');
                    return;
                }
                entity.remark = (self.viewModel.orderRemark === null || self.viewModel.orderRemark.trim() === '' ? '' : self.viewModel.orderRemark + '\r\n') +
                    new Date().format('yyyy-MM-dd hh:mm:ss') + ': ' + self.$util.getUserName() + '->' + self.appendOrderRemark;

                self.$axios.post(self.remarkUrl, entity).then((res) => {
                    self.$Notice.success({title: '备注追加', desc: '追加成功'});
                    self.viewModel.orderRemark = entity.remark;
                });
            },
            subModify () { // 提交修改
                let self = this;
                if (isSaveStatus == false) {
                    let data = self.tidyData(self.modifyFormModel);
                    self.$axios.post(self.describeSettingUrl, data).then((res) => {
                        if (res == true) {
                            self.modifyShow = false;
                            isSaveStatus = true;
                            self.$Message.success('修改成功');
                            self.queryMyListClick();
                        } else {
                            self.$Message.success('修改失败');
                        }
                    });
                } else {
                    self.$Message.warning('没有做任何的修改');
                }
            },
            tidyData (modifyForm) {
                let data = {};
                data.orderSn = modifyForm.orderSn;
                data.cleanerId = modifyForm.cleanerId;
                data.cleanerName = modifyForm.cleanerName;
                data.memberId = modifyForm.memberId;
                data.memberName = modifyForm.memberName;
                data.deposit = modifyForm.deposit;
                data.payType = modifyForm.payType;
                data.status = modifyForm.status;
                data.cleanFee = modifyForm.cleanFee;
                data.realCleanFee = modifyForm.realCleanFee;
                data.originalFee = modifyForm.originalFee;
                data.sumFee = modifyForm.sumFee;
                data.realIncome = modifyForm.realIncome;
                data.addr = modifyForm.addr;

                data.cleanArea = modifyForm.cleanArea;
                data.distance = modifyForm.distance;
                data.distanceFee = modifyForm.distanceFee;
                data.memberRemark = modifyForm.memberRemark;
                data.orderRemark = modifyForm.orderRemark;
                data.createTime = modifyForm.createTime;
                data.appointmentTime = modifyForm.appointmentTime;
                data.cleanerReceiveOrderTime = modifyForm.cleanerReceiveOrderTime;
                data.cleanerArriveTime = modifyForm.cleanerArriveTime;
                data.cleanerSetOutTime = modifyForm.cleanerSetOutTime;
                data.startCleanTime = modifyForm.startCleanTime;
                data.endCleanTime = modifyForm.endCleanTime;

                data.cancelTime = modifyForm.cancelTime;
                data.discountId = modifyForm.discountId;
                data.discount = modifyForm.discount;
                data.platformSharePercentage = modifyForm.platformSharePercentage;
                data.userSharePercentage = modifyForm.userSharePercentage;
                data.cleanPeriod = modifyForm.cleanPeriod;
                data.realCleanPeriod = modifyForm.realCleanPeriod;
                data.cleanType = modifyForm.cleanType;
                data.memberMobile = modifyForm.memberMobile;
                data.cleanerMobile = modifyForm.cleanerMobile;
                data.latitude = modifyForm.latitude;
                data.latitude = modifyForm.longitude;

                data.discountFee = modifyForm.discountFee;
                data.platformShareDiscountFee = modifyForm.platformShareDiscountFee;
                data.platformBonusPercent = modifyForm.platformBonusPercent;
                data.minFee = modifyForm.minFee;
                data.hoursPer100Square = modifyForm.hoursPer100Square;
                data.perHourFee = modifyForm.perHourFee;
                data.platformBonus = modifyForm.platformBonus;
                data.payOrderList = modifyForm.payOrderList;
                return data;
            },
            ok () {
            },
            cancel () {
                let self = this;
                self.editShow = false;
                self.appendOrderRemark = '';
            },
            closeModify () {
                let self = this;
                self.modifyShow = false;
                // self.editShow = true;
                self.appendOrderRemark = '';
            },
            view (index) {
                let self = this;
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));

                // 计算保洁员收入;
                // let platformBonus = self.viewModel.platformBonus;
                let realIncome = self.viewModel.realIncome;
                if(realIncome>0){
                    self.viewModel.cleanerSalary= self.viewModel.realIncome;
                }else{
                    self.viewModel.cleanerSalary = '0.00';
                }
                //     let percent = self.viewModel.platformBonusPercent;
                // if (platformBonus > 0) {
                //     let sumFee = platformBonus / percent * 100;
                //     self.viewModel.cleanerSalary = (sumFee - platformBonus).toFixed(2);
                // } else {
                //     self.viewModel.cleanerSalary = '0.00';
                // }
                // 支付订单
                self.depositList = [];
                self.payOrderList = [];
                for (let xx = 0; xx < self.viewModel.payOrderList.length; xx++) {
                    let obj = self.viewModel.payOrderList[xx];
                    // WECHAT_PAY payTypeCode tradeTypeName
                    if (obj.tradePayNo.charAt(obj.tradePayNo.length - 1) === 'D') {
                        self.depositList.push(obj);
                    } else {
                        self.payOrderList.push(obj);
                    }
                    if (obj.payTypeCode === 'WECHAT_PAY') {
                        obj.tradeTypeName = '微信支付单号';
                    } else {
                        obj.tradeTypeName = '支付宝支付单号';
                    }
                }

                self.hisArr = [];
                let hisArr = [];
                // 请求订单评价的接口
                self.$axios.post(self.commUrl, {orderSn: self.viewModel.orderSn}).then(res => {
                    self.$axios.get(self.eventUrl + self.viewModel.orderSn).then(events => {
                            let comm = null;
                            let ei = 0;
                            for (ei in events) {
                                hisArr.push({time: new Date(events[ei].createTime).formatDef(), value: events[ei].description});
                            }
                            //                        if (!self.$util.isEmpty(self.viewModel.createTime)) hisArr.push({time: new Date(self.viewModel.createTime).formatDef(), value: '客户下单'});
                            //                        if (!self.$util.isEmpty(self.viewModel.payTime)) hisArr.push({time: new Date(self.viewModel.payTime).formatDef(), value: '客户已支付订金' });
                            //                        if (!self.$util.isEmpty(self.viewModel.cleanerReceiveOrderTime)) hisArr.push({time: new Date(self.viewModel.cleanerReceiveOrderTime).formatDef(), value: '已派单,保洁员:' +cleanerName+ ',距离客户:'+ distance+'米'});
                            //                        if (!self.$util.isEmpty(self.viewModel.cleanerSetOutTime)) hisArr.push({time: new Date(self.viewModel.cleanerSetOutTime).formatDef(), value: '保洁员:' +cleanerName+ '正火速前往客户位置'});
                            //                        if (!self.$util.isEmpty(self.viewModel.cleanerArriveTime)) hisArr.push({time: new Date(self.viewModel.cleanerArriveTime).formatDef(), value: '保洁员:' +cleanerName+ '已到达客户位置'});
                            //                        if (!self.$util.isEmpty(self.viewModel.startCleanTime)) hisArr.push({time: new Date(self.viewModel.startCleanTime).formatDef(), value: '保洁员:' +cleanerName+ '开始进行保洁工作'});
                            //                        if (!self.$util.isEmpty(self.viewModel.endCleanTime)) hisArr.push({time: new Date(self.viewModel.endCleanTime).formatDef(), value: '保洁员:' +cleanerName+ '已完成保洁工作'});
                            //                        if (res.memberComment !== null) {
                            //                            hisArr.push({time: new Date(res.memberComment.createTime).formatDef(), value: '客户评价: '+res.memberComment.comment+',评分:'+res.memberComment.score});
                            //                        }
                            self.hisArr = hisArr;
                            self.currentStep = hisArr.length;

                            self.editShow = true;
                        }
                    );
                });
            },
            viewPic (picUrl) {
                let self = this;
                self.picModal = true;
                self.viewingPic = picUrl;
            },
            detectionChange () {
                isSaveStatus = false;
            },
            deliver (index, bool) {
                let self = this;
                self.reFlag = bool;
                self.deliverShow = true;

                self.$axios.get(self.oneOrderUrl + self.myList[index].orderSn).then((res) => {
                    self.viewModel = res;
                    self.spinShow = true;
                    self.cleanerListLoading = true;
                    self.$axios.post(self.cleanerUrl, {pagination: {page: 1, size: 1000}, cityCode: self.viewModel.cityCode}).then((res) => {
                        if (self.mapObj === null) {
                            self.mapObj = new AMap.Map('map-container', {
                                zoom: 11
                            });
                            self.mapObj.plugin(['AMap.ToolBar'], function () {
                                self.mapObj.addControl(new AMap.ToolBar());
                            });
                        } else {
                            let i = 0;
                            for (i in self.markers) {
                                self.mapObj.remove(self.markers[i]);
                                self.mapObj.remove(self.subMarkers[i]);
                            }
                            self.markers.length = 0;
                            self.subMarkers.length = 0;
                        }
                        self.mapObj.setCenter([self.viewModel.longitude, self.viewModel.latitude]);
                        self.mapObj.setZoom(11);

                        if (res.list.length === 0) {
                            self.cleanerList = [];
                        } else {
                            let i = 0;
                            self.cleanerList = res.list;

                            let _onClick = (e) => { self.showOne(e.target.F.extData); };

                            AMapUI.loadUI(['overlay/SvgMarker'], function (SvgMarker) {
                                let i = 0;
                                for (i in self.cleanerList) {
                                    let name = self.cleanerList[i].name;

                                    let color = self.cleanerList[i].orderStatus === 1 ? 'brown' : self.cleanerList[i].orderStatus === 2 ? 'green' : '#666';

                                    let obj = new SvgMarker.Shape.WaterDrop({
                                        height: 40, // 高度
                                        fillColor: color, // 填充色
                                        strokeWidth: 1, // 描边宽度
                                        strokeColor: '#666' // 描边颜色
                                    });

                                    let marker = new SvgMarker(obj, {
                                            showPositionPoint: true, // 显示定位点
                                            position: [self.cleanerList[i].longtitude, self.cleanerList[i].latitude],
                                            map: self.mapObj,
                                            title: name,
                                            extData: self.cleanerList[i].id,
                                            clickable: true
                                        }
                                    );
                                    let distance = self.$util.figureDistance(self.cleanerList[i].latitude, self.cleanerList[i].longtitude, self.viewModel.latitude, self.viewModel.longitude);
                                    if (distance > 1000) distance = (distance / 1000 + '').split('.')[0] + 'km';
                                    else distance = (distance + '').split('.')[0] + 'm';

                                    self.markers.push(marker);
                                    AMap.event.addListener(marker, 'click', _onClick);
                                    let subMark = new AMap.Marker({
                                        position: [self.cleanerList[i].longtitude, self.cleanerList[i].latitude],
                                        map: self.mapObj,
                                        content: '<div style="white-space: pre; opacity: 1;color: black"><p><b>' + distance + '</b></p><p>' + name + '</p></div>',
                                        offset: new AMap.Pixel(-13, -80)
                                    });
                                    self.subMarkers.push(subMark);
                                }
                            });
                        }
                        // 订单标记
                        {
                            AMapUI.loadUI(['overlay/SvgMarker'], function (SvgMarker) {
                                let obj = new SvgMarker.Shape.WaterDrop({
                                    height: 30, // 高度
                                    fillColor: 'red', // 填充色
                                    strokeWidth: 1, // 描边宽度
                                    strokeColor: '#666' // 描边颜色
                                });

                                self.orderSubMarker = new SvgMarker(obj,
                                    {
                                        showPositionPoint: true, // 显示定位点
                                        position: [self.viewModel.longitude, self.viewModel.latitude],
                                        map: self.mapObj,
                                        title: self.viewModel.memberName
                                    }
                                );
                            });
                            let memberName = self.$util.isEmpty(self.viewModel.memberName) ? '未知' : self.viewModel.memberName;
                            self.orderMarker = new AMap.Marker({
                                position: [self.viewModel.longitude, self.viewModel.latitude],
                                map: self.mapObj,
                                content: '<div class="amap-marker-content" style="white-space: pre; opacity: 1;color: black;font-weight: bold">' + memberName + '</div>',
                                offset: new AMap.Pixel(-15, -50)
                            });
                        }
                        self.spinShow = false;
                        self.cleanerListLoading = false;
                    });
                });
            },
        	choice(){
			     console.log("tree.data",this.$refs.tree.data);
			     this.choices = this.dg(this.$refs.tree.data); 
			     console.log("所有节点"+JSON.stringify(this.$refs.tree.data));
			   
			     console.log("上一节点"+JSON.stringify(this.choices ))
			     this.subdata=this.$refs.tree.getSelectedNodes();//获取点击的节点
			     console.log("选中节点"+JSON.stringify(this.subdata))
//			     this.power=this.subdata.filter(item =>{
//			        return !item.children //因为filter只会返回true的布尔值，所以这里把没有子集的，也就是单个的权限返回出去，用this.power接收
//			      })
//			     console.log('power',this.power);
			},
			dg(data){
				var parent=[];
				console.log("节点"+JSON.stringify(data))
				var choices=data;
			    for(let i=0;i<choices.length;i++){
			     	console.log("11")
			     	if(choices.selected==true){
			     		console.log("22"+choices[i])
			     		parent.push(choices[i])
			     	}else{
			     		for(let j=0;j<choices[i].children.length;j++){
			     			console.log("33"+JSON.stringify(choices[i].children[j]));
					     	if(choices[i].children[j].selected==true){
					     		parent.push(choices[i].children[j])
					     	}else{
					     		for(let g=0;j<choices[i].children[j].children[g].length;g++){
					     			console.log("44"+JSON.stringify(choices[i].children[j].children[g]));
					     			console.log(choices[i].children[j].children[g].selected)
							     	if(choices[i].children[j].children[g].selected==true){
							     		parent.push(choices[i].children[j].children[g])
							     	}else{
							     		for(let f=0;j<choices[f].children[j].children[g].children[f].length;f++){
							     			console.log("44"+JSON.stringify(choices[i].children[j].children[g].children[f]));
							     			console.log(choices[i].children[j].children[g].children[f].selected)
									     	if(choices[i].children[j].children[g].children[f].selected==true){
									     		parent.push(choices[i].children[j].children[g].children[f])
									     	}else{
									     		
									     	}
									    }
							     		
							     		
							     		
							     	}
							    }
					     	}
					    }
			     	}
			     }
			    console.log(parent)
			}
        }
    };
</script>
