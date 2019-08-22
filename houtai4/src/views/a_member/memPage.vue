<style scoped>
    @import '../../styles/common.less';
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入手机号码..." v-model="queryBody.mobile" style="width: 200px;padding: 3px" clearable/></span>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入姓名..." v-model="queryBody.name" style="width: 200px;padding: 3px" clearable/></span>

                <Select placeholder="来源" v-model="queryBody.registType" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in sourceSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <Select placeholder="用户状态" v-model="queryBody.status" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in statusSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <span @click="queryMyListClick" style="margin: 0 10px;"><Button type="primary" icon="search">查询</Button></span>
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

        <Modal v-model="editShow" :title="modalTitle" width="600" :closable=false :mask-closable=false>
            <Row>
                <div style="width: 105px;height: 105px; margin: 0 auto;border:2px solid">
                    <img style="height: 100%; width: 100%; padding: 2px;" :src="viewHeadImg" alt="">
                </div>
            </Row>
            <Row style="margin-top: 3px">
                <Form :model="viewModel" :labelWidth="90" inline :rules="validateRules" ref="viewModel">
                    <FormItem prop="name" label="姓名" >
                        <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
                    </FormItem>
                    <!--<FormItem prop="nickname" label="昵称">-->
                        <!--<Input type="text" v-model="viewModel.nickname" :readonly="disableEdit"></Input>-->
                    <!--</FormItem>-->

                    <FormItem prop="sex" label="性别">
                        <Select v-model="viewModel.sex" :style="{width: $util.width}" :disabled="disableEdit">
                            <Option :value=1>男</Option>
                            <Option :value=2>女</Option>
                        </Select>
                    </FormItem>

                    <FormItem prop="mobile" label="手机号码">
                        <Input type="text" v-model="viewModel.mobile" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="user" label="来源">
                        <Input type="text" v-model="viewModel.registType == 1? '微信':viewModel.registType == 2? 'QQ':viewModel.registType == 3? '支付宝':viewModel.registType == 4?'手机':'未知'" :readonly="true"></Input>
                    </FormItem>

                    <FormItem prop="status" label="状态" v-if="!disableEdit">
                        <Select v-model="viewModel.status" :style="{width: $util.width}" :disabled="disableEdit">
                            <Option v-for="item in statusSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>

                    <Row>
                        <FormItem prop="user" label="微信openid">
                            <Input type="text" v-model="viewModel.wxOpenId" :readonly="true"></Input>
                        </FormItem>
                        <FormItem prop="user" label="微信unionid">
                            <Input type="text" v-model="viewModel.wxUnionId" :readonly="true"></Input>
                        </FormItem>
                        <FormItem prop="user" label="微信小程序openid">
                            <Input type="text" v-model="viewModel.xcxOpenId" :readonly="true"></Input>
                        </FormItem>
                        <FormItem prop="user" label="qqopenid">
                            <Input type="text" v-model="viewModel.qqOpenId" :readonly="true"></Input>
                        </FormItem>
                    </Row>

                    <FormItem prop="user" label="注册时间" v-if="disableEdit">
                        <Input type="text" v-model="viewModel.ctime" :readonly=true></Input>
                    </FormItem>
                    <FormItem prop="user" label="修改时间" v-if="disableEdit">
                        <Input type="text" v-model="viewModel.utime" :readonly=true></Input>
                    </FormItem>
                    <FormItem prop="user" label="备注" style="width: 400px">
                        <Input type="textarea" :rows="5" v-model="viewModel.remark" :readonly="disableEdit"></Input>
                    </FormItem>

                    <FormItem prop="user" v-show="disableEdit">
                        <ButtonGroup vertical>
                            <!--<div><Button long type="primary">常用地址</Button></div>-->
                            <div style="margin-top: 10px" @click="lookOrder"><Button long type="primary">查看订单</Button></div>
                        </ButtonGroup>
                    </FormItem>
                </Form>
            </Row>

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
            return {
                queryUrl: '/member/list', // 获取会员列表
                editUrl: '/member/edit', // 编辑会员
                queryBody: { // 请求体
                    pagination: {
                        page: 1,
                        size: 10,
                        total: 10
                    }
                },
                myList: [],
                tableLoading: true,

                modalTitle: '',
                viewHeadImg: '',

                statusSelector: [
                    {value: 1, label: '使用中'},
                    {value: 0, label: '禁用中'}
                ],

                sourceSelector: [
                    {value: 1, label: '微信'},
                    {value: 2, label: 'QQ'},
                    {value: 3, label: '支付宝'},
                    {value: 4, label: '微信小程序'}
                ],

                okText: '',
                disableEdit: true,
                editShow: false,
                viewModel: {}, // 单个的实体

                validateRules: {
                    name: [{required: true, message: '不能为空', trigger: 'blur'}],
                    sex: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
                    mobile: [{required: true, message: '不能为空', trigger: 'change'}],
                    status: [{required: true, type: 'number', message: '不能为空', trigger: 'change'}]
                },

                columns: [ // 字段
                    {title: 'id', key: 'id', align: 'center'},
                    {title: '姓名', key: 'name', align: 'center'},
//                    {title: '昵称', key: 'nickname', align:'center'},
                    {title: '来源', key: 'registType', align:'center', minWidth: 30
                        , render:(h, params) => {
                        let self = this;
                        let type = self.myList[params.index].registType;
                        if (type === 1) type = h('div', {attrs: {style: 'color:green'}}, '微信');
                        else if (type === 2) type = h('div', {attrs: {}}, 'QQ');
                        else if (type === 3) type = h('div', {attrs: {style: 'color:blue'}}, '手机');
                        else if (type === 4) type = h('div', {attrs: {}}, '小程序授权');
                        else type = h('div', {attrs: {style: 'color:brown'}}, '未知');
                        return type;
                    }},
                    {title: '手机号码', key: 'mobile', align:'center'},
                    {title: '注册时间', key: 'registTime', align:'center', minWidth:70},
                    {title: '用户状态', key: 'status', align:'center'
                        , render:(h, params) => {
                        let self = this;
                        let type = self.myList[params.index].status;
                        if (type === 1) type = h('div', {attrs: {style: 'color:green'}}, '正常');
                        else if (type === 2) type = h('div', {attrs: {style: 'color:red'}}, '停用');
                        else type = h('div', {attrs: {style: 'color:brown'}}, '未知');
                        return type;
                    }},
                    {title: '下单量', key: 'orderTotalNum', align:'center', minWidth:50},
                    {title: '备注', key: 'remark', align:'center', minWidth:70},
                    {title: '操作', key: 'action', align: 'center', fixed:'right', width:130,//操作
                        render: (h, params) => {
                            let arr = [];
                            let access = this.$util.getAccess('mem_edit');
                            arr.push(h('Button', {props: {type: 'primary', size: 'small', style:'margin:50px;'}, on: {click: () => {this.view(params.index)}}}, '查看'));
                            if (access)arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '修改'));
                            return h('div', arr);
                        }
                    }
                ]

            }
        },
        created(){
            let self = this;
            let entity = JSON.parse(sessionStorage.getItem('lookingMem'));
            if (entity !== null && entity !== undefined){
                self.viewModel = entity;
                self.viewHeadImg = self.viewModel.picLogo;
                self.editShow = true;
                sessionStorage.removeItem('lookingMem');
            }
        },
        mounted(){
            let self = this;
            self.queryMyList();
        },
        methods:{
            lookOrder(){
                if (this.$util.isEmpty(this.viewModel.name)) {
                    this.$Message.warning('该会员没有订单!');
                    return;
                }
                sessionStorage.setItem('lookingMem', JSON.stringify(this.viewModel));
                this.$router.push({name:'order_order', params:{memberName:this.viewModel.name}});
            },
            changePage(val){
                let self = this;
                self.tableLoading = true;
                self.queryBody.pagination.page = val;
                self.queryMyList();
            },
            queryMyListClick () {
                let self = this;
                self.queryBody.pagination = {page:1, total:10, size:10};
                self.queryMyList();
            },
            queryMyList () {
                let self = this;

                self.tableLoading = true;
                self.$util.deleteBlankProp(self.queryBody);

                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination = res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.tableLoading = false;
                })
            },
            ok () {
                let self = this;
                self.$refs.viewModel.validate(e => {
                    if (e === true){
                        delete self.viewModel.ctime;
                        delete self.viewModel.utime;
                        if (self.disableEdit === false){
                            let editModal = {};
                            editModal.name = self.viewModel.name;
                            editModal.nickname = self.viewModel.nickname;
                            editModal.sex = self.viewModel.sex;
                            editModal.mobile = self.viewModel.mobile;
                            editModal.remark = self.viewModel.remark;
                            editModal.id = self.viewModel.id;
                            editModal.status = self.viewModel.status;

                            self.$axios.post(self.editUrl, editModal).then((res) => {
                                self.$Notice.success({title:'会员编辑', desc:'编辑成功!'});
                                self.editShow = false;
                                self.queryMyList();
                            });
                        }
                    }else {
                        self.$Message.error('请输入完整信息');
                    }
                });

            },
            cancel(){
                this.editShow = false;
            },
            view(index){
                let self = this;
                self.$refs.viewModel.resetFields();
                self.modalTitle = '用户详情';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewHeadImg = self.viewModel.picLogo;

                self.okText = '确定';
                self.disableEdit = true;
                self.editShow = true;
            },
            edit(index){
                let self = this;
                self.$refs.viewModel.resetFields();
                self.modalTitle = '修改用户';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewHeadImg = self.viewModel.picLogo;

                self.okText = '提交';
                self.disableEdit = false;
                self.editShow = true;
            }
        }
    };
</script>
