<style scoped>
    @import '../../styles/common.less';
    .ivu-input-number{
        display: block;
        width: 140px;
    }
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row :gutter="5">
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入服务名称..." v-model="queryBody.name" style="width: 200px;padding: 3px" clearable/></span>

                <Select placeholder="上架状态" v-model="queryBody.status" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in statusSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Select placeholder="服务类型" v-model="queryBody.type" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in typeSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
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

                <span @click="queryMyListClick" style="padding: 3px"><Button type="primary" icon="search">查询</Button></span>

                <span @click="add" style="padding: 3px" v-if="$util.getAccess('ser_save')"><Button type="success" icon="plus">添加</Button></span>
                <span @click="showFun" ><Button type="success" icon="search">计算公式</Button></span>
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


        <Modal v-model="editShow" :width="700" :mask-closable=false :closable=false>
            <Form ref="addEntity" :model="viewModel" :labelWidth="130" :rules="ruleValidate" inline>
                <Card>
                    <p slot="title">服务详情</p>
                    <Row>
                        <FormItem prop="name" label="服务名称" :show-message="viewMode">
                            <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
                        </FormItem>

                        <!--<FormItem prop="type" label="保洁类型"  :show-message="viewMode">-->
                            <!--<Select :style="{width: $util.width}" placeholder="保洁类型" v-model="viewModel.type" :disabled="disableEdit">-->
                                <!--<Option v-for="item in cleanTypeSel" :value="item.value" :key="item.value">{{item.label}}</Option>-->
                            <!--</Select>-->
                        <!--</FormItem>-->

                        <FormItem prop="cityCode" label="适用地区"  :show-message="viewMode">
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
                        <!--<FormItem prop="user" label="计算公式" >-->
                            <!--<Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>-->
                        <!--</FormItem>-->
                    </Row>
                    <Row>
                        <p><b>服务对象: 个人</b></p>
                        <Row>
                            <Col span="12">
                            <FormItem prop="dailyMinFeePerson" label="起步费用(元)"  :show-message="viewMode">
                                <InputNumber :min=1 v-model="viewModel.dailyMinFeePerson" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <!--<FormItem prop="user" label="起步工时" >-->
                                <!--<InputNumber :min=1  v-model="viewModel.name" :readonly="disableEdit"></InputNumber>-->
                            <!--</FormItem>-->
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <FormItem prop="dailyPerHourFeePerson" label="日常类型(元)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.dailyPerHourFeePerson" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem prop="daily100squareHourPerson" label="100平方工时(小时)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.daily100squareHourPerson" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <FormItem prop="newPerHourFeePerson" label="开荒类型(元)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.newPerHourFeePerson" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem prop="new100squareHourPerson" label="100平方工时(小时)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.new100squareHourPerson" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <FormItem prop="freeDistancePerson" label="最大免费距离(公里)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.freeDistancePerson" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem prop="distanceFeePerson" label="超出每公里(元)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.distanceFeePerson" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
                        <Radio-group v-model="viewModel.depositType">
                            <Row>
                                <FormItem prop="depositPercentCompany" label="按比例(%)"  :show-message="viewMode">
                                    <Radio :min=1 :max=100 v-model="viewModel.percentagecollectPerson" label="1" id="percentagePerson" >
                                        <InputNumber :min=1 :max=100 v-model="viewModel.depositPercentPerson" :readonly="disableEdit"></InputNumber>
                                    </Radio>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem prop="depositPercentCompany" label="按小时(H)"  :show-message="viewMode">
                                    <Radio :min=1 :max=100 v-model="viewModel.timecollectPerson" label="2" id="timePerson" >
                                        <InputNumber :min=1 :max=100 v-model="viewModel.timePercentPerson" :readonly="disableEdit"></InputNumber>
                                    </Radio>
                                </FormItem>
                            </Row>
                        </Radio-group>
                    </Row>
                    <Row>
                        <p><b>服务对象: 公司</b></p>
                        <Row>
                            <Col span="12">
                            <FormItem prop="dailyMinFeeCompany" label="起步费用(元)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.dailyMinFeeCompany" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <!--<FormItem prop="user" label="起步工时" >-->
                                <!--<InputNumber :min=1  v-model="viewModel.name" :readonly="disableEdit"></InputNumber>-->
                            <!--</FormItem>-->
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <FormItem prop="dailyPerHourFeeCompany" label="日常类型(元)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.dailyPerHourFeeCompany" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem prop="daily100squareHourCompany" label="100平方工时(小时)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.daily100squareHourCompany" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                            <FormItem prop="newPerHourFeeCompany" label="开荒类型(元)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.newPerHourFeeCompany" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem prop="new100squareHourCompany" label="100平方工时(小时)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.new100squareHourCompany" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>

                        </Row>
                            <Col span="12">
                            <FormItem prop="freeDistanceCompany" label="最大免费距离(公里)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.freeDistanceCompany" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem prop="distanceFeeCompany" label="超出每公里(元)"  :show-message="viewMode">
                                <InputNumber :min=1  v-model="viewModel.distanceFeeCompany" :readonly="disableEdit"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
                        <Radio-group v-model="viewModel.depositType">
                            <Row>
                                <FormItem prop="depositPercentCompany" label="按比例(%)"  :show-message="viewMode">
                                        <Radio :min=1 :max=100 v-model="viewModel.percentagecollectCompany" label="1" id="percentageCompany" >
                                            <InputNumber :min=1 :max=100 v-model="viewModel.depositPercentCompany" :readonly="disableEdit"></InputNumber>
                                        </Radio>
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem prop="depositPercentCompany" label="按小时(H)"  :show-message="viewMode">
                                    <Radio :min=1 :max=100 v-model="viewModel.timecollectCompany" label="2" id="timeCompany" >
                                        <InputNumber :min=1 :max=100 v-model="viewModel.timePercentCompany" :readonly="disableEdit"></InputNumber>
                                    </Radio>
                                </FormItem>
                            </Row>
                        </Radio-group>
                        <FormItem prop="status" label="上架状态" :show-message="viewMode">
                            <Select :style="{width: $util.width}" placeholder="上架状态" v-model="viewModel.status" :disabled="disableEdit">
                                <Option v-for="item in statusSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    <Row>

                        <FormItem prop="user" label="创建时间" v-if="!addModel && disableEdit">
                            <Input style="width: 138px" type="text" v-model="new Date(viewModel.ctime).formatDef()" :readonly="true"></Input>
                        </FormItem>
                        <FormItem prop="user" label="修改时间" v-if="!addModel && disableEdit">
                            <Input style="width: 138px" type="text" v-model="new Date(viewModel.utime).formatDef()" :readonly="true"></Input>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="remark" label="备注" >
                            <Input type="textarea" v-model="viewModel.remark" :readonly="disableEdit"></Input>
                        </FormItem>
                    </Row>
                </Card>
            </Form>

            <div slot="footer">
                <Button type="text" size="large" @click="cancel">返回</Button>
                <Button type="primary" size="large" @click="ok" v-if="!disableEdit">确定</Button>
            </div>
        </Modal>

        <!--计算公式模块-->
        <Modal :width="300" v-model="withRule" title="计算公式" @on-ok="" @on-cancel="" ok-text="返回" cancel-text="" :closable=false :mask-closable=false>
            <Input v-model="viewingRule" readonly type="textarea" :rows="8"></Input>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                queryUrl: '/products/list', // 获取列表
                editUrl: '/products/edit',
                saveUrl: '/products/save',

                ruleQueryUrl: '/sys/list',
                ruleQueryBody: {
                    pagination: {
                        page: 1,
                        size: 11,
                        total: 0
                    },
                    type: 2
                },
                viewingRule: '',
                withRule: false,

                queryBody: {// 请求体
                    pagination: {
                        page: 1,
                        size: 10,
                        total: 10
                    }
                },
                tableLoading: true,
                viewMode: true,
                test: false,
                provinceList: [],
                cityList: [],
                townList: [],
                cityCode: {
                    province: null,
                    city: null,
                    town: null
                },
                editCityCode: {
                    province: null,
                    city: null,
                    town: null
                },

                statusSelector: [
                    {value: 1, label: '使用中'},
                    {value: 2, label: '禁用中'}
                ],

                sourceSelector: [
                ],

                typeSelector: [
                    {value: 1, label: '保洁'}
                ],

                cleanTypeSel: [
                    {value: 1, label: '日常保洁'},
                    {value: 2, label: '开荒保洁'}
                ],

                addModel: false,
                disableEdit: false,
                editShow: false,

                viewModel: {}, // 编辑单个的实体
                addEntity: {},
                okText: '',

                ruleValidate: {
                    status: [{ required: true, type: 'number', message: '不能为空!', trigger: 'change' }],
                    type: [{ required: true, type: 'number', message: '不能为空!', trigger: 'change' }],
                    //                    cityCode:[{ required: true, type:'number', message: '不能为空!', trigger: 'change' }],
                    dailyMinFeePerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    dailyPerHourFeePerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    daily100squareHourPerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    newPerHourFeePerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    new100squareHourPerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    freeDistancePerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    distanceFeePerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    // depositPercentPerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    // timePercentPerson: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    dailyMinFeeCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    dailyPerHourFeeCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    daily100squareHourCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    newPerHourFeeCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    freeDistanceCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    distanceFeeCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    new100squareHourCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    // depositPercentCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    // timePercentCompany: [{ required: true, type: 'number', message: '请输入数值!', trigger: 'change' }],
                    percentagecollectCompany: true,
                    timecollectPerson: true,
                    percentagecollectPerson: false,
                    timecollectCompany: false,
                    name: [{ required: true, message: '不能为空', trigger: 'blur' }]
                },
                depositTypeCompany: 1,
                depositTypePerson: 1,
                depositType: 1,
                timePercentCompany: 1,
                depositPercentCompany: 1,
                depositPercentPerson: 1,
                timePercentPerson: 1,
                columns: [// 字段
                    {title: 'id', key: 'id', align: 'center'},
                    {title: '名称', key: 'name', align: 'center'},
                    //                    {title: '保洁类型', key: 'type', align:'center',
                    //                        render: (h, params) => {
                    //                            let self = this;
                    //                            let obj = self.myList[params.index].type;
                    //                            if (obj === 1) obj = h('div', {attrs: {style:'color:green'}}, '日常保洁');
                    //                            else if (obj === 2) obj = h('div', {attrs: {style:'color:red'}}, '开荒保洁');
                    //                            else obj = h('div', {attrs: {style:'color:brown'}}, '未知');
                    //                            return obj;
                    //                        }
                    //                    },
                    {title: '适用地区',
                        key: 'cityCode',
                        align: 'center',
                        render: (h, params) => {
                            let self = this;
                            let cc = self.myList[params.index].cityCode;
                            self.$util.getProCityTown(self.myList[params.index], cc);
                            return h('div', self.myList[params.index].allName);
                        }
                    },
                    {title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            let self = this;
                            let obj = self.myList[params.index].status;
                            if (obj === 1) obj = h('div', {attrs: {style: 'color:green'}}, '使用中');
                            else if (obj === 2) obj = h('div', {attrs: {style: 'color:red'}}, '禁用中');
                            else obj = h('div', {attrs: {style: 'color:brown'}}, '未知');
                            return obj;
                        }
                    },
                    //                    {title: '计算公式', key: 'platform', align:'center'},
                    {title: '备注', key: 'remark', align: 'center'},
                    {title: '创建时间',
                        key: 'ctime',
                        align: 'center',
                        render: (h, params) => {
                            let obj = params.row.ctime;
                            return h('div', new Date(obj).formatDef());
                        }
                    },
                    {title: '修改时间',
                        key: 'utime',
                        align: 'center',
                        render: (h, params) => {
                            let obj = params.row.utime;
                            return h('div', new Date(obj).formatDef());
                        }
                    },
                    {title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 130, // 操作
                        render: (h, params) => {
                            let arr = [];
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => { this.view(params.index); }}}, '详情'));
                            let access = this.$util.getAccess('ser_edit');
                            if (access)arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => { this.edit(params.index); }}}, '修改'));
                            return h('div', arr);
                        }
                    }
                ],
                myList: []

            };
        },
        mounted () {
            let self = this;
            let cityCode = 100000;
            let levelType = 1;
            let prop = 'provinceList';
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);

            self.queryMyList();
        },
        methods: {
            // 省份确定城市
            selProvince (val) {
                let self = this;

                if (self.editShow) {
                    // 非搜索列表情况下
                    self.editCityCode.city = null;
                    self.editCityCode.town = null;
                } else {
                    // 搜索列表情况下
                    self.cityCode.city = null;
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 2, 'cityList');
            },
            selCity (val) {
                let self = this;

                if (self.editShow) {
                    // 非搜索列表情况下
                    self.editCityCode.town = null;
                } else {
                    // 搜索列表情况下
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 3, 'townList');
            },

            showFun () {
                let self = this;

                self.$axios.post(self.ruleQueryUrl, self.ruleQueryBody).then(res => {
                    if (res !== null && res.length !== 0) {
                        self.viewingRule = res[0].content;
                    }

                    self.withRule = true;
                });
            },
            changePage (val) {
                let self = this;
                self.tableLoading = true;
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

                self.$util.deleteBlankProp(self.queryBody);

                self.$util.cityCodeBeforeQuery(self);

                self.tableLoading = true;
                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination = res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.tableLoading = false;
                });
            },
            view (index) {
                let self = this;
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));

                self.okText = '确定';
                self.disableEdit = true;
                self.editShow = true;

                self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
                self.selProvince(self.viewModel.province);
                self.selCity(self.viewModel.city);
                self.editCityCode.province = self.viewModel.province;
                self.editCityCode.city = self.viewModel.city;
                self.editCityCode.town = self.viewModel.town;
            },
            edit (index) {
                let self = this;
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));

                self.viewMode = false;
                self.okText = '提交';
                self.disableEdit = false;
                self.editShow = true;
                self.addModel = false;

                self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
                self.selProvince(self.viewModel.province);
                self.selCity(self.viewModel.city);
                self.editCityCode.province = self.viewModel.province;
                self.editCityCode.city = self.viewModel.city;
                self.editCityCode.town = self.viewModel.town;
            },
            add () {
                let self = this;
                self.viewModel = self.addEntity;

                self.editCityCode.province = null;
                self.editCityCode.city = null;
                self.editCityCode.town = null;

                self.viewMode = false;
                self.okText = '提交';
                self.disableEdit = false;
                self.editShow = true;
                self.addModel = true;
            },
            handleSubmit (name) {
                let self = this;
                let val = false;
                self.$refs[name].validate((valid) => {
                    val = valid;
                });
                return val;
            },
            ok () {
                let self = this;

                self.$util.cityCodeBeforeEdit(self);

                if (self.disableEdit === false) {
                    if (self.addModel === false) { // 编辑模式
                        if (!self.handleSubmit('addEntity')) {
                            self.viewMode = true;
                            self.$Message.error('请输入完整信息');
                        } else {
                            let statusResult = self.extracted(self);// 验证是否输入了时长 和 比例
                            if (statusResult) {
                                return;
                            }
                            self.$axios.post(self.editUrl, self.viewModel).then((res) => {
                                self.editShow = false;
                                self.$Notice.success({title: '服务商品', desc: '修改成功!'});
                                self.queryMyList();
                            });
                        }
                    } else { // 添加模式
                        if (!self.handleSubmit('addEntity')) {
                            self.viewMode = true;
                            self.$Message.error('请输入完整信息');
                        } else {
                            let statusResult = self.extracted();// 验证是否输入了时长 和 比例
                            if (statusResult) {
                                return;
                            }
                            self.$axios.post(self.saveUrl, self.addEntity).then((res) => {
                                self.tableLoading = true;
                                self.editShow = false;
                                self.$Notice.success({title: '服务商品', desc: '添加成功'});
                                self.queryMyList();
                            });
                        }
                    }
                } else {
                    self.editShow = false;
                }
            },
            extracted () {
                let self = this;
                if (self.viewModel.depositType === 1 || self.viewModel.depositType === '1' || self.viewModel.depositType === '1') {
                    if (self.viewModel.depositPercentPerson === undefined || self.viewModel.depositPercentPerson === null || self.viewModel.depositPercentPerson === '' || self.viewModel.depositPercentPerson === 0) {
                        self.$Message.error('请输入个人比例');
                        return true;
                    }
                } else {
                    if (self.viewModel.timePercentPerson === undefined || self.viewModel.timePercentPerson === null || self.viewModel.timePercentPerson === '' || self.viewModel.timePercentPerson === 0) {
                        self.$Message.error('请输入个人时长');
                        return true;
                    }
                }

                if (self.viewModel.depositType === 1 || self.viewModel.depositType === '1' || self.viewModel.depositType === '1') {
                    if (self.viewModel.depositPercentCompany === undefined || self.viewModel.depositPercentCompany === null || self.viewModel.depositPercentCompany === '' || self.viewModel.depositPercentCompany === 0) {
                        self.$Message.error('请输入公司比例');
                        return true;
                    }
                } else {
                    if (self.viewModel.timePercentCompany === undefined || self.viewModel.timePercentCompany === null || self.viewModel.timePercentCompany === '' || self.viewModel.timePercentCompany === 0) {
                        self.$Message.error('请输入公司时长');
                        return true;
                    }
                }
                return false;
            },
            cancel () {
                let self = this;
                if (self.disableEdit === false) self.$refs['addEntity'].resetFields();
                self.editShow = false;
            }
        }
    };
</script>
