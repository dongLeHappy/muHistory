<style scoped>
    @import '../../styles/common.less';
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row><Button type="success" icon="plus" @click="save" v-if="$util.getAccess('role_save')">添加角色</Button></Row>
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
        <Modal v-model="editShow" :title="isSave? '角色添加':'角色编辑'" :width="400" :mask-closable=false :closable=false>
            <Form ref="viewModel" :rules="validateRules" :model="viewModel" :labelWidth="110" inline>
                <FormItem prop="name" label="名称" >
                    <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
                </FormItem>
                <FormItem prop="remark" label="备注" >
                    <Input type="text" v-model="viewModel.remark" :readonly="disableEdit"></Input>
                </FormItem>
                <FormItem prop="ctime" label="创建时间" v-if="!isSave && disableEdit">
                    <Input type="text" v-model="viewModel.ctime" readonly ></Input>
                </FormItem>
                <FormItem prop="utime" label="修改时间" v-if="!isSave && disableEdit">
                    <Input type="text" v-model="viewModel.utime" readonly ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel">返回</Button>
                <Button type="primary" @click="ok" v-if="!disableEdit">确定</Button>
            </div>
        </Modal>

        <Modal v-model="pageShow" title="权限菜单" width="600" :mask-closable=false :closable=false>
            <CheckboxGroup v-model="selectedPage">
                <div v-for="item in pageList" style="margin: 5px 5px ;width: 240px;height:200px;padding-bottom:20px;display: inline-flex;overflow-y:scroll">
                    <Card style="width: 230px;">
                        <Checkbox :label="item.access" style="font-size: 14px" @click.prevent.native="checkedBox(item.access, item.children)">
                            <span style="margin-left: 3px">{{item.title}}</span></Checkbox>
                            <CheckboxGroup v-for="(subItem, idx) in item.children" :key="idx" v-model="selectedPage" @on-change="subChecked">
                                <Checkbox :label="subItem.access" style="display: inline-block; margin-left: 50px;font-size: 14px">
                                    <span style="margin-left: 3px">{{subItem.title}}</span>
                                </Checkbox>
                            </CheckboxGroup>
                    </Card>
                </div>
            </CheckboxGroup>
            <div slot="footer">
                <Button type="ghost" @click="pageShow = false">返回</Button>
                <Button type="primary" @click="relateMenu">确定</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
    import au from '../../libs/accessUtils.js';
    import {appRouter} from '../../router/router.js'
    export default {
        data () {
            return {
                queryUrl:'/sysRole/list',//获取列表
                editUrl: '/sysRole/edit',
                saveUrl: '/sysRole/save',
                deleteUrl: '/sysRole/delete',
                relateUrl: '/sysRole/relationResource',
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
                selectedPage:[],
                pageList:[
                    {title: '积分模块', access:au.score, children:[
                            {title: '积分兑换', access:au.score},
                            {title: '积分配置', access:au.score_config},
                            {title: '积分修改', access:au.score_edit},
                            {title: '积分删除', access:au.score_delete}


                        ]
                    },
                    {title: '用户模块', access: au.mem_mem, children:[
                        {title: '用户列表', access:au.mem_mem},
                        {title: '用户修改', access:au.mem_edit}
                    ]
                    },
                    {title: '保洁员模块', access: au.clean_clean, children:[
                        {title: '保洁员列表', access:au.clean_clean},
                        {title: '在线地图状态', access:au.clean_onlineMap},
                        {title: '保洁员修改', access:au.clean_edit},
                        {title: '保洁员列表', access:au.clean_clean},
                        {title: '保洁员审核', access:au.clean_audit},
                        {title: '保洁员登记', access:au.clean_reg}
                    ]
                    },
                    {title: '代理商模块', access: au.proxy_proxy, children:[
                        {title: '代理商列表', access:au.proxy_proxy},
                        {title: '代理SS商添加', access:au.proxy_save},
                        {title: '代理商修改', access:au.proxy_edit},
                    ]
                    },
                    {title: '服务商品模块', access: au.ser_ser, children:[
                        {title: '服务列表', access:au.ser_ser},
                        {title: '服务添加', access:au.ser_save},
                        {title: '服务修改', access:au.ser_edit},
                         {title: '服务商审核保洁员', access:au.ser_save},
                    ]
                    },
                    {title: '订单模块', access: au.order_order, children:[
                        {title: '订单列表', access:au.order_order},
                        {title: '订单派送', access:au.order_delivery},
                        {title: '订单备注', access:au.order_remark},
                        {title: '取消订单', access:au.order_cancel},
                        {title: '订单概览', access:au.order_statistic},
                        {title: '订单统计', access:au.survey}
                    ]
                    },
                    {title: '提现模块', access: au.wal_wal, children:[
                        {title: '钱包列表', access:au.wal_wal},
                        {title: '提现列表', access:au.withdraw},
                         {title: '提现审核', access:au.withdraw_audit},
                        {title: '收入列表', access:au.accountRecordPage}
                    ]
                    },
                    {title: '消息模块', access: au.msg_msg, children:[
                        {title: '消息列表', access:au.msg_msg},
                        {title: '消息添加', access:au.msg_save},
                        {title: '消息修改', access:au.msg_edit},
                        {title: '消息删除', access:au.msg_delete},
                        {title: '消息推送', access:au.msg_push}
                    ]
                    },
                    {title: '广告模块', access: au.spr_adv, children:[
                        {title: '广告列表', access:au.spr_adv},
                        {title: '广告添加', access:au.adv_save},
                        {title: '广告修改', access:au.adv_edit},
                        {title: '广告删除', access:au.adv_delete},
                        {title: '活动管理', access:au.adv_active},
                        {title: '活动详情', access:au.adv_active_item},
                        {title: '删除活动', access:au.adv_active_delete},
                        {title: '修改活动', access:au.adv_active_edit},
                        {title: '添加活动', access:au.adv_active_add},
                        {title: '添加优惠券', access:au.adv_cou_add},
                        {title: '优惠劵审核', access:au.adv_cou_examine},
                        {title: '优惠券管理', access:au.adv_cou},
                        {title: '优惠券详情', access:au.adv_cou_item},
                        {title: '修改优惠券', access:au.adv_cou_edit},
                        {title: '删除优惠券', access:au.adv_cou_delete}
                    ]
                    },
                    {title: '折扣模块', access: au.spr_off, children:[
                        {title: '折扣列表', access:au.spr_off},
                        {title: '折扣添加', access:au.off_save},
                        {title: '折扣修改', access:au.off_edit},
                        {title: '折扣删除', access:au.off_delete}
                    ]
                    },
                    {title: '评价模块', access: au.com_com, children:[
                        {title: '评价列表', access:au.com_com},
                        {title: '评价审核', access:au.com_audit}
                    ]
                    },
                    {title: '等级模块', access: au.com_lv, children:[
                        {title: '等级字典列表', access:au.com_lv},
                        {title: '等级添加', access:au.lv_save},
                        {title: '等级修改', access:au.lv_edit},
                        {title: '等级删除', access:au.lv_delete}
                    ]
                    },
                    {title: '客服模块', access: au.cs_setting, children:[
                        {title: '客服设置', access:au.cs_setting},
                        {title: '投诉中心', access:au.cs_com},
                        {title: '投诉处理', access:au.cs_handle},
                        {title: '关于', access:au.cs_about}
                    ]
                    },
                    {title: '版本模块', access: au.cs_version, children:[
                        {title: '版本列表', access:au.cs_version},
                        {title: '版本添加', access:au.ver_save},
                        {title: '版本修改', access:au.ver_edit},
                        {title: '版本删除', access:au.ver_delete}
                    ]
                    },
                    {title: '角色模块', access: au.role_role, children:[
                        {title: '角色列表', access:au.role_role},
                        {title: '角色添加', access:au.role_save},
                        {title: '角色修改', access:au.role_edit},
                        {title: '角色删除', access:au.role_delete},
                        {title: '角色权限绑定', access:au.role_bind}
                    ]
                    },
                    {title: '员工模块', access: au.user_user, children:[
                        {title: '员工列表', access:au.user_user},
                        {title: '员工添加', access:au.user_save},
                        {title: '员工修改', access:au.user_edit},
                        {title: '员工删除', access:au.user_delete},
                        {title: '员工角色绑定', access:au.user_bind}
                    ]
                    },
                    {title: '系统模块', access: au.sys_ver, children:[
                        {title: '系统管理', access:au.sys_ver}
                    ]
                    }
                ],
                pageShow:false,
                isSave:false,
                editShow:false,
                viewModel:{},//编辑单个的实体
                roleId:0,
                validateRules:{
                    name: [
                        {required: true, message: '不能为空!', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, message: '不能为空!', trigger: 'blur'}
                    ]
                },

                columns: [//字段
                    {title: '角色id', key: 'id', align:'center'},
                    {title: '角色名称', key: 'name', align:'center'},
                    {title: '备注', key: 'remark', align:'center'},
                    {title: '创建时间', key: 'ctime', align:'center'},
                    {title: '修改时间', key: 'utime', align:'center'},
                    {title: '操作', key: 'action', align: 'center', width:200,//操作
                        render: (h, params) => {
                            let arr = [];
                            let access = this.$util.getAccess('role_edit');
                            if (access) arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '修改'));
                            access = this.$util.getAccess('role_bind');
                            if (access) arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.showMenu(params.index)}}}, '绑定权限'));
                            access = this.$util.getAccess('role_delete');
                            if (access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.row.id)}}}, '删除'));
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
            relateMenu(){
                let self = this;
                let entity = {};
                entity.roleId = self.roleId;
                entity.resourceIds = [];

                let size = self.selectedPage.length;
                for(let i = 0; i < size; i++){
                    let id = au.getId(self.selectedPage[i]);
                    entity.resourceIds.push(id);
                }

                self.$axios.post(self.relateUrl, entity).then(res => {
                    self.$Notice.success({title: '绑定权限', desc: '绑定成功!'});
                    self.pageShow = false;
                    self.queryMyList();
                });
            },
            checkedBox(pAccess, childrens){
                //选上子节点
                let self = this;
                if (!self.$util.oneOf(pAccess, self.selectedPage)){
                    self.selectedPage.push(pAccess);
                    for(let i = 0; i < childrens.length; i++){
                        if (!self.$util.oneOf(childrens[i].access, self.selectedPage)){
                            self.selectedPage.push(childrens[i].access);
                        }
                    }
                }else {
                    self.selectedPage.splice(self.selectedPage.indexOf(pAccess), 1);
                    for(let i = 0; i < childrens.length; i++){
                        if (self.$util.oneOf(childrens[i].access, self.selectedPage)){
                            self.selectedPage.splice(self.selectedPage.indexOf(childrens[i].access),1);
                        }
                    }
                }

            },
            subChecked(val){
                let self = this;
                for (let i =0; i < val.length; i++){
                    if (val[i] > 21 || val[i] === au.clean_onlineMap || val[i] === au.clean_reg){
                        //把父节点选上
                        for (let j = 0; j < self.pageList.length; j++){
                            for (let k = 0; k < self.pageList[j].children.length; k++){
                                if (self.pageList[j].children[k].access === val[i]){
                                    if (!self.$util.oneOf(self.pageList[j].access, self.selectedPage)){
                                        self.selectedPage.push(self.pageList[j].access);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            showMenu(index){
                this.selectedPage = [];
                this.roleId = this.myList[index].id;
                if (this.myList[index].resourceList !== null){
                    for (let i = 0; i < this.myList[index].resourceList.length; i++){
                        this.selectedPage.push(parseInt(this.myList[index].resourceList[i].code));
                    }
                }

                this.pageShow=true;
            },
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
                self.editShow = true;
                self.isSave = false;

            },
            save(){
                let self = this;
                self.viewModel = {};
                self.disableEdit = false;
                self.editShow = true;
                self.isSave = true;
            },
            ok () {
                let self = this;
                self.$refs.viewModel.validate(e => {
                    if (e){
                        let entity = JSON.parse(JSON.stringify(self.viewModel));
                        delete entity.ctime;
                        delete entity.utime;
                        if(self.isSave === false){//编辑
                            self.$axios.post(self.editUrl, entity).then( (res) => {
                                self.$Notice.success({title: '角色修改', desc: '修改成功!'});
                                this.editShow = false;
                                self.queryMyList();
                            } );
                        }else {
                            self.$axios.post(self.saveUrl, entity).then( (res) => {
                                self.$Notice.success({title: '角色添加', desc: '添加成功!'});
                                this.editShow = false;
                                self.queryMyList();
                            } );
                        }
                    }else {
                        self.$Message.error('请输入完整信息!');
                    }
                });
            },
            delete(id){
                let self = this;
                self.$Modal.confirm({title:'角色删除',content:'确定要删除该角色吗?',onOk:function () {
                    self.$axios.post(self.deleteUrl, ''+id, {headers: {'Content-Type':'application/json'}}).then((res) => {
                        self.$Notice.success({title:'角色删除', desc:'删除成功'});
                        self.queryMyList();
                    })
                }});
            },
            cancel () {
                this.$refs.viewModel.resetFields();
                this.editShow = false;
            }
        }
    }
</script>
