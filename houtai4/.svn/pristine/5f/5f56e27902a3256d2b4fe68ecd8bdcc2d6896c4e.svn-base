<style scoped>
    @import '../../styles/common.less';
    .ivu-btn-small{
        margin-left: 3px;
    }
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <Button type="success" icon="plus" @click="add" v-if="$util.getAccess('lv_save')">添加</Button>
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

        <!--修改添加-->
        <Modal  :width="300" v-model="modalShow" :title="modalTitle" >
            <Form ref="viewModel" :rules="ruleValidate" :model="viewModel" :labelWidth="70">
                <FormItem prop="levelName" label="等级名称">
                    <Input type="text" v-model="viewModel.levelName"></Input>
                </FormItem>
                <FormItem prop="min_max" label="评分区间">
                    <Row>
                        <Col span="11">
                        <InputNumber type="text" v-model="viewModel.limitMin"></InputNumber>
                        </Col>
                        <Col span="2" style="text-align: center">-</Col>
                        <Col span="11">
                        <InputNumber type="text" v-model="viewModel.limitMax"></InputNumber>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem prop="refType" label="等级类型">
                    <Select v-model="viewModel.refType" style="width:200px;padding: 3px">
                        <Option v-for="item in refTypeSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click="cancel">返回</Button>
                <Button type="primary" size="large" @click="ok">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                queryUrl:'/level/list',//获取等级列表
                saveUrl:'/level/save',
                editUrl:'/level/edit',
                deleteUrl:'/level/delete',
                queryBody:{//请求体
                    pagination:{
                        page:1,
                        size:10,
                        total:10
                    }
                }
                ,myList:[],
                tableLoading:true,

                addModel:false,
                isEdit:false,
                modalShow:false,
                modalTitle: '',

                refTypeSelector:[
                    {value:1, label:'会员'},
                    {value:2, label:'保洁员'}
                ],

                addEntity:{},//保存添加的数据
                viewModel:{},//编辑单个的实体
                ruleValidate:{
                    refType:[{ required: true,type:'number', message: '不能为空!', trigger: 'change' }]
                    ,levelName:[{ required: true, message: '不能为空!', trigger: 'change' }]
                },

                columns: [//字段
                    {title: '等级名称', key: 'levelName' ,align:'center'},
                    {title: '评分范围', key: 'wow', align:'center',
                        render:(h, params) => {
                            let self = this;
                            let ss = self.myList[params.index].limitMin + ' - ' + self.myList[params.index].limitMax;
                            return h('div', ss);
                        }
                    },
                    {title: '等级类型', key: 'refType' ,align:'center'
                        ,render:(h, params) => {
                            let self = this;
                            let type = self.myList[params.index].refType;
                            if (type === 1) type = '会员';
                            else if (type === 2) type = '保洁员';
                            else type = '未知';
                            return h('div', type);
                    }
                    },
                    {title: '操作', key: 'action', align: 'center', fixed:'right', width:130,//操作
                        render: (h, params) => {
                            let arr = [];
                            let access = this.$util.getAccess('lv_edit');
                            if (access)arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '修改'));
                            access = this.$util.getAccess('lv_delete');
                            if (access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.index)}}}, '删除'));
                            return h('div', arr);
                        }
                    }
                ]
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
                self.$util.deleteBlankProp(self.queryBody);

                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.tableLoading = false;
                })
            },
            handleSubmit (name) {
                let self = this;
                let val = false;
                self.$refs[name].validate((valid) => {
                    val = valid;
                });
                return val;
            },
            ok(){
                let self = this;

                if (self.handleSubmit('viewModel')){
                    if (isNaN(self.viewModel.limitMin) || isNaN(self.viewModel.limitMax)){
                        self.$Message.error('请输入数值!');
                        return;
                    }
                    else if (self.viewModel.limitMin === '' || self.viewModel.limitMax === ''){
                        self.$Message.error('都不能为空!');
                        return;
                    }else if(self.viewModel.limitMin >=  self.viewModel.limitMax) {
                        self.$Message.error('最大值必须大于最小值!');
                        return;
                    }

                    if (self.addModel === true){//添加
                        self.addEntity = self.viewModel;
                        self.$axios.post(self.saveUrl, self.viewModel).then((res) => {
                            self.tableLoading = true;
                            self.modalShow = false;

                            self.$Notice.success({title:'等级字典',desc:'添加成功!'});
                            self.queryMyList();
                        });
                    }else {//编辑
                        self.$axios.post(self.editUrl, self.viewModel).then((res) => {
                            self.tableLoading = true;
                            self.modalShow = false;
                            self.$Notice.success({title:'等级字典',desc:'编辑成功!'});
                            self.queryMyList();
                        });
                    }
                }else{
                    self.$Message.error('请输入完整信息');
                }

            },
            cancel () {
                let self = this;
                self.$refs.viewModel.resetFields();
                self.modalShow = false;
            },
            add(){
                let self = this;
                self.isEdit = false;
                self.addModel = true;

                self.viewModel = {};

                self.modalTitle = '添加等级';
                self.modalShow = true;
            },
            edit(index){
                let self = this;
                self.isEdit = true;
                self.addModel = false;

                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));

                self.modalTitle = '修改等级';
                self.modalShow=true;
            },
            delete(index){
                let self = this;
                self.$Modal.confirm({title:'等级删除', content:'确定要删除该等级吗?', onOk:function () {
                    self.$axios.post(self.deleteUrl, self.myList[index].id, {headers: {'Content-Type': 'application/json'}}).then((res) => {
                        self.tableLoading = true;
                        self.$Notice.success({title:'等级字典', desc:'删除成功!'});
                        self.queryMyList();
                    });
                }});

            }
        }
    }
</script>
