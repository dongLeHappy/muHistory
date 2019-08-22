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
                <Select placeholder="是否生效" v-model="queryBody.state" style="width:200px;padding: 3px" clearable>
                    <Option :value=1>生效</Option>
                    <Option :value=2>关闭</Option>
                    <Option :value=3>失效</Option>

                </Select>
				<Input type="text" placeholder="请输入编码" style="width:200px;padding: 3px" v-model="queryBody.no"></Input>
                
                <span @click="queryMyListClick" style="display: inline-block;padding: 3px"><Button type="primary" icon="search">搜索</Button></span>
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
                	<FormItem prop="activeId" label="活动id" >
                        <Input type="text"  v-model="viewModel.activeId" readonly></Input>
                    </FormItem>
                    <FormItem prop="name" label="名称" >
                        <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
                    </FormItem>

<!--                    <FormItem prop="couponType" label="优惠类型" >-->
<!--                        <Input type="text" v-model="viewModel.couponType" :readonly="disableEdit" placeholder="金额or折扣"></Input>-->
<!--                    </FormItem>-->
                    <FormItem prop="state" label="优惠类型" >
                        <Select placeholder="优惠类型" v-model="viewModel.couponType" style="width:200px;padding: 3px" clearable>
                            <Option :value=1>金额</Option>
                            <Option :value=2>折扣</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="equalScore" label="等值积分" >
                        <Input type="text" v-model="viewModel.equalScore" :readonly="disableEdit" placeholder=""></Input>
                    </FormItem>
                    <FormItem prop="fixedNum" label="范围时间内的次数"  v-if="viewModel.couponMethod==3">
                        <Input type="text" v-model="viewModel.fixedNum" :readonly="disableEdit" placeholder=""></Input>
                    </FormItem>
                    <FormItem prop="totalNum" label="优惠券总量"  v-if="viewModel.couponMethod==3" >
                        <Input type="text" v-model="viewModel.totalNum" :readonly="disableEdit" placeholder=""></Input>
                    </FormItem>
                    <Row>
                    	<FormItem prop="amount" label="优惠力度" >
                    		<Input type="number" pattern="\d*" v-model="viewModel.amount"  placeholder="type为2，优惠金额，type为1，折扣比例，10-100这种 " style="width:495px"></Input>
                    	</FormItem>
                    </Row>

                    <!-- 如果选择生成二维码. 且活动类型为1次性 & 优惠券类型为 则后台批量生成 -->
                    <Row>
                        <FormItem prop="target" label="是否生成线下券" style="width:100px;">
                            <input type="checkbox" v-model="viewModel.generatFlag" value="1" ></input>
                        </FormItem>

                        <FormItem prop="target" label="生成数量" style="width:500px;">
                             <Input type="text" v-model="viewModel.qrcodeNum"></Input>
                        </FormItem>
                    </Row>



                    <Row>
                        <FormItem prop="effectDate" label="开始生效时间" >
                            <DatePicker type="datetime"  format="yyyy-MM-dd 00:00:00" v-model="viewModel.effectDate" style="width: 180px" :disabled="disableEdit"></DatePicker>
                        </FormItem>
                        <FormItem prop="loseDate" label="结束生效时间" >
                            <DatePicker type="datetime" @on-change="completionChange" placeholder="截止时间" v-model="viewModel.loseDate" style="width: 150px;padding: 3px" clearable/>
<!--                            <DatePicker type="datetime"  format="yyyy-MM-dd 23:59:59" v-model="viewModel.loseDate" style="width: 180px" :disabled="disableEdit"></DatePicker>-->
                        </FormItem>
                    </Row>

                    <Row>
<!--                    	<FormItem prop="state" label="是否生效" >-->
<!--	                    	<Select placeholder="是否生效" v-model="viewModel.state" style="width:200px;padding: 3px" clearable>-->
<!--			                    <Option :value=1>生效</Option>-->
<!--			                    <Option :value=2>关闭</Option>-->
<!--			                    <Option :value=3>失效</Option>-->
<!--			                </Select>-->
<!--		                </FormItem>-->
		                <FormItem prop="couponMethod" label="优惠方式" >
	                    	<Select placeholder="是否生效" v-model="viewModel.couponMethod" style="width:200px;padding: 3px" clearable>
			                    <Option :value=1>一次性</Option>
			                    <Option :value=2>时间范围内有效</Option>
			                    <Option :value=3>时间范围内固定次数</Option>
			                    <Option :value=4>分享推荐</Option>
                                <Option :value=5>线下券</Option>
			                </Select>
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
                let before = this.viewModel.effectDate.getTime();
                let after = new Date(value).getTime();
                if (before >= after){
                    return callback(new Error('结束时间必须大于开始时间!'));
                }else {
                    callback();
                }
            };
            return {
                queryUrl:'/coupon/list',//获取列表
                editUrl:'/coupon/edit',
                saveUrl:'/coupon/intset',
                deleteUrl:'/coupon/list',
                cityUrl: this.$util.cityUrl,

                test: false,
                provinceList:[],
//              cityList: [],
//              townList: [],
//              cityCode: {
//                  province: null,
//                  city: null,
//                  town: null,
//              },
//              editCityCode: {
//                  province: null,
//                  city: null,
//                  town: null,
//              },

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
                editShow:false,
                viewModel:{},//编辑单个的实体
                validateRules:{
                    name: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    couponType: [{required: true, message: '不能为空!', trigger: 'blur'} ],
                    amount: [{required: true, message: '不能为空!', trigger: 'blur'}],

                    effectDate: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'}
                    ],
                    loseDate: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'},
                        {validator: afterV, trigger: 'change'}
                    ],

//                    cityCode: [ {required: true, message: '不能为空!', trigger: 'change'} ],
                },

                platformSel:[
                    {value:1, label:'Android'},
                    {value:2, label:'IOS'},
                    {value:3, label:'其他'},
                    {value:4, label:'全部'}
                ],

                columns: [//字段
                    {title: '活动id', key: 'activeId', align:'center', minWidth:110 },
                    {title: '编码', key: 'no', align:'center', minWidth:110 },
                    {title: '优惠券名称', key: 'name', align:'center', minWidth:110 },
                    {title: '优惠券类型', key: 'couponType', align:'center', minWidth:110
                    	,render: (h, params) => {

						    switch (params.row.couponType) {
						        case 'M':
						            return h('div', '优惠券');
						            break;
						        case 'D':
						            return h('div', '折扣券');
						            break;
						    }
						}
                    },
                    {title: '等值积分', key: 'equalScore', align:'center', minWidth:110},
                    // {title: '固定数量', key: 'fixedNum', align:'center', minWidth:110},
                    // {title: '优惠总量', key: 'totalNum', align:'center', minWidth:110},
                    {title: '优惠', key: 'amount', align:'center', minWidth:110},

                    {title: '生效日期', key: 'effectDate', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.effectDate).formatDef());
                    }
                    },
                    {title: '截止日期', key: 'loseDate', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.loseDate).formatDef());
                    }
                   },
                    {title: '是否生效', key: 'state', align:'center', minWidth:150,render: (h, params) => {

                            switch (params.row.state) {
                                case  1:
                                    return h('div', '生效');
                                    break;
                                case 2:
                                    return h('div', '失效');
                                    break;
                            }
                        }},
                     {title: '优惠方式', key: 'couponMethod', align:'center', minWidth:150,render: (h, params) => {

                             switch (params.row.couponMethod) {
                                 case  1:
                                     return h('div', '一次性');
                                     break;
                                 case  2:
                                     return h('div', '时间范围内有效');
                                     break;
                                 case 3:
                                     return h('div', '时间范围内固定次数');
                                     break;
                                 case 4:
                                     return h('div', '分享推荐');
                                     break;
                                case 5:
                                     return h('div', '线下券');
                                     break;
                             }
                             }},
                    // {title: '操作', key: 'action', fixed:'right', width:180, align:'center',//操作
                    {title: '操作', key: 'action', width:180, align:'center',//操作
                        render: (h, params) => {
                            let arr = [];
                            let state = this.myList[params.index].state;
                            let t = this.myList[params.index].state === 2;
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.show(params.index)}}}, '查看'));

                            let access = this.$util.getAccess('adv_cou_edit');
                            if (access) arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '编辑'));

                            access = this.$util.getAccess('adv_cou_examine');
                            if (access) {
                                if (state === 2) {
                                    arr.push(
                                        h(
                                            'Button',
                                            {
                                                props: { type: 'warning', size: 'small', disabled: !t },
                                                on: {
                                                    click: () => {
                                                        this.verifyFacilitator(params.row.id,params.row.couponMethod,params.row.activeId);
                                                    }
                                                }
                                            },
                                            '有效'
                                        )
                                    );
                                }
                                else {
                                    arr.push(
                                        h(
                                            'Button',
                                            {
                                                props: { type: 'warning', size: 'small', disabled: !t },
                                                on: {
                                                    click: () => {
                                                        this.verifyFacilitator(params.row.id);
                                                    }
                                                }
                                            },
                                            '失效'
                                        )
                                    );
                                }
                            }


							 return h('div', arr);
                        }
                    }
                ],
                advList: [
                ],
                id:this.$route.params.id,
            }
        },
        mounted(){
        	  var self = this;
			self.queryMyList();
        	if(this.id==null || this.id =="" || this.id==undefined){
        		return;
        	}else{
        		var self = this;
                self.isSave=true;
                self.modalTitle = '添加优惠券';
                self.viewModel = {};
                self.viewModel.activeId=this.id;
                self.disableEdit = false;
                self.editShow = true;
        	}
          

//          let cityCode = 100000;
//          let levelType = 1;
//          let prop = "provinceList";
//          self.$util.cityCodeSelect(self, cityCode, levelType, prop);

            
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
            //省份确定城市
//          selProvince(val){
//              let self = this;
//
//              if (self.editShow){
//                  //非搜索列表情况下
//                  self.editCityCode.city = null;
//                  self.editCityCode.town = null;
//              }else {
//                  //搜索列表情况下
//                  self.cityCode.city = null;
//                  self.cityCode.town = null;
//              }
//
//              self.$util.cityCodeSelect(self, val, 2, 'cityList');
//          },
//          selCity(val){
//              let self = this;
//
//              if (self.editShow){
//                  //非搜索列表情况下
//                  self.editCityCode.town = null;
//              }else {
//                  //搜索列表情况下
//                  self.cityCode.town = null;
//              }
//
//              self.$util.cityCodeSelect(self, val, 3, 'townList');
//          },


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

            queryMyList(){
                var self = this;

                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody);

                var query = JSON.parse(JSON.stringify(self.queryBody));
                if (self.queryBody.state !== undefined) query.state = self.queryBody.state;
                if (self.queryBody.no !== undefined) query.no = self.queryBody.no;
                self.$axios.post(self.queryUrl, query).then((res) => {
                	
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    // console.log(self.myList )
                    self.tableLoading = false;
                })
            },


            verifyFacilitator (id,couponMethod,activeId) {
                let self = this;
                self.$Modal.confirm({title: '优惠劵审核',
                    content: '确定要审核该优惠劵吗?',
                    onOk: function () {
                        self.queryBodys.id = id;
                        self.queryBodys.state = 1;
                        self.queryBodys.couponMethod=couponMethod;
                        if(couponMethod==5){
                            self.queryBodys.activeId=activeId;
                        }
                        self.$axios.post(self.editUrl, self.queryBodys).then((res) => {
                            self.$Notice.success({title: '优惠劵审核', desc: '审核成功'});
                            self.queryMyList();
                        });
                    }});
        },
        show(index){
                let self = this;
                self.modalTitle = '优惠券详情';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                self.disableEdit = true;
                self.editShow = true;

//              self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
//              self.selProvince(self.viewModel.province);
//              self.selCity(self.viewModel.city);
//              self.editCityCode.province = self.viewModel.province;
//              self.editCityCode.city = self.viewModel.city;
//              self.editCityCode.town = self.viewModel.town;
            },

            edit(index){
                let self = this;
                self.isSave=false;
                self.modalTitle = '修改优惠券';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                self.disableEdit = false;
                self.editShow = true;

//              self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
//              self.selProvince(self.viewModel.province);
//              self.selCity(self.viewModel.city);
//              self.editCityCode.province = self.viewModel.province;
//              self.editCityCode.city = self.viewModel.city;
//              self.editCityCode.town = self.viewModel.town;
            },
//          save(){
//              let self = this;
//              self.isSave=true;
//              self.modalTitle = '添加优惠券';
//              self.viewModel = {};
//              self.disableEdit = false;
//              self.editShow = true;
//          },

            ok () {
                let self = this;
                let entity = JSON.parse(JSON.stringify(self.viewModel));

                // if(self.viewModel.totalNum<self.viewModel.fixedNum){
                //     self.$Message.error('优惠券的总量需必须大于范围时间内的次数!');
                //     return;
                // }

                if (self.disableEdit === false){
                    self.$refs.viewModel.validate(e => {
                        if (e){
                            entity.effectDate = new Date(self.viewModel.effectDate).getTime();
                            entity.loseDate = new Date(self.viewModel.loseDate).getTime();
                            if(entity.couponType==1){
                                entity.couponType="M"
                            }else if(entity.couponType==2){
                                entity.couponType="D"
                            }
                            delete entity.createTime;
                            if (self.isSave === true){//添加
                                self.$axios.post(self.saveUrl, entity).then((res) => {
                                    // self.$Message.error('优惠券的总量需必须大于范围时间内的次数!'+self.viewModel.loseDate);
                                    self.$Notice.success({title:'优惠券添加', desc:'添加成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                }).catch((res)=>{
                                	 console.log(res)
                                });
                            }else{//编辑
                                self.$axios.post(self.editUrl, entity).then((res) => {
                                    self.$Notice.success({title:'优惠券编辑', desc:'修改成功'});
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
