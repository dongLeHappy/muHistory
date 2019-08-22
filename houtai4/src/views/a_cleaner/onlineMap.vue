<style scoped>
    @import '../../styles/common.less';
    .ivu-input{
        width: 200px;
    }
    .searchDiv{
        margin: 5px 5px
    }
    #map-container{
        margin-left: 8px;
        width: 100%;
        height: 400px;
    }

</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <div class="searchDiv">
                    <span @keyup.enter="queryMyList" ><Input placeholder="请输入保洁员名称..." v-model="queryBody.name" style="width: 200px;padding: 3px" clearable/></span>
                    <span @keyup.enter="queryMyList" ><Input placeholder="请输入手机号码..." v-model="queryBody.mobile" style="width: 200px;padding: 3px" clearable/></span>
                    <span @keyup.enter="queryMyList" ><Input placeholder="请输入身份证..." v-model="queryBody.idNum" style="width: 200px;padding: 3px" clearable/></span>
                    <Select placeholder="注册类型" v-model="queryBody.registType" style="width:200px;padding: 3px" clearable>
                        <Option v-for="item in verifySelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Row style="padding: 3px" id="address_row">
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
                    </Row>
                    <Button type="primary" icon="search" @click="queryMyList">查询</Button>
                </div>
            </Row>
            <Row style="margin-left: 5px">
                <b>标注颜色的意义:
                    <span style="color: brown">棕色:不接单</span>
                    <span style="color: green">绿色:正在接单</span>
                    <span style="color: #666">灰色:工作中</span>
                </b>
            </Row>
            <Row :gutter="12">
                <Col span="12">
                    <div id="map-container"></div>
                    <Spin size="large" fix v-if="spinShow"></Spin>
                </Col>
                <Col span="12">
                    <div>
                        <Table ref="table" border :columns="columns" :data="myList" :loading="tableLoading" no-data-text="暂无数据" height="400"></Table>
                    </div>
                </Col>
            </Row>
        </Card>

        <!-- 详情和编辑 -->
        <Modal :width="700" v-model="editShow" title="保洁员详情" @on-ok="ok" @on-cancel="cancel" ok-text="返回" cancel-text="" :closable=false :mask-closable=false>
            <Row type="flex" justify="center" align="middle">
                <Col span="11">
                <div style="width: 100px;height: 100px;margin: 5px auto;">
                    <img style="height: 100%; width: 100%" :src="viewModel.picLogo" alt="">
                </div>
                </Col>
                <Col span="11" style="height: 100%">
                <Select :placeholder="viewModel.level === null || viewModel.level === ''? '暂无等级':viewModel.level" style="width:200px;padding: 3px" :disabled="disableEdit" clearable>

                </Select>
                </Col>
            </Row>
            <Row>
                <Form :model="viewModel" :labelWidth="90" inline>
                    <FormItem prop="user" label="姓名" >
                        <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="身份证">
                        <Input type="text" v-model="viewModel.idNum" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="手机号码">
                        <Input type="text" v-model="viewModel.mobile" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="登录密码">
                        <Input type="text" v-model="viewModel.password" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="公司名称">
                        <Input type="text" v-model="viewModel.companyName" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="营业执照">
                        <Input type="text" v-model="viewModel.idBusinessLicense" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="公司地址">
                        <Input type="text" v-model="viewModel.addr" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="开户行">
                        <Input type="text" v-model="viewModel.bankName" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="基本帐号">
                        <Input type="text" v-model="viewModel.bankAccountNo" :readonly="disableEdit"></Input>
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
                        <Select v-model="viewModel.auditStatus" style="width:162px" :disabled="disableEdit">
                            <Option v-for="item in auditSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem prop="user" label="保洁员类型">
                        <Select v-model="viewModel.type" style="width:162px" :disabled="disableEdit">
                            <Option v-for="item in typeSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem prop="user" label="状态">
                        <Select v-model="viewModel.status" style="width:162px" :disabled="disableEdit">
                            <Option v-for="item in statusSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem prop="user" label="注册时间">
                        <Input type="text" v-model="viewModel.ctime" :readonly=true></Input>
                    </FormItem>
                    <!--123123123-->
                    <FormItem prop="user" label="修改时间">
                        <Input type="text" v-model="viewModel.utime" :readonly=true></Input>
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
                <Button type="text" size="large" @click="cancel">返回</Button>
                <Button type="primary" size="large" @click="ok" v-if="!disableEdit">确定</Button>
            </div>
        </Modal>

        <!--照片大图模块-->
        <Modal v-model="picModal" title="图片" cancel-text="" >
            <img style="width: 100%;height: 100%;padding: 5px 5px" :src="viewingPic" alt="">
        </Modal>
    </div>
</template>
<script>
    import AMap from 'AMap';
    import AMapUI from 'AMapUI';
    import Cookies from 'js-cookie';
    var disposable = true;
    export default {
        data () {
            return {
                queryUrl:'/cleaner/listOnlineCleaner',
                oneCleanerUrl: '/cleaner/',
                cityUrl: this.$util.cityUrl,
                citySel: [],
                queryBody:{//请求体
                    pagination:{
                        currentIndex:0,
                        page:1,
                        size:1000
                    }
                },

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

                spinShow:true,
                editShow:false,
                disableEdit:true,
                picModal:false,
                viewModel:{},//编辑单个的实体
                mapObj:null,
                idPic:[],
                BusLicPic:[],
                contactPic:[],
                otherPic:[],
                markers:[],
                subMarkers:[],
                viewingPic:'',

                verifySelector:[
                    {value: 1, label: '自注册'},
                    {value: 2, label: '邀请入驻'}
                ],
                selectedVerify:'',

                tableLoading:true,
                columns: [//字段
                    {title: 'id', key: 'id', align:'center', minWidth:110},
                    {title: '姓名', key: 'name', align:'center', minWidth:110},
                    {title: '手机号码', key: 'mobile', align:'center', minWidth:110},
                    {title: '工作年龄', key: 'workingYears', align:'center', minWidth:110},
                    {title: '状态', key: 'status', align:'center', minWidth:110
                        , render:(h, params) => {
                        let obj = this.myList[params.index].status;//1正常，2停用
                        if (obj === 1) obj = h('div', {attrs:{style:'color:green'}}, '正常');
                        else if (obj === 2) obj = h('div', {attrs:{style:'color:red'}}, '停用');
                        else obj = h('div', {attrs:{style:'color:brown'}}, '未知');
                        return obj;
                    }
                    },
                    {title: '操作', className:'actionColumn', key: 'action', width:100, align: 'center',fixed:'right',//操作
                        render: (h, params) => {
                            let arr = [];
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.view(params.row.id)}}}, '查看'));
                            return h('div', arr);
                        }
                    }
                ]
                ,myList:[]
                ,auditSel: [
                    {value: 0, label: '未审核'},
                    {value: 1, label: '已提交待审核'},
                    {value: 2, label: '通过'},
                    {value: 3, label: '不通过'}
                ],
                typeSelector:[
                    {value: 1, label: '个人'},
                    {value: 2, label: '公司'}
                ],

                funSelector:[
                    {value: 1, label: '没接单'},
                    {value: 2, label: '正在接单'},
                    {value: 3, label: '工作中'}
                ],

                statusSelector:[
                    {value: 1, label: '正常'},
                    {value: 2, label: '停用'}
                ],

                confirmSel:[
                    {value: 0, label: '未审核'},
                    {value: 1, label: '提交资料待审核'},
                    {value: 2, label: '审核通过'},
                    {value: 3, label: '审核不通过'}
                ],

            }
        },
        mounted(){
            let self = this;
            let cityCode = 100000;
            let levelType = 1;
            let prop = "provinceList";
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);

//            let cs = JSON.parse(localStorage.getItem('citySel'));
//            if (cs === null || cs === undefined){
//                self.$axios.post(self.cityUrl).then((res) => {
//                    self.citySel = res;
//                    self.citySel.unshift({cityCode:'0',cityName:'',provinceName:'全国'});
//                    localStorage.setItem('citySel', JSON.stringify(res));
//                });
//            }else {
//                self.citySel = cs;
//            }
            self.queryMyList();
        },
        methods:{
            //省份确定城市
            selProvince(val){
                let self = this;
                if (self.editShow){
                    //非搜索列表情况下
                    delete self.editCityCode.city;
                    delete self.editCityCode.town;
                }else {
                    //搜索列表情况下
                    delete self.cityCode.city;
                    delete self.cityCode.town;
                }

                self.$util.cityCodeSelect(self, val, 2, 'cityList');
            },
            selCity(val){
                let self = this;
                if (self.editShow){
                    //非搜索列表情况下
                    delete self.editCityCode.town;
                }else {
                    //搜索列表情况下
                    delete self.cityCode.town;
                }
                self.$util.cityCodeSelect(self, val, 3, 'townList');
            },

            queryMyList(){
                let self = this;
                self.spinShow=true;
                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody);

                if (self.$util.isEmpty(self.cityCode.town)){
                    self.queryBody.cityCode = self.cityCode.city;
                }else if (!self.$util.isEmpty(self.cityCode.town)){
                    self.queryBody.cityCode = self.cityCode.town;
                }

                // 从 Cookies 中查询 有没有地区编码
                let cityCodes = Cookies.get('cityCode');

                if(cityCodes !== undefined) {

                    let cityList = self.$util.strConvertArray(cityCodes);

                    if (cityList[0] !== 'null' && cityList[0] !== ''){
                        //删除元素
                        if (cityList.length > 0) {
                            let canvas = document.querySelector('#address_row');
                            if(cityCodes !== null && canvas !== null){
                                canvas.remove();
                            }
                        } else {
                            //初始化查询 地区 条件
                            self.$util.cityCodeBeforeQuery(self);
                        }
                        self.queryBody.cityCode = cityList[0];
                    }
                }

                self.queryBody.refType = Cookies.get('refType');
                self.queryBody.id = Cookies.get('userId');

                let i = 0;
                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
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

                    if (res.list.length === 0){
                        self.myList = [];
                    }else {
                        self.myList = res.list;

                        let _onClick = (e) =>{self.showOne(e.target.F.extData)};

                        AMapUI.loadUI(['overlay/SvgMarker'], function(SvgMarker) {
                            for (i in self.myList){
                                let name = self.myList[i].name;

                                let color = self.myList[i].orderStatus === 1? 'brown': self.myList[i].orderStatus === 2? 'green': '#666' ;

                                let obj =new SvgMarker.Shape.WaterDrop({
                                    height: 40, //高度
                                    fillColor: color, //填充色
                                    strokeWidth: 1, //描边宽度
                                    strokeColor: '#666' //描边颜色
                                });

                                let marker = new SvgMarker(obj,
                                    {
                                        showPositionPoint: true, //显示定位点
                                        position: [self.myList[i].longtitude,self.myList[i].latitude],
                                        map: self.mapObj,
                                        title: name,
                                        extData: self.myList[i].id,
                                        clickable:true
                                    }
                                );
                                self.markers.push(marker);
                                AMap.event.addListener(marker, 'click', _onClick);
                                let subMarker = new AMap.Marker({
                                position: [self.myList[i].longtitude,self.myList[i].latitude],
                                map: self.mapObj,
                                content: '<div style="white-space: pre; opacity: 1;color: black">'+name+'</div>',
                                offset: new AMap.Pixel(-15,-58)
                                });
                                self.subMarkers.push(subMarker);
                            }
                        });

                    }
                    self.spinShow=false;
                    self.tableLoading = false;
                })
            },
            view(id){
                let self = this;
                let x = 0;

                for (x in self.markers){
                    if (self.markers[x].F.extData === id){
                        self.mapObj.setZoom(15);
                        self.mapObj.setCenter([ self.markers[x].F.position.lng, self.markers[x].F.position.lat]);
                    }
                }
            },
            showOne(id){
                let self = this;
                self.$axios.get(self.oneCleanerUrl+id).then((res) => {
                    self.editShow = true;
                    self.viewModel = res;
                    self.idPic = self.$util.strToPicArr(self.viewModel.picId0);
                    self.idPic = self.idPic.concat(self.$util.strToPicArr(self.viewModel.picId1));
                    self.BusLicPic = self.$util.strToPicArr(self.viewModel.picBusinessLicense);
                    self.contactPic = self.$util.strToPicArr(self.viewModel.picContract);
                    self.otherPic = self.$util.strToPicArr(self.viewModel.picOther);
                });
            },
            viewPic(picUrl){
                let self = this;
                self.picModal = true;
                self.viewingPic = picUrl;
            },
            show(){
                this.editShow = true;
            },
            ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.editShow = false;
            }
        }
    }
</script>
