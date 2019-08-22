<style lang='less' scoped>
    @import '../../styles/common.less';
    .ivu-input{
        width: 200px;
    }
    .demo-upload-list{
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
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }

</style>
<template>
    <div style="padding: 5px">
       <Card>
           <Row>
               <Form ref="viewModel" :model="viewModel" :labelWidth="95" :rules="ruleValidate">
                   <Row :gutter="11">
                       <Col span="8">
                       <FormItem prop="name" label="姓名" >
                           <Input type="text" v-model="viewModel.name"></Input>
                       </FormItem>
                       <FormItem prop="idNum" label="身份证">
                           <Input type="text" v-model="viewModel.idNum" ></Input>
                       </FormItem>
                       <FormItem prop="mobile" label="手机号码">
                           <Input type="text" v-model="viewModel.mobile" ></Input>
                       </FormItem>
                       <!--<FormItem prop="user" label="验证码">-->
                           <!--<Input type="text" v-model="viewModel.sex" ></Input>-->
                       <!--</FormItem>-->
                       <FormItem prop="prePassword" label="登录密码">
                           <Input type="password" v-model="viewModel.prePassword" ></Input>
                       </FormItem>
                       <FormItem prop="password" label="再次登录密码">
                           <Input type="password" v-model="viewModel.password" ></Input>
                       </FormItem>
                       <FormItem prop="presentAddr" label="现住址">
                           <Input type="text" v-model="viewModel.presentAddr" ></Input>
                       </FormItem>
                       <FormItem prop="emergencyName" label="紧急联系人">
                           <Input type="text" v-model="viewModel.emergencyName" ></Input>
                       </FormItem>
                       </Col>

                       <Col span="8" offset="4">
                       <FormItem prop="companyName" label="公司名称">
                           <Input type="text" v-model="viewModel.companyName" ></Input>
                       </FormItem>
                       <FormItem prop="idBusinessLicense" label="营业执照">
                           <Input type="text" v-model="viewModel.idBusinessLicense" ></Input>
                       </FormItem>
                       <FormItem prop="addr" label="公司地址">
                           <Input type="text" v-model="viewModel.addr" ></Input>
                       </FormItem>
                       <FormItem prop="bankName" label="开户行">
                           <Input type="text" v-model="viewModel.bankName" ></Input>
                       </FormItem>

                       <FormItem prop="account" label="基本户账号">
                           <Input type="text" v-model="viewModel.account" ></Input>
                       </FormItem>
                       <FormItem prop="type" label="用户类型">
                           <Select placeholder="保洁员类型" v-model="viewModel.type" style="width:200px;padding: 3px">
                               <Option v-for="item in typeSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
                           </Select>
                       </FormItem>
                       <FormItem prop="emergencyMobile" label="紧急联系电话">
                           <Input type="text" v-model="viewModel.emergencyMobile" ></Input>
                       </FormItem>
                       </Col>
                   </Row>
                   <FormItem prop="cityCode" label="服务地区">
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

                   <Row style="margin-left: 5px" class="picClass">
                       <p style="margin:5px"><b style="display: inline-block;margin-right: 4px;line-height: 1;font-family: SimSun;font-size: 12px;color: #ed3f14;">*</b><b>头像</b></p>
                       <div class="demo-upload-list" v-for="item in avaterPics">
                           <template v-if="item.status === 'finished'">
                               <img :src="item.url">
                               <div class="demo-upload-list-cover">
                                   <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                   <Icon type="ios-trash-outline" @click.native="handleAvaterReverseRemove(item)"></Icon>
                               </div>
                           </template>
                           <template v-else>
                               <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                           </template>
                       </div>
                       <Upload :show-upload-list="false" :default-file-list="avaterPics" :on-success="handleAvaterReverseSuccess" :before-upload="beforeUpload" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" multiple type="drag" :action="uploadUrl" style="display: inline-block;width:58px;">
                           <div style="width: 58px;height:58px;line-height: 58px;">
                               <Icon type="camera" size="20"></Icon>
                           </div>
                       </Upload>
                   </Row>

                   <Row style="margin-left: 5px">
                       <p style="margin:5px"><b style="display: inline-block;margin-right: 4px;line-height: 1;font-family: SimSun;font-size: 12px;color: #ed3f14;">*</b><b>身份证正面照片</b></p>
                       <div class="demo-upload-list" v-for="item in idPics">
                           <template v-if="item.status === 'finished'">
                               <img :src="item.url">
                               <div class="demo-upload-list-cover">
                                   <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                   <Icon type="ios-trash-outline" @click.native="handleIdRemove(item)"></Icon>
                               </div>
                           </template>
                           <template v-else>
                               <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                           </template>
                       </div>
                       <Upload :show-upload-list="false" :default-file-list="idPics" :on-success="handleIdSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" multiple type="drag" :action="uploadUrl" style="display: inline-block;width:58px;">
                           <div style="width: 58px;height:58px;line-height: 58px;">
                               <Icon type="camera" size="20"></Icon>
                           </div>
                       </Upload>
                   </Row>

                   <Row style="margin-left: 5px">
                       <p style="margin:5px"><b style="display: inline-block;margin-right: 4px;line-height: 1;font-family: SimSun;font-size: 12px;color: #ed3f14;">*</b><b>身份证反面照片</b></p>
                       <div class="demo-upload-list" v-for="item in idReversePics">
                           <template v-if="item.status === 'finished'">
                               <img :src="item.url">
                               <div class="demo-upload-list-cover">
                                   <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                   <Icon type="ios-trash-outline" @click.native="handleIdReverseRemove(item)"></Icon>
                               </div>
                           </template>
                           <template v-else>
                               <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                           </template>
                       </div>
                       <Upload :show-upload-list="false" :default-file-list="idReversePics" :on-success="handleIdReverseSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" multiple type="drag" :action="uploadUrl" style="display: inline-block;width:58px;">
                           <div style="width: 58px;height:58px;line-height: 58px;">
                               <Icon type="camera" size="20"></Icon>
                           </div>
                       </Upload>
                   </Row>

                   <Row style="margin-left: 5px">
                       <p style="margin:5px"><b>营业执照</b></p>
                       <div class="demo-upload-list" v-for="item in blPics">
                           <template v-if="item.status === 'finished'">
                               <img :src="item.url">
                               <div class="demo-upload-list-cover">
                                   <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                   <Icon type="ios-trash-outline" @click.native="handleBlRemove(item)"></Icon>
                               </div>
                           </template>
                           <template v-else>
                               <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                           </template>
                       </div>
                       <Upload :show-upload-list="false" :default-file-list="blPics" :on-success="handleBLSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" multiple type="drag" :action="uploadUrl" style="display: inline-block;width:58px;">
                           <div style="width: 58px;height:58px;line-height: 58px;">
                               <Icon type="camera" size="20"></Icon>
                           </div>
                       </Upload>
                   </Row>

                   <Row style="margin-left: 5px">
                       <p style="margin:5px"><b>公司合同</b></p>
                       <div class="demo-upload-list" v-for="item in contactPics">
                           <template v-if="item.status === 'finished'">
                               <img :src="item.url">
                               <div class="demo-upload-list-cover">
                                   <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                   <Icon type="ios-trash-outline" @click.native="handleContactRemove(item)"></Icon>
                               </div>
                           </template>
                           <template v-else>
                               <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                           </template>
                       </div>
                       <Upload :show-upload-list="false" :default-file-list="contactPics" :on-success="handleContactSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" multiple type="drag" :action="uploadUrl" style="display: inline-block;width:58px;">
                           <div style="width: 58px;height:58px;line-height: 58px;">
                               <Icon type="camera" size="20"></Icon>
                           </div>
                       </Upload>
                   </Row>

                   <Row style="margin-left: 5px">
                       <p style="margin:5px"><b>其他资质</b></p>
                       <div class="demo-upload-list" v-for="item in otherPics">
                           <template v-if="item.status === 'finished'">
                               <img :src="item.url">
                               <div class="demo-upload-list-cover">
                                   <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                   <Icon type="ios-trash-outline" @click.native="handleOtherRemove(item)"></Icon>
                               </div>
                           </template>
                           <template v-else>
                               <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                           </template>
                       </div>
                       <Upload :show-upload-list="false" :default-file-list="otherPics" :on-success="handleOtherSuccess" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError" multiple type="drag" :action="uploadUrl" style="display: inline-block;width:58px;">
                           <div style="width: 58px;height:58px;line-height: 58px;">
                               <Icon type="camera" size="20"></Icon>
                           </div>
                       </Upload>
                   </Row>

               </Form>
           </Row>
           <Row>
               <Button type="primary" @click="save" style="display: block; margin: 0 auto;padding: 10px 100px;">提交</Button>
               <Spin fix v-if="spinShow">
                   <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                   <div>5s后重新登记</div>
               </Spin>
           </Row>

       </Card>

        <Modal title="查看图片" v-model="picView">
            <img :src="viewingPic" style="width: 100%">
        </Modal>
    </div>
</template>
<script>
    import vjs from '../../libs/validateRules.js';
    import Cookies from 'js-cookie';
    export default {
        data () {
            const validatePass=(rule, value, callback)=>{
                let self = this;
                if (value !== self.viewModel.prePassword){
                    return callback(new Error('两次密码不相同!'));
                }else {
                    callback();
                }
            };
            return {
                uploadUrl:this.$util.uploadUrl,
                cityUrl: this.$util.cityUrl,

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


                imgName: '',
                picView: false,

                idPics: [],
                avaterPics: [],
                idReversePics: [],
                contactPics:[],
                blPics:[],
                otherPics:[],
                viewingPic:'',

                spinShow:false,
                editShow:false,
                viewModel:{},//编辑单个的实体

                ruleValidate:{
                    name:[{ required: true, message: '不能为空', trigger: 'blur' }],
                    status:[{ required: true,type:'number', message: '不能为空!', trigger: 'change' }],
                    type:[{ required: true,type:'number', message: '不能为空!', trigger: 'change' }],
                    idNum:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                        ,{ validator: vjs.idV, trigger: 'blur'}
                    ],
                    mobile:[
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { validator: vjs.phoneV, trigger: 'blur' }
                    ],
                    prePassword:[{ required: true, message: '不能为空', trigger: 'blur' }],
                    password:[
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur'}
                    ],
                    //     cityCode:[{ required: true, message: '不能为空', trigger: 'change' }],
                    presentAddr: [{ required: true, message: '不能为空', trigger: 'blur'}],
                    emergencyName: [{ required: true, message: '不能为空', trigger: 'blur'}],
                    emergencyMobile: [{ required: true, message: '不能为空', trigger: 'blur'}],
                    account:[{ required: true, message: '不能为空', trigger: 'blur' }]
                },

                typeSelector:[
                    {value: 1, label: '个人'},
                    {value: 2, label: '公司'}
                ],

                saveUrl:'/cleaner/save'

            }
        },
        mounted(){
            let self = this;
            let cityCode = 100000;
            let levelType = 1;
            let prop = "provinceList";
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);
        },
        methods: {
            //省份确定城市
            selProvince(val){
                let self = this;
                delete self.cityCode.city;
                delete self.cityCode.town;
                delete self.editCityCode.city;
                delete self.editCityCode.town;
                self.$util.cityCodeSelect(self, val, 2, 'cityList');
            },
            selCity(val){
                let self = this;
                delete self.cityCode.town;
                delete self.editCityCode.town;
                self.$util.cityCodeSelect(self, val, 3, 'townList');
            },

            save(){
                let self = this;
                let val = false;

                self.$refs['viewModel'].validate((valid) => {
                    val = valid;
                });

                self.viewModel.picId0 = self.$util.filesToStr(self.idPics);
                self.viewModel.picId1 = self.$util.filesToStr(self.idReversePics);
                self.viewModel.picBusinessLicense = self.$util.filesToStr(self.blPics);
                self.viewModel.picContract = self.$util.filesToStr(self.contactPics);
                self.viewModel.picOther = self.$util.filesToStr(self.otherPics);
                self.viewModel.avaterPics = self.$util.filesToStr(self.avaterPics);
                self.viewModel.registType = 2;//邀请入驻的

                if (self.$util.isEmpty(self.editCityCode.town)){
                    self.viewModel.cityCode = self.editCityCode.city;
                }else if (!self.$util.isEmpty(self.editCityCode.town)){
                    self.viewModel.cityCode = self.editCityCode.town;
                }

                if (self.$util.isEmpty(self.viewModel.cityCode)){
                    self.$Message.error({content: '请选择地区!'});
                    return;
                }

                if (val === true){
                    if (self.$util.isEmpty(self.viewModel.avaterPics)){
                        self.$Message.error('请上传头像!');
                        return;
                    }
                    if (self.$util.isEmpty(self.viewModel.picId0)){
                        self.$Message.error('请上传身份证正面照片!');
                        return;
                    }
                    if (self.$util.isEmpty(self.viewModel.picId1)){
                        self.$Message.error('请上传身份证反面照片!');
                        return;
                    }

                    if (self.viewModel.cityCode === 'null'){
                        self.$Message.error('不能为全国!');
                        return;
                    }

                    self.viewModel.refId  = Cookies.get('userId');
                    self.viewModel.refType = Cookies.get('refType');
                            // console.log(self.viewModel)
                    
                    self.$Modal.confirm({title:'保洁员登记', content: '确定登记该保洁员?', onOk: function () {
                        self.$axios.put(self.saveUrl, self.viewModel).then((res) => {
                            // console.log(self.viewModel)
                            self.spinShow = true;
                            self.$Notice.success({title:'保洁员',desc:'登记成功!'});
                            setTimeout(() => {
                                self.spinShow = false;
                                self.$emit('successData',self.viewModel)
                            },5000);
                        });
                    }});
                }else {
                    self.$Message.error('请输入完整信息!');
                }
            },

            beforeUpload(file){
                let self = this;
                if (self.avaterPics.length !== 0){
                    self.$Notice.warning({title: '上传图片', desc: '只能传一张图片!'});
                    return false;
                }else {
                    return true;
                }
            },
            handleIdSuccess (res, file) {
                let self = this;
                if (res.success === true){
                    file.url = res.result;
                    self.idPics.push(file);
                }else {
                    self.$Notice.error({title:'网络出错了!',desc:'错误码:'+res.data.error.errorCode+', 描述:'+res.data.error.errorMessage});
                }
            },
            handleIdReverseSuccess (res, file) {
                let self = this;
                if (res.success === true){
                    file.url = res.result;
                    self.idReversePics.push(file);
                }else {
                    self.$Notice.error({title:'网络出错了!',desc:'错误码:'+res.data.error.errorCode+', 描述:'+res.data.error.errorMessage});
                }
            },
            handleAvaterReverseSuccess (res, file) {
                let self = this;
                if (res.success === true){
                    file.url = res.result;
                    self.avaterPics.push(file);
                }else {
                    self.$Notice.error({title:'网络出错了!',desc:'错误码:'+res.data.error.errorCode+', 描述:'+res.data.error.errorMessage});
                }
            },
            handleAvaterReverseRemove (res, file) {
                let self = this;
                self.avaterPics.splice(self.idReversePics.indexOf(file), 1);
            },
            handleBLSuccess(res, file){
                let self = this;
                if (res.success === true){
                    file.url = res.result;
                    self.blPics.push(file);
                }else {
                    self.$Notice.error({title:'网络出错了!',desc:'错误码:'+res.data.error.errorCode+', 描述:'+res.data.error.errorMessage});
                }
            },
            handleContactSuccess(res, file){
                let self = this;
                if (res.success === true){
                    file.url = res.result;
                    self.contactPics.push(file);
                }else {
                    self.$Notice.error({title:'网络出错了!',desc:'错误码:'+res.data.error.errorCode+', 描述:'+res.data.error.errorMessage});
                }
            },
            handleOtherSuccess(res, file){
                let self = this;
                if (res.success === true){
                    file.url = res.result;
                    self.otherPics.push(file);
                }else {
                    self.$Notice.error({title:'网络出错了!',desc:'错误码:'+res.data.error.errorCode+', 描述:'+res.data.error.errorMessage});
                }
            },
            handleView (url) {
                let self = this;
                self.viewingPic = url;
                self.picView = true;
            },
            handleIdRemove (file) {
                let self = this;
                self.idPics.splice(self.idPics.indexOf(file), 1);
            },
            handleIdReverseRemove (file) {
                let self = this;
                self.idReversePics.splice(self.idReversePics.indexOf(file), 1);
            },
            handleBlRemove (file) {
                let self = this;
                self.blPics.splice(self.blPics.indexOf(file), 1);
            },
            handleContactRemove (file) {
                let self = this;
                self.contactPics.splice(self.contactPics.indexOf(file), 1);
            },
            handleOtherRemove (file) {
                let self = this;
                self.otherPics.splice(self.otherPics.indexOf(file), 1);
            },

            handleFormatError (file) {
                let self = this;
                self.$Notice.warning({title: '上传图片', desc: file.name + '格式不对, 请上传jpg,jpeg或png'});
            }
        }
    }
</script>
