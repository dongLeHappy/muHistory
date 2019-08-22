<style scoped>
    @import '../../styles/common.less';
    .ivu-input{
        width: 162px;
    }
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row><Button type="success" icon="plus" @click="save"  v-if="$util.getAccess('user_save')">添加员工</Button></Row>
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

        <Modal v-model="editShow" :title="isSave?'添加员工':'员工编辑'" width="400">
            <Form :model="viewModel" ref="viewModel" :rules="validateRules" :labelWidth="90" inline>
                <FormItem label="员工id" prop="id" v-show="!isSave">
                    <Input type="text" v-model="viewModel.id" :readonly="true"></Input>
                </FormItem>
                <FormItem label="帐号" prop="account">
                    <Input type="text" v-model="viewModel.account" :readonly="disableEdit"></Input>
                </FormItem>
                <FormItem label="手机" prop="mobile">
                    <Input type="text" v-model="viewModel.mobile" :readonly="disableEdit"></Input>
                </FormItem>
                <FormItem label="密码" prop="password" v-if="isSave">
                    <Input type="text" v-model="viewModel.password" :readonly="disableEdit"></Input>
                </FormItem>
                <FormItem label="名字" prop="name">
                    <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
                </FormItem>
                <FormItem label="状态" prop="status">
                    <Select v-model="viewModel.status" :style="{width: $util.width}" :disabled="disableEdit">
                        <Option v-for="item in statusSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <Row v-if="!isSave">
                    <Col span="6"><Button @click="resetPwd = true;" type="warning">重置密码</Button></Col>
                    <Col span="10" v-if="resetPwd"><Input type="text" v-model="viewModel.pwd" :readonly="disableEdit"></Input></Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel">返回</Button>
                <Button type="primary" @click="ok">确定</Button>
            </div>
        </Modal>

        <Modal v-model="roleShow" title="角色选择" width="400" :mask-closable=false :closable=false>
            <CheckboxGroup v-model="myRoles">
                <div v-for="item in roleList">
                    <Checkbox style="margin: 1px 0px;font-size: 14px"  :label="item.id">{{item.name}}</Checkbox>
                </div>
            </CheckboxGroup>


            <div slot="footer">
                <Button type="ghost" @click="roleShow = false">返回</Button>
                <Button type="primary" @click="roleOk">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import vjs from '../../libs/validateRules.js'
    export default {
        data () {
            return {
                queryUrl:'/sysUser/list',
                editUrl:'/sysUser/edit',
                saveUrl:'/sysUser/save',
                deleteUrl:'/sysUser/delete',
                roleUrl:'/sysRole/list',
                relateUrl: '/sysUser/relationRole',
                queryBody:{//请求体
                    pagination:{
                        currentIndex:0,
                        page:1,
                        size:10
                    },
                    req:{}
                },
                tableLoading:true,
                disableEdit:true,
                resetPwd:false,

                statusSel:[
                    {value:1, label:'正常'},
                    {value:2, label:'停用'}
                ],

                myRoles:[],

                roleList:[],
                thisUserId:0,
                roleShow:false,

                isSave:false,
                editShow:false,
                viewModel:{},//编辑单个的实体
                validateRules:{
                    account: [
                        {required: true, message: '不能为空!', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '不能为空!', trigger: 'blur'},
                        {validator: vjs.phoneV, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '不能为空!', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '不能为空!', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, type: 'number', message: '不能为空!', trigger: 'blur'}
                    ],
                },

                columns: [//字段
                    {title: '员工id', key: 'id', align:'center'},
                    {title: '员工名称', key: 'name', align:'center'},
                    {title: '员工帐号', key: 'account', align:'center'},
                    {title: '手机', key: 'mobile', align:'center'},
                    {title: '状态', key: 'status', align:'center'
                        ,render:(h, params) => {
                        let self = this;
                        let obj = self.myList[params.index].status;
                        if (obj === 1) obj='正常';
                        else if(obj === 2) obj= '停用';
                        else obj ='未知';
                        return h('div', obj);
                    }
                    },
                    {title: '创建时间', key: 'ctime', align:'center'},
                    {title: '修改时间', key: 'utime', align:'center'},
                  
                    {title: '操作', key: 'action', align: 'center', width:210,//操作
                        render: (h, params) => {
                            let arr = [];
                            let access = this.$util.getAccess('user_edit');
                            if(access) arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '修改'));
                            access = this.$util.getAccess('user_bind');
                            if(access) arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.relateRole(params.index)}}}, '角色关联'));
                            access = this.$util.getAccess('user_delete');
                            if(access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.row.id)}}}, '删除'));
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
            edit(index){
                let self = this;
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.disableEdit = false;
                self.isSave = false;
                self.editShow = true;
            },
            relateRole(index){
                this.thisUserId = this.myList[index].id;
                this.myRoles = [];
                this.$axios.post(this.roleUrl, {pagination:{page: 1, size: 100}}).then((res) => {
                    this.roleList = res.list;
                    let i = 0;
                    for (i in this.myList[index].roleList){
                        this.myRoles.push(this.myList[index].roleList[i].id);
                    }
                    this.roleShow = true;
                });

            },
            roleOk(){
                let self = this;
                let entity = {};
                entity.roleIds = self.myRoles;
                entity.userId = self.thisUserId;


                self.$axios.post(self.relateUrl, entity).then(res => {
                    self.$Notice.success({title:'角色绑定', desc:'绑定成功!'});
                    self.roleShow = false;
                    self.queryMyList();
                });
            },
            save(){
                let self = this;
                self.viewModel = {};
                self.disableEdit = false;
                self.isSave = true;
                self.editShow = true;
            },
            show(){
                this.editShow = true;
            },
            ok () {
                let self = this;

                let entity = JSON.parse(JSON.stringify(self.viewModel));

                self.$refs.viewModel.validate(e => {
                    if (e){
                        if (self.isSave === true){//添加
                            self.$axios.post(self.saveUrl, entity).then((res) => {
                                self.$Notice.success({title:'员工添加', desc:'添加成功!'});
                                self.editShow = false;
                                self.queryMyList();
                            });
                        }else {
                            delete entity.ctime;
                            delete entity.utime;
                            delete entity.password;

                            if (!self.$util.isEmpty(entity.pwd)) entity.password = entity.pwd;

                            self.$axios.post(self.editUrl, entity).then((res) => {
                                self.$Notice.success({title:'员工编辑', desc:'编辑成功!'});
                                self.editShow = false;
                                self.resetPwd = false;
                                self.queryMyList();
                            });
                        }
                    }else {
                        self.$Message.error('请输入完整信息!');
                    }
                });
            },
            delete(id){
                let self = this;
                self.$Modal.confirm({title:'员工删除', content:'确定要删除该员工吗?', onOk:function () {
                    self.$axios.post(self.deleteUrl, id, {headers: {'Content-Type': 'application/json'}}).then((res) => {
                        self.$Notice.success({title:'员工删除', desc:'删除成功!'});
                        self.queryMyList();
                    });
                }});
            },
            cancel () {
                let self = this;
                self.editShow = false;
                self.resetPwd = false;
                self.$refs.viewModel.resetFields();
            }
        }
    }
</script>
