<style scoped>
    @import '../../styles/common.less';
    #map-container{
        margin-left: 8px;
        width: 100px;
        height: 400px;
    }

    .absolute{
        position: absolute;
        left:1080px;
        top:56px;
    }

</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <Row>

                </Row>

                <Row style="padding: 3px" id="address_row">
                    <span>服务地区: </span>
                    <Select placeholder="请选择省份" v-model="cityCode.province" style="width:210px;padding: 3px" clearable @on-change="selProvince">
                        <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                    <Select placeholder="请选择城市" v-model="cityCode.city" style="width:210px;padding: 3px" clearable @on-change="selCity">
                        <Option v-for="item in cityList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                    <Select placeholder="请选择区" v-model="cityCode.town" style="width:210px;padding: 3px" clearable>
                        <Option v-for="item in townList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                    &nbsp;&nbsp;&nbsp;
                    下单时间:
                    <DatePicker type="datetime" placement="bottom-end" v-model="queryBody.req.startTime" style="width: 180px;padding: 3px" placeholder="开始时间" clearable></DatePicker>
                    -
                    <DatePicker type="datetime" @on-change="placeChange" placement="bottom-end" v-model="queryBody.req.endTime" style="width: 180px;padding: 3px" placeholder="截止时间" clearable></DatePicker>

                </Row>


                <div style="padding: 30px;" >
                    <Row>

                        <!--开始保洁时间:-->
                        <!--<DatePicker type="datetime" placement="bottom-end" v-model="startTime" style="width: 150px;padding: 3px" placeholder="开始时间" clearable></DatePicker>-->
                        <!-- - -->
                        <!--<DatePicker type="datetime" placement="bottom-end" v-model="endTime" style="width: 150px;padding: 3px" placeholder="截止时间" clearable></DatePicker>-->


                    </Row>
                    <div class="absolute">

                        <span @click="queryMyListClick" style="margin-left: 3px;"><Button type="primary" icon="search">查询</Button></span>

                        <span style="margin-left: 3px;"><Button type="success" @click="exportExcel">导出excel</Button></span>
                    </div>
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


        <Modal v-model="deliverShow" title="在线订单派送" @on-ok="ok" @on-cancel="cancel" width="1100" cancel-text="" :mask-closable=false :closable=false>

            <Row :gutter="12">
                <Col span="11">
                    <div id="map-container"></div>
                    <Spin size="large" fix v-if="spinShow"></Spin>
                </Col>
                <Col span="1">
                    <div>
                        <Table border ::data="cleanerList" :loading="cleanerListLoading" no-data-text="" height="400">



                        </Table>
                    </div>
                </Col>
            </Row>

        </Modal>

        <!-------------------------------分------------------------------割---------------------------------------线-------------------->




    </div>
</template>

<script>
    import AMap from 'AMap';
    import AMapUI from 'AMapUI';
    import au from  '../../libs/accessUtils.js';
    import Cookies from 'js-cookie';
    var disposable = true;
    var isSaveStatus = true;
    export default {
        data () {
            return {
                queryUrl:'/order/list',//获取列表
                timeoutUrl:'/order/timeout',
                remarkUrl:'/order/remark',
                cleanerUrl:'/cleaner/listOnlineCleaner',
                oneCleanerUrl: '/cleaner/',
                oneOrderUrl:'/order/',
                dispatcherUrl:'/order/dispatcher',
                cancelUrl: '/order/cancel/',
                commUrl: '/comment/detail/',
                eventUrl: '/order/event/',
                payRemindUrl: '/order/payRemind',//提醒支付余额
                reassignmentUrl: '/order/reassignment',//改派
                exportUrl: '/order/export',
                describeSettingUrl: '/order/describeSetting',//修改订单详情

                provinceList:[],
                cityList: [],
                townList: [],
                cityCode: {
                    province: null,
                    city: null,
                    town: null,
                },
                editCityCode: {
                    province: null,
                    city: null,
                    town: null,
                },

                queryBody:{//请求体
                    pagination:{
                        page:1,
                        total:10,
                        size:10
                    },
                    req:{}
                },
                tableLoading:true,
                cleanerList:[],
                depositList: [],
                payOrderList: [],
                startTime: '',
                endTime: '',

                cleanerShow:false,
                cleanerModel:{},
                idPic:[],
                BusLicPic:[],
                contactPic:[],
                otherPic:[],
                picModal:false,
                viewingPic:'',

                modifyShow:false,

                spinShow:true,
                cleanerListLoading:true,

                isTimeout:false,
                isFirstTimeout:true,
                currentStep: 0,
                disableEdit:true,
                editShow:false,
                viewModel:{},//编辑单个的实体
                appendOrderRemark:'',

                modifyFormModel:{},//修改订单实体

                deliverShow:false,
                deliverModal:{},
                mapObj:null,



                columns: [//字段
                    // {title: '订单号', key: 'orderSn', minWidth:100, fixed:'left', align: 'center'},
                    {title: '服务地区', key: '1111', width:280, minWidth:120, fixed:'left', align: 'center'},
                    // {title: '客户手机号', key: 'memberMobile', minWidth:100, align: 'center'},
                    {title: '订单总数', key: 'memberMobile', width:290, align: 'center'},
                    {title: '订单金额', key: 'status', minWidth:100,width:300, align: 'center'},
                    {title: '待结算', key: 'createTime', minWidth:160, width:200, align: 'center'},
                    {title: '已结算', key: 'appointmentTime', minWidth:160, width:200, align: 'center'}
                ],
                myList:[],
                reFlag: false, //改派的标识, true为改派
                markers:[],
                orderMarker:{},
                orderSubMarker:{},
                hisArr:[],
                subMarkers:[]
            }
        },
        created(){
            let self = this;
            let cityCode = 100000;
            let levelType = 1;
            let prop = "provinceList";
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);

            let memberName = self.$route.params.memberName;
            let cleanerName = self.$route.params.cleanerName;
            if (memberName !== null && memberName !== undefined && memberName !== '')self.queryBody.req.memberName = memberName;
            if (cleanerName !== null && cleanerName !== undefined && cleanerName !== '')self.queryBody.req.cleanerName = cleanerName;
        },
        mounted(){
            let self = this;
            self.queryMyList();
        },
        methods:{
            //省份确定城市
            selProvince(val){
                let self = this;

                if (self.editShow){
                    //非搜索列表情况下
                    self.editCityCode.city = null;
                    self.editCityCode.town = null;
                }else {
                    //搜索列表情况下
                    self.cityCode.city = null;
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 2, 'cityList');
            },
            selCity(val){
                let self = this;

                if (self.editShow){
                    //非搜索列表情况下
                    self.editCityCode.town = null;
                }else {
                    //搜索列表情况下
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 3, 'townList');
            },

            exportExcel(){
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

                //数据分割
                let cityCodes = Cookies.get('cityCode');
                if(cityCodes !== undefined) {
                    let cityList = self.$util.strConvertArray(cityCodes);
                    if (cityList[0] != 'null') {
                        queryBody.req.cityCodes = cityList;
                    }
                }
                let axios = self.$axios.create({
                    baseURL: self.$axios.defaults.baseURL
                });
                axios({ // 用axios发送post请求
                    method: 'post',
                    url: 'order/export', // 请求地址
                    data: queryBody, // 参数
                    responseType: 'blob' // 表明返回服务器返回的数据类型
                }).then((res) => { // 处理返回的文件流
                    let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
                    if(blob.size > 114){
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob); //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = '订单明细.xls'; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载
                        document.body.removeChild(downloadElement); //下载完成移除元素
                        window.URL.revokeObjectURL(href); //释放掉blob对象
                    }else {
                        self.$Message.error({content: '导出订单的结束下单时间只允许到昨天!'});
                    }
                })
            },
            //服务改变日期
            appointChange(formatedDate, date){
                let self = this;
                self.baseChange(formatedDate, 'endAppointmentTime');
            },
            //保洁改变的日期
            completionChange(formatedDate, date){
                let self = this;
                self.baseChange(formatedDate, 'endCompletionTime');
            },
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
            //发送提示支付短信
            payRemind(orderSn){
                let self = this;
                self.$Modal.confirm({title: '发送短信', content: '确定发送提示支付余额的消息?', onOk: () => {
                    self.$axios.post(self.payRemindUrl, {orderSn: orderSn}).then(res => {
                        self.$Notice.success({title: '发送短信', desc: '发送成功!'});
                    })
                }});
            },
            resetOrder(index){//修改信息

                let self = this;
                let queryBody = {};
                queryBody.req = {};
                queryBody.loginSession = {};

                let userId = Cookies.get('userId');
                let refType = Cookies.get('refType');
                let token = Cookies.get('token');
                let agentStatus = Cookies.get('agentStatus');
                queryBody.req.orderSn = index;
                //驗證登錄信息
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
                    //数据绑定
                    self.bindModifyModel(res.list);
                    self.modifyShow = true;
                    self.appendOrderRemark = '';
                });

            },
            bindModifyModel(list){
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
            //改派
            ressign(id){
                let self = this;
                let entity = {};
                self.$Modal.confirm({title:'派单',content:'确定要改派给这位保洁员吗?',onOk: () => {
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

            changeStatus(){
                let self = this;
                self.$Modal.confirm({title: '订单取消', content: '确定要取消该订单吗?', onOk:() => {
                    self.$axios.post(self.cancelUrl+self.viewModel.orderSn).then(res => {
                        self.$Notice.success({title: '订单取消', desc: '取消成功!'});
                        self.editShow = false;
                        self.queryMyList();
                    });
                }});
            },
            showOne(id){
                let self = this;
                self.$axios.get(self.oneCleanerUrl+id).then((res) => {
                    self.cleanerShow = true;
                    self.cleanerModel = res;
                    self.idPic = self.$util.strToPicArr(self.cleanerModel.picId0);
                    self.idPic = self.idPic.concat(self.$util.strToPicArr(self.cleanerModel.picId1));
                    self.BusLicPic = self.$util.strToPicArr(self.cleanerModel.picBusinessLicense);
                    self.contactPic = self.$util.strToPicArr(self.cleanerModel.picContract);
                    self.otherPic = self.$util.strToPicArr(self.cleanerModel.picOther);
                });
            },
            moveTo(id){
                let self = this;
                let x = 0;

                for (x in self.markers){
                    if (self.markers[x].F.extData === id){
                        self.mapObj.setZoom(15);
                        self.mapObj.setCenter([ self.markers[x].F.position.lng, self.markers[x].F.position.lat]);
                    }
                }
            },
            dd(id){
                let self = this;
                let entity = {};
                self.$Modal.confirm({title:'派单',content:'确定要派单给这位保洁员吗?',onOk: () => {
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
            changePage(val){
                let self = this;
                self.queryBody.pagination.page = val;

                if (self.isTimeout){
                    self.timeoutList();
                }else {
                    self.queryMyList();
                }
            },
            timeoutList(){
                let self = this;
                self.tableLoading = true;
                self.isTimeout = true;

                if (self.isFirstTimeout) self.queryBody.pagination = {page:1, total:10, size:10};

                self.$axios.get(self.timeoutUrl+self.$util.objToStr(self.queryBody.pagination)).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.isFirstTimeout = false;
                    self.tableLoading = false;
                });
            },
            queryMyListClick(){
                let self = this;
                self.queryBody.pagination = {page:1, total:10, size:10};
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
                    delete self.queryBody.req.cityCodes
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

                let userId = Cookies.get('userId');
                let refType = Cookies.get('refType');
                let token = Cookies.get('token');
                let agentStatus = Cookies.get('agentStatus');

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
                //驗證登錄信息
                self.queryBody.loginSession = {};
                self.queryBody.loginSession.refId = userId;
                self.queryBody.loginSession.refType = refType;
                self.queryBody.loginSession.loginToken = token;
                self.queryBody.req.agentStatus = agentStatus;


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
                });
            },
            subRemark(){
                let self = this;
                let entity = {};

                entity.orderSn = self.viewModel.orderSn;
                if (self.$util.isEmpty(self.appendOrderRemark)){
                    self.$Message.error('请输入追加备注');
                    return;
                }
                entity.remark = (self.viewModel.orderRemark===null||self.viewModel.orderRemark.trim()===''?'':self.viewModel.orderRemark+'\r\n')+
                    new Date().format('yyyy-MM-dd hh:mm:ss')+': '+self.$util.getUserName()+'->'+self.appendOrderRemark;

                self.$axios.post(self.remarkUrl, entity).then((res) => {
                    self.$Notice.success({title:'备注追加', desc:'追加成功'});
                    self.viewModel.orderRemark = entity.remark;
                });
            },
            subModify(){//提交修改
                let self = this;
                if(isSaveStatus == false){
                    let data = self.tidyData(self.modifyFormModel);
                    self.$axios.post(self.describeSettingUrl, data).then((res) => {
                        if(res == true){
                            self.modifyShow = false;
                            isSaveStatus = true;
                            self.$Message.success('修改成功');
                            self.queryMyListClick();
                        }else {
                            self.$Message.success('修改失败');
                        }
                    });
                }else {
                    self.$Message.warning('没有做任何的修改');
                }
            },
            tidyData(modifyForm){
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
            view(index){
                let self = this;
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));

                //计算保洁员收入;
                let platformBonus = self.viewModel.platformBonus;
                let percent = self.viewModel.platformBonusPercent;
                if (platformBonus > 0){
                    let sumFee = platformBonus / percent * 100;
                    self.viewModel.cleanerSalary =  (sumFee - platformBonus).toFixed(2);
                }else{
                    self.viewModel.cleanerSalary =  '0.00';
                }
                //支付订单
                self.depositList = [];
                self.payOrderList = [];
                for (let xx = 0; xx < self.viewModel.payOrderList.length; xx++){
                    let obj = self.viewModel.payOrderList[xx];
                    //WECHAT_PAY payTypeCode tradeTypeName
                    if(obj.tradePayNo.charAt(obj.tradePayNo.length-1) === 'D') {
                        self.depositList.push(obj);
                    }
                    else {
                        self.payOrderList.push(obj);
                    }
                    if (obj.payTypeCode === 'WECHAT_PAY'){
                        obj.tradeTypeName = '微信支付单号';
                    }else {
                        obj.tradeTypeName = '支付宝支付单号';
                    }
                }

                self.hisArr = [];
                let hisArr = [];
                //请求订单评价的接口
                self.$axios.post(self.commUrl, {orderSn: self.viewModel.orderSn}).then(res => {
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

                        self.editShow = true;
                    }
                    );
                })

            },
            viewPic(picUrl){
                let self = this;
                self.picModal = true;
                self.viewingPic = picUrl;
            },
            detectionChange(){
                isSaveStatus = false;
            },
            deliver(index, bool){
                let self = this;
                self.reFlag = bool;
                self.deliverShow = true;

                self.$axios.get(self.oneOrderUrl+self.myList[index].orderSn).then((res) => {
                    self.viewModel = res;
                    self.spinShow=true;
                    self.cleanerListLoading = true;
                    self.$axios.post(self.cleanerUrl, {pagination: {page:1, size: 1000}, cityCode: self.viewModel.cityCode}).then((res) => {
                        if (self.mapObj === null){
                            self.mapObj = new AMap.Map('map-container', {
                                zoom: 11
                            });
                            self.mapObj.plugin(['AMap.ToolBar'], function () {
                                self.mapObj.addControl(new AMap.ToolBar())
                            });
                        }else {
                            let i = 0;
                            for (i in self.markers){
                                self.mapObj.remove(self.markers[i]);
                                self.mapObj.remove(self.subMarkers[i]);
                            }
                            self.markers.length = 0;
                            self.subMarkers.length = 0;
                        }
                        self.mapObj.setCenter([self.viewModel.longitude, self.viewModel.latitude]);
                        self.mapObj.setZoom(11);

                        if (res.list.length === 0){
                            self.cleanerList = [];
                        } else {
                            let i = 0;
                            self.cleanerList = res.list;

                            let _onClick = (e) => {self.showOne(e.target.F.extData)};

                            AMapUI.loadUI(['overlay/SvgMarker'], function(SvgMarker) {
                                let i = 0;
                                for (i in self.cleanerList){
                                    let name = self.cleanerList[i].name;

                                    let color = self.cleanerList[i].orderStatus === 1?'brown': self.cleanerList[i].orderStatus === 2? 'green': '#666' ;

                                    let obj =new SvgMarker.Shape.WaterDrop({
                                        height: 40, //高度
                                        fillColor: color, //填充色
                                        strokeWidth: 1, //描边宽度
                                        strokeColor: '#666' //描边颜色
                                    });

                                    let marker = new SvgMarker(obj, {
                                            showPositionPoint: true, //显示定位点
                                            position: [self.cleanerList[i].longtitude,self.cleanerList[i].latitude],
                                            map: self.mapObj,
                                            title: name,
                                            extData: self.cleanerList[i].id,
                                            clickable:true
                                        }
                                    );
                                    let distance = self.$util.figureDistance(self.cleanerList[i].latitude, self.cleanerList[i].longtitude, self.viewModel.latitude, self.viewModel.longitude);
                                    if (distance > 1000) distance = (distance/1000+'').split('.')[0] + 'km';
                                    else distance = (distance+'').split('.')[0] + 'm';

                                    self.markers.push(marker);
                                    AMap.event.addListener(marker, 'click', _onClick);
                                    let subMark = new AMap.Marker({
                                        position: [self.cleanerList[i].longtitude,self.cleanerList[i].latitude],
                                        map: self.mapObj,
                                        content: '<div style="white-space: pre; opacity: 1;color: black"><p><b>'+distance+'</b></p><p>'+name+'</p></div>',
                                        offset: new AMap.Pixel(-13,-80)
                                    });
                                    self.subMarkers.push(subMark);
                                }
                            });
                        }
                        //订单标记
                        {
                            AMapUI.loadUI(['overlay/SvgMarker'], function(SvgMarker) {
                                let obj =new SvgMarker.Shape.WaterDrop({
                                    height: 30, //高度
                                    fillColor: 'red', //填充色
                                    strokeWidth: 1, //描边宽度
                                    strokeColor: '#666' //描边颜色
                                });

                                self.orderSubMarker = new SvgMarker(obj,
                                    {
                                        showPositionPoint: true, //显示定位点
                                        position: [self.viewModel.longitude, self.viewModel.latitude],
                                        map: self.mapObj,
                                        title: self.viewModel.memberName
                                    }
                                );
                            });
                            let memberName = self.$util.isEmpty(self.viewModel.memberName)? '未知':self.viewModel.memberName;
                            self.orderMarker = new AMap.Marker({
                                position: [self.viewModel.longitude, self.viewModel.latitude],
                                map: self.mapObj,
                                content: '<div class="amap-marker-content" style="white-space: pre; opacity: 1;color: black;font-weight: bold">'+memberName+'</div>',
                                offset: new AMap.Pixel(-15,-50)
                            });
                        }
                        self.spinShow=false;
                        self.cleanerListLoading = false;
                    })
                });
            }
        }
    }
</script>
