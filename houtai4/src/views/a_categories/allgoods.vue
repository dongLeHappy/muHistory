<style scoped>
    @import '../../styles/common.less';
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
        <span style="display: none">{{test}}</span>
        <Card>
            <Row>
                <span @keyup.enter="queryMyListClick" ><Input v-model="queryBody.title" style="width: 200px;padding: 3px" placeholder="请输入标题..." clearable></Input></span>

                <Select placeholder="广告类型" v-model="queryBody.type" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in typeSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select placeholder="展示平台" v-model="queryBody.platform" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in platformSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select placeholder="状态" v-model="queryBody.status" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in statusSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <Row style="padding: 3px">
                    <span style="display: none">{{test}}</span>
                    <span>适用地区: </span>
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

                <span @click="queryMyListClick" style="display: inline-block;padding: 3px"><Button type="primary" icon="search">搜索</Button></span>
                <span @click="save" style="display: inline-block;padding: 3px" v-if="$util.getAccess('adv_save')"><Button type="success" icon="plus">发布广告</Button></span>
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

        <!--编辑添加模块-->
        <Modal v-model="editShow" :title="modalTitle" :width="600" :mask-closable=false :closable=false>
            <Form ref="viewModel" :model="viewModel" :rules="validateRules" :labelWidth="90" inline>
                <Row>
                    <FormItem prop="title" label="标题"  >
                        <Input type="text" v-model="viewModel.title" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="content" label="内容" style="width: 450px"  >
                        <Input type="textarea" :rows="6" v-model="viewModel.content" :readonly="disableEdit"></Input>
                    </FormItem>

                    <div>
                        <FormItem prop="cityCode" label="适用地区" >
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
                    </div>

                    <FormItem prop="sort" label="权重"  >
                        <InputNumber :style="{width: $util.width}" v-model="viewModel.sort" :readonly="disableEdit"></InputNumber>
                    </FormItem>

                    <FormItem prop="platform" label="平台"  >
                        <Select v-model="viewModel.platform" :style="{width: $util.width}" :disabled="disableEdit">
                            <Option v-for="item in platformSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem prop="clientType" label="客户端"  >
                        <Select v-model="viewModel.clientType" :style="{width: $util.width}" :disabled="disableEdit">
                            <Option :value=1>快洁帮</Option>
                            <Option :value=2>快洁专员</Option>
                        </Select>
                    </FormItem>

                    <FormItem prop="type" label="类型">
                        <Select v-model="viewModel.type" :disabled="disableEdit" :style="{width: $util.width}">
                            <Option v-for="item in typeSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <FormItem prop="webUrl" label="跳转链接"  >
                        <Input type="text" v-model="viewModel.webUrl" :readonly="disableEdit"></Input>
                    </FormItem>

                    <FormItem prop="status" label="状态" >
                        <Select v-model="viewModel.status" :disabled="disableEdit" :style="{width: $util.width}">
                            <Option v-for="item in statusSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="创建时间" v-if="!isSave && disableEdit">
                        <Input v-model="viewModel.ctime" readonly></Input>
                    </FormItem>
                    <FormItem label="修改时间" v-if="!isSave && disableEdit">
                        <Input v-model="viewModel.utime" readonly></Input>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="广告图片" v-if="disableEdit">
                        <div style="max-width: 300px;max-height: 300px">
                            <img style="height: 100%;max-height: 300px" :src="viewModel.picUrl" alt="">
                        </div>
                    </FormItem>
                    <div style="margin-left: 30px" v-else>
                        <p style="margin:5px"><b>广告图片</b></p>
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
    import vjs from "../../libs/validateRules.js"
    export default {
        data () {
            return {
                uploadUrl: this.$util.uploadUrl,
                queryUrl: '/advertise/list',//获取列表
                editUrl: '/advertise/edit',
                saveUrl: '/advertise/save',
                deleteUrl: '/advertise/delete',
                citySel: [],
                queryBody: {//请求体
                    pagination: {
                        page: 1,
                        size: 10,
                        total: 10
                    }
                }
                , myList: [],
                pics: [],

                modalTitle: '',
                tableLoading: true,
                disableEdit: true,
                picModal: false,
                viewingPic: '',

                test: false,
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

                validateRules: {
                    title: [{required:true, message:'不能为空', trigger:'blur'}],
                    content: [{required:true, message:'不能为空', trigger:'blur'}],
//                    cityCode: [{required:true, message:'不能为空', trigger:'change'}],
                    platform: [{required:true, type:'number', message:'不能为空', trigger:'change'}],
                    clientType: [{required:true, type:'number', message:'不能为空', trigger:'change'}],
                    sort: [{required:true, type:'number', message:'不能为空', trigger:'change'}],
                    status: [{required:true, type:'number', message:'不能为空', trigger:'change'}],
                    type: [{required:true, type:'number', message:'不能为空', trigger:'change'}],
                    webUrl: [
                        {required:true, message:'不能为空', trigger:'blur'},
                        {validator: vjs.urlV, trigger:'blur'}
                    ]
                },

                isSave:false,
                editShow:false,
                viewModel:{},//编辑单个的实体

                typeSel:[
                    {value:1, label:'启动页'},
                    {value:2, label:'轮播'}
                ],
                platformSel:[
                    {value:1, label:'Android'},
                    {value:2, label:'IOS'}
                ],
                statusSel:[
                    {value:1, label:'有效'},
                    {value:0, label:'无效'}
                ],

                columns: [//字段
                    {title: '城市', key: 'cityCode', align:'center'
                        ,render:(h,params)=>{
                        let self = this;
                        let cc = self.myList[params.index].cityCode;
                        self.$util.getProCityTown(self.myList[params.index], cc);
                        return h('div', self.myList[params.index].allName);
                    }
                    },
                    {title: '内容', key: 'content', align:'center'},
                    {title: '图片', key: 'picUrl', align:'center'
                        ,render: (h, params) => {
                        let self = this;
                        let arr = [];
                        let ssrc = self.myList[params.index].picUrl;
                        arr.push(h('img', {attrs:{src:ssrc,style:'width:100%;margin-top: 6px;'}, on: {click: () => {this.viewPic(ssrc)}}}));
                        return h('div', arr);
                    }
                    },
                    {title: '广告平台', key: 'platform', align:'center', render:(h, params) => {
                        let self = this;
                        let type = self.myList[params.index].platform;
                        if (type === 1)  type = h('div', {attrs:{style:'color:green'}}, 'Android');
                        else if (type === 2) type = h('div', {attrs:{style:'color:blue'}}, 'IOS');
                        else if (type === 3) type = h('div', {attrs:{style:'color:red'}}, '其他');
                        else if (type === 4) type = h('div', {attrs:{style:'color:red'}}, '全部');
                        else  type = h('div', {attrs:{style:'color:brown'}}, '未知');
                        return type;
                    }},
                    {title: '客户端', key: 'clientType', align:'center', render:(h, params) => {
                        let self = this;
                        let type = params.row.clientType;
                        if (type === 1)  type = h('div', {attrs:{style:'color:green'}}, '快洁帮');
                        else if (type === 2) type = h('div', {attrs:{style:'color:blue'}}, '快洁专员');
                        else  type = h('div', {attrs:{style:'color:brown'}}, '未知');
                        return type;
                    }},
                    {title: '状态', key: 'status', align:'center', render:(h, params) => {
                        let self = this;
                        let type = params.row.status;
                        if (type === 0)  type = h('div', {attrs:{style:'color:red'}}, '无效');
                        else if (type === 1) type = h('div', {attrs:{style:'color:green'}}, '有效');
                        else  type = h('div', {attrs:{style:'color:brown'}}, '未知');
                        return type;
                    }},
                    {title: '权重', key: 'sort', align:'center'},
                    {title: '标题', key: 'title', align:'center'},
                    {title: '广告展示类型', key: 'type', align:'center', render:(h, params) => {
                        let self = this;
                        let arr = [];
                        let type = self.myList[params.index].type;
                        if (type === 1) type = h('div', {attrs:{style:'color:red'}}, '启动页');
                        else if (type === 2)type = h('div', {attrs:{style:'color:green'}}, '轮播');
                        else type = h('div', {attrs:{style:'color:brown'}}, '未知');
                        return type;
                    }},
                    {title: '跳转链接', key: 'webUrl', align:'center'
                        , render:(h, params) => {
                        let self = this;
                        let ssrc = self.myList[params.index].webUrl;
                        return h('a',{attrs:{href:ssrc, target:'_blank'}, on: {}}, ssrc);
                    }
                    },
                    {title: '操作', key: 'action', fixed:'right', width:180, align:'center',//操作
                        render: (h, params) => {
                            let arr = [];
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.show(params.index)}}}, '查看'));
                            let access = this.$util.getAccess('adv_edit');
                            if (access)arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '编辑'));

                            access = this.$util.getAccess('adv_delete');
                            if (access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.index)}}}, '删除'));
                            return h('div', arr);
                        }
                    }
                ],
                advList: [
                ]
            }
        },
        mounted(){
            let self = this;

            let cityCode = 100000;
            let levelType = 1;
            let prop = "provinceList";
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);

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


            changePage(val){
                let self = this;
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

                self.$util.cityCodeBeforeQuery(self);

                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody);

                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
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
                self.modalTitle = '广告详情';
                self.viewModel = self.myList[index];
                self.disableEdit = true;
                self.editShow = true;

                self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
                self.selProvince(self.viewModel.province);
                self.selCity(self.viewModel.city);
                self.editCityCode.province = self.viewModel.province;
                self.editCityCode.city = self.viewModel.city;
                self.editCityCode.town = self.viewModel.town;
                debugger
            },
            edit(index){
                let self = this;
                self.isSave=false;
                self.pics = [];
                self.modalTitle = '修改广告';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                if (self.viewModel.picUrl !== null && self.viewModel.picUrl !== ''){
                    self.pics.push({status:'finished', url:self.viewModel.picUrl});
                }
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

                self.modalTitle = '发布广告';
                self.viewModel = {};
                self.pics = [];
                self.disableEdit = false;
                self.editShow = true;
            },
            delete(index){
                let self = this;
                self.$Modal.confirm({title:'广告删除',content:'确定要删除该广告吗?',onOk:() => {
                    self.$axios.post(self.deleteUrl, self.myList[index].id, {headers:{'Content-Type':'application/json'}}).then((res) => {
                        self.$Notice.success({title:'广告删除', desc:'删除成功'});
                        self.queryMyList();
                    })
                }});
            },
            ok () {
                let self = this;
                self.viewModel.picUrl = self.$util.filesToStr(self.pics);

                delete self.viewModel.ctime;
                delete self.viewModel.utime;
                delete self.viewModel.viewNum;

                if (self.disableEdit === false){
                    self.$refs.viewModel.validate(e => {
                        if (e === true){
                            self.$util.cityCodeBeforeEdit(self);

                            if (self.$util.isEmpty(self.viewModel.picUrl)){
                                self.$Message.error('请添加广告的图片');
                                return;
                            }

                            if (self.isSave === true){//添加
                                self.$axios.post(self.saveUrl, self.viewModel).then((res) => {
                                    self.$Notice.success({title:'广告发布', desc:'发布成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                });
                            }else{//编辑
                                self.$axios.post(self.editUrl, self.viewModel).then((res) => {
                                    self.$Notice.success({title:'广告编辑', desc:'修改成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                });
                            }
                        }else {
                            self.$Message.error('请输入完整信息');
                        }
                    });
                }else {
                    self.editShow = false;
                }
            },
            cancel () {
                let self = this;
                if (self.disableEdit === false) self.$refs['viewModel'].resetFields();
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
