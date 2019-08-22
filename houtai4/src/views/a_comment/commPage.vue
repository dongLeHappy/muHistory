<style scoped>
    @import '../../styles/common.less';
    .ivu-btn-small{
        margin-left: 3px;
    }
    .ivu-form-item{
        width: 300px;
    }
    .loadbox{position:absolute;width:100%;height:100%;
        background:rgba(0,0,0,.2);
        z-index: 9999999;}
    .loadbox img{width:100px;height:100px;position:absolute;top:50%;left:50%;margin-left:-50px;margin-top:-50px;}
</style>
<template>
    <div style="padding: 5px">
        <div class="loadbox" :hidden="imgshow" >
            <img src="../../images/d161165956e23.gif"  class="loadingimg" />
        </div>
        <Card>
            <Row>
                <span @keyup.enter="queryMyListClick" ><Input v-model="queryBody.req.cleanerId" placeholder="请输入保洁员id..." style="width: 200px;padding: 3px" clearable /></span>
                <span @keyup.enter="queryMyListClick" ><Input v-model="queryBody.req.cleanerName" placeholder="请输入保洁员名称..." style="width: 200px;padding: 3px" clearable /></span>
                <span @keyup.enter="queryMyListClick" ><Input v-model="queryBody.req.memberId" placeholder="请输入客户id..." style="width: 200px;padding: 3px" clearable /></span>
                <span @keyup.enter="queryMyListClick" ><Input v-model="queryBody.req.orderSn" placeholder="请输入订单号..." style="width: 200px;padding: 3px" clearable /></span>

                <DatePicker type="datetime" placement="bottom-end" v-model="queryBody.req.startTime" style="width: 150px;padding: 3px" placeholder="开始时间" clearable></DatePicker>
                -
                <DatePicker type="datetime" @on-change="placeChange" placement="bottom-end" v-model="queryBody.req.endTime" style="width: 150px;padding: 3px" placeholder="截止时间" clearable></DatePicker>


                <span @click="queryMyListClick" style="margin: 0 10px;"><Button type="primary" icon="search">查询</Button></span>
                <span style="margin-left: 3px;"><Button type="success" @click="exportExcel">导出excel</Button></span>
            </Row>
            <Row class="margin-top-10 searchable-table-con1">
                <Table border :columns="columns" :data="myList" :loading="tableLoading" no-data-text="暂无数据"></Table>
                <Page style="margin-top: 5px" show-total
                      :total="queryBody.pagination.total"
                      :current="queryBody.pagination.page"
                      :page-size="queryBody.pagination.size"
                      @on-change="changePage"
                      show-elevator
                ></Page>
            </Row>
        </Card>

        <!--查看模块-->
        <Modal :width="800" v-model="editShow" title="评价详情" :closable=false :mask-closable=false>
            <Form :model="viewModel" :labelWidth="90" inline>
                <!--<Row>
                    <FormItem prop="orderSn" label="订单编号">
                        <Input type="text" v-model="viewModel.orderSn" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="deposit" label="定金" >
                        <Input type="text" v-model="viewModel.deposit" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="payType" label="支付类型" >
                        <Input type="text" v-model="viewModel.payType==1?'微信':viewModel.payType==2?'支付宝':viewModel.payType==3?'银行':'未知'" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="status" label="状态" >
                        <Input type="text" v-model="viewModel.status==1?'已创建':viewModel.status==2?'已支付':viewModel.status==3?'已接单':viewModel.status==4?'已出发':viewModel.status==5?'已到达':viewModel.status==6?'已开始':viewModel.status==7?'清洁已完成':viewModel.status==8?'订单完成':viewModel.status==9?'取消':'未知'" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="addr" label="地址" >
                        <Input type="text" v-model="viewModel.addr" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="cleanArea" label="面积" >
                        <Input type="text" v-model="viewModel.cleanArea" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="distance" label="客户与保洁员的距离" >
                        <Input type="text" v-model="viewModel.distance" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="distanceFee" label="交通费" >
                        <Input type="text" v-model="viewModel.distanceFee" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="createTime" label="创建时间" >
                        <Input type="text" v-model="viewModel.createTime" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="appointmentTime" label="预约时间" >
                        <Input type="text" v-model="viewModel.appointmentTime == null? '':new Date(viewModel.appointmentTime).toLocaleString()" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="cleanerReceiveOrderTime" label="接单时间" >
                        <Input type="text" v-model="viewModel.cleanerReceiveOrderTime == null? '':new Date(viewModel.cleanerReceiveOrderTime).toLocaleString()" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="cleanerArriveTime" label="到达时间" >
                        <Input type="text" v-model="viewModel.cleanerArriveTime == null? '':new Date(viewModel.cleanerArriveTime).toLocaleString()" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="cleanerSetOutTime" label="开始出发时间" >
                        <Input type="text" v-model="viewModel.cleanerSetOutTime == null? '':new Date(viewModel.cleanerSetOutTime).toLocaleString()" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="startCleanTime" label="开始清洁时间" >
                        <Input type="text" v-model="viewModel.startCleanTime == null? '':new Date(viewModel.startCleanTime).toLocaleString()" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="endCleanTime" label="结束清洁时间" >
                        <Input type="text" v-model="viewModel.endCleanTime == null? '':new Date(viewModel.endCleanTime).toLocaleString()" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="cancelTime" label="取消时间" >
                        <Input type="text" v-model="viewModel.cancelTime == null? '':new Date(viewModel.cancelTime).toLocaleString()" :readonly="disableEdit"></Input>
                    </FormItem>
                </Row>-->
                <Row>
                    <FormItem prop="user" label="保洁员留言">
                        <Input v-model="viewModel.cleanerComm" :rows="5" readonly type="textarea"></Input>
                    </FormItem>
                    <FormItem prop="user" label="客户留言">
                        <Input v-model="viewModel.memberComm" :rows="5" readonly type="textarea"></Input>
                    </FormItem>
                    <FormItem prop="user" label="评价备注">
                        <Input v-model="viewModel.remark" :rows="5" readonly type="textarea"></Input>
                    </FormItem>
                </Row>
                <FormItem label="评价时间">
                    <Input type="text" v-model="new Date(viewModel.createTime).formatDef()" :readonly="disableEdit"></Input>
                </FormItem>
                <Row>
                    <FormItem>
                        <Button type="primary" @click="lookOrder">查看订单</Button>
                    </FormItem>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="editShow = false;">返回</Button>
            </div>
        </Modal>

        <!--审核模块-->
        <Modal :width="300" v-model="verifyShow" title="评分审核" @on-ok="verifyOk" @on-cancel="verifyCancel" ok-text="提交" :closable=false :mask-closable=false>
            <Row>
                <p><b>审核人: {{userName}}</b></p>
            </Row>
            <Row style="margin-top: 10px">
                <div>
                    <Select v-model="verifyEntity.auditStatus" style="width:200px" placeholder="审核状态" clearable>
                        <Option v-for="item in auditSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div style="margin-top: 5px">
                    <Input style="" v-model="verifyEntity.remark" type="textarea" :rows="8" placeholder="请输入审核结果..."></Input>
                </div>
            </Row>
            <div slot="footer">
                <Button type="ghost" @click="verifyCancel">返回</Button>
                <Button type="primary" @click="verifyOk">确定</Button>
            </div>
        </Modal>

        <!--=======================+++++++++++++++++++++++++++++++++++++++++++订单详情-->
        <Modal v-model="orderShow" title="订单详情" width="700" :mask-closable=false :closable=false>
            <Form :model="orderEntity" :labelWidth="120" inline>
                <Row>
                    <FormItem prop="orderSn" label="订单编号" >
                        <Input type="text" v-model="orderEntity.orderSn" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="deposit" label="保洁费用" >
                        <Input type="text" v-model="orderEntity.cleanFee" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="deposit" label="下单时间" >
                        <Input type="text" v-model="new Date(orderEntity.createTime).formatDef()" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="deposit" label="服务时间" >
                        <Input type="text" v-model="orderEntity.startCleanTime == null? '':new Date(orderEntity.startCleanTime).formatDef()" :readonly="disableEdit"></Input>
                    </FormItem>

                    <FormItem prop="payType" label="服务类型" >
                        <Input type="text" v-model="orderEntity.cleanType=='00'?'个人日常':orderEntity.cleanType=='01'?'个人开荒':orderEntity.cleanType=='10'?'公司日常':'公司开荒'" readonly></Input>
                    </FormItem>
                    <FormItem prop="payType" label="支付类型" >
                        <Select readonly v-model="orderEntity.payType" :style="{width: $util.width}" clearable :disabled="disableEdit">
                            <Option :value=1>微信</Option>
                            <Option :value=2>支付宝</Option>
                            <Option :value=3>银行</Option>
                        </Select>
                    </FormItem>

                    <FormItem prop="addr" label="地址" >
                        <Input type="text" v-model="orderEntity.addr" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="cleanArea" label="保洁面积(平方)" >
                        <Input type="text" v-model="orderEntity.cleanArea" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="distance" label="客户与保洁员的距离(米)" >
                        <Input type="text" v-model="orderEntity.distance" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="distanceFee" label="交通费(元)" >
                        <Input type="text" v-model="orderEntity.distanceFee" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="distanceFee" label="定金(元)" >
                        <Input type="text" v-model="orderEntity.deposit" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="distanceFee" label="平台抽成(元)" >
                        <Input type="text" v-model="orderEntity.platformBonus" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="distanceFee" label="保洁员电话" >
                        <Input type="text" v-model="orderEntity.cleanerMobile" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="distanceFee" label="会员电话" >
                        <Input type="text" v-model="orderEntity.memberMobile" :readonly="disableEdit"></Input>
                    </FormItem>
                    <Row>
                        <FormItem label="时间进度" style="width: 500px">
                            <Steps :current=currentStep direction="vertical">
                                <Step v-for="(item, idx) in hisArr" :key="idx" :title="item.time" :content="item.value"></Step>
                            </Steps>
                        </FormItem>
                    </Row>
                </Row>
                <Row>
                    <FormItem prop="memberRemark" label="客户备注" style="width: 400px">
                        <Input v-model="orderEntity.memberRemark" readonly type="textarea" :rows="3"></Input>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem prop="remark" label="历史备注" style="width: 400px">
                        <Input readonly v-model="orderEntity.orderRemark" type="textarea" placeholder="暂无历史备注" :rows="5"></Input>
                    </FormItem>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="orderShow = false;">返回</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                queryUrl:'/comment/list',
                auditUrl:'/comment/audit',
                detailUrl:'/comment/detail',
                orderUrl:'/order/list',
                oneUrl:'/order/',

                queryBody:{//请求体
                    pagination:{
                        page:1,
                        size:10,
                        total:10
                    },
                    req:{}
                },
                myList:[],
                tableLoading:true,

                userName:this.$util.getUserName(),

                verifyShow: false,
                verifyEntity: {},
                orderEntity:{},
                orderShow:false,
                statusSelector:[
                    {value: 1, label: '订单已创建'},
                    {value: 2, label: '定金已经支付'},
                    {value: 3, label: '已经派单'},
                    {value: 4, label: '保洁接单'},
                    {value: 5, label: '保洁员已出发'},
                    {value: 6, label: '保洁员已到达'},
                    {value: 7, label: '保洁员已开始清洁'},
                    {value: 8, label: '保洁员已完成'},
                    {value: 9, label: '订单已支付'},
                    {value: 10, label: '订单完成'},
                    {value: 11, label: '保洁拒绝接单'},
                    {value: 12, label: '定金支付中'},
                    {value: 13, label: '订单支付中'},
                    {value: 99, label: '订单取消'}
                ],

                editShow: false,
                disableEdit: true,

                selectedType:'',
                auditSel:[
                    {value:0, label:"未处理"},
                    {value:1, label:"已通过"},
                    {value:2, label:"待处理"}
                ],

                viewModel:{},//编辑单个的实体
                columns: [//字段
                    {title: '订单号', key: 'orderSn', align: 'center', minWidth:130, width:170, fixed:'left'},
                    {title: '保洁员id', key: 'cleanerId', align: 'center',  width:170,minWidth:100},
                    {title: '保洁员名称', key: 'cleanerName', align: 'center',  width:170,minWidth:100},
                    {title: '会员id', key: 'memberId', align: 'center',  width:170,minWidth:100},
                    {title: '会员名称', key: 'memberName', align: 'center', width:170, minWidth:100},
                    {title: '分数', key: 'score', align: 'center', width:170, minWidth:100},
                    {title: '内容', key: 'comment', align: 'center', width:170, minWidth:100},
                    {title: '审核状态', key: 'auditStatus', align: 'center', width:170, minWidth:100
                        ,render:(h, params) => {
                            let self = this;
                            let obj = self.myList[params.index].auditStatus;
                            if (obj === 0) obj = h('div', {attrs:{style: 'color:brown'}}, '未处理');
                            else if (obj === 1) obj = h('div', {attrs:{style: 'color:green'}}, '已通过');
                            else if (obj === 2) obj = h('div', {attrs:{style: 'color:red'}}, '待处理');
                            return obj;
                        }
                    },
                    {title: '评价时间', key: 'createTime', align: 'center', width:170, minWidth:151
                        ,render:(h, params) => {
                            let self = this;
                            let obj = new Date(self.myList[params.index].createTime).formatDef();
                            return h('div', obj);
                        }
                    },
                    {title: '备注', key: 'remark', align: 'center',  width:170,minWidth:100},
                    {title: '操作', key: 'action', align: 'center', fixed:'right', width:170, width:130,//操作
                        render: (h, params) => {
                            let arr = [];
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.view(params.index)}}}, '详情'));
                            let access = this.$util.getAccess('com_audit');
                            if (access)arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.verify(params.index)}}}, '审核'));
                            return h('div', arr);
                        }
                    }
                ],
                currentStep: 0,
                hisArr:[],
                eventUrl: '/order/event/',
                imgshow:true


            }
        },
        created(){
            let self = this;
            let entity = JSON.parse(sessionStorage.getItem('lookingComm'));
            if (entity !== null && entity !== undefined){
                self.viewModel = entity;
                self.editShow = true;
                sessionStorage.removeItem('lookingComm');
            }
        },
        mounted(){
            let self = this;
            self.queryMyList();
        },
        methods:{
            //下单改变的日期
            placeChange(formatedDate, date){
                let self = this;
                self.baseChange(formatedDate, 'endTime');
            },
            baseChange(date, property){
                let self = this;
                if (!self.$util.isEmpty(date)){
                    let split = date.split(' ');
                    if (split[1] !== '00:00:00'){
                        self.queryBody.req[property] = new Date(date);
                    }else {
                        self.queryBody.req[property] = new Date(split[0] + ' 23:59:59');
                    }
                }
            },
            exportExcel(){
                let self = this;

                if (self.$util.isEmpty(self.queryBody.req.startTime)) {
                    self.$Message.error({content: '请选择开始日期!'});
                    return;
                }
                if (self.$util.isEmpty(self.queryBody.req.endTime)) {
                    self.$Message.error({content: '请选择结束日期!'});
                    return;
                }
                let queryBody = {req: {}};
                self.queryBody.req.startTime = self.queryBody.req.startTime.formatDef();
                self.queryBody.req.endTime = self.queryBody.req.endTime.formatDef();

                //数据分割
                let cityCodes = Cookies.get('cityCode');
                if(cityCodes !== undefined){
                    let cityList = self.$util.strConvertArray(cityCodes);
                    if (cityList[0] !== 'null' && cityList[0] !== ''){
                        self.queryBody.req.cityCodes = cityList;
                        //删除元素
                        if (cityList.length > 0) {
                            let canvas = document.querySelector('#address_row');
                            if(cityCodes !== null && canvas !== null){
                                canvas.remove();
                            }
                        }
                    }
                }

                let axios = self.$axios.create({
                    baseURL: self.$axios.defaults.baseURL
                });
                this.imgshow=false;
                axios({ // 用axios发送post请求
                    method: 'post',
                    url: 'comment/export', // 请求地址
                    data: self.queryBody,  // 参数
                    responseType: 'blob'   // 表明返回服务器返回的数据类型
                }).then((res) => { // 处理返回的文件流
                    let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
                    // if(blob.size > 114){
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob); //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = '订单评价明细.xls'; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载
                        document.body.removeChild(downloadElement); //下载完成移除元素
                        window.URL.revokeObjectURL(href); //释放掉blob对象
                    // }else {
                    //     self.$Message.error({content: '导出订单的结束下单时间只允许到昨天!'});
                    // }
                    self.imgshow=true
                });
            },

            lookOrder(){
                let self = this;
                self.hisArr = [];
                let hisArr = [];
                self.$axios.get(self.oneUrl+'/'+self.viewModel.orderSn).then((res) => {
                    self.orderEntity = res;
                    self.$axios.get(self.eventUrl+self.viewModel.orderSn).then( events => {
                            let comm = null;
                            let ei = 0;
                            for(ei in events){
                                hisArr.push({time: new Date(events[ei].createTime).formatDef(), value: events[ei].description})
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
                            self.orderShow = true;
                        }
                    );


                });
            },
            changePage(val){
                let self = this;
                self.tableLoading = true;
                self.queryBody.pagination.page = val;
                self.queryMyList();
            },
            queryMyListClick(){
                let self = this;
                self.queryBody.pagination = {page:1, total:10, size:10};
                self.queryMyList();
            },
            queryMyList(){
                let self = this;

                self.tableLoading = true;
                self.$util.deleteBlankProp(self.queryBody.req);

                let queryBody = {req: {}};

                if (!self.$util.isEmpty(self.queryBody.req.startTime)) {
                    self.queryBody.req.startTime = self.queryBody.req.startTime.formatDef();
                }
                if (!self.$util.isEmpty(self.queryBody.req.endTime)) {
                    self.queryBody.req.endTime = self.queryBody.req.endTime.formatDef();
                }

                //数据分割
                let cityCodes = Cookies.get('cityCode');
                if(cityCodes !== undefined){
                    let cityList = self.$util.strConvertArray(cityCodes);
                    if (cityList[0] !== 'null' && cityList[0] !== ''){
                        self.queryBody.req.cityCodes = cityList;
                        //删除元素
                        if (cityList.length > 0) {
                            let canvas = document.querySelector('#address_row');
                            if(cityCodes !== null && canvas !== null){
                                canvas.remove();
                            }
                        }
                    }
                }

                // delete self.queryBody.req.startTime;
                // delete self.queryBody.req.endTime;

                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.$util.sortArr(res.list, 'createTime');
                    self.myList = res.list;
                    self.tableLoading = false;
                })
            },
            show(){
                this.editShow = true;
            },
            cancel () {
                this.editShow= false;
            },
            verifyOk(){
                let self = this;
                let remark = self.verifyEntity.remark;
                if (!self.$util.isEmpty(remark)){
                    self.$axios.post(self.auditUrl, self.verifyEntity).then((res) => {
                        self.$Notice.success({title:'评价审核', desc:'审核成功!'});
                        self.verifyShow = false;
                        self.queryMyList();
                    })
                }else {
                    self.$Message.error('请输入处理结果');
                }
            },
            verifyCancel(){
                let self = this;
                self.verifyShow = false;
            },
            view(index){
                let self = this;
                let entity = {};
                self.viewModel = self.myList[index];
                entity.orderSn = self.viewModel.orderSn;
                self.$axios.post(self.detailUrl, entity).then((res) => {
                    self.viewModel.cleanerComm = res.cleanerComment===null? '暂无留言': res.cleanerComment.comment;
                    self.viewModel.memberComm = res.memberComment===null? '暂无留言': res.memberComment.comment;
                    self.disableEdit = true;
                    self.editShow = true;
                });

//                self.$axios.post(self.orderUrl
            },
            verify(index){
                let self = this;
                self.verifyEntity.auditStatus = self.myList[index].auditStatus;
                self.verifyEntity.remark = self.myList[index].remark;
                self.verifyEntity.commentId= self.myList[index].id;
                self.verifyShow = true;
            }
        }
    }
</script>
