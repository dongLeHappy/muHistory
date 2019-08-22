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
                <Select placeholder="是否生效" v-model="queryBody.state" style="width:200px;padding: 3px" clearable>
                    <Option :value=1>生效</Option>
                    <Option :value=2>关闭</Option>
                    <Option :value=3>失效</Option>

                </Select>
				<Input type="text" placeholder="请输入编码" style="width:200px;padding: 3px" v-model="queryBody.no"></Input>


                <span @click="queryMyListClick" style="display: inline-block;padding: 3px"><Button type="primary" icon="search">搜索</Button></span>
            	<Row>
	                <span @click="save" style="display: inline-block;padding: 3px" v-if="$util.getAccess('adv_save')"><Button type="success" icon="plus">添加商品</Button></span>
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
                <Row>
                	<FormItem prop="productNo" label="商品编码" >
                        <Input type="text"  v-model="viewModel.productNo" readonly></Input>
                    </FormItem>
                    <FormItem prop="productName" label="商品名称" >
                        <Input type="text" v-model="viewModel.productName" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="categoryNo" label="商品分类编码" >
                        <Select placeholder="商品分类编码" v-model="viewModel.couponType" style="width:200px;padding: 3px" clearable>
                            <Option :value=1>清洁工具</Option>
                            <Option :value=2>清洁剂</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="freeFlag" label="是否为赠品" >
                        <Select placeholder="是否在售" v-model="viewModel.freeFlag" style="width:200px;padding: 3px" clearable>
                            <Option :value=0>否</Option>
                            <Option :value=1>是</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="state" label="状态" >
                        <Select placeholder="是否在售" v-model="viewModel.state" style="width:200px;padding: 3px" clearable>
                            <Option :value=1>在售</Option>
                            <Option :value=2>下架</Option>
                        </Select>
                    </FormItem>
                    <FormItem prop="costPrice" label="成本价" >
                        <Input type="text" v-model="viewModel.costPrice" :readonly="disableEdit" placeholder=""></Input>
                    </FormItem>
                    <FormItem prop="price" label="销售单价"  v-if="viewModel.price">
                        <Input type="text" v-model="viewModel.fixedNum" :readonly="disableEdit" placeholder=""></Input>
                    </FormItem>



                    <Row>
                        <FormItem prop="effectTime" label="开始生效时间" >
                            <DatePicker type="datetime"  format="yyyy-MM-dd 00:00:00" v-model="viewModel.effectTime" style="width: 180px" :disabled="disableEdit"></DatePicker>
                        </FormItem>
                        <FormItem prop="loseTime" label="结束生效时间" >
                            <DatePicker type="datetime" @on-change="completionChange" placeholder="截止时间" 
                            	v-model="viewModel.loseTime" style="width: 150px;padding: 3px" clearable/>
<!--                            <DatePicker type="datetime"  format="yyyy-MM-dd 23:59:59" v-model="viewModel.loseDate" style="width: 180px" :disabled="disableEdit"></DatePicker>-->
                        </FormItem>	
                    </Row>
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
	               <Row>
				        <FormItem label="商品主图" v-if="disableEdit" >
	                        <div style="max-width: 300px;max-height: 300px" v-for="pic in productmainPic">
	                            <img style="height: 100%;max-height: 300px" @click="viewPic(pic)" :src="pic" alt="">
	                        </div>
	                    </FormItem>	
	                    <div style="margin-left: 30px" v-if="!disableEdit">
					        <p style="margin:5px">
					          <b>商品主图</b>
					        </p>
					        <div class="demo-upload-list" v-for="item in productmainPics">
					          <template v-if="item.status === 'finished'">
					            <img :src="item.url">
					            <div class="demo-upload-list-cover">
					              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
					              <Icon type="ios-trash-outline" @click.native="handleMainRemove(item)"></Icon>
					            </div>
					          </template>
					          <template v-else>
					            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
					          </template>
					        </div>
					        <Upload
					          :show-upload-list="false"
					          :default-file-list="productmainPics"
					          :on-success="handleMainSuccess"
					          :format="['jpg','jpeg','png']"
					          :on-format-error="handleFormatError"
					          multiple
					          type="drag"
					          :action="uploadUrl"
					          style="display: inline-block;width:58px;"
					        >
					          <div style="width: 58px;height:58px;line-height: 58px;">
					            <Icon type="camera" size="20"></Icon>
					          </div>
					        </Upload>
					    </div>

                
			      	</Row>
				    <!--商品图片详情-->
	                <Row>
				        <FormItem label="商品详情图" v-if="disableEdit" >
	                        <div style="max-width: 300px;max-height: 300px" v-for="pic in productDetail">
	                            <img style="height: 100%;max-height: 300px" @click="viewPic(pic)" :src="pic" alt="">
	                        </div>
	                    </FormItem>	
	                    <div style="margin-left: 30px" v-if="!disableEdit">
					        <p style="margin:5px">
					          <b>商品详情图</b>
					        </p>
					        <div class="demo-upload-list" v-for="item in productDetails">
					          <template v-if="item.status === 'finished'">
					            <img :src="item.url">
					            <div class="demo-upload-list-cover">
					              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
					              <Icon type="ios-trash-outline" @click.native="handleDetailRemove(item)"></Icon>
					            </div>
					          </template>
					          <template v-else>
					            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
					          </template>
					        </div>
					        <Upload
					          :show-upload-list="false"
					          :default-file-list="productDetails"
					          :on-success="handleDetailSuccess"
					          :format="['jpg','jpeg','png']"
					          :on-format-error="handleFormatError"
					          multiple
					          type="drag"
					          :action="uploadUrl"
					          style="display: inline-block;width:58px;"
					        >
					          <div style="width: 58px;height:58px;line-height: 58px;">
					            <Icon type="camera" size="20"></Icon>
					          </div>
					        </Upload>
					    </div>
			      	</Row>
			      	<!--图片列表-->
	                <Row>
				        <FormItem label="图片列表" v-if="disableEdit" >
	                        <div style="max-width: 300px;max-height: 300px" v-for="pic in contactPic">
	                            <img style="height: 100%;max-height: 300px" @click="viewPic(pic)" :src="pic" alt="">
	                        </div>
	                    </FormItem>	
	                    <div style="margin-left: 30px" v-if="!disableEdit">
					        <p style="margin:5px">
					          <b>图片列表</b>
					        </p>
					        <div class="demo-upload-list" v-for="item in contactPics">
					          <template v-if="item.status === 'finished'">
					            <img :src="item.url" style="height: 100%;max-height: 300px">
					            <div class="demo-upload-list-cover">
					              <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
					              <Icon type="ios-trash-outline" @click.native="handleContactRemove(item)"></Icon>
					            </div>
					          </template>
					          <template v-else>
					            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
					          </template>
					        </div>
					        <Upload
					          :show-upload-list="false"
					          :default-file-list="contactPics"
					          :on-success="handleContactSuccess"
					          :format="['jpg','jpeg','png']"
					          :on-format-error="handleFormatError"
					          multiple
					          type="drag"
					          :action="uploadUrl"
					          style="display: inline-block;width:58px;"
					        >
					          <div style="width: 58px;height:58px;line-height: 58px;">
					            <Icon type="camera" size="20"></Icon>
					          </div>
					        </Upload>
					    </div>

                
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
                provinceList:[],
                contactPics: [],//图片列表
                productDetails:[],//商品详情
                productmainPics:[],
                contactPic: [],//图片列表
                productDetail:[],//商品详情
                productmainPic:[],
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
                    productNo: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    productName: [{required: true, message: '不能为空!', trigger: 'blur'} ],
                    costPrice: [{required: true, message: '不能为空!', trigger: 'blur'}],
					price: [{required: true, message: '不能为空!', trigger: 'blur'}],
                    effectTime: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'}
                        ],
                    loseTime: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'},
                        {validator: afterV, trigger: 'change'}
                    ],

//                    cityCode: [ {required: true, message: '不能为空!', trigger: 'change'} ],
                },


                columns: [//字段
                	{title: '商品id', key: 'id', align:'center', minWidth:110 },
                    {title: '商品编码', key: 'productNo', align:'center', minWidth:110 },
                    {title: '商品名称', key: 'productName', align:'center', minWidth:110 },
                    {title: '商品分类编码', key: 'categoryNo', align:'center', minWidth:110
                    	,render: (h, params) => {

						    switch (params.row.categoryNo) {
						        case 'M':
						            return h('div', '清洁工具');
						            break;
						        case 'D':
						            return h('div', '清洁剂');
						            break;
						    }
						}
                    },
                    {title: '成本价', key: 'costPrice', align:'center', minWidth:110},
                    {title: '销售单价', key: 'price', align:'center', minWidth:110},
                    {title: '是否为赠品', key: 'freeFlag', align:'center', minWidth:150,render: (h, params) => {
                            switch (params.row.state) {
                                case  0:
                                    return h('div', '否');
                                    break;
                                case 1:
                                    return h('div', '是');
                                    break;
                            }
                        }},
                    {title: '上架时间', key: 'effectTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.effectDate).formatDef());
                    }
                    },
                    {title: '下架时间', key: 'loseTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.loseDate).formatDef());
                    }
                   },
                    {title: '状态', key: 'state', align:'center', minWidth:150,render: (h, params) => {
                            switch (params.row.state) {
                                case  1:
                                    return h('div', '在售');
                                    break;
                                case 2:
                                    return h('div', '下架');
                                    break;
                            }
                        }},
                    {title: '主图', key: 'headImg', align:'center'
                        ,render: (h, params) => {
                        let self = this;
                        let arr = [];
                        let ssrc = self.myList[params.index].headImg;
                        arr.push(h('img', {attrs:{src:ssrc,style:'width:100%;margin-top: 6px;'}, on: {click: () => {this.viewPic(ssrc)}}}));
                        return h('div', arr);
                    }
                    },
                    {title: '图片列表', key: 'packageImg', align:'center'
                        ,render: (h, params) => {
                        let self = this;
                        let arr = [];
                        let ssrc = self.myList[params.index].packageImg;
                        arr.push(h('img', {attrs:{src:ssrc,style:'width:100%;margin-top: 6px;'}, on: {click: () => {this.viewPic(ssrc)}}}));
                        return h('div', arr);
                    }
                    },
                    {title: '商品详情', key: 'productDetail', align:'center'
                        ,render: (h, params) => {
                        let self = this;
                        let arr = [];
                        let ssrc = self.myList[params.index].productDetail;
                        arr.push(h('img', {attrs:{src:ssrc,style:'width:100%;margin-top: 6px;'}, on: {click: () => {this.viewPic(ssrc)}}}));
                        return h('div', arr);
                    }
                    },
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
                self.modalTitle = '添加商品';
                self.viewModel = {};
                self.viewModel.activeId=this.id;
                console.log(self.viewModel)
                self.disableEdit = false;
                self.editShow = true;
        	}
          

//          let cityCode = 100000;
//          let levelType = 1;
//          let prop = "provinceList";
//          self.$util.cityCodeSelect(self, cityCode, levelType, prop);

            
        },
        methods:{
			save(){
                let self = this;
                self.isSave=true;

                self.modalTitle = '发布商品信息';
                self.viewModel = {};
                self.pics = [];
                // 照片
			    self.productDetails = self.$util.strToFiles(self.viewModel.productDetail);
			    self.productmainPics = self.$util.strToFiles(self.viewModel.productmainPic);
			    self.contactPics = self.$util.strToFiles(self.viewModel.contactPic);
                self.disableEdit = false;
                self.editShow = true;
            },
            beforeUpload(file){
                let self = this;
//              if (self.pics.length !== 0){
//                  self.$Notice.warning({title: '上传图片', desc: '只能传一张图片!'});
//                  return false;
//              }else {
//                  return true;
//              }
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


            verifyFacilitator (id) {
                let self = this;
                self.$Modal.confirm({title: '商品信息审核',
                    content: '确定要审核该活动吗?',
                    onOk: function () {
                        self.queryBodys.id = id;
                        self.queryBodys.state = 1;
                        self.$axios.post(self.editUrl, self.queryBodys).then((res) => {
                            self.$Notice.success({title: '商品信息审核', desc: '审核成功'});
                            self.queryMyList();
                        });
                    }});
        },






        show(index){
                let self = this;
                self.modalTitle = '商品信息详情';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                self.disableEdit = true;
                self.editShow = true;
				self.productDetails = self.$util.strToFiles(self.viewModel.productDetail);
			    self.productmainPics = self.$util.strToFiles(self.viewModel.productmainPic);
			    self.contactPics = self.$util.strToFiles(self.viewModel.contactPic);
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
                self.modalTitle = '修改商品信息';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.effectDate = new Date(self.viewModel.effectDate);
                self.viewModel.loseDate = new Date(self.viewModel.loseDate);
                
                self.contactPics = self.$util.strToPicArr(self.viewModel.packageImg);
			    self.productDetails = self.$util.strToPicArr(self.viewModel.productDetail);
			    self.productmainPics = self.$util.strToPicArr(self.viewModel.headImg);
			    
                self.disableEdit = false;
                
                self.editShow = true;

//              self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
//              self.selProvince(self.viewModel.province);
//              self.selCity(self.viewModel.city);
//              self.editCityCode.province = self.viewModel.province;
//              self.editCityCode.city = self.viewModel.city;
//              self.editCityCode.town = self.viewModel.town;
            },
            save(){
                let self = this;
                self.isSave=true;
                self.modalTitle = '添加商品信息';
                self.viewModel = {};
                self.disableEdit = false;
                self.editShow = true;
                
                
                self.contactPics = self.$util.strToFiles(self.viewModel.packageImg);
			    self.productDetails = self.$util.strToFiles(self.viewModel.productDetail);
			    self.productmainPics = self.$util.strToFiles(self.viewModel.headImg);

            },

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
                            
                            
                            self.viewModel.packageImg = self.$util.filesToStr(self.contactPics);
                            self.viewModel.productDetail = self.$util.filesToStr(self.productDetails);
                            self.viewModel.headImg = self.$util.filesToStr(self.productmainPics);
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
            },
            handleDetailSuccess(res, file) {
		      let self = this;
		      if (res.success === true) {
		        file.url = res.result;
		        self.productDetails.push(file);
		      } else {
		        self.$Notice.error({
		          title: "网络出错了!",
		          desc:
		            "错误码:" +
		            response.data.error.errorCode +
		            ", 描述:" +
		            response.data.error.errorMessage
		        });
		      }
		    },
            handleMainSuccess(res, file) {
		      let self = this;
		      if (res.success === true) {
		        file.url = res.result;
		        self.productmainPics.push(file);
		      } else {
		        self.$Notice.error({
		          title: "网络出错了!",
		          desc:
		            "错误码:" +
		            response.data.error.errorCode +
		            ", 描述:" +
		            response.data.error.errorMessage
		        });
		      }
		    },
            handleContactSuccess(res, file) {
		      let self = this;
		      if (res.success === true) {
		        file.url = res.result;
		        self.contactPics.push(file);
		      } else {
		        self.$Notice.error({
		          title: "网络出错了!",
		          desc:
		            "错误码:" +
		            response.data.error.errorCode +
		            ", 描述:" +
		            response.data.error.errorMessage
		        });
		      }
		    },
            handleMainRemove(file) {
		      let self = this;
		      self.blPics.splice(self.productmainPics.indexOf(file), 1);
		    },
		    handleContactRemove(file) {
		      let self = this;
		      self.contactPics.splice(self.contactPics.indexOf(file), 1);
		    },
		    handleDetailRemove(file) {
		      let self = this;
		      self.otherPics.splice(self.productDetails.indexOf(file), 1);
		    },
		    handleView(url) {
		      let self = this;
		      self.viewingPic = url;
		      self.picModal = true;
		    },
            handleFormatError (file) {
                let self = this;
                self.$Notice.warning({title: '上传图片', desc: file.name + '格式不对, 请上传jpg,jpeg或png'});
            }

        }
    }
</script>
