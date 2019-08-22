<style scoped>
    @import '../../styles/common.less';
    .ivu-form-item{
        width: 300px;
    }
    .ivu-input-number{
        width: 180px;
    }
    .userselect{display: flex;flex-flow: row nowrap;align-items: center;}
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <span style="padding: 3px">
                       <DatePicker type="datetime" placement="bottom-end" v-model="queryBody.effectDate" style="width: 150px;padding: 3px" placeholder="开始时间" clearable></DatePicker>
                    -
                     <DatePicker type="datetime" @on-change="completionChanges" placeholder="截止时间" v-model="queryBody.loseDate" style="width: 150px;padding: 3px" clearable/>
<!--                  <DatePicker type="datetime" placeholder="截止时间" format="yyyy-MM-dd 23:59:59" v-model="queryBody.loseDate" style="width: 150px;padding: 3px" clearable/>-->
                </span>

                <span @click="queryMyListClick" style="display: inline-block;padding: 3px"><Button type="primary" icon="search">搜索</Button></span>
                <span @click="save" style="display: inline-block;padding: 3px" v-if="$util.getAccess('adv_active_add')"><Button type="success" icon="plus">添加活动</Button></span>
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

        <!--编辑添加活动-->
        <Modal v-model="editShow" :title="modalTitle" :width="800" :mask-closable=false :closable=false>
            <Form ref="viewModel" :rules="validateRules" :model="viewModel" :labelWidth="120" inline>
                <Row>
                    <FormItem prop="name" label="活动名称" >
                        <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="title" label="标题">
                        <Input type="text" v-model="viewModel.title" :readonly="disableEdit"></Input>
                    </FormItem>
                    <Row>
                        <FormItem prop="cityCode" label="适用地区" style="width: 700px">
                            <Select placeholder="请选择省份" :style="{width: $util.width}" v-model="editCityCode.province" style="width:200px;padding: 3px" clearable @on-change="selProvince">
                                <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                            <Select placeholder="请选择城市" :style="{width: $util.width}" v-model="editCityCode.city" style="width:200px;padding: 3px" clearable @on-change="selCity">
                                <Option v-for="item in cityList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                            <Select placeholder="请选择区" :style="{width: $util.width}" v-model="editCityCode.town" style="width:200px;padding: 3px" clearable>
                                <Option v-for="item in townList" :value="item.id" :key="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="activeType" label="活动方式" >
                            <Select placeholder="" v-model="viewModel.activeType" style="width:200px;padding: 3px" clearable>
                                <Option :value=1>一次性</Option>
                                <Option :value=2>周期性</Option>
                                <Option :value=3>永久性</Option>
                                <Option :value=4>分享推荐</Option>
                            </Select>
                        </FormItem>
                        <FormItem prop="state" label="是否有效" >
                            <Select placeholder="" v-model="viewModel.state" style="width:200px;padding: 3px" clearable>
                                <Option :value=1>有效</Option>
                                <Option :value=2>无效</Option>

                            </Select>
                        </FormItem>
                    </Row>


                    <Row>
                        <FormItem prop="effectDate" label="生效时间" >
                            <DatePicker type="datetime" placement="bottom-end" v-model="viewModel.effectDate" style="width: 150px;padding: 3px" placeholder="开始时间" clearable></DatePicker>
                        </FormItem>
                        <FormItem prop="loseDate" label="截止时间" >
                            <DatePicker type="datetime" @on-change="completionChange" placeholder="截止时间" v-model="viewModel.loseDate" style="width: 150px;padding: 3px" clearable/>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="desc" label="活动内容" >
                            <Input type="textarea" v-model="viewModel.desc" :rows="6" style="width:495px"></Input>
                        </FormItem>
                    </Row>

                    <Row>
                        <FormItem prop="target" label="受众对象" style="width:700px;">
                            <Checkbox></Checkbox>
                            <Select v-model="viewModel.target" style="width:200px;padding: 3px;" clearable>
<!--                                <Option :value=0>新用户</Option>-->
<!--                                <Option :value=0>老用户</Option>-->
                                <Option :value=0>所有用户</Option>
                            </Select>
                        </FormItem>
                    </Row>
                    
<!--                    <Row>-->
<!--                        <FormItem prop="target" style="width:700px;">-->
<!--                            <Checkbox></Checkbox>-->
<!--                            <Select  v-model="viewModel.target" style="width:200px;padding: 3px" clearable>-->
<!--                                <Option :value=0>白银</Option>-->
<!--                                <Option :value=0>翡翠</Option>-->
<!--                                <Option :value=0>黄金</Option>-->
<!--                                <Option :value=0>钻石</Option>-->
<!--                            </Select>-->
<!--                        </FormItem>-->
<!--                    </Row>-->
                    <Row>
                        <FormItem prop="creatorName" label="创建者" >
                            <Input type="text" v-model="isSave? userName:viewModel.creatorName" readonly></Input>
                        </FormItem>
                        <FormItem prop="modifyName" label="修改人" >
                            <Input type="text" v-model="isSave? userName:viewModel.modifyName" readonly></Input>
                        </FormItem>

                        <FormItem prop="createTime" label="创建时间" v-if="!isSave && disableEdit">
                            <Input type="text" v-model="new Date(viewModel.createTime).formatDef()" readonly></Input>
                        </FormItem>
                        <FormItem prop="lastModifyDate" label="修改时间" v-if="!isSave && disableEdit">
                            <Input type="text" v-model="new Date(viewModel.lastModifyDate).formatDef()" readonly></Input>
                        </FormItem>
                    </Row>
                    <Row>
	                    <FormItem label="活动图片" v-if="disableEdit">
	                        <div style="max-width: 300px;max-height: 300px">
	                            <img style="height: 100%;max-height: 300px" :src="viewModel.imageUrl" alt="">
	                        </div>
	                    </FormItem>
	                    <div style="margin-left: 30px" v-else>
	                        <p style="margin:5px"><b>活动图片</b></p>
	                        <div class="demo-upload-list" v-for="item in pics">
	                            <template v-if="item.status === 'finished'">
	                                <img :src="item.url">
	                                <div class="demo-upload-list-cover">
	                                    <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
	                                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
	                                </div>
	                            </template>
	                            <template v-else>
	                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
	                            </template>
	                        </div>
	                        <Upload ref="upload" :show-upload-list="false" :default-file-list="pics" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" :before-upload="beforeUpload" type="drag" :action="uploadUrl" style="display: inline-block;width:58px;">
	                            <div style="width: 58px;height:58px;line-height: 58px;">
	                                <Icon type="camera" size="20"></Icon>
	                            </div>
	                        </Upload>
	                    </div>
	                </Row>

                </Row>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel">返回</Button>
                <Button type="primary" @click="ok" v-if="!disableEdit">确定</Button>
            </div>
        </Modal>

		<!--照片大图模块-->
        <Modal v-model="picModal" title="图片" cancel-text="" ok-text="返回">
            <img style="width: 100%;height: 100%;padding: 5px 5px" :src="viewingPic" alt="">
        </Modal>
    </div>
</template>

<script>
    export default {
        data () {
            const afterV = (rule, value, callback) => {
                let before = this.viewModel.effectDate.getTime();
                let after = new Date(value).getTime();
                if (before >= after) {
                    return callback(new Error('结束时间必须大于开始时间!'));
                } else {
                    callback();
                }
            };
            return {
            	uploadUrl: this.$util.uploadUrl,
                queryUrl:'/memActive/list',//获取列表
                editUrl:'/memActive/edit',//编辑
                saveUrl:'/memActive/insert',//保存
                deleteUrl:'/memActive/edit',//删除
                oneDownloadUrl:'/coupon/fileDownLoad',//下载二维码
                cityUrl: this.$util.cityUrl,//城市选择
                test: false,
                provinceList:[],
                pics: [],
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
                        size:10,
                        total:10
                    }
                },


                queryBodys:{//请求体
                    pagination:{
                        page:1,
                        size:10,
                        total:10
                    }
                },
                myList:[],

                modalTitle: '',
                tableLoading:true,
                userName: this.$util.getUserName(),

                disableEdit:true,

                picModal:false,

                isSave:false,
                viewingPic: '',
                editShow:false,
                viewModel:{},//编辑单个的实体
                validateRules:{
                    name: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    title: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    desc: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    effectDate: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'}
                    ],
                    loseDate: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'},
                        {validator: afterV, trigger: 'change'}
                    ],
                    maxUseCount: [ {required: true, type: 'number', message: '不能为空!', trigger: 'change'} ],
//                    cityCode: [ {required: true, message: '不能为空!', trigger: 'change'} ],
                },

                platformSel:[
                    {value:1, label:'Android'},
                    {value:2, label:'IOS'},
                    {value:3, label:'其他'},
                    {value:4, label:'全部'}
                ],

                columns: [//字段
                    {title: '活动名称', key: 'name', align:'center', minWidth:110 },
                    {title: '城市', key: 'cityCode', align:'center', minWidth:110
                        , render: (h, params) => {
                            let self = this;
                            let cc = self.myList[params.index].cityCode;
                            self.$util.getProCityTown(self.myList[params.index], cc);
                            return h('div', self.myList[params.index].allName);
                        }
                    },
                    {title: '是否生效', key: 'state', align:'center', minWidth:110,render: (h, params) => {

                            switch (params.row.state) {
                                case  1:
                                    return h('div', '生效');
                                    break;
                                case 2:
                                    return h('div', '失效');
                                    break;
                            }
                        }},
                    {title: '活动方式', key: 'activeType', align:'center', minWidth:110,render: (h, params) => {

                            switch (params.row.activeType) {
                                case  1:
                                    return h('div', '一次性');
                                    break;
                                case  2:
                                    return h('div', '周期性');
                                    break;
                                case 3:
                                    return h('div', '永久性');
                                    break;
                                case 4:
                                    return h('div', '分享推荐');
                                    break;
                            }
                        }},
                    {title: '活动内容', key: 'desc', align:'center', minWidth:130},

                    {title: '受众用户', key: 'target', align:'center', minWidth:110
                        ,render: (h, params) => {

                            switch (params.row.target) {
                                case '[4]':
                                    return h('div', '钻石');
                                    break;
                                case '1':
                                    return h('div', '全部');
                                    break;
                                case '2':
                                    return h('div', '黄金');
                                    break;
                                case '0':
                                    return h('div', '所有用户');
                                    break;
                            }
                        }

                    },
                    {title: '生效时间', key: 'effectDate', align:'center', minWidth:150
                        ,render: (h, params) => {
                            return h('div', new Date(params.row.effectDate).formatDef());
                        }
                    },
                    {title: '结束日期', key: 'loseDate', align:'center', minWidth:150
                        ,render: (h, params) => {
                            return h('div', new Date(params.row.loseDate).formatDef());
                        }
                    },
                    {title: '创建者', key: 'creatorName', align:'center', minWidth:110},
                    {title: '修改者', key: 'modifyName', align:'center', minWidth:110},
                    {title: '创建时间', key: 'createTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                            return h('div', new Date(params.row.createTime).formatDef());
                        }
                    },
                    {title: '修改时间', key: 'lastModifyDate', align:'center', minWidth:150
                        ,render: (h, params) => {
                            return h('div', new Date(params.row.lastModifyDate).formatDef());
                        }
                    },
					{title: '图片', key: 'imageUrl', align:'center'
                        ,render: (h, params) => {
                        let self = this;
                        let arr = [];
                        let ssrc = self.myList[params.index].imageUrl;
                        arr.push(h('img', {attrs:{src:ssrc,style:'width:100%;margin-top: 6px;'}, on: {click: () => {this.viewPic(ssrc)}}}));
                        return h('div', arr);
                    	}
                    },
                    {title: '操作', key: 'action', width:260, align:'center',//操作
                        render: (h, params) => {
                            let arr = [];
                            let status = this.myList[params.index].state;
                            let t = this.myList[params.index].state === 2;
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.show(params.index)}}}, '查看'));

                            let access = this.$util.getAccess('adv_active_edit');
                            if (access) arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '编辑'));
                            access = this.$util.getAccess('adv_active_delete');
                            if (access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.row.id)}}}, '删除'));
                            access = this.$util.getAccess('adv_cou_add');
                            if (access)
                                if(status ===1){
                                arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.addcou(params.row.id)}}}, '添加优惠券'));
                            }
                            access = this.$util.getAccess('adv_cou_download');
                            if (access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.showOne(params.row.id)}}}, '下载二维码'));
                            return h('div', arr);
                        }
                    }
                ],
                advList: [
                ],

            }
        },

        mounted(){
            let self = this;

            let cityCode = 100000;
            let levelType = 1;
            let prop = "provinceList";
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);
            //获取整个表格数据
            self.queryMyList();
        },
        methods:{

            // 保洁改变的日期
            completionChange (formatedDate, date) {
                let self = this;
                self.baseChange(formatedDate, 'loseDate');
            },
            baseChange (date, property) {
                let self = this;
                if (!self.$util.isEmpty(date)) {
                    let split = date.split(' ');
                    if (split[1] !== '00:00:00') {
                        self.viewModel[property] = new Date(date);
                    } else {
                        self.viewModel[property] = new Date(split[0] + ' 23:59:59');
                    }
                }
            },

            // 保洁改变的日期
            completionChanges (formatedDate, date) {
                let self = this;
                self.baseChanges(formatedDate, 'loseDate');
            },
            baseChanges (date, property) {
                let self = this;
                if (!self.$util.isEmpty(date)) {
                    let split = date.split(' ');
                    if (split[1] !== '00:00:00') {
                        self.queryBody[property] = new Date(date);
                    } else {
                        self.queryBody[property] = new Date(split[0] + ' 23:59:59');
                    }
                }
            },


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

            //页码改变后的回调
            changePage(val){
                let self = this;
                self.queryBody.pagination.page = val;
                self.queryMyList();
            },
            //搜索
            queryMyListClick(){
                let self = this;
                self.queryBody.pagination = {page:1, total:10, size:10};
                self.queryMyList();
            },
            // 列表
            queryMyList(){
                let self = this;

                self.tableLoading = true;
                //去掉queryBody对象里空值属性
                self.$util.deleteBlankProp(self.queryBody);
                //请求参数

                let query = JSON.parse(JSON.stringify(self.queryBody));
				console.log("参数"+JSON.stringify(self.queryBody))

                self.$axios.post(self.queryUrl, query).then((res) => {
                	console.log("活动"+JSON.stringify(res))
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                       console.log("myList"+JSON.stringify(self.myList))
                    self.tableLoading = false;
                })
            },
            viewPic(pic){
                let self = this;
                self.viewingPic=pic;
                self.picModal=true;
            },
            show(index){
                let self = this;
                self.modalTitle = '活动详情';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                self.disableEdit = true;
                self.editShow = true;

                self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
                self.selProvince(self.viewModel.province);
                self.selCity(self.viewModel.city);
                self.editCityCode.province = self.viewModel.province;
                self.editCityCode.city = self.viewModel.city;
                self.editCityCode.town = self.viewModel.town;
            },
            edit(index){
                let self = this;
                self.isSave=false;
                self.modalTitle = '修改活动';
                self.pics = [];
                if (self.viewModel.imageUrl !== null && self.viewModel.imageUrl !== ''){
                    self.pics.push({status:'finished', url:self.viewModel.imageUrl});
                }
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                self.disableEdit = false;
                self.editShow = true;

                self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
                self.selProvince(self.viewModel.province);
                self.selCity(self.viewModel.city);
                self.editCityCode.province = self.viewModel.province;
                self.editCityCode.city = self.viewModel.city;
                self.editCityCode.town = self.viewModel.town;
            },
            save(){
                let self = this;
                self.isSave=true;
                self.modalTitle = '添加活动';
                self.viewModel = {};
				self.pics = [];
                self.disableEdit = false;
                self.editShow = true;
            },
            delete(id){
                let self = this;
//              self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
//				self.$Modal.confirm({title:'活动删除',content:'确定要删除该活动吗?',onOk:function () {
//                  self.viewModel.state=3;
//
//              }});

                var date = new Date();
                if(date){

                }

                self.$Modal.confirm({title:'活动删除',content:'确定要删除该活动吗?',onOk:function () {
                        self.queryBodys.id = id;
                        self.queryBodys.state = 3;
                        self.$axios.post(self.deleteUrl,self.queryBodys).then((res) => {
                            self.$Notice.success({title:'活动删除', desc:'删除成功'});
                            self.queryMyList();
                        });
                    }});


                // self.$axios.post(self.deleteUrl, self.queryBody).then((res) => {
                //     self.$Notice.success({title:'活动删除', desc:'活动删除'});
                //     self.queryMyList();
                // });
            },
            showOne(id){
                // $.post("/backend/coupon/fileDownLoad?t=" + new Date() * 1,{"activeId":id}, function (data) {
                //     console.info("请求成功");
                // });
                let self=this;
                var activeUrl = "/coupon/fileDownLoad?activeId=" + id;
                let axios = self.$axios.create({
                    baseURL: self.$axios.defaults.baseURL
                });
                // post 数据
                let postData = { activeId: id}

                axios.post(activeUrl, postData)
                    .then(response => {
                        // post 成功，response.data 为返回的数据
                        if(!response.data.success){
                            self.$Message.error({content: response.data.error.errorMessage});
                        }
                        console.log(response.data);
                    })
                    .catch(error => {
                        // 请求失败
                        self.$Message.error({content: '下载失败'});

                    });

            },
            addcou(id){
                let self = this;
                this.$router.push({
                    name: 'adv_cou',
                    params:{
                        id:id
                    }
                })

            },
            //活动添加保存
            ok () {
                let self = this;
                self.viewModel.imageUrl = self.$util.filesToStr(self.pics);
                self.$util.cityCodeBeforeEdit(self);

                let entity = JSON.parse(JSON.stringify(self.viewModel));

//              entity.updateBy = self.userName;

                if (self.disableEdit === false){

                    self.$refs.viewModel.validate(e => {
                        if (e){
                            entity.loseDate = new Date(self.viewModel.loseDate ).getTime();
                            entity.effectDate = new Date(self.viewModel.effectDate ).getTime();

                            delete entity.createTime;
                            delete entity.updateTime;
                            console.log("self.viewModel.imageUrl"+self.viewModel.imageUrl)
							if (self.$util.isEmpty(self.viewModel.imageUrl)){
                                self.$Message.error('请添加活动的图片');
                                return;
                            }

                            if (self.isSave === true){//添加
                                entity.creatorId = self.$util.getUserId();
                                entity.modifyId = self.$util.getUserId();
                                console.log("entity"+JSON.stringify(entity))
                                self.$axios.post(self.saveUrl, entity).then((res) => {
                                    self.$Notice.success({title:'活动添加', desc:'添加成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                });
                            }else{//编辑
                                self.$axios.post(self.editUrl, entity).then((res) => {
                                    self.$Notice.success({title:'活动编辑', desc:'修改成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                });
                            }
                        }else {
                            self.$Message.error('请输入完整信息!');
                        }
                    })

                }
            },
            cancel () {
                let self = this;
                self.$refs.viewModel.resetFields();
                self.editShow = false;
            },
            beforeUpload(file){
                let self = this;
                if (self.pics.length !== 0){
                    self.$Notice.warning({title: '上传图片', desc: '只能传一张图片!'});
                    return false;
                }else {
                    return true;
                }
            },
            handleSuccess(res, file){
                let self = this;
                if (res.success === true){
                    file.url = res.result;
                    self.pics.push(file);
                    console.log("上传图片"+self.pics)
                }else {
                    self.$Notice.error({title:'网络出错了!',desc:'错误码:'+response.data.error.errorCode+', 描述:'+response.data.error.errorMessage});
                }
            },
            handleView (url) {
                let self = this;
                self.viewPic(url);
            },
            handleRemove (file) {
                let self = this;
                self.pics.splice(self.pics.indexOf(file), 1);
            },
            handleFormatError (file) {
                let self = this;
                self.$Notice.warning({title: '上传图片', desc: file.name + '格式不对, 请上传jpg,jpeg或png'});
            }

        }
    }
</script>
