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
                <Select placeholder="是否生效" v-model="queryBody.inUse" style="width:200px;padding: 3px" clearable>
                    <Option :value=0>生效</Option>
                    <Option :value=1>失效</Option>
                </Select>
                <span style="padding: 3px">
                    <DatePicker v-model="queryBody.startTime" type="date" placement="bottom-end"  style="width: 150px;" placeholder="商品套餐上架日期" clearable></DatePicker>
                    -
                    <DatePicker v-model="queryBody.endTime" type="date" placement="bottom-end"  style="width: 150px;" placeholder="商品套餐下架日期" clearable></DatePicker>
                </span>

                <span @click="queryMyListClick" style="display: inline-block;padding: 3px"><Button type="primary" icon="search">搜索</Button></span>
                <span @click="save" style="display: inline-block;padding: 3px" v-if="$util.getAccess('off_save')"><Button type="success" icon="plus">添加商品套餐</Button></span>
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
                    <FormItem prop="groupName" label="商品套餐名称" >
                        <Input type="text" v-model="viewModel.groupName" :readonly="disableEdit"></Input>
                    </FormItem>
                    <FormItem prop="initPrice" label="原价" >
                        <Input type="text" v-model="viewModel.initPrice" :readonly="disableEdit" placeholder=""></Input>
                    </FormItem>
                    <FormItem prop="realPrice" label="现价"  v-if="viewModel.realPrice">
                        <Input type="text" v-model="viewModel.realPrice" :readonly="disableEdit" placeholder=""></Input>
                    </FormItem>
                    <FormItem prop="activeId" label="活动id"  v-if="viewModel.activeId">
                        <Input type="text" v-model="viewModel.activeId" :readonly="disableEdit" placeholder=""></Input>
                    </FormItem>
                    <FormItem prop="state" label="状态" >
                        <Select placeholder="是否在售" v-model="viewModel.state" style="width:200px;padding: 3px" clearable>
                            <Option :value=1>在售</Option>
                            <Option :value=2>下架</Option>
                        </Select>
                    </FormItem>
                    <Row>
                        <FormItem prop="effectTime" label="上架时间" >
                            <DatePicker type="date" v-model="viewModel.effectTime" style="width: 180px" :disabled="disableEdit"></DatePicker>
                        </FormItem>
                        <FormItem prop="loseTime" label="下架时间" >
                            <DatePicker type="date" v-model="viewModel.loseTime" style="width: 180px" :disabled="disableEdit"></DatePicker>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem prop="createBy" label="创建者" >
                            <Input type="text" v-model="isSave? userName:viewModel.createBy" readonly></Input>
                        </FormItem>
                        <FormItem prop="updateBy" label="修改人" >
                            <Input type="text" v-model="isSave? userName:viewModel.updateBy" readonly></Input>
                        </FormItem>

                        <FormItem prop="createTime" label="创建时间" v-if="!isSave && disableEdit">
                            <Input type="text" v-model="new Date(viewModel.createTime).formatDef()" readonly></Input>
                        </FormItem>
                        <FormItem prop="updateTime" label="修改时间" v-if="!isSave && disableEdit">
                            <Input type="text" v-model="new Date(viewModel.updateTime).formatDef()" readonly></Input>
                        </FormItem>
                    </Row>
                     <Row>
				        <FormItem label="商品套餐主图" v-if="disableEdit" >
	                        <div style="max-width: 300px;max-height: 300px" v-for="pic in productmainPic">
	                            <img style="height: 100%;max-height: 300px" @click="viewPic(pic)" :src="pic" alt="">
	                        </div>
	                    </FormItem>	
	                    <div style="margin-left: 30px" v-if="!disableEdit">
					        <p style="margin:5px">
					          <b>商品套餐主图</b>
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
				        <FormItem label="商品套餐详情图" v-if="disableEdit" >
	                        <div style="max-width: 300px;max-height: 300px" v-for="pic in productDetail">
	                            <img style="height: 100%;max-height: 300px" @click="viewPic(pic)" :src="pic" alt="">
	                        </div>
	                    </FormItem>	
	                    <div style="margin-left: 30px" v-if="!disableEdit">
					        <p style="margin:5px">
					          <b>商品套餐详情图</b>
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
				        <FormItem label="商品套餐图片列表" v-if="disableEdit" >
	                        <div style="max-width: 300px;max-height: 300px" v-for="pic in contactPic">
	                            <img style="height: 100%;max-height: 300px" @click="viewPic(pic)" :src="pic" alt="">
	                        </div>
	                    </FormItem>	
	                    <div style="margin-left: 30px" v-if="!disableEdit">
					        <p style="margin:5px">
					          <b>商品套餐图片列表</b>
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
                let before = this.viewModel.startEffectiveTime.getTime();
                let after = new Date(value).getTime();
                if (before >= after){
                    return callback(new Error('结束时间必须大于开始时间!'));
                }else {
                    callback();
                }
            };
            return {
                queryUrl:'/discount/list',//获取列表
                editUrl:'/discount/update',
                saveUrl:'/discount/save',
                deleteUrl:'/discount/',
                cityUrl: this.$util.cityUrl,
				contactPics: [],//图片列表
                productDetails:[],//商品详情
                productmainPics:[],
                contactPic: [],//图片列表
                productDetail:[],//商品详情
                productmainPic:[],
                test: false,
                provinceList:[],
                cityList: [],
                townList: [],
                cityCode: {
                    province: null,
                    city: null,
                    town: null,
                },
                editCityCode: {
                    province: null,
                    city: null,
                    town: null,
                },

                queryBody:{//请求体
                    pagination:{
                        page:1,
                        size:10,
                        total:10
                    }
                }
                ,myList:[],

                modalTitle: '',
                tableLoading:true,
                userName: this.$util.getUserName(),

                disableEdit:true,

                picModal:false,

                isSave:false,
                editShow:false,
                viewModel:{},//编辑单个的实体
                validateRules:{
                    groupName: [ {required: true, message: '不能为空!', trigger: 'blur'} ],
                    initPrice: [{required: true, message: '不能为空!', trigger: 'blur'}],
					realPrice: [{required: true, message: '不能为空!', trigger: 'blur'}],
                    state: [{required:true, type:'number', message:'不能为空', trigger:'change'}],
                    
                    effectTime: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'}
                        ],
                    loseTime: [
                        {required: true, type: 'date', message: '不能为空!', trigger: 'change'},
                        {validator: afterV, trigger: 'change'}
                    ],
                },

                columns: [//字段
                   
                    {title: '商品套餐名称', key: 'groupName', align:'center', minWidth:110 },
                    {title: '原价', key: 'initPrice', align:'center', minWidth:110},
                    {title: '现价', key: 'realPrice', align:'center', minWidth:110},
                    {title: '活动id', key: 'activeId', align:'center', minWidth:110},
                   	{title: '上架时间', key: 'effectTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.effectTime).formatDef());
                    }
                    },
                    {title: '下架时间', key: 'loseTime', align:'center', minWidth:150
                        ,render: (h, params) => {
                        return h('div', new Date(params.row.loseTime).formatDef());
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
                    {title:'商品套餐主图', key: 'headImg', align:'center'
                        ,render: (h, params) => {
                        let self = this;
                        let arr = [];
                        let ssrc = self.myList[params.index].headImg;
                        arr.push(h('img', {attrs:{src:ssrc,style:'width:100%;margin-top: 6px;'}, on: {click: () => {this.viewPic(ssrc)}}}));
                        return h('div', arr);
                    }
                    },
                    {title:'商品套餐图片列表', key: 'packageImg', align:'center'
                        ,render: (h, params) => {
                        let self = this;
                        let arr = [];
                        let ssrc = self.myList[params.index].packageImg;
                        arr.push(h('img', {attrs:{src:ssrc,style:'width:100%;margin-top: 6px;'}, on: {click: () => {this.viewPic(ssrc)}}}));
                        return h('div', arr);
                    }
                    },
                    {title: '商品套餐详情', key: 'groupDetail', align:'center'
                        ,render: (h, params) => {
                        let self = this;
                        let arr = [];
                        let ssrc = self.myList[params.index].productDetail;
                        arr.push(h('img', {attrs:{src:ssrc,style:'width:100%;margin-top: 6px;'}, on: {click: () => {this.viewPic(ssrc)}}}));
                        return h('div', arr);
                    }
                    },

                    {title: '操作', key: 'recordFlag', width:180, align:'center',//操作
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
                ]
            }
        },
        mounted(){
            let self = this;

            let cityCode = 100000;
            let levelType = 1;
            let prop = "provinceList";
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);

            self.queryMyList();
        },
        methods:{
            //省份确定城市
            selProvince(val){
                let self = this;

                if (self.editShow){
                    //非搜索列表情况下
                    self.editCityCode.city = null;
                    self.editCityCode.town = null;
                }else {
                    //搜索列表情况下
                    self.cityCode.city = null;
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 2, 'cityList');
            },
            selCity(val){
                let self = this;

                if (self.editShow){
                    //非搜索列表情况下
                    self.editCityCode.town = null;
                }else {
                    //搜索列表情况下
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 3, 'townList');
            },


            changePage(val){
                let self = this;
                self.queryBody.pagination.page = val;
                self.queryMyList();
            },
            queryMyListClick(){
                let self = this;
                self.queryBody.pagination = {page:1, total:10, size:10};
                self.queryMyList();
            },
            queryMyList(){
                let self = this;

                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody);

                let query = JSON.parse(JSON.stringify(self.queryBody));

                if (self.queryBody.inUse !== undefined) query.inUse = self.$util.numToBoolean(self.queryBody.inUse);

                self.$axios.post(self.queryUrl, query).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.tableLoading = false;
                })
            },
            show(index){
                let self = this;
                self.modalTitle = '商品套餐详情';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.startEffectiveTime = new Date(self.viewModel.startEffectiveTime);
                self.viewModel.endEffectiveTime = new Date(self.viewModel.endEffectiveTime);
                
                self.contactPics = self.$util.strToPicArr(self.viewModel.packageImg);
			    self.productDetails = self.$util.strToPicArr(self.viewModel.groupDetail);
			    self.productmainPics = self.$util.strToPicArr(self.viewModel.headImg);
                self.disableEdit = true;
                self.editShow = true;

                self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
                self.selProvince(self.viewModel.province);
                self.selCity(self.viewModel.city);
                self.editCityCode.province = self.viewModel.province;
                self.editCityCode.city = self.viewModel.city;
                self.editCityCode.town = self.viewModel.town;
            },
            edit(index){
                let self = this;
                self.isSave=false;
                self.modalTitle = '修改商品套餐';
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.viewModel.endEffectiveTime = new Date(self.viewModel.endEffectiveTime);
                self.viewModel.startEffectiveTime = new Date(self.viewModel.startEffectiveTime);
                self.disableEdit = false;
                self.editShow = true;

				self.contactPics = self.$util.strToPicArr(self.viewModel.packageImg);
			    self.productDetails = self.$util.strToPicArr(self.viewModel.groupDetail);
			    self.productmainPics = self.$util.strToPicArr(self.viewModel.headImg);
                self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
                self.selProvince(self.viewModel.province);
                self.selCity(self.viewModel.city);
                self.editCityCode.province = self.viewModel.province;
                self.editCityCode.city = self.viewModel.city;
                self.editCityCode.town = self.viewModel.town;
            },
            save(){
                let self = this;
                self.isSave=true;
                self.modalTitle = '添加商品套餐';
                self.viewModel = {};
                self.disableEdit = false;
                self.editShow = true;
                self.productDetails = self.$util.strToFiles(self.viewModel.groupDetail);
			    self.productmainPics = self.$util.strToFiles(self.viewModel.productmainPic);
			    self.contactPics = self.$util.strToFiles(self.viewModel.contactPic);
            },
            delete(id){
                let self = this;
                self.$Modal.confirm({title:'商品套餐删除',content:'确定要删除该商品套餐吗?',onOk:function () {
                    self.$axios.delete(self.deleteUrl+'/'+id).then((res) => {
                        self.$Notice.success({title:'商品套餐删除', desc:'删除成功'});
                        self.queryMyList();
                    })
                }});
            },
            ok () {
                let self = this;

                self.$util.cityCodeBeforeEdit(self);

                let entity = JSON.parse(JSON.stringify(self.viewModel));

                entity.updateBy = self.userName;

                if (self.disableEdit === false){

                    self.$refs.viewModel.validate(e => {
                        if (e){
                            entity.endEffectiveTime = new Date(self.viewModel.endEffectiveTime ).getTime();
                            entity.startEffectiveTime = new Date(self.viewModel.startEffectiveTime ).getTime();
                            entity.userSharePercentage = 100 - entity.platformSharePercentage;
							self.viewModel.packageImg = self.$util.filesToStr(self.contactPics);
                            self.viewModel.groupDetail = self.$util.filesToStr(self.productDetails);
                            self.viewModel.headImg = self.$util.filesToStr(self.productmainPics);
                            delete entity.createTime;
                            delete entity.updateTime;

                            if (self.isSave === true){//添加
                                entity.createBy = self.$util.getUserName();
                                self.$axios.post(self.saveUrl, entity).then((res) => {
                                    self.$Notice.success({title:'商品套餐添加', desc:'添加成功'});
                                    self.editShow=false;
                                    self.queryMyList();
                                });
                            }else{//编辑
                                self.$axios.post(self.editUrl, entity).then((res) => {
                                    self.$Notice.success({title:'商品套餐编辑', desc:'修改成功'});
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
