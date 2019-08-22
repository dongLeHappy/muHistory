<style scoped>
@import "../../styles/common.less";
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
.button {
  background-color: #4caf50;
  color: white;
}
</style>
<template>
  <div style="padding: 5px">
    <Card>
      <Row>
        <span @keyup.enter="queryMyListClick">
          <Input
            placeholder="请输入服务商名称..."
            v-model="queryBody.name"
            style="width: 200px;padding: 3px"
            clearable
          />
        </span>
        <span @keyup.enter="queryMyListClick">
          <Input
            placeholder="请输入手机号码..."
            v-model="queryBody.mobile"
            style="width: 200px;padding: 3px"
            clearable
          />
        </span>
        <span @keyup.enter="queryMyListClick">
          <Input
            placeholder="请输入身份证..."
            v-model="queryBody.idNum"
            style="width: 200px;padding: 3px"
            clearable
          />
        </span>
        <span @keyup.enter="queryMyListClick">
          <Input
            placeholder="请输入营业执照..."
            v-model="queryBody.idBusinessLicense"
            style="width: 200px;padding: 3px"
            clearable
          />
        </span>

        <Select
          placeholder="状态"
          v-model="queryBody.status"
          style="width:200px;padding: 3px"
          clearable
        >
          <Option
            v-for="item in statusSelector"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>

        <Row style="padding: 3px">
          <span>服务地区:</span>
          <Select
            placeholder="请选择省份"
            v-model="cityCode.province"
            style="width:200px;padding: 3px"
            clearable
            @on-change="selProvince"
          >
            <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
          <Select
            placeholder="请选择城市"
            v-model="cityCode.city"
            style="width:200px;padding: 3px"
            clearable
            @on-change="selCity"
          >
            <Option v-for="item in cityList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
          <Select
            placeholder="请选择区"
            v-model="cityCode.town"
            style="width:200px;padding: 3px"
            clearable
          >
            <Option v-for="item in townList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </Row>

        <span @click="queryMyListClick" style="padding: 3px">
          <Button type="primary" icon="search">查询</Button>
        </span>
        <span v-if="$util.getAccess('proxy_save')" @click="save" style="padding: 3px">
          <Button type="success" icon="search">添加服务商</Button>
        </span>
        <span v-if="$util.getAccess('proxy_save')" @click="saveType5" style="padding: 3px">
          <Button type="success" icon="search">添加渠道商</Button>
        </span>
      </Row>
      <Row class="margin-top-10 searchable-table-con1">
        <Table
          border
          :columns="columns"
          :data="myList"
          :loading="tableLoading"
          type="selection"
          no-data-text="暂无数据"
        ></Table>
        <Page
          style="margin-top: 5px"
          show-total
          :total="queryBody.pagination.total"
          :current="queryBody.pagination.page"
          :page-size="queryBody.pagination.size"
          @on-change="changePage"
          show-elevator
        ></Page>
      </Row>
    </Card>

    <Modal
      :width="600"
      v-model="bindService"
      :title="modalTitle"
      cancel-text="返回"
      :closable="false"
      @on-ok="doConfirm"
      :mask-closable="false"
    >
      <Row>
        <Form ref="viewModel" :rules="ruleValidate" :model="viewModel" :labelWidth="90" inline>
          <span @keyup.enter="queryBusiness">
            <Input
              placeholder="请输入手机号码..."
              v-model="queryBodys.mobile"
              style="width: 200px;padding: 3px"
              clearable
            />
          </span>
          
          <span @click="queryBusiness" style="padding: 3px">
            <Button class="button" type="primary" icon="search">查询</Button>
          </span>
          <Row class="margin-top-10 searchable-table-con1">
            <!--<Table border :columns="columnsBusiness" :data="myListBusiness" :loading="tableLoadingBusiness"  no-data-text="暂无数据"></Table>-->
            <i-table border :columns="columnsBusiness" :data="myListBusiness"></i-table>
            <Page
              style="margin-top: 5px"
              show-total
              :total="queryBodys.pagination.total"
              :current="queryBodys.pagination.page"
              :page-size="queryBodys.pagination.size"
              @on-change="BusinessPage"
              show-elevator
            ></Page>
          </Row>
        </Form>
      </Row>
    </Modal>

    <!-- 详情和编辑 -->
    <Modal
      :width="700"
      v-model="editShow"
      :title="modalTitle"
      @on-ok="ok"
      @on-cancel="cancel"
      :ok-text="okText"
      cancel-text="返回"
      :closable="false"
      :mask-closable="false"
    >
      <Row>
        <Form ref="viewModel" :rules="ruleValidate" :model="viewModel" :labelWidth="90" inline>
          <Row>
            <Col span="10">
              <FormItem prop="name" label="姓名">
                <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem prop="account" label="账号">
                <Input type="text" v-model="viewModel.account" :readonly="disableEdit"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem prop="user" label="公司名称">
                <Input
                  type="text"
                  v-model="viewModel.agentInfo.companyName"
                  :readonly="disableEdit"
                ></Input>
              </FormItem>
            </Col>

            <Col span="10">
              <FormItem prop="user" label="公司地址">
                <Input
                  type="text"
                  v-model="viewModel.agentInfo.presentAddr"
                  :readonly="disableEdit"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem prop="mobile" label="手机号码">
                <Input type="text" v-model="viewModel.mobile" :readonly="!saveFlag"></Input>
              </FormItem>
            </Col>

            <Col span="10">
              <FormItem prop="idNum" label="身份证">
                <Input type="text" v-model="viewModel.agentInfo.idNum" :readonly="disableEdit"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem prop="password" label="登录密码">
                <Input type="text" v-model="viewModel.password" :readonly="!saveFlag"></Input>
              </FormItem>
            </Col>

            <Col span="10">
              <FormItem prop="bankAccountNo" label="基本帐号">
                <Input
                  type="text"
                  v-model="viewModel.agentInfo.bankAccountNo"
                  :readonly="disableEdit"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="10">
              <FormItem prop="user" label="营业执照">
                <Input
                  type="text"
                  v-model="viewModel.agentInfo.idBusinessLicense"
                  :readonly="disableEdit"
                ></Input>
              </FormItem>
            </Col>

            <Col span="10">
              <FormItem prop="user" label="开户行">
                <Input type="text" v-model="viewModel.agentInfo.bankName" :readonly="disableEdit"></Input>
              </FormItem>
            </Col>
          </Row>

          <FormItem prop="user" label="用户状态">
            <Select
              v-model="viewModel.status"
              :style="{width: $util.width}"
              :disabled="disableEdit"
            >
              <Option
                v-for="item in statusSelector"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="服务地区">
            <Select
              placeholder="请选择省份"
              :style="{width: $util.width}"
              v-model="editCityCode.province"
              style="width:200px;padding: 3px"
              clearable
              @on-change="selProvince"
            >
              <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
            <Select
              placeholder="请选择城市"
              :style="{width: $util.width}"
              v-model="editCityCode.city"
              style="width:200px;padding: 3px"
              clearable
              @on-change="selCity"
            >
              <Option v-for="item in cityList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
            <Select
              placeholder="请选择区"
              :style="{width: $util.width}"
              v-model="editCityCode.town"
              style="width:200px;padding: 3px"
              clearable
            >
              <Option v-for="item in townList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
            <Button type="success" @click="relateRegion" :disabled="disableEdit">添加</Button>
            <Row style="margin-left: 5px" v-for="region in regionList" key="index">
              <Row style="background-color: #dde7f4; margin: 2px">
                <Col style="margin-left: 10px" span="7">{{region.allName}}</Col>
                <Col
                  style="margin-left: 10px"
                  span="7"
                >{{'代理时间:' + new Date(region.agentDate).format('yyyy-MM-dd')}}</Col>
                <Col style="margin-left: 10px" span="3">{{"状态:" + region.agentStatus}}</Col>
              </Row>
            </Row>
          </FormItem>

          <FormItem prop="user" label="注册时间" v-if="disableEdit">
            <Input type="text" v-model="viewModel.ctime" :readonly="true"></Input>
          </FormItem>
          <!--123123123-->
          <FormItem prop="user" label="修改时间" v-if="disableEdit">
            <Input type="text" v-model="viewModel.utime" :readonly="true"></Input>
          </FormItem>

          <Row>
            <FormItem prop="remark" label="备注">
              <Input type="textarea" v-model="viewModel.agentInfo.remark" :readonly="disableEdit"></Input>
            </FormItem>
          </Row>
        </Form>
      </Row>

      <Row v-if="disableEdit">
        <p style="margin:5px">
          <b>身份证照片</b>
        </p>
        <div v-for="pic in idPic" style="width: 100px;height: 100px;float: left;margin:5px">
          <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt>
        </div>
      </Row>
      <Row style="margin-left: 5px" v-if="!disableEdit">
        <p style="margin:5px">
          <b
            style="display: inline-block;margin-right: 4px;line-height: 1;font-family: SimSun;font-size: 12px;color: #ed3f14;"
          >*</b>
          <b>身份证正面照片</b>
        </p>
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
        <Upload
          :show-upload-list="false"
          :default-file-list="idPics"
          :on-success="handleIdSuccess"
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
      </Row>
      <Row style="margin-left: 5px" v-if="!disableEdit">
        <p style="margin:5px">
          <b
            style="display: inline-block;margin-right: 4px;line-height: 1;font-family: SimSun;font-size: 12px;color: #ed3f14;"
          >*</b>
          <b>身份证反面照片</b>
        </p>
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
        <Upload
          :show-upload-list="false"
          :default-file-list="idReversePics"
          :on-success="handleIdReverseSuccess"
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
      </Row>

      <Row v-if="disableEdit">
        <p style="margin:5px">
          <b>营业执照</b>
        </p>
        <div v-for="pic in BusLicPic" style="width: 100px;height: 100px;float: left;margin:5px">
          <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt>
        </div>
      </Row>
      <Row style="margin-left: 5px" v-if="!disableEdit">
        <p style="margin:5px">
          <b>营业执照</b>
        </p>
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
        <Upload
          :show-upload-list="false"
          :default-file-list="blPics"
          :on-success="handleBLSuccess"
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
      </Row>

      <Row v-if="disableEdit">
        <p style="margin:5px">
          <b>公司开户单</b>
        </p>
        <div v-for="pic in contactPic" style="width: 100px;height: 100px;float: left;margin:5px">
          <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt>
        </div>
      </Row>
      <Row style="margin-left: 5px" v-if="!disableEdit">
        <p style="margin:5px">
          <b>公司开户单</b>
        </p>
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
      </Row>

      <Row v-if="disableEdit">
        <p style="margin:5px">
          <b>其他资质</b>
        </p>
        <div v-for="pic in otherPic" style="width: 100px;height: 100px;float: left;margin:5px">
          <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt>
        </div>
      </Row>
      <Row style="margin-left: 5px" v-if="!disableEdit">
        <p style="margin:5px">
          <b>其他资质</b>
        </p>
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
        <Upload
          :show-upload-list="false"
          :default-file-list="otherPics"
          :on-success="handleOtherSuccess"
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
      </Row>

      <!--<Row>-->
      <!--<div v-if="disableEdit">-->
      <!--<ButtonGroup vertical>-->
      <!--<div style="margin: 2px" @click="lookOrder"><Button long type="primary">查看订单</Button></div>-->
      <!--<div style="margin: 2px" @click="lookWallet"><Button long type="primary">查看钱包</Button></div>-->
      <!--</ButtonGroup>-->
      <!--</div>-->
      <!--</Row>-->
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">返回</Button>
        <Button type="primary" size="large" @click="ok" v-if="!disableEdit">确定</Button>
      </div>
    </Modal>

    <!--照片大图模块-->
    <Modal v-model="picModal" title="图片" cancel-text>
      <img style="width: 100%;height: 100%;padding: 5px 5px" :src="viewingPic" alt>
    </Modal>
  </div>
</template>
<script>
import vjs from "../../libs/validateRules.js";
var refType = 0; // 4-服务商 5-渠道商
export default {
  data() {
    return {
      uploadUrl: this.$util.uploadUrl,
      queryUrl: "/sysUser/list", // 获取列表
      queryUrlBusiness: "/sysUser/listBusiness", // 获取服务商
      editUrl: "/sysUser/edit",
      saveUrl: "/sysUser/save",
      oneUrl: "/sysUser/",
      saveRegionUrl: "/sysUser/relationRegion",
      currentid: 0,
      provinceList: [],
      cityList: [],
      townList: [],
      cityCode: {
        province: null,
        city: null,
        town: null
      },

      // methods: {
      //     check(index) {
      //         // 先取消所有选中项
      //         this.radios.forEach((item) => {
      //             item.isChecked = false;
      //         });
      //         //再设置当前点击项选中
      //         this.payType = this.radios[index].value;
      //         // 设置值，以供传递
      //         this.radios[index].isChecked = true;
      //         console.log(this.payType);
      //     },
      editCityCode: {
        province: null,
        city: null,
        town: null
      },

      queryBody: {
        // 请求体
        type: 4, // 服务商
        pagination: {
          page: 1,
          size: 10,
          total: 10
        }
      },
      queryBodys: {
        // 请求体
        type: 4, // 服务商
        pagination: {
          page: 1,
          size: 10,
          total: 10
        }
      },

      idPics: [],
      idReversePics: [],
      blPics: [],
      contactPics: [],
      otherPics: [],

      tableLoading: true,
      tableLoadingBusiness: true,
      userName: this.$util.getUserName(),
      userId: this.$util.getUserId(),

      verifyShow: false,
      verifyEntity: {},
      verifyId: null,
      verifyHist: "",
      modalTitle: "",

      disableEdit: true,
      editShow: false,
      bindService: false,
      saveFlag: false,

      viewModel: {
        agentInfo: {}
      }, // 编辑单个的实体

      okText: "",
      viewHeadImg: "",
      viewLevel: 0,
      idPic: [],
      BusLicPic: [],
      contactPic: [],
      otherPic: [],

      picModal: false,
      viewingPic: "",

      levelSelector: [],

      channelId: 0,

      auditSel: [
        { value: 0, label: "未审核" },
        { value: 1, label: "已提交待审核" },
        { value: 2, label: "通过" },
        { value: 3, label: "不通过" }
      ],
      typeSelector: [{ value: 1, label: "个人" }, { value: 2, label: "公司" }],

      funSelector: [
        { value: 1, label: "不接单" },
        { value: 2, label: "正在接单" },
        { value: 3, label: "工作中" }
      ],

      statusSelector: [
        { value: 1, label: "正常" },
        { value: 2, label: "停用" }
      ],

      confirmSel: [
        { value: 0, label: "未审核" },
        { value: 1, label: "提交资料待审核" },
        { value: 2, label: "审核通过" },
        { value: 3, label: "审核不通过" }
      ],

      ruleValidate: {
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        status: [
          {
            required: true,
            type: "number",
            message: "不能为空!",
            trigger: "change"
          }
        ],
        //                    type:[{ required: true,type:'number', message: '不能为空!', trigger: 'change' }],
        //                    idNum:[
        //                        { required: true, message: '不能为空', trigger: 'blur' }
        //                        ,{ validator: vjs.idV, trigger: 'blur'}
        //                    ],
        mobile: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: vjs.phoneV, trigger: "blur" }
        ],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],
        //                    cityCode:[{ required: true, message: '不能为空', trigger: 'change' }],
        //                    presentAddr: [{ required: true, message: '不能为空', trigger: 'blur'}],
        //                    emergencyName: [{ required: true, message: '不能为空', trigger: 'blur'}],
        //                    emergencyMobile: [{ required: true, message: '不能为空', trigger: 'blur'}],
        account: [{ required: true, message: "不能为空", trigger: "blur" }]
      },

      columns: [
        //

        { title: "id", key: "id", align: "center", width: 100 },
        { title: "账号", key: "account", align: "center", minWidth: 120 },
        { title: "服务商名称", key: "name", align: "center", minWidth: 120 },
        { title: "手机号码", key: "mobile", align: "center", minWidth: 120 },
        {
          title: "商户类型",
          key: "type",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            let self = this;
            let type = self.myList[params.index].type;
            if (type === 4)
              type = h("div", { attrs: { style: "color:green" } }, "服务商");
            else if (type === 5)
              type = h("div", { attrs: { style: "color:blue" } }, "渠道商");
            else type = h("div", { attrs: { style: "color:brown" } }, "未知");
            return type;
          }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            let self = this;
            let type = self.myList[params.index].status;
            if (type === 1)
              type = h("div", { attrs: { style: "color:green" } }, "正常");
            else if (type === 2)
              type = h("div", { attrs: { style: "color:red" } }, "停用");
            else type = h("div", { attrs: { style: "color:brown" } }, "未知");
            return type;
          }
        },
        { title: "注册时间", key: "ctime", align: "center", minWidth: 160 },
        {
          title: "操作",
          className: "actionColumn",
          key: "action",
          align: "center",
          fixed: "right",
          width: 240, // 操作
          render: (h, params) => {
            let arr = [];
            arr.push(
              h(
                "Button",
                {
                  props: { type: "primary", size: "small" },
                  on: {
                    click: () => {
                      this.view(params.index);
                    }
                  }
                },
                "查看"
              )
            );

            let access = this.$util.getAccess("order_delivery");
            let self = this;
            let type = self.myList[params.index].type;
            let id = self.myList[params.index].id;
            if (access) {
              if (type === 5) {
                arr.push(
                  h(
                    "Button",
                    {
                      props: { type: "success", size: "small" },
                      on: {
                        click: () => {
                          this.viewBusiness(id);
                        }
                      }
                    },
                    "选择服务商"
                  )
                );
              }
            }

            access = this.$util.getAccess("proxy_edit");

            if (access)
              arr.push(
                h(
                  "Button",
                  {
                    props: { type: "warning", size: "small" },
                    on: {
                      click: () => {
                        this.edit(params.index);
                      }
                    }
                  },
                  "修改"
                )
              );

            return h("div", arr);
          }
        }
      ],
      columnsBusiness: [
        // 字段
        // {
        //   type: "selection",
        //   width: 60,
        //   align: "center"
        // },
        // { title: "id", key: "id", align: "center", minWidth: 120 },
        {
          title: "选择",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Radio", {
                props: {
                  value: params.row.checkBox
                },
                on: {
                  "on-change": e => {
                    // console.log(e);
                    this.myListBusiness.forEach(items => {
                      this.$set(items, "checkBox", false);
                    });
                    this.myListBusiness[params.index].checkBox = e; //再将勾选的对象的checkBox设置为true
                  }
                }
              })
            ]);
          }
        },
        { title: "手机号码", key: "mobile", align: "center", minWidth: 160 },
        { title: "服务商名称", key: "name", align: "center", minWidth: 160 },
        { title: "账号", key: "account", align: "center", minWidth: 160 },
        // {
        //   title: "操作",
        //   className: "actionColumn",
        //   key: "action",
        //   align: "center",
        //   fixed: "right",
        //   width: 180, // 操作
        //   render: (h, params) => {
        //     let arr = [];
        //     let access = this.$util.getAccess("order_delivery");
        //     let self = this;
        //     let facilitatorId = self.myListBusiness[params.index].id;
        //     arr.push(
        //       h(
        //         "Button",
        //         {
        //           props: { type: "warning", size: "small" },
        //           on: {
        //             click: () => {
        //               this.editFacilitator(facilitatorId);
        //             }
        //           }
        //         },
        //         "修改"
        //       )
        //     );
        //     return h("div", arr);
        //   }
        // }
      ],
      myListBusiness: [],
      myList: [],
      saveEntity: {},

      regionList: []
    };
  },
  created() {
    let self = this;
    let cityCode = 100000;
    let levelType = 1;
    let prop = "provinceList";
    self.$util.cityCodeSelect(self, cityCode, levelType, prop);
    // console.log(this.bu)
    let entity = JSON.parse(sessionStorage.getItem("lookingCleaner"));
    if (entity !== null && entity !== undefined) {
      self.viewModel = entity;
      self.viewHeadImg = self.viewModel.picLogo;
      self.viewLevel = self.viewModel.level;

      // 照片
      self.idPic = self.$util.strToPicArr(self.viewModel.picId0);
      self.idPic = self.idPic.concat(
        self.$util.strToPicArr(self.viewModel.picId1)
      );
      self.BusLicPic = self.$util.strToPicArr(
        self.viewModel.picBusinessLicense
      );
      self.contactPic = self.$util.strToPicArr(self.viewModel.picContract);
      self.otherPic = self.$util.strToPicArr(self.viewModel.picOther);
      self.editShow = true;
      sessionStorage.removeItem("lookingCleaner");
    }
  },
  mounted() {
    let self = this;
    self.queryMyList();
  },
  methods: {
    doConfirm() {
      //   console.log(this.myListBusiness);
      let id = 0;
      for (let index = 0; index < this.myListBusiness.length; index++) {
        if (this.myListBusiness[index].checkBox) {
          id = this.myListBusiness[index].id;
        }
      }
      this.editFacilitator(id);
    },
    // 省份确定城市
    selProvince(val) {
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

      self.$util.cityCodeSelect(self, val, 2, "cityList");
    },
    selCity(val) {
      let self = this;

      if (self.editShow) {
        // 非搜索列表情况下
        self.editCityCode.town = null;
      } else {
        // 搜索列表情况下
        self.cityCode.town = null;
      }

      self.$util.cityCodeSelect(self, val, 3, "townList");
    },

    save() {
      let self = this;
      self.saveFlag = true;

      self.viewModel = { agentInfo: {} };

      self.modalTitle = "添加服务商";
      self.viewHeadImg = self.viewModel.picLogo;
      self.viewLevel = self.viewModel.level;
      refType = 4; // 打开了服务商

      //                self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
      //                self.selProvince(self.viewModel.province);
      //                self.selCity(self.viewModel.city);
      //                self.editCityCode.province = self.viewModel.province;
      //                self.editCityCode.city = self.viewModel.city;
      //                self.editCityCode.town = self.viewModel.town;

      // 照片
      self.idPics = self.$util.strToFiles(self.viewModel.picId0);
      self.idReversePics = self.$util.strToFiles(self.viewModel.picId1);
      self.blPics = self.$util.strToFiles(self.viewModel.picBusinessLicense);
      self.otherPics = self.$util.strToFiles(self.viewModel.picOther);
      self.contactPics = self.$util.strToFiles(self.viewModel.picContract);

      self.okText = "确定";
      self.$refs.viewModel.resetFields();
      self.disableEdit = false;
      self.editShow = true;
    },
    saveType5() {
      let self = this;
      self.saveFlag = true;
      self.viewModel = { agentInfo: {} };

      self.modalTitle = "添加渠道商";
      refType = 5; // 打开了渠道商
      self.viewHeadImg = self.viewModel.picLogo;
      self.viewLevel = self.viewModel.level;

      // self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
      // self.selProvince(self.viewModel.province);
      // self.selCity(self.viewModel.city);
      // self.editCityCode.province = self.viewModel.province;
      // self.editCityCode.city = self.viewModel.city;
      // self.editCityCode.town = self.viewModel.town;

      // 照片
      self.idPics = self.$util.strToFiles(self.viewModel.picId0);
      self.idReversePics = self.$util.strToFiles(self.viewModel.picId1);
      self.blPics = self.$util.strToFiles(self.viewModel.picBusinessLicense);
      self.otherPics = self.$util.strToFiles(self.viewModel.picOther);
      self.contactPics = self.$util.strToFiles(self.viewModel.picContract);

      self.okText = "确定";
      self.$refs.viewModel.resetFields();
      self.disableEdit = false;
      self.editShow = true;
    },
    lookOrder() {
      if (this.$util.isEmpty(this.viewModel.name)) {
        this.$Message.warning("该服务商没有订单!");
        return;
      }
      sessionStorage.setItem("lookingCleaner", JSON.stringify(this.viewModel));
      this.$router.push({
        name: "order_order",
        params: { cleanerName: this.viewModel.name }
      });
    },
    lookWallet() {
      sessionStorage.setItem("lookingCleaner", JSON.stringify(this.viewModel));
      this.$router.push({ name: "wal_wal", params: { id: this.viewModel.id } });
    },
    changePage(val) {
      let self = this;
      self.tableLoading = true;
      self.tableLoadingBusiness = true;
      self.queryBody.pagination.page = val;
      self.queryMyList();
    },
    BusinessPage(val) {
      let self = this;

      self.tableLoadingBusiness = true;
      self.queryBodys.pagination.page = val;
      self.viewBusiness();
    },
    queryMyListClick() {
      let self = this;
      self.queryBody.pagination = { page: 1, total: 10, size: 10 };
      self.queryMyList();
    },

    queryBusiness() {
      let self = this;
      self.queryBodys.pagination = { page: 1, total: 10, size: 10 };
      self.viewBusiness();
    },
    queryMyList() {
      let self = this;
      self.$util.cityCodeBeforeQuery(self);

      self.tableLoading = true;

      self.$util.deleteBlankProp(self.queryBody);

      self.$axios.post(self.queryUrl, self.queryBody).then(res => {
        self.queryBody.pagination = res.pagination;
        delete self.queryBody.pagination.currentIndex;
        self.myList = res.list;
        self.tableLoading = false;
      });
    },
    ok() {
      let self = this;

      if (self.$util.isEmpty(self.editCityCode.town)) {
        self.viewModel.cityCode = self.editCityCode.city;
      } else if (!self.$util.isEmpty(self.editCityCode.town)) {
        self.viewModel.cityCode = self.editCityCode.town;
      }

      // if (self.$util.isEmpty(self.viewModel.cityCode)){
      //     self.$Message.error({content: '请选择地区!'});
      //     return;
      // }

      self.$refs.viewModel.validate(e => {
        if (e) {
          self.viewModel.agentInfo.picId0 = self.$util.filesToStr(self.idPics);
          self.viewModel.agentInfo.picId1 = self.$util.filesToStr(
            self.idReversePics
          );

          if (self.$util.isEmpty(self.viewModel.agentInfo.picId0)) {
            self.$Message.error("请上传身份证正面照片!");
          } else if (self.$util.isEmpty(self.viewModel.agentInfo.picId1)) {
            self.$Message.error("请上传身份证反面照片!");
          } else {
            delete self.viewModel.ctime;
            delete self.viewModel.utime;
            delete self.viewModel.registTime;

            self.viewModel.agentInfo.picBusinessLicense = self.$util.filesToStr(
              self.blPics
            );
            self.viewModel.agentInfo.picContract = self.$util.filesToStr(
              self.contactPics
            );
            self.viewModel.agentInfo.picOpen = self.$util.filesToStr(
              self.otherPics
            );

            if (self.disableEdit === false) {
              if (self.saveFlag) {
                // 添加
                self.viewModel.type = refType;
                self.$axios.post(self.saveUrl, self.viewModel).then(res => {
                  self.$Notice.success({ title: "添加", desc: "添加成功" });
                  self.editShow = false;
                  self.queryMyList();
                  self.regionList = [];
                });
              } else {
                // 编辑
                self.$axios.post(self.editUrl, self.viewModel).then(res => {
                  self.$Notice.success({ title: "编辑", desc: "保存成功" });
                  self.editShow = false;
                  self.queryMyList();
                  self.regionList = [];
                });
              }
            }
          }
        } else {
          self.$Message.error("请输入完整信息");
        }
      });
    },
    cancel() {
      let self = this;
      self.editShow = false;
      self.regionList = [];
    },
    relateRegion() {
      let self = this;
      if (self.$util.isEmpty(self.editCityCode.town)) {
        self.viewModel.cityCode = self.editCityCode.city;
      } else if (!self.$util.isEmpty(self.editCityCode.town)) {
        self.viewModel.cityCode = self.editCityCode.town;
      }

      if (self.$util.isEmpty(self.viewModel.cityCode)) {
        self.$Message.error({ content: "请选择地区!" });
        return;
      }

      if (self.$util.isEmpty(self.viewModel.agentInfo)) {
        self.$Message.error({ content: "还不是服务商!" });
      }

      let entity = {};
      entity.agentId = self.viewModel.agentInfo.agentId;
      entity.cityCodes = [self.viewModel.cityCode];

      self.$axios.post(self.saveRegionUrl, entity).then(res => {
        self.$Notice.success({ title: "服务商", desc: "代理区域成功" });
        self.editShow = false;
        self.queryMyList();
      });
    },
    handleOneRes(res) {
      let self = this;
      let regionList = res.agentInfo.agentRegionList;

      self.editCityCode.city = null;
      self.editCityCode.province = null;
      self.editCityCode.town = null;

      self.regionList.length = 0;
      if (!self.$util.isEmpty(regionList)) {
        //                    let lastOne = regionList.splice(regionList.length - 1, 1)[0];

        regionList.forEach(e => {
          self.$util.getProCityTown(e, e.cityCode);
          // e.agentStatus = e.agentStatus === 1? "有效": "无效";
          e.agentStatus = e.agentStatus === 1 ? 1 : 2; // 返回值不能为String类型。强制转换错误
          self.regionList.push(e);
        });

        // self.$util.getProCityTown(self.viewModel, lastOne.cityCode);
        // self.selProvince(self.viewModel.province);
        // self.selCity(self.viewModel.city);
        // self.editCityCode.province = self.viewModel.province;
        // self.editCityCode.city = self.viewModel.city;
        // self.editCityCode.town = self.viewModel.town;
      }

      self.$refs.viewModel.resetFields();
    },
    view(index) {
      let self = this;

      self.$axios.get(self.oneUrl + self.myList[index].id).then(res => {
        self.viewModel = res;

        self.handleOneRes(res);

        self.modalTitle = "服务商详情";
        // 照片
        self.idPic = self.$util.strToPicArr(self.viewModel.agentInfo.picId0);
        self.idPic = self.idPic.concat(
          self.$util.strToPicArr(self.viewModel.agentInfo.picId1)
        );
        self.BusLicPic = self.$util.strToPicArr(
          self.viewModel.agentInfo.picBusinessLicense
        );
        self.contactPic = self.$util.strToPicArr(
          self.viewModel.agentInfo.picOpen
        );
        self.otherPic = self.$util.strToPicArr(
          self.viewModel.agentInfo.picOther
        );

        self.okText = "确定";
        self.disableEdit = true;
        self.editShow = true;
      });
    },
    edit(index) {
      let self = this;

      self.$axios.get(self.oneUrl + self.myList[index].id).then(res => {
        self.modalTitle = "修改服务商";
        self.viewModel = res;

        self.handleOneRes(res);

        // 照片
        self.idPics = self.$util.strToFiles(self.viewModel.agentInfo.picId0);
        self.idReversePics = self.$util.strToFiles(
          self.viewModel.agentInfo.picId1
        );
        self.blPics = self.$util.strToFiles(
          self.viewModel.agentInfo.picBusinessLicense
        );
        self.otherPics = self.$util.strToFiles(
          self.viewModel.agentInfo.picOther
        );
        self.contactPics = self.$util.strToFiles(
          self.viewModel.agentInfo.picOpen
        );

        self.okText = "确定";
        self.disableEdit = false;
        self.editShow = true;
        self.saveFlag = false;
      });
    },
    viewBusiness(id) {
      let self = this;
      self.modalTitle = "选择所属服务商";
      // self.$Message.error({content: '还不是服务商!'+id});
      self.$util.cityCodeBeforeQuery(self);

      self.channelId = id;

      self.tableLoadingBusiness = true;
      self.$util.deleteBlankProp(self.queryBodys);
      self.$axios.post(self.queryUrlBusiness, self.queryBodys).then(res => {
        self.queryBodys.pagination = res.pagination;
        delete self.queryBodys.pagination.currentIndex;
        self.myListBusiness = res.list;
        self.$set(self.myListBusiness[0], "checkBox", true);
        self.bindService = true;
        self.tableLoadingBusiness = false;
      });
    },
    editFacilitator(facilitatorId) {
      let self = this;

      let entity = {};

      entity.id = facilitatorId; //服务商
      entity.providerId = self.channelId; //渠道商
      //    self.$Message.error({content: '还不是服务商!'+self.channelId});

      self.$axios.post(self.editUrl, entity).then(res => {
        self.$Notice.success({ title: "编辑", desc: "保存成功" });
        self.bindService = false;
        self.queryMyList();
      });
    },

    viewPic(picUrl) {
      let self = this;
      self.picModal = true;
      self.viewingPic = picUrl;
    },

    handleIdSuccess(res, file) {
      let self = this;
      if (res.success === true) {
        file.url = res.result;
        self.idPics.push(file);
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
    handleIdReverseSuccess(res, file) {
      let self = this;
      if (res.success === true) {
        file.url = res.result;
        self.idReversePics.push(file);
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
    handleBLSuccess(res, file) {
      let self = this;
      if (res.success === true) {
        file.url = res.result;
        self.blPics.push(file);
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
    handleOtherSuccess(res, file) {
      let self = this;
      if (res.success === true) {
        file.url = res.result;
        self.otherPics.push(file);
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

    handleIdRemove(file) {
      let self = this;
      self.idPics.splice(self.idPics.indexOf(file), 1);
    },
    handleIdReverseRemove(file) {
      let self = this;
      self.idReversePics.splice(self.idReversePics.indexOf(file), 1);
    },
    handleBlRemove(file) {
      let self = this;
      self.blPics.splice(self.blPics.indexOf(file), 1);
    },
    handleContactRemove(file) {
      let self = this;
      self.contactPics.splice(self.contactPics.indexOf(file), 1);
    },
    handleOtherRemove(file) {
      let self = this;
      self.otherPics.splice(self.otherPics.indexOf(file), 1);
    },

    handleView(url) {
      let self = this;

      self.viewingPic = url;
      self.picModal = true;
    },
    handleFormatError(file) {
      let self = this;
      self.$Notice.warning({
        title: "上传图片",
        desc: file.name + "格式不对, 请上传jpg,jpeg或png"
      });
    }
  }
};
</script>

