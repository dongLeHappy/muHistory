<style scoped>
    @import '../../styles/common.less';
    .ivu-form-item{
        width: 300px;
    }
    .ivu-input-number{
        width: 180px;
    }
    .userselect{display: flex;flex-flow: row nowrap;align-items: center;}
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <span @click="save" style="display: inline-block;padding: 3px" v-if="$util.getAccess('adv_active_add')"><Button type="success" icon="plus">配置积分</Button></span>
            </Row>
            <Row class="margin-top-10 searchable-table-con1">
                <Table border :columns="columns" :data="myList" :loading="tableLoading" no-data-text="暂无数据"></Table>
                <!--<Page style="margin-top: 5px" show-total
                      :total="queryBody.pagination.total"
                      :current="queryBody.pagination.page"
                      :page-size="queryBody.pagination.size"
                      @on-change="changePage"
                      show-elevator
                ></Page>-->
            </Row>
        </Card>

        <!--编辑添加积分-->
        <Modal v-model="editShow" :title="modalTitle" :width="800" :mask-closable=false :closable=false>
            <Form ref="viewModel" :rules="validateRules" :model="viewModel" :labelWidth="120" inline>
                <Row>
                    <!--<FormItem prop="id" label="id" >
                        <Input type="text" v-model="viewModel.id" :readonly="disableEdit"></Input>
                    </FormItem>-->
                    <FormItem prop="scoreKey" label="名称"  v-if="!isSave">
                        <Input type="text" v-model="viewModel.scoreKey" readonly></Input>
                    </FormItem>
                    <FormItem prop="scoreKey" label="名称"  v-if="isSave">
                        <Input type="text" v-model="viewModel.scoreKey" ></Input>
                    </FormItem>
                    <Row>
                    	<FormItem prop="enable" label="状态" >
		                    <RadioGroup  v-model="viewModel.enable">
						        <Radio label="0" :value="0">禁用</Radio>
						        <Radio label="1" :value="1">启用</Radio>
						    </RadioGroup>
					    </FormItem>
				    </Row>
                    <Row>
                    	<FormItem prop="scoreValue" label="积分值"  v-if="!isSave ">
                    		<Input type="text" v-model="viewModel.scoreValue" :rows="6" style="width:495px"  readonly></Input>
                    	</FormItem>
                        <FormItem prop="scoreValue" label="积分值"  v-if="isSave ">
                            <Input type="text" v-model="viewModel.scoreValue" :rows="6" style="width:495px"  readonly></Input>
                        </FormItem>
                    </Row>
                    <Row>
                    	<FormItem prop="desc" label="说明" >
                    		<Input type="text" v-model="viewModel.desc" :rows="6" style="width:495px"></Input>
                    	</FormItem>
                    </Row>
                    <Row>
                    	<FormItem prop="categoryModel" label="模块" >
                    		<Input type="text" v-model="viewModel.categoryModel" :rows="6" style="width:495px"></Input>
                    	</FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="createTime" label="创建时间" v-if="!isSave && disableEdit">
                            <Input type="text" v-model="new Date(viewModel.createTime).formatDef()" readonly></Input>
                        </FormItem>
                        <FormItem prop="lastModifyTime" label="修改时间" v-if="!isSave && disableEdit">
                            <Input type="text" v-model="new Date(viewModel.lastModifyTime).formatDef()" readonly></Input>
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
                queryUrl:'/scoreConfig/list',//获取列表
                editUrl:'/scoreConfig/save',
                saveUrl:'/scoreConfig/save',//保存
                deleteUrl:'/scoreConfig/delete',//删除
                cityUrl: this.$util.cityUrl,//城市选择

                test: false,
                

                 queryBody:{//请求体
                    pagination:{
                        page:1,
                        size:10,
                        
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
                    scoreKey: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    desc: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    createTime: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'}
                    ],
                    lastModifyTime: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'}
                    ],

                },
				
                platformSel:[
                    {value:1, label:'Android'},
                    {value:2, label:'IOS'},
                    {value:3, label:'其他'},
                    {value:4, label:'全部'}
                ],

                columns: [//字段

//                  {title: 'id', key: 'id', align:'center', minWidth:110 },
                    {title: '名称', key: 'scoreKey', align:'center', minWidth:110},
                    {title: '积分值', key: 'scoreValue', align:'center', minWidth:130},
					{title: '状态', key: 'enable', align:'center', minWidth:110 },
                    {title: '说明', key: 'desc', align:'center', minWidth:110},
                    {title: '积分值', key: 'scoreValue', align:'center', minWidth:130},

                    {title: '模块', key: 'categoryModel', align:'center', minWidth:110},
                	{title: '创建时间', key: 'createTime', align:'center', minWidth:150
	                        ,render: (h, params) => {
	                        return h('div', new Date(params.row.createTime).formatDef());
	                    }
                  	},
	                  {title: '修改时间', key: 'lastModifyDate', align:'center', minWidth:150
	                        ,render: (h, params) => {
	                        return h('div', new Date(params.row.lastModifyTime).formatDef());
	                    }
	                  },
                    {title: '操作', key: 'action', width:260, align:'center',//操作
                        render: (h, params) => {
                            let arr = [];
                            let access = this.$util.getAccess('score_edit');
                            if (access) arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index,params.row.id)}}}, '编辑'));

                            access = this.$util.getAccess('score_delete');
                            if (access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.row.id)}}}, '删除'));
                            return h('div', arr);
                        }
                    }
                ],
                advList: [
                ],
               
            }
        },
        mounted(){
            let self = this;
            self.queryMyList();
//          let cityCode = 100000;
//             let levelType = 1;
//          let prop = "provinceList";
//          self.$util.cityCodeSelect(self, cityCode, levelType, prop);
			//获取整个表格数据

        },
        methods:{
           
            //
            //   //搜索
            // queryMyListClick(){
            //     let self = this;
            //     self.queryBody.pagination = {page:1, total:10, size:10};
            //     self.queryMyList();
            // },
           // 列表
           queryMyList(){
                var self = this;

                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody);

                var query = JSON.parse(JSON.stringify(self.queryBody));

                self.$axios.post(self.queryUrl,query).then((res) => {
                	console.log(res)
                    // self.queryBody.pagination=res.pagination;
                    // delete self.queryBody.pagination.currentIndex;
                    self.myList = res;
                    console.log(self.myList )
                    self.tableLoading = false;
                })
            },
            show(index){
                let self = this;
                self.modalTitle = '积分详情';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                self.disableEdit = true;
                self.editShow = true;
            },
            edit(index,id){
                let self = this;
                self.isSave=false;
                self.modalTitle = '修改积分';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                // self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                // self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                self.viewModel.id = self.viewModel.id;

                self.disableEdit = false;
                self.editShow = true;
            },
            save(){
                let self = this;
                self.isSave=true;
                self.modalTitle = '添加积分';
                self.viewModel = {};
                self.disableEdit = false;
                self.editShow = true;
            },
            delete(id){
                let self = this;
//              self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
//				self.$Modal.confirm({title:'积分删除',content:'确定要删除该积分吗?',onOk:function () {
//                  self.viewModel.state=3;
//                  
//              }});
                var scoreConfigIds = [];
                scoreConfigIds.push(id);
                console.log(scoreConfigIds)
                self.$Modal.confirm({title:'积分删除',content:'确定要删除该积分吗?',onOk:function () {
                    self.$axios.post(self.deleteUrl,{
                        scoreConfigIds:scoreConfigIds
                    }).then((res) => {
                        self.$Notice.success({title:'积分删除', desc:'删除成功'});
                        self.queryMyList();
                    })
                }});
            },

            	//积分添加保存
            ok () {
                let self = this;
                let entity = JSON.parse(JSON.stringify(self.viewModel));


                if (self.disableEdit === false){

                    self.$refs.viewModel.validate(e => {
                        if (e){
//                          entity.loseDate = new Date(self.viewModel.loseDate ).getTime();
//                          entity.effectDate = new Date(self.viewModel.effectDate ).getTime();
                            entity.enable=parseInt(self.viewModel.enable);
                            entity.scoreValue=parseInt(self.viewModel.scoreValue);
                            delete entity.createTime;
                            delete entity.updateTime;
                            entity.creatorId = self.$util.getUserId();
                            if (self.isSave === true){//添加
                                self.$axios.post(self.saveUrl, entity).then((res) => {
                                    self.$Notice.success({title:'积分添加', desc:'添加成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                });
                            }else{//编辑
                                delete entity.modifyId;
                                delete entity.lastModifyTime;
                                self.$axios.post(self.editUrl, entity).then((res) => {
                                    self.$Notice.success({title:'积分编辑', desc:'修改成功'});
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
