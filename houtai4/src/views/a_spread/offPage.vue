<style scoped>
    @import '../../styles/common.less';
    .ivu-form-item{
        width: 300px;
    }
    .ivu-input-number{
        width: 180px;
    }
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <Select placeholder="是否生效" v-model="queryBody.inUse" style="width:200px;padding: 3px" clearable>
                    <Option :value=0>生效</Option>
                    <Option :value=1>失效</Option>
                </Select>
                <span style="padding: 3px">
                    <DatePicker v-model="queryBody.startTime" type="date" placement="bottom-end"  style="width: 150px;" placeholder="折扣开始日期" clearable></DatePicker>
                    -
                    <DatePicker v-model="queryBody.endTime" type="date" placement="bottom-end"  style="width: 150px;" placeholder="折扣截止日期" clearable></DatePicker>
                </span>

                <span @click="queryMyListClick" style="display: inline-block;padding: 3px"><Button type="primary" icon="search">搜索</Button></span>
                <span @click="save" style="display: inline-block;padding: 3px" v-if="$util.getAccess('off_save')"><Button type="success" icon="plus">添加折扣</Button></span>
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
        <Modal v-model="editShow" :title="modalTitle" :width="800" :mask-closable=false :closable=false>
            <Form ref="viewModel" :rules="validateRules" :model="viewModel" :labelWidth="120" inline>
                <Row>
                    <FormItem prop="name" label="名称" >
                        <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="description" label="描述" >
                        <Input type="text" v-model="viewModel.description" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="discount" label="折扣(%)" >
                        <InputNumber :min=0 :max=100 type="text" v-model="viewModel.discount" :readonly="disableEdit"></InputNumber>
                    </FormItem>
                    <Row>
                        <FormItem prop="platformSharePercentage" label="平台分摊比例(%)" >
                            <InputNumber :min=0 :max=100 type="text" v-model="viewModel.platformSharePercentage" :readonly="disableEdit"></InputNumber>
                        </FormItem>
                        <FormItem prop="userSharePercentage" label="用户分摊比例(%)" >
                            <InputNumber type="text" v-model="viewModel.platformSharePercentage === undefined? 0:100 - viewModel.platformSharePercentage" disabled></InputNumber>
                        </FormItem>
                    </Row>

                    <Row>
                        <FormItem prop="startEffectiveTime" label="开始生效时间" >
                            <DatePicker type="date" v-model="viewModel.startEffectiveTime" style="width: 180px" :disabled="disableEdit"></DatePicker>
                        </FormItem>
                        <FormItem prop="endEffectiveTime" label="结束生效时间" >
                            <DatePicker type="date" v-model="viewModel.endEffectiveTime" style="width: 180px" :disabled="disableEdit"></DatePicker>
                        </FormItem>
                    </Row>

                    <FormItem prop="maxUseCount" label="最大使用次数" >
                        <InputNumber :min=1 type="text" v-model="viewModel.maxUseCount" :readonly="disableEdit"></InputNumber>
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
                        <FormItem prop="createBy" label="创建者" >
                            <Input type="text" v-model="isSave? userName:viewModel.createBy" readonly></Input>
                        </FormItem>
                        <FormItem prop="updateBy" label="修改人" >
                            <Input type="text" v-model="isSave? userName:viewModel.updateBy" readonly></Input>
                        </FormItem>

                        <FormItem prop="createTime" label="创建时间" v-if="!isSave && disableEdit">
                            <Input type="text" v-model="new Date(viewModel.createTime).formatDef()" readonly></Input>
                        </FormItem>
                        <FormItem prop="updateTime" label="修改时间" v-if="!isSave && disableEdit">
                            <Input type="text" v-model="new Date(viewModel.updateTime).formatDef()" readonly></Input>
                        </FormItem>
                    </Row>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel">返回</Button>
                <Button type="primary" @click="ok" v-if="!disableEdit">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    export default {
        data () {
            const afterV = (rule, value, callback) => {
                let before = this.viewModel.startEffectiveTime.getTime();
                let after = new Date(value).getTime();
                if (before >= after){
                    return callback(new Error('结束时间必须大于开始时间!'));
                }else {
                    callback();
                }
            };
            return {
                queryUrl:'/discount/list',//获取列表
                editUrl:'/discount/update',
                saveUrl:'/discount/save',
                deleteUrl:'/discount/',
                cityUrl: this.$util.cityUrl,

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

                queryBody:{//请求体
                    pagination:{
                        page:1,
                        size:10,
                        total:10
                    }
                }
                ,myList:[],

                modalTitle: '',
                tableLoading:true,
                userName: this.$util.getUserName(),

                disableEdit:true,

                picModal:false,

                isSave:false,
                editShow:false,
                viewModel:{},//编辑单个的实体
                validateRules:{
                    name: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    description: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    discount: [ {required: true, type: 'number', message: '不能为空!', trigger: 'change'} ],
                    platformSharePercentage: [ {required: true, type: 'number', message: '不能为空!', trigger: 'change'} ],
                    startEffectiveTime: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'}
                        ],
                    endEffectiveTime: [
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
                   
                    {title: '折扣名称', key: 'name', align:'center', minWidth:110 },
                    {title: '折扣', key: 'discount', align:'center', minWidth:110},
                    {title: '城市', key: 'cityCode', align:'center', minWidth:110
                        , render: (h, params) => {
                        let self = this;
                        let cc = self.myList[params.index].cityCode;
                        self.$util.getProCityTown(self.myList[params.index], cc);
                        return h('div', self.myList[params.index].allName);
                    }
                    },
                    {title: '保洁员承担比例', key: 'userSharePercentage', align:'center', minWidth:130},
                    {title: '平台承担比例', key: 'platformSharePercentage', align:'center', minWidth:130},
                    {title: '限制数量', key: 'maxUseCount', align:'center', minWidth:110},
                    {title: '开始日期', key: 'startEffectiveTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.startEffectiveTime).formatDef());
                    }
                    },
                    {title: '结束日期', key: 'endEffectiveTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.endEffectiveTime).formatDef());
                    }
                    },
                    {title: '是否生效', key: 'isDeleted', align:'center', minWidth:110
                        , render: (h, params) => {
                        if (params.row.isDeleted === 0){
                            return h('div', {attrs: { style: 'color: green'}}, '生效');
                        }else {
                            return h('div', {attrs: { style: 'color: red'}}, '失效');
                        }
                    }
                    },
                    {title: '创建者', key: 'createBy', align:'center', minWidth:110},
                    {title: '修改者', key: 'updateBy', align:'center', minWidth:110},
                    {title: '创建日期', key: 'createTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.createTime).formatDef());
                    }
                    },
                    {title: '修改日期', key: 'updateTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.updateTime).formatDef());
                    }
                    },
                    // {title: '操作', key: 'action', fixed:'right', width:180, align:'center',//操作
                    {title: '操作', key: 'action', width:180, align:'center',//操作
                        render: (h, params) => {
                            let arr = [];
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.show(params.index)}}}, '查看'));

                            let access = this.$util.getAccess('off_edit');
                            if (access) arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '编辑'));

                            access = this.$util.getAccess('off_delete');
                            if (access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.row.id)}}}, '删除'));
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

                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody);

                let query = JSON.parse(JSON.stringify(self.queryBody));

                if (self.queryBody.inUse !== undefined) query.inUse = self.$util.numToBoolean(self.queryBody.inUse);

                self.$axios.post(self.queryUrl, query).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.tableLoading = false;
                })
            },
            show(index){
                let self = this;
                self.modalTitle = '折扣详情';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.startEffectiveTime = new Date(self.viewModel.startEffectiveTime);
                self.viewModel.endEffectiveTime = new Date(self.viewModel.endEffectiveTime);
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
                self.modalTitle = '修改折扣';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.endEffectiveTime = new Date(self.viewModel.endEffectiveTime);
                self.viewModel.startEffectiveTime = new Date(self.viewModel.startEffectiveTime);
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
                self.modalTitle = '添加折扣';
                self.viewModel = {};
                self.disableEdit = false;
                self.editShow = true;
            },
            delete(id){
                let self = this;
                self.$Modal.confirm({title:'折扣删除',content:'确定要删除该折扣吗?',onOk:function () {
                    self.$axios.delete(self.deleteUrl+'/'+id).then((res) => {
                        self.$Notice.success({title:'折扣删除', desc:'删除成功'});
                        self.queryMyList();
                    })
                }});
            },
            ok () {
                let self = this;

                self.$util.cityCodeBeforeEdit(self);

                let entity = JSON.parse(JSON.stringify(self.viewModel));

                entity.updateBy = self.userName;

                if (self.disableEdit === false){

                    self.$refs.viewModel.validate(e => {
                        if (e){
                            entity.endEffectiveTime = new Date(self.viewModel.endEffectiveTime ).getTime();
                            entity.startEffectiveTime = new Date(self.viewModel.startEffectiveTime ).getTime();
                            entity.userSharePercentage = 100 - entity.platformSharePercentage;

                            delete entity.createTime;
                            delete entity.updateTime;

                            if (self.isSave === true){//添加
                                entity.createBy = self.$util.getUserName();
                                self.$axios.post(self.saveUrl, entity).then((res) => {
                                    self.$Notice.success({title:'折扣添加', desc:'添加成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                });
                            }else{//编辑
                                self.$axios.post(self.editUrl, entity).then((res) => {
                                    self.$Notice.success({title:'折扣编辑', desc:'修改成功'});
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
            }

        }
    }
</script>
