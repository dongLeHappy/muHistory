<style scoped>
    @import '../../styles/common.less';
    .ivu-form-item{
        width: 300px;
    }
    .ivu-input-number{
        width: 180px;
    }
    .demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
				<Row>
	                <span @click="save" style="display: inline-block;padding: 3px" v-if="$util.getAccess('adv_save')"><Button type="success" icon="plus">添加库存记录</Button></span>
	            </Row>
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
                <Row>=
                    <FormItem prop="num" label="数量" >
                        <Input type="text" v-model="viewModel.num" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="type" label="类型" >
                        <Select placeholder="" v-model="viewModel.type" style="width:200px;padding: 3px" clearable>
                            <Option :value=1>买入</Option>
                            <Option :value=2>卖出</Option>
                        </Select>
                    </FormItem>
					<Row>
	                	<FormItem prop="createId" label="创建者" >
	                            <Input type="text" v-model="isSave? userName:viewModel.createBy" readonly></Input>
	                        </FormItem>
	                        <FormItem prop="modifyId" label="修改人" >
	                            <Input type="text" v-model="isSave? userName:viewModel.updateBy" readonly></Input>
	                        </FormItem>
	
	                    <FormItem label="创建时间" v-if="!isSave && disableEdit">
	                        <Input v-model="viewModel.createTime" readonly></Input>
	                    </FormItem>
	                    <FormItem label="修改时间" v-if="!isSave && disableEdit">
	                        <Input v-model="viewModel.lastModifyTime" readonly></Input>
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
				uploadUrl: this.$util.uploadUrl,
                test: false,
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
                    num: [{required: true, message: '不能为空!', trigger: 'blur'} ],
					type: [{required:true, type:'number', message:'不能为空', trigger:'change'}],
                 },


                columns: [//字段
                	{title: '库存记录id', key: 'id', align:'center', minWidth:110 },
                    {title: '库存id', key: 'stockId', align:'center', minWidth:110 },
                    {title: '类型', key: 'type', align:'center', minWidth:110
                    	,render: (h, params) => {
						    switch (params.row.type) {
						        case '1':
						            return h('div', '买入');
						            break;
						        case '2':
						            return h('div', '卖出');
						            break;
						    }
						}
                    },
                    {title: '数量', key: 'num', align:'center', minWidth:110},
                    {title: '关联订单号', key: 'orderSn', align:'center', minWidth:110},
                  
                   	{title: '创建者', key: 'createId', align:'center', minWidth:110},
                    {title: '修改者', key: 'modifyId', align:'center', minWidth:110},
                    {title: '创建日期', key: 'createTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.createTime).formatDef());
                    }
                    },
                    {title: '修改日期', key: 'lastModifyTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.lastModifyTime).formatDef());
                    }
                    },
                    // {title: '操作', key: 'action', fixed:'right', width:180, align:'center',//操作
                    {title: '操作', key: 'recordFlag', width:180, align:'center',//操作
                        render: (h, params) => {
                            let arr = [];
                            let state = this.myList[params.index].state;
                            let t = this.myList[params.index].state === 2;
                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.show(params.index)}}}, '查看'));

                            let access = this.$util.getAccess('adv_cou_edit');
                            if (access) arr.push(h('Button', {props: {type: 'warning', size: 'small'}, on: {click: () => {this.edit(params.index)}}}, '编辑'));

                            access = this.$util.getAccess('adv_delete');
                            if (access) arr.push(h('Button', {props: {type: 'error', size: 'small'}, on: {click: () => {this.delete(params.index)}}}, '删除'));
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
                self.modalTitle = '添加库存记录';
                self.viewModel = {};
                self.viewModel.activeId=this.id;
                console.log(self.viewModel)
                self.disableEdit = false;
                self.editShow = true;
        	}
 
            
        },
        methods:{
			save(){
                let self = this;
                self.isSave=true;

                self.modalTitle = '发布库存记录';
                self.viewModel = {};
                self.disableEdit = false;
                self.editShow = true;
           },
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

	        show(index){
	            let self = this;
	            self.modalTitle = '查看库存记录';
	            self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
	            self.viewModel.effectDate = new Date(self.viewModel.effectDate);
	            self.viewModel.loseDate = new Date(self.viewModel.loseDate);
	            self.disableEdit = true;
	            self.editShow = true;
			
	        },

            edit(index){
                let self = this;
                self.isSave=false;
                self.modalTitle = '修改库存记录';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                
                self.disableEdit = false;
                
                self.editShow = true;
            },
            delete(index){
                let self = this;
                self.$Modal.confirm({title:'库存删除',content:'确定要删除该库存吗?',onOk:() => {
                    self.$axios.post(self.deleteUrl, self.myList[index].id, {headers:{'Content-Type':'application/json'}}).then((res) => {
                        self.$Notice.success({title:'库存删除', desc:'删除成功'});
                        self.queryMyList();
                    })
                }});
            },
            save(){
                let self = this;
                self.isSave=true;
                self.modalTitle = '添加库存记录';
                self.viewModel = {};
                self.disableEdit = false;
                self.editShow = true;
            },

            ok () {
                let self = this;
                let entity = JSON.parse(JSON.stringify(self.viewModel));

                if (self.disableEdit === false){
                    self.$refs.viewModel.validate(e => {
                        if (e){
                            entity.effectTime = new Date(self.viewModel.effectTime).getTime();
                            entity.loseTime= new Date(self.viewModel.loseTime).getTime();
                            delete entity.createTime;
                            if (self.isSave === true){//添加
                                self.$axios.post(self.saveUrl, entity).then((res) => {
                                    self.$Notice.success({title:'库存添加', desc:'添加成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                }).catch((res)=>{
                                	 console.log(res)
                                });
                            }else{//编辑
                                self.$axios.post(self.editUrl, entity).then((res) => {
                                    self.$Notice.success({title:'库存编辑', desc:'修改成功'});
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
            },
            

        }
    }
</script>
