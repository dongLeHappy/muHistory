<style scoped>
    @import '../../styles/common.less';
    .ivu-input-number{
        display: block;
        width: 162px;
    }
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入标题..." v-model="queryBody.title" style="width: 200px;padding: 3px" clearable/></span>

                <Select placeholder="推送类型" v-model="queryBody.pushType" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in typeSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select placeholder="目标类型" v-model="queryBody.pushRefType" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in objSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select placeholder="平台" v-model="queryBody.platform" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in platformSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <span @click="queryMyListClick"><Button type="primary" icon="search">查询</Button></span>
                <span @click="save" v-if="$util.getAccess('msg_save')"><Button type="success" icon="plus">发布消息</Button></span>
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


        <Modal v-model="editShow" :title="modalTitle" width="600" :mask-closable=false :closable=false>
            <Form ref="viewModel" :model="viewModel" :labelWidth="90" inline :rules="validateRules">
                <FormItem prop="title" label="标题" >
                    <Input type="text" v-model="viewModel.title" :readonly="disableEdit"></Input>
                </FormItem>

                <FormItem prop="content" label="内容" style="width: 450px" >
                    <Input type="textarea" :rows="5" v-model="viewModel.content" :readonly="disableEdit" maxlength="220"></Input>
                </FormItem>

                <FormItem prop="contentUrl" label="推送的链接" >
                    <Input type="text" v-model="viewModel.contentUrl" :readonly="disableEdit"></Input>
                </FormItem>
                <FormItem prop="operatorName" label="操作人员名称">
                    <Input type="text" v-model="isSave === true? this.$util.getUserName():viewModel.operatorName" :readonly="true"></Input>
                </FormItem>

                <!--<FormItem prop="platform" label="目标平台">-->
                    <!--<Select v-model="viewModel.platform" :style="{width: $util.width}" :disabled="disableEdit">-->
                        <!--<Option v-for="item in platformSel" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->

                <FormItem prop="pushCount" label="推送次数" v-show="!isSave" >
                    <Input type="text" v-model="viewModel.pushCount" :readonly="true"></Input>
                </FormItem>

                <FormItem prop="pushRefType" label="目标类型">
                    <Select v-model="viewModel.pushRefType" :style="{width: $util.width}" :disabled="disableEdit" @on-change="targetChange">
                        <Option v-for="item in objSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>


                <!--<FormItem prop="pushSource" label="来源" >-->
                    <!--<InputNumber v-model="viewModel.pushSource" :readonly="disableEdit"></InputNumber>-->
                <!--</FormItem>-->

                <FormItem prop="pushStatus" label="推送状态" v-show="!isSave" >
                    <Select v-model="viewModel.pushStatus" placeholder="未知" :style="{width: $util.width}" disabled>
                        <Option :value=1>未推送</Option>
                        <Option :value=2>已推送</Option>
                    </Select>
                </FormItem>

                <FormItem prop="pushTime" label="推送时间" v-show="!isSave">
                    <Input type="text" v-model="viewModel.pushTime" :readonly="true"></Input>
                </FormItem>

                <FormItem prop="pushType" label="推送类型">
                    <Select v-model="viewModel.pushType" :style="{width: $util.width}" :disabled="disableEdit" @on-change="targetChange">
                        <Option v-for="item in typeSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="推送用户" v-if="targetShow">
                    <Select v-model="viewModel.pushRefId" :style="{width: $util.width}" clearable filterable :disabled="disableEdit">
                        <Option v-for="item in targetList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel" >返回</Button>
                <Button type="primary" @click="ok" v-if="!disableEdit">确定</Button>
            </div>
        </Modal>

        <!--推送modal-->
        <!--<Modal v-model="pushShow" title="消息推送" width="300" :mask-closable=false :closable=false>-->
            <!--<Form :labelWidth="60">-->

            <!--</Form>-->
            <!--<div slot="footer">-->
                <!--<Button type="ghost" @click="pushShow = false">返回</Button>-->
                <!--<Button type="primary" @click="push(viewModel)">确定</Button>-->
            <!--</div>-->
        <!--</Modal>-->
    </div>
</template>
<script>
    import vjs from '../../libs/validateRules.js';
    export default {
        data () {
            return {
                queryUrl: '/sysPush/list', // 获取列表
                pushUrl: '/sysPush/push',
                editUrl: '/sysPush/edit',
                saveUrl: '/sysPush/save',
                deleteUrl: '/sysPush/delete',

                cleanerSelUrl: '/cleaner/select',
                memSelUrl: '/member/select',

                queryBody: {// 请求体
                    pagination: {
                        page: 1,
                        size: 10,
                        total: 10
                    }
                },
                tableLoading: true,
                pushShow: false,
                targetShow: false,
                targetList: [],

                modalTitle: '',

                typeSelector: [
                    {value: 1, label: '全体'},
                    {value: 2, label: '个人'}
                ],

                objSelector: [
                    {value: 1, label: '会员'},
                    {value: 2, label: '保洁员'}
                ],
                platformSel: [
                    {value: 1, label: 'Android'},
                    {value: 2, label: 'IOS'},
                    {value: 3, label: 'wap'},
                    {value: 4, label: '其他'},
                    {value: 5, label: 'pc'},
                    {value: 6, label: '全部'}
                ],

                isSave: null,
                editShow: false,
                viewModel: {}, // 编辑单个的实体
                disableEdit: true,
                errShow: false,

                validateRules: {
                    title: [{required: true, message: '不能为空', trigger: 'blur'}],
                    content: [{required: true, message: '不能为空', trigger: 'blur'}],
                    platform: [{required: true, type: 'number', message: '不能为空', trigger: 'change'}],
                    pushRefType: [{required: true, type: 'number', message: '不能为空', trigger: 'change'}],
                    pushSource: [{required: true, type: 'number', message: '不能为空', trigger: 'change'}],
                    pushType: [{required: true, type: 'number', message: '不能为空', trigger: 'change'}]
                },

                columns: [// 字段
                    {title: 'id', key: 'id', align: 'center', width: 230},
                    {title: '标题', key: 'title', align: 'center', width: 320},
                    {title: '消息类型',
                        key: 'pushSource',
                        align: 'center',
                        render: (h, params) => {
                            let self = this;
                            let type = self.myList[params.index].pushType;
                            if (type === 1) type = h('div', {attrs: {style: 'color: red'}}, '系统消息');
                            else if (type === 2) type = h('div', {attrs: {style: 'color: green'}}, '推广消息');
                            else if (type === 3) type = h('div', {attrs: {style: 'color: blue'}}, '订单消息');
                            else type = h('div', {}, '未知');
                            return type;
                        },
                        width: 230},
                    {title: '推送对象类型',
                        key: 'pushRefType',
                        align: 'center',
                        render: (h, params) => {
                            let self = this;
                            let type = self.myList[params.index].pushRefType;
                            if (type === 1) type = h('div', {attrs: {style: 'color: green'}}, '会员');
                            else if (type === 2)type = h('div', {attrs: {style: 'color: blue'}}, '保洁员');
                            else type = h('div', {attrs: {style: 'color: brown'}}, '未知');
                            return type;
                        },
                        width: 230},
                    {title: '推送类型',
                        key: 'pushType',
                        align: 'center',
                        render: (h, params) => {
                            let self = this;
                            let obj = params.row.pushType;
                            if (obj === 1) obj = h('div', {attrs: {style: 'color: red'}}, '全体');
                            else if (obj === 2) obj = h('div', {attrs: {style: 'color: green'}}, '个人');
                            else obj = h('div', {attrs: {style: 'color: brown'}}, '未知');
                            return obj;
                        },
                        width: 230
                    },
                    {title: '推送状态',
                        key: 'pushStatus',
                        align: 'center',
                        render: (h, params) => {
                            let self = this;
                            let obj = self.myList[params.index].pushStatus;
                            if (obj === 1) obj = h('div', {attrs: {style: 'color: red'}}, '未推送');
                            else if (obj === 2) obj = h('div', {attrs: {style: 'color: green'}}, '已推送');
                            else obj = h('div', {attrs: {style: 'color: brown'}}, '未知');
                            return obj;
                        },
                        width: 230
                    },
                    {title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 235, // 操作
                        render: (h, params) => {
                            let arr = [];
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => { this.show(params.index); }}}, '详情'));
                            let access = this.$util.getAccess('msg_edit');
                            if (access)arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => { this.edit(params.index); }}}, '编辑'));

                            access = this.$util.getAccess('msg_push');
                            if (access)arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => { this.push(params.row); }}}, '推送'));

                            access = this.$util.getAccess('msg_delete');
                            if (access)arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => { this.delete(params.index); }}}, '删除'));
                            return h('div', arr);
                        }
                    }
                ],
                myList: [],
                memberSels: [],
                cleanerSels: []

            };
        },
        mounted () {
            let self = this;
            self.queryMyList();

            let obj = {
                pagination: {
                }
            };
            self.$axios.post(self.cleanerSelUrl, obj).then(res => {
                let j = 0;
                let i = 0;
                for (i in res) {
                    if (!self.$util.isEmpty(res[i].name)) {
                        self.cleanerSels.push({});
                        self.cleanerSels[j].id = res[i].id;
                        self.cleanerSels[j].name = res[i].name;
                        j += 1;
                    }
                }
            });
            self.$axios.post(self.memSelUrl, obj).then(res => {
                let j = 0;
                let i = 0;
                for (i in res) {
                    if (!self.$util.isEmpty(res[i].name)) {
                        self.memberSels.push({});
                        self.memberSels[j].id = res[i].id;
                        self.memberSels[j].name = res[i].name;
                        j += 1;
                    }
                }
            });
        },
        methods: {
            targetChange () {
                let self = this;
                let flag = self.viewModel.pushType === 2;
                self.targetList.length = 0;

                if (flag) {
                    self.targetShow = true;

                    if (self.viewModel.pushRefType === 1) {
                        self.targetList = JSON.parse(JSON.stringify(self.memberSels));
                    } else {
                        self.targetList = JSON.parse(JSON.stringify(self.cleanerSels));
                    }
                } else {
                    self.targetShow = false;
                }
            },
            changePage (val) {
                let self = this;
                self.queryBody.pagination.page = val;
                self.queryMyList();
            },
            queryMyListClick () {
                let self = this;
                self.queryBody.pagination = {page: 1, total: 10, size: 10};
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
                });
            },
            show (index) {
                let self = this;
                self.errShow = false;
                self.modalTitle = '消息详情';
                self.viewModel = self.myList[index];
                self.editShow = true;
                self.isSave = false;
                self.targetChange();
                self.disableEdit = true;
            },
            ok () {
                let self = this;
                if (self.disableEdit === false) {
                    self.$refs.viewModel.validate((e) => {
                        if (e === false) {
                            self.$Message.error('请输入完整信息!');
                        } else {
                            delete self.viewModel.ctime;
                            delete self.viewModel.pushTime;
                            delete self.viewModel.utime;
                            self.viewModel.operatorName = self.$util.getUserName();
                            self.viewModel.operatorId = self.$util.getUserId();


                            if (self.isSave === true) { // 添加
                                self.$axios.post(self.saveUrl, self.viewModel).then((res) => {
                                    self.$Notice.success({title: '消息发布', desc: '发布成功!'});
                                    self.editShow = false;
                                    self.$refs['viewModel'].resetFields();
                                    self.queryMyList();
                                });
                            } else { // 编辑
                                self.$axios.post(self.editUrl, self.viewModel).then((res) => {
                                    self.$Notice.success({title: '消息编辑', desc: '修改成功!'});
                                    self.editShow = false;
                                    self.$refs['viewModel'].resetFields();
                                    self.queryMyList();
                                });
                            }
                        }
                    });
                } else {
                    self.editShow = false;
                }
            },
            cancel () {
                let self = this;
                if (self.disableEdit === false) self.$refs['viewModel'].resetFields();
                self.editShow = false;
            },
            push (viewModel) {
                let self = this;
                self.$Modal.confirm({title: '消息推送',
                    content: '确定要推送该消息吗?',
                    onOk: function () {
                        self.pushShow = false;
                        let pushEntity = {};
                        pushEntity.id = viewModel.id;
                        pushEntity.pushTime = new Date();
                        self.$axios.post(self.pushUrl, pushEntity).then((res) => {
                            self.$Notice.success({title: '消息推送', desc: '推送成功!'});
                            self.queryMyList();
                        });
                    }});
            },
            delete (index) {
                let self = this;
                self.$Modal.confirm({title: '消息删除',
                    content: '确定要删除该消息吗?',
                    onOk: function () {
                        self.$axios.post(self.deleteUrl, self.myList[index].id, {headers: {'Content-Type': 'application/json'}}).then((res) => {
                            self.tableLoading = true;
                            self.$Notice.success({title: '消息', desc: '删除成功!'});
                            self.queryMyList();
                        });
                    }});
            },
            edit (index) {
                let self = this;
                self.errShow = false;
                self.modalTitle = '修改消息';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.disableEdit = false;
                self.isSave = false;
                self.targetChange();
                self.editShow = true;
            },
            save () {
                let self = this;
                self.errShow = false;
                self.modalTitle = '发布消息';
                self.viewModel = {};
                self.disableEdit = false;
                self.isSave = true;
                self.editShow = true;
            }
        }
    };
</script>
