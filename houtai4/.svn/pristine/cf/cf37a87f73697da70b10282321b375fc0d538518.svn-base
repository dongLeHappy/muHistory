<style scoped>
    @import '../../styles/common.less';
    .ivu-input-number{
        display: block;
        width: 162px;
    }
    .ivu-form-item{
        width: 320px;
        margin-left: 20px;
    }
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row><Button type="success" icon="plus" @click="save" v-if="$util.getAccess('ver_save')">发布版本</Button></Row>
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

        <Modal v-model="editShow" :title="modalTitle" width="600" :mask-closable=false :closable=false>
            <Form ref="viewModel" :model="viewModel" :labelWidth="130" :rules="validateRules">
                <FormItem prop="versionName" label="版本名称">
                    <Input type="text" v-model="viewModel.versionName" :readonly="disableEdit" placeholder="输入版本名称, 例如快洁帮V1.0.1"></Input>
                </FormItem>
                <FormItem prop="versionCode" label="版本代码">
                    <Input type="text" v-model="viewModel.versionCode" :readonly="disableEdit" placeholder="输入版本代码, 例如1.0.1"></Input>
                </FormItem>
                <FormItem prop="platform" label="平台">
                    <Select v-model="viewModel.platform" style="width:162px" :disabled="disableEdit">
                        <Option v-for="item in platformSel" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>

                <FormItem label="上传apk文件">
                    <Upload ref="upload" :default-file-list="apkList" type="drag" :action="uploadUrl" :format="['apk', '1', '2', '3']" :before-upload="beforeUpload" :on-remove="removeApk" :on-format-error="handleFormatError" :on-success="handleApkSuccess">
                        <div>
                            请选择或拖拽文件到此,下载链接自动填写
                        </div>
                    </Upload>
                </FormItem>
                <!--<FormItem prop="downloadUrl" label="下载链接">-->
                    <!--<template v-if="uploadOk === true">-->
                    <!--</template>-->
                    <!--<Input type="text" v-model="viewModel.downloadUrl" readonly></Input>-->
                <!--</FormItem>-->
                <!--<FormItem prop="size" label="大小(MB)" sytle="width:162px">-->
                    <!--<InputNumber :min=1 type="text" v-model="viewModel.size" :readonly="disableEdit"></InputNumber>-->
                <!--</FormItem>-->
                <FormItem prop="isWifiUpdate" label="是否WiFi下强制升级">
                    <Select v-model="viewModel.isWifiUpdate" style="width: 162px">
                        <Option v-for="item in commSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="isForedUpdate" label="是否强制升级">
                    <Select v-model="viewModel.isForedUpdate" style="width: 162px">
                        <Option v-for="item in commSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="newest" label="是否最新">
                    <Select v-model="viewModel.newest" style="width: 162px">
                        <Option v-for="item in commSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>

                <FormItem prop="versionType" label="版本类型">
                    <Select v-model="viewModel.versionType" style="width: 162px">
                        <Option :value=0>会员端</Option>
                        <Option :value=1>保洁员端</Option>
                    </Select>
                </FormItem>

                <FormItem prop="remark" label="版本备注">
                    <Input type="textarea" v-model="viewModel.remark" :readonly="disableEdit"></Input>
                </FormItem>
                <FormItem prop="ctime" label="创建时间" v-show="!isSave && disableEdit">
                    <Input type="text" v-model="viewModel.ctime" :readonly="true"></Input>
                </FormItem>
                <FormItem prop="utime" label="更新时间" v-show="!isSave && disableEdit">
                    <Input type="text" v-model="viewModel.utime" :readonly="true"></Input>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel">返回</Button>
                <Button type="primary" @click="ok" :disabled=okDisable>确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import vjs from  '../../libs/validateRules.js';
    export default {
        data () {
            return {
                queryUrl:'/version/list',//获取列表
                editUrl:'/version/edit',
                saveUrl:'/version/save',
                deleteUrl:'/version/delete',
                uploadUrl:this.$util.uploadUrl,
                queryBody:{//请求体
                    pagination:{
                        currentIndex:0,
                        page:1,
                        size:10
                    },
                    req:{}
                },

                tableLoading:true,

                commSel:[
                    {value:0, label:'否'},
                    {value:1, label:'是'}
                ],
                platformSel:[
                    {value:1, label:'安卓'},
                    {value:2, label:'IOS'}
                ],

                modalTitle: '',
                isSave:false,
                disableEdit:true,
                selectedType:'',
                editShow:false,
                viewModel:{},//编辑单个的实体
                apkList:[],
                uploadOk:false,
                okDisable: false,

                validateRules:{
                    versionName: [{required: true, message:'不能为空!', trigger: 'blur'}],
                    versionCode: [
                        {required: true, message: '不能为空!', trigger: 'blur'},
                        {validator: vjs.versionCodeV, trigger: 'blur'}
                        ],
                    platform: [{required: true, type: 'number', message: '不能为空!', trigger: 'change'}],
//                    size: [{required: true, type: 'number', message: '不能为空!', trigger: 'blur'}],
//                    downloadUrl: [{required: true, message: '不能为空!', trigger: 'change'}],
                    packagePath: [{required: true, message: '不能为空!', trigger: 'blur'}],
                    isWifiUpdate: [{required: true, type: 'number', message: '不能为空!', trigger: 'change'}],
                    isForedUpdate: [{required: true, type: 'number', message: '不能为空!', trigger: 'change'}],
                    newest: [{required: true, type: 'number', message: '不能为空!', trigger: 'change'}],
                    versionType: [{required: true, type: 'number', message: '不能为空!', trigger: 'change'}]
                },

                columns: [//字段
                    {title: '版本代码', key: 'versionCode', align:'center', minWidth:110},
                    {title: '版本名称', key: 'versionName', align:'center', minWidth:110},
                    {title: '平台', key: 'platform', align:'center', minWidth:110
                        ,render:(h, params) => {
                        let self = this;
                        let obj = params.row.platform;
                        if (obj === 1) obj=h('div', {attrs:{style: 'color:green'}}, '安卓');
                        else if(obj === 2) obj= h('div', {attrs:{style: 'color:blue'}}, 'IOS');
                        else obj= h('div', {attrs:{style: 'color:brown'}}, '未知');
                        return obj;
                    }
                    },
                    {title: '版本类型', key: 'versionType', align:'center', minWidth:110
                        ,render: (h, params) => {
                        let obj = this.myList[params.index].versionType;
                        if (obj === 0) obj = h('div', {attrs:{style:'color:green'}}, '会员端');
                        else if (obj === 1) obj = h('div', {attrs:{style:'color:blue'}}, '保洁员端');
                        else  obj = h('div', {attrs:{style:'color:brown'}}, '未知');
                        return obj;
                    }
                    },
                    {title: '下载链接', key: 'downloadUrl', align:'center', minWidth:110
                        ,render:(h, params) => {
                        let self = this;
                        let ssrc = params.row.downloadUrl;
                        return h('a',{attrs:{href:ssrc, target:'_blank'}, on: {}}, ssrc);
                    }
                    },
                    {title: 'wifi强制升级', key: 'isWifiUpdate', align:'center', minWidth:110
                        ,render:(h, params) => {
                        let self = this;
                        let obj = self.myList[params.index].isWifiUpdate;
                        if (obj === 0) obj='否';
                        else if(obj === 1) obj= '是';
                        else obj ='未知';
                        return h('div', obj);
                    }
                    },
                    {title: '强制升级', key: 'isForedUpdate', align:'center', minWidth:110
                        ,render:(h, params) => {
                        let self = this;
                        let obj = self.myList[params.index].isForedUpdate;
                        if (obj === 0) obj='否';
                        else if(obj === 1) obj= '是';
                        else obj ='未知';
                        return h('div', obj);
                    }
                    },
                    {title: '是否最新', key: 'newest', align:'center', minWidth:110
                        ,render:(h, params) => {
                        let self = this;
                        let obj = self.myList[params.index].newest;
                        if (obj === 0) obj='否';
                        else if(obj === 1) obj= '是';
                        else obj ='未知';
                        return h('div', obj);
                    }
                    },
                    {title: '备注', key: 'remark', align:'center', minWidth:110},
                    {title: '创建时间', key: 'ctime', align:'center', minWidth:110},
                    {title: '修改时间', key: 'utime', align:'center', minWidth:110},
                    {title: '操作', key: 'action', align: 'center', fixed:'right', width:130,//操作
                        render: (h, params) => {
                            let arr = [];

                            let access = this.$util.getAccess('ver_edit');
                            if (access)arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '修改'));
                            access = this.$util.getAccess('ver_delete');
                            if (access)arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.index)}}}, '删除'));
                            return h('div', arr);
                        }
                    }
                ]
                ,myList:[]


            }
        },
        mounted(){
            let self = this;
            self.queryMyList();
        },
        methods:{
            changePage(val){
                let self = this;
                self.queryBody.pagination.page = val;
                self.queryMyList();
            },
            queryMyList(){
                let self = this;
                self.tableLoading = true;
                self.$util.deleteBlankProp(self.queryBody.req);

                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.tableLoading = false;
                })
            },
            delete(index){
                let self = this;
                self.$Modal.confirm({title:'版本删除',content:'确定要删除该版本吗?',onOk:function () {
                    self.$axios.post(self.deleteUrl, self.myList[index].id, {headers:{'Content-Type':'application/json'}}).then((res) => {
                        self.$Notice.success({title:'版本删除', desc:'删除成功'});
                        self.queryMyList();
                    });
                }});

            },
            edit(index){
                let self = this;
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.$refs.upload.clearFiles();

                self.modalTitle = '修改版本';
                if (!self.$util.isEmpty(self.viewModel.downloadUrl)){
                    self.apkList = [{name: self.viewModel.downloadUrl.substr(self.viewModel.downloadUrl.lastIndexOf('/')+1), url: self.viewModel.downloadUrl}];
                }
                self.isSave = false;
                self.disableEdit = false;
                self.editShow = true;
            },
            save(){
                let self = this;
                self.viewModel = {};
                self.$refs.upload.clearFiles();

                self.modalTitle = '发布版本';
                self.isSave = true;
                self.disableEdit = false;
                self.editShow = true;
            },
            ok () {
                let self = this;
                self.$refs.viewModel.validate((e) => {
                    if (e === true){
                        delete self.viewModel.ctime;
                        delete self.viewModel.utime;
                        if (self.isSave === true){
                            self.$axios.post(self.saveUrl, self.viewModel).then((res) => {
                                self.$Notice.success({title:'版本发布', desc:'发布成功'});
                                self.editShow = false;
                                self.$refs.viewModel.resetFields();
                                self.queryMyList();
                            });
                        }else {//编辑
                            self.$axios.post(self.editUrl, self.viewModel).then((res) => {
                                self.$Notice.success({title:'版本编辑', desc:'编辑成功'});
                                self.editShow = false;
                                self.$refs.viewModel.resetFields();
                                self.queryMyList();
                            });
                        }
                    }else {
                        self.$Message.error('请输入完整信息!');
                    }
                });
            },
            cancel () {
                let self = this;
                self.editShow = false;
                self.$refs.viewModel.resetFields();
            },
            handleApkSuccess(res, file, fileList){
                let self = this;

                if (res.success === true){
                    self.uploadOk = true;
                    self.viewModel.downloadUrl = res.result;
                    self.okDisable = false;
                }else {
                    self.$Notice.error({title:'网络出错了!',desc:'错误码:'+res.data.error.errorCode+', 描述:'+res.data.error.errorMessage});
                }
            },
            removeApk(){
                let self = this;
                self.viewModel.downloadUrl = '';
                self.uploadOk = false;
                self.okDisable = false;
            },
            beforeUpload(file){
                let self = this;
                if (self.viewModel.downloadUrl !== null && self.viewModel.downloadUrl !== undefined && self.viewModel.downloadUrl !== ''){
                    self.$Notice.warning({title:'上传文件',desc:'只能上传一个文件!请删除后再次上传'});
                    return false;
                }
                self.okDisable = true;
            },
            handleFormatError (file) {
                let self = this;
                self.$Notice.warning({title: '上传文件', desc: file.name + '格式不对, 请上传apk'});
                self.okDisable = false;
            }
        }
    }
</script>
