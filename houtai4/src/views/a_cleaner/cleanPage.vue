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
.loadbox{position:absolute;width:100%;height:100%;
  background:rgba(0,0,0,.2);
  z-index: 9999999;}
.loadbox img{width:100px;height:100px;position:absolute;top:50%;left:50%;margin-left:-50px;margin-top:-50px;}
</style>
<template>
  <div style="padding: 5px">
    <div class="loadbox" :hidden="imgshow" >
      <img src="../../images/d161165956e23.gif"  class="loadingimg" />
    </div>
    <Card>
      <Row>
        <span @keyup.enter="queryMyListClick">
          <Input
            placeholder="请输入保洁员名称..."
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
        <Select
          placeholder="工作状态"
          v-model="queryBody.orderStatus"
          style="width:200px;padding: 3px"
          clearable
        >
          <Option v-for="item in funSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select
          placeholder="保洁员类型"
          v-model="queryBody.type"
          style="width:200px;padding: 3px"
          clearable
        >
          <Option
            v-for="item in typeSelector"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
        <Select
          placeholder="保洁员等级"
          v-model="queryBody.level"
          style="width:200px;padding: 3px"
          clearable
        >
          <Option
            v-for="item in levelSelector"
            :value="item.levelName"
            :key="item.levelName"
          >{{ item.levelName }}</Option>
        </Select>
        <Select
          placeholder="在线状态"
          v-model="queryBody.onlineStatus"
          style="width:200px;padding: 3px"
          clearable
        >
          <Option :value="2">在线</Option>
          <Option :value="1">不在线</Option>
        </Select>

        <Select
          placeholder="审核状态"
          v-model="queryBody.auditStatus"
          style="width:200px;padding: 3px"
          clearable
        >
          <Option v-for="item in auditSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>注册时间:
        <DatePicker
          type="datetime"
          placeholder="开始时间"
          v-model="queryBody.registTime"
          style="width: 150px;padding: 3px"
          clearable
        />-
        <DatePicker
          type="datetime"
          @on-change="registrationChange"
          placeholder="截止时间"
          v-model="queryBody.registTimeEnd"
          style="width: 150px;padding: 3px"
          clearable
        />

        <Row style="padding: 3px" id="address_row">
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
        <span style="margin-left: 3px;">
          <Button type="success" @click="exportCleanExcel">导出excel</Button>
        </span>
        <span style="margin-left: 3px;" v-if="refType==5">
          <Button type="success" @click="showBox = true">添加</Button>
        </span>
      </Row>
      <Row class="margin-top-10 searchable-table-con1">
        <Table border :columns="columns" :data="myList" :loading="tableLoading" no-data-text="暂无数据"></Table>
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
      <Row type="flex" justify="center" align="middle">
        <Col span="11">
          <div style="width: 100px;height: 105px;margin: 5px auto;border:2px solid">
            <img style="height: 100%; width: 100%;padding: 2px" :src="viewHeadImg" alt>
          </div>
        </Col>
        <Col span="11" style="height: 100%">
          <Select
            :placeholder="viewModel.level === null || viewModel.level === ''? '暂无等级': viewModel.level"
            v-model="viewModel.level"
            style="width:200px;padding: 3px"
            :disabled="disableEdit"
            clearable
          >
            <Option
              v-for="item in levelSelector"
              :value="item.levelName"
              :key="item.levelName"
            >{{ item.levelName+',分数区间:'+item.limitMin+'-'+item.limitMax }}</Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Form ref="viewModel" :rules="ruleValidate" :model="viewModel" :labelWidth="90" inline>
          <FormItem prop="name" label="姓名">
            <Input type="text" v-model="viewModel.name" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="idNum" label="身份证">
            <Input type="text" v-model="viewModel.idNum" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="mobile" label="手机号码">
            <Input type="text" v-model="viewModel.mobile" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="password" label="登录密码">
            <Input type="text" v-model="viewModel.password" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="user" label="公司名称">
            <Input type="text" v-model="viewModel.companyName" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="user" label="营业执照">
            <Input type="text" v-model="viewModel.idBusinessLicense" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="user" label="公司地址">
            <Input type="text" v-model="viewModel.addr" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="user" label="开户行">
            <Input type="text" v-model="viewModel.bankName" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="account" label="基本帐号">
            <Input type="text" v-model="viewModel.bankAccountNo" :readonly="disableEdit"></Input>
          </FormItem>
          <FormItem prop="user" label="微信openid">
            <Input type="text" v-model="viewModel.wxOpenId" readonly></Input>
          </FormItem>
          <FormItem prop="user" label="微信unionid">
            <Input type="text" v-model="viewModel.wxUnionId" readonly></Input>
          </FormItem>
          <FormItem prop="user" label="qqopenid">
            <Input type="text" v-model="viewModel.qqOpenId" readonly></Input>
          </FormItem>

          <FormItem prop="presentAddr" label="现住址">
            <Input type="text" v-model="viewModel.presentAddr"></Input>
          </FormItem>
          <FormItem prop="emergencyName" label="紧急联系人">
            <Input type="text" v-model="viewModel.emergencyName"></Input>
          </FormItem>
          <FormItem prop="emergencyMobile" label="紧急联系电话">
            <Input type="text" v-model="viewModel.emergencyMobile"></Input>
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
          </FormItem>

          <FormItem prop="user" label="审核状态">
            <Select
              v-model="viewModel.auditStatus"
              :style="{width: $util.width}"
              :disabled="disableEdit"
            >
              <Option
                v-for="item in auditSel"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem prop="user" label="保洁员类型">
            <Select v-model="viewModel.type" :style="{width: $util.width}" :disabled="disableEdit">
              <Option
                v-for="item in typeSelector"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem prop="user" label="状态">
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

          <FormItem prop="user" label="注册时间" v-if="disableEdit">
            <Input type="text" v-model="viewModel.ctime" :readonly="true"></Input>
          </FormItem>
          <!--123123123-->
          <FormItem prop="user" label="修改时间" v-if="disableEdit">
            <Input type="text" v-model="viewModel.utime" :readonly="true"></Input>
          </FormItem>

          <Row>
            <FormItem prop="remark" label="备注">
              <Input type="textarea" v-model="viewModel.remark" :readonly="true"></Input>
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
          <b>公司合同</b>
        </p>
        <div v-for="pic in contactPic" style="width: 100px;height: 100px;float: left;margin:5px">
          <img style="height: 100%; width: 100%;float: left" @click="viewPic(pic)" :src="pic" alt>
        </div>
      </Row>
      <Row style="margin-left: 5px" v-if="!disableEdit">
        <p style="margin:5px">
          <b>公司合同</b>
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

      <Row>
        <div v-if="disableEdit">
          <ButtonGroup vertical>
            <div style="margin: 2px" @click="lookOrder">
              <Button long type="primary">查看订单</Button>
            </div>
            <div style="margin: 2px" @click="lookWallet">
              <Button long type="primary">查看钱包</Button>
            </div>
          </ButtonGroup>
        </div>
      </Row>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">返回</Button>
        <Button type="primary" size="large" @click="ok" v-if="!disableEdit">确定</Button>
      </div>
    </Modal>

    <!--审核模块-->
    <Modal :width="420" v-model="verifyShow" title="保洁员审核" :closable="false" :mask-closable="false">
      <Row>
        <div>
          <b>审核记录:</b>
        </div>
        <Input type="textarea" v-model="verifyHist" :rows="8" readonly></Input>
      </Row>
      <Row style="margin-top: 5px; margin-bottom: 5px">
        <p>
          <b>审核人: {{userName}}</b>
        </p>
      </Row>

      <Row>
        <Select
          placeholder="认证类型"
          v-model="verifyEntity.auditStatus"
          style="margin-top: 5px"
          clearable
        >
          <Option v-for="item in confirmSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Row>
      <Row style="margin-top: 10px">
        <Input
          style
          type="textarea"
          v-model="verifyEntity.auditRemark"
          :rows="8"
          placeholder="请输入审核结果..."
        ></Input>
      </Row>
      <div slot="footer">
        <Button type="text" size="large" @click="verifyCancel">返回</Button>
        <Button type="primary" size="large" @click="verifyOk">确定</Button>
      </div>
    </Modal>

    <!--服务商审核模块-->
    <Modal
      :width="420"
      v-model="verifyShowFuShou"
      title="保洁员审核"
      :closable="false"
      :mask-closable="false"
    >
      <Row>
        <div>
          <b>审核记录:</b>
        </div>
        <Input type="textarea" v-model="verifyHists" :rows="8" readonly></Input>
      </Row>
      <Row style="margin-top: 5px; margin-bottom: 5px">
        <p>
          <b>审核人: {{userName}}</b>
        </p>
      </Row>

      <Row>
        <Select
          placeholder="认证类型"
          v-model="verifyEntity.facilitatorStatus"
          style="margin-top: 5px"
          clearable
        >
          <Option
            v-for="item in confirmSelService"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
      </Row>
      <Row style="margin-top: 10px">
        <Input
          style
          type="textarea"
          v-model="verifyEntity.auditRemark"
          :rows="8"
          placeholder="请输入审核结果..."
        ></Input>
      </Row>
      <div slot="footer">
        <Button type="text" size="large" @click="verifyCancelFuShou">返回</Button>
        <Button type="primary" size="large" @click="verifyFushouOk">确定</Button>
      </div>
    </Modal>

    <!--照片大图模块-->
    <Modal v-model="picModal" title="图片" cancel-text>
      <img style="width: 100%;height: 100%;padding: 5px 5px" :src="viewingPic" alt>
    </Modal>
    <div
      class="addBox"
      style="position:absolute;right:0;top:0;z-index:999;width:100%"
      v-show="showBox"
    >
      <i-button
        type="text"
        shape="circle"
        icon="close"
        class="closeAddBox"
        style="position:absolute;right:10px;top:10px;z-index:999"
        @click="showBox = false"
      ></i-button>
      <cleaner-reg v-on:successData="getChildData"></cleaner-reg>
    </div>
  </div>
</template>
<script>
import vjs from "../../libs/validateRules.js";
import Cookies from "js-cookie";
import cleanerReg from "./cleanerReg.vue";
var disposable = true;
export default {
  data() {
    return {
      uploadUrl: this.$util.uploadUrl,
      queryUrl: "/cleaner/list", //获取列表
      auditUrl: "/cleaner/audit",
      editUrl: "/cleaner/edit",
      oneUrl: "/cleaner/",
      showBox: false,
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

      queryBody: {
        //请求体
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
        refType: Cookies.get("refType"),

      tableLoading: true,
      userName: this.$util.getUserName(),
      userId: this.$util.getUserId(),

      verifyShow: false,
      verifyShowFuShou: false,
      verifyEntity: {},
      verifyId: null,
      verifyHist: "",
      verifyHists: "",
      modalTitle: "",

      disableEdit: true,
      editShow: false,
      viewModel: {}, //编辑单个的实体

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

      confirmSelService: [
        { value: 0, label: "培训未审核" },
        { value: 1, label: "提交资料待审核" },
        { value: 2, label: "培训审核通过" },
        { value: 3, label: "培训审核不通过" }
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
        type: [
          {
            required: true,
            type: "number",
            message: "不能为空!",
            trigger: "change"
          }
        ],
        idNum: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: vjs.idV, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: vjs.phoneV, trigger: "blur" }
        ],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],
        //                    cityCode:[{ required: true, message: '不能为空', trigger: 'change' }],
        presentAddr: [{ required: true, message: "不能为空", trigger: "blur" }],
        emergencyName: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        emergencyMobile: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        account: [{ required: true, message: "不能为空", trigger: "blur" }]
      },

      columns: [
        //字段
        { title: "id", key: "id", align: "center", minWidth: 120, width: 120 },
        {
          title: "账号",
          key: "account",
          align: "center",
          minWidth: 120,
          width: 160
        },
        {
          title: "姓名",
          key: "name",
          align: "center",
          minWidth: 120,
          width: 150
        },
        {
          title: "手机号码",
          key: "mobile",
          align: "center",
          minWidth: 120,
          width: 180
        },


        {
          title: "工作状态",
          key: "orderStatus",
          align: "center",
          minWidth: 120,
          width: 170,
          render: (h, params) => {
            let self = this;
            let type = params.row.orderStatus;
            if (type === 1)
              type = h("div", { attrs: { style: "color:brown" } }, "不接单");
            else if (type === 2)
              type = h("div", { attrs: { style: "color:green" } }, "正在接单");
            else if (type === 3)
              type = h("div", { attrs: { style: "color:red" } }, "工作中");
            else type = h("div", { attrs: { style: "color:brown" } }, "未知");
            return type;
          }
        },

        {title: '地址', key: 'presentAddr', minWidth: 50, width: 200, align: 'center'},
        {
          title: "注册类型",
          key: "registType",
          align: "center",
          minWidth: 120,
          width: 180,
          render: (h, params) => {
            let self = this;
            let type = self.myList[params.index].registType;
            if (type === 1)
              type = h("div", { attrs: { style: "color:green" } }, "自注册");
            else if (type === 2)
              type = h("div", { attrs: { style: "color:blue" } }, "邀请入驻");
            else type = h("div", { attrs: { style: "color:brown" } }, "未知");
            return type;
          }
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          minWidth: 120,
          width: 180,
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
        {
          title: "审核状态",
          key: "auditStatus",
          align: "center",
          minWidth: 120,
          width: 180,
          render: (h, params) => {
            //审核状态：0未审核,1提交资料待审核,2审核通过,3审核不通过
            let self = this;
            let type = self.myList[params.index].auditStatus;
            if (type === 1)
              type = h("div", { attrs: { style: "color:brown" } }, "待审核");
            else if (type === 2)
              type = h("div", { attrs: { style: "color:green" } }, "通过");
            else if (type === 3)
              type = h("div", { attrs: { style: "color:red" } }, "不通过");
            else if (type === 0)
              type = h("div", { attrs: { style: "color:#c5c549" } }, "未审核");
            else type = h("div", { attrs: { style: "color:brown" } }, "未知");
            return type;
          }
        },
        {
          title: "服务商审核状态",
          key: "facilitatorStatus",
          align: "center",
          minWidth: 120,
          width: 180,
          render: (h, params) => {
            //审核状态：0未审核,1提交资料待审核,2审核通过,3审核不通过
            let self = this;
            let type = self.myList[params.index].facilitatorStatus;

            if (type === 1)
              type = h("div", { attrs: { style: "color:brown" } }, "待审核");
            else if (type === 2)
              type = h("div", { attrs: { style: "color:green" } }, "通过");
            else if (type === 3)
              type = h("div", { attrs: { style: "color:red" } }, "不通过");
            else if (type === 0)
              type = h("div", { attrs: { style: "color:#c5c549" } }, "未审核");
            else type = h("div", { attrs: { style: "color:brown" } }, "未知");
            return type;
          }
        },

        {
          title: "注册时间",
          key: "registTime",
          align: "center",
          minWidth: 160,
          width: 180
        },
        {
          title: "操作",
          className: "actionColumn",
          key: "action",
          align: "center",
          fixed: "right",
          width: 180, //操作
          render: (h, params) => {
            let arr = [];
            let self = this;
            let refTypes = Cookies.get("refType");
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

            let access = this.$util.getAccess("clean_audit");
            let t = this.myList[params.index].auditStatus === 1;
            let ts = this.myList[params.index].facilitatorStatus === 1;
            let providerAudit = this.myList[params.index].facilitatorStatus;
              let auditStatus = this.myList[params.index].auditStatus;

            if (access)
              if (refTypes == 4) {
                  if(auditStatus == 0){
                arr.push(
                  h(
                    "Button",
                    {
                      props: { type: "warning", size: "small", disabled: ts },
                      on: {
                        click: () => {
                          this.verifyFacilitator(params.index);
                        }
                      }
                    },
                    "培训审核"
                  )
                );
                  }else{
                      arr.push(
                          h(
                              "Button",
                              {
                                  props: { type: "warning", size: "small", disabled: !ts },
                                  on: {
                                      click: () => {
                                          this.verifyFacilitator(params.index);
                                      }
                                  }
                              },
                              "培训审核"
                          )
                      );
                  }
              } else {
                if (providerAudit == 1) {

                  arr.push(
                    h(
                      "Button",
                      {
                        props: { type: "warning", size: "small", disabled: ts },
                        on: {
                          click: () => {
                            this.verify(params.index);
                          }
                        }
                      },
                      "公司审核"
                    )
                  );
                } else {
                  arr.push(
                    h(
                      "Button",
                      {
                        props: { type: "warning", size: "small", disabled: !t },
                        on: {
                          click: () => {
                            this.verify(params.index);
                          }
                        }
                      },
                      "公司审核"
                    )
                  );
                }
              }
            access = this.$util.getAccess("clean_edit");
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
      myList: [],

      levelUrl: "/level/select",
      levelList: [],
      imgshow:true
    };
  },

  //服务改变日期
  registrationChange(formatedDate, date) {
    let self = this;
    self.baseChange(formatedDate, "registTimeEnd");
  },
  baseChange(date, property) {
    let self = this;
    if (!self.$util.isEmpty(date)) {
      let split = date.split(" ");
      if (split[1] !== "00:00:00") {
        self.queryBody.req[property] = new Date(date);
      } else {
        self.queryBody.req[property] = new Date(split[0] + " 23:59:59");
      }
    }
  },
  components: { cleanerReg },
  created() {
      console.log(this.refType)
    let self = this;
    let cityCode = 100000;
    let levelType = 1;
    let prop = "provinceList";
    self.$util.cityCodeSelect(self, cityCode, levelType, prop);

    let entity = JSON.parse(sessionStorage.getItem("lookingCleaner"));
    if (entity !== null && entity !== undefined) {
      self.viewModel = entity;
      self.viewHeadImg = self.viewModel.picLogo;
      self.viewLevel = self.viewModel.level;

      //照片
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
      let refTypes = Cookies.get("refType");
    let self = this;
    // this.data.refType = refType
      console.log(this)

      self.queryMyList();
    //查询所有保洁员等级

    self.$axios.post(self.levelUrl).then(res => {
      self.levelSelector = res;
    });
  },
  methods: {
    //提交添加返回的数据
    getChildData(data) {
      console.log(data);
      if (data) {
        this.showBox = false;
        this.queryMyList();
      }
    },
    //省份确定城市
    selProvince(val) {
      let self = this;

      if (self.editShow) {
        //非搜索列表情况下
        self.editCityCode.city = null;
        self.editCityCode.town = null;
      } else {
        //搜索列表情况下
        self.cityCode.city = null;
        self.cityCode.town = null;
      }

      self.$util.cityCodeSelect(self, val, 2, "cityList");
    },
    exportCleanExcel() {
      let self = this;
      if (self.$util.isEmpty(self.queryBody.registTime)) {
        self.$Message.error({ content: "请选择注册时间始!" });
        return;
      }
      if (self.$util.isEmpty(self.queryBody.registTimeEnd)) {
        self.$Message.error({ content: "请选择注册时间止!" });
        return;
      }
      let queryBody = { req: {} };

      queryBody.req.registTime = self.queryBody.registTime.formatDef();
      queryBody.req.registTimeEnd = self.queryBody.registTimeEnd.formatDef();
      if (self.$util.isEmpty(self.cityCode.town) && !self.$util.isEmpty(self.cityCode.city)) {
       queryBody.req.cityCodes = [self.cityCode.city];
      } else if (!self.$util.isEmpty(self.cityCode.town)) {
      queryBody.req.cityCodes = [self.cityCode.town];
      } else {
        delete queryBody.req.cityCodes;
      }


      queryBody.req.refType = Cookies.get("refType");
      queryBody.req.id = Cookies.get("userId");

      //数据分割
      // let cityCodes = Cookies.get("cityCode");
      // if (cityCodes !== undefined) {
      //   let cityList = self.$util.strConvertArray(cityCodes);
      //   if (cityList[0] !== "null" && cityList[0] !== "") {
      //     queryBody.req.cityCode = cityList[0];
      //   }
      // }
    //  self.$Message.error({content: '还不是服务商!'+cityCodes});
      let axios = self.$axios.create({
        baseURL: self.$axios.defaults.baseURL
      });
      this.imgshow=false;
      axios({
        // 用axios发送post请求
        method: "post",
        url: "cleaner/export", // 请求地址
        data: queryBody, // 参数
        responseType: "blob" // 表明返回服务器返回的数据类型
      }).then(res => {
        // 处理返回的文件流
        let blob = new Blob([res.data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型

        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = "保洁员信息明细.xls"; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
        self.imgshow=true
      });
    },
    selCity(val) {
      let self = this;

      if (self.editShow) {
        //非搜索列表情况下
        self.editCityCode.town = null;
      } else {
        //搜索列表情况下
        self.cityCode.town = null;
      }

      self.$util.cityCodeSelect(self, val, 3, "townList");
    },

    lookOrder() {
      if (this.$util.isEmpty(this.viewModel.name)) {
        this.$Message.warning("该保洁员没有订单!");
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
      self.queryBody.pagination.page = val;
      self.queryMyList();
    },
    queryMyListClick() {
      let self = this;
      self.queryBody.pagination = { page: 1, total: 10, size: 10 };
      self.queryMyList();
    },
    queryMyList() {
      let self = this;

      let refTypes = Cookies.get("refType");

      // if (refTypes != 4) {
        //从 Cookies 中查询 有没有地区编码
      //   let cityCodes = Cookies.get("cityCode");
      //   if (cityCodes !== undefined) {
      //     let cityList = self.$util.strConvertArray(cityCodes);
      //     if (cityList[0] !== "null" && cityList[0] !== "") {
      //       //删除元素
      //       if (cityList.length > 0) {
      //         let canvas = document.querySelector("#address_row");
      //         if (cityCodes !== null && canvas !== null) {
      //           canvas.remove();
      //         }
      //       } else {
      //         // 初始化查询 地区 条件
      //         self.$util.cityCodeBeforeQuery(self);
      //       }
      //       self.queryBody.cityCode = cityList[0];
      //     }
      //   }
      // }
      self.$util.cityCodeBeforeQuery(self);
      self.tableLoading = true;
      self.queryBody.refType = Cookies.get("refType");
      self.queryBody.id = Cookies.get("userId");

      // 删除空值属性
      self.$util.deleteBlankProp(self.queryBody);

      self.$axios.post(self.queryUrl, self.queryBody).then(res => {
        self.queryBody.pagination = res.pagination;
        delete self.queryBody.pagination.currentIndex;
     //   self.$Message.error({content: '还不是服务商!'+  self.queryBody.pagination});

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

      if (self.$util.isEmpty(self.viewModel.cityCode)) {
        self.$Message.error({ content: "请选择地区!" });
        return;
      }

      self.$refs.viewModel.validate(e => {
        if (e) {
          self.viewModel.picId0 = self.$util.filesToStr(self.idPics);
          self.viewModel.picId1 = self.$util.filesToStr(self.idReversePics);

          if (self.$util.isEmpty(self.viewModel.picId0)) {
            self.$Message.error("请上传身份证正面照片!");
          } else if (self.$util.isEmpty(self.viewModel.picId1)) {
            self.$Message.error("请上传身份证反面照片!");
          } else {
            delete self.viewModel.ctime;
            delete self.viewModel.utime;
            delete self.viewModel.registTime;

            self.viewModel.picBusinessLicense = self.$util.filesToStr(
              self.blPics
            );
            self.viewModel.picContract = self.$util.filesToStr(
              self.contactPics
            );
            self.viewModel.picOther = self.$util.filesToStr(self.otherPics);

            if (self.disableEdit === false) {
              self.$axios.post(self.editUrl, self.viewModel).then(res => {
                self.$Notice.success({ title: "保洁员编辑", desc: "修改成功" });
                self.editShow = false;
                self.queryMyList();
              });
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
    },
    view(index) {
      let self = this;

      self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
      self.viewHeadImg = self.viewModel.picLogo;
      self.viewLevel = self.viewModel.level;

      self.modalTitle = "保洁员详情";
      //照片
      self.idPic = self.$util.strToPicArr(self.viewModel.picId0);
      self.idPic = self.idPic.concat(
        self.$util.strToPicArr(self.viewModel.picId1)
      );
      self.BusLicPic = self.$util.strToPicArr(
        self.viewModel.picBusinessLicense
      );
      self.contactPic = self.$util.strToPicArr(self.viewModel.picContract);
      self.otherPic = self.$util.strToPicArr(self.viewModel.picOther);

      self.okText = "确定";
      self.disableEdit = true;
      self.editShow = true;

      self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
      self.selProvince(self.viewModel.province);
      self.selCity(self.viewModel.city);
      self.editCityCode.province = self.viewModel.province;
      self.editCityCode.city = self.viewModel.city;
      self.editCityCode.town = self.viewModel.town;
    },
    edit(index) {
      let self = this;

      self.modalTitle = "修改保洁员";
      self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
      self.viewHeadImg = self.viewModel.picLogo;
      self.viewLevel = self.viewModel.level;

      //照片
      self.idPics = self.$util.strToFiles(self.viewModel.picId0);
      self.idReversePics = self.$util.strToFiles(self.viewModel.picId1);
      self.blPics = self.$util.strToFiles(self.viewModel.picBusinessLicense);
      self.otherPics = self.$util.strToFiles(self.viewModel.picOther);
      self.contactPics = self.$util.strToFiles(self.viewModel.picContract);

      self.okText = "确定";
      self.disableEdit = false;
      self.editShow = true;

      self.$util.getProCityTown(self.viewModel, self.viewModel.cityCode);
      self.selProvince(self.viewModel.province);
      self.selCity(self.viewModel.city);
      self.editCityCode.province = self.viewModel.province;
      self.editCityCode.city = self.viewModel.city;
      self.editCityCode.town = self.viewModel.town;
    },
    viewPic(picUrl) {
      let self = this;
      self.picModal = true;
      self.viewingPic = picUrl;
    },

    verify(index) {
      let self = this;

      self.verifyHist = "";
      self.verifyEntity.auditRemark = "";

      self.$axios.get(self.oneUrl + self.myList[index].id).then(res => {
        self.verifyId = self.myList[index].id;

        for (x in res.auditLogs) {
          self.verifyHist +=
            "审核时间: " +
            new Date(res.auditLogs[x].auditTime).formatDef() +
            ", 审核状态: " +
            (res.auditLogs[x].auditStatus === 0
              ? "未审核"
              : res.auditLogs[x].auditStatus === 1
              ? "待审核"
              : res.auditLogs[x].auditStatus === 2
              ? "通过"
              : res.auditLogs[x].auditStatus === 3
              ? "不通过"
              : "未知") +
            ", 审核结果: " +
            res.auditLogs[x].auditRemark +
            " --审核人: " +
            res.auditLogs[x].auditUserName +
            "\r\n" +
            "\r\n";
        }
        self.verifyEntity.auditStatus = self.myList[index].auditStatus;
        let x = 0;
        self.verifyShow = true;
      });
    },

    verifyFacilitator(index) {
      let self = this;

      self.verifyHists = "";
      self.verifyEntity.auditRemark = "";

      self.$axios.get(self.oneUrl + self.myList[index].id).then(res => {
        self.verifyId = self.myList[index].id;

        for (x in res.auditLogs) {
          self.verifyHists +=
            "审核时间: " +
            new Date(res.auditLogs[x].auditTime).formatDef() +
            ", 服务商审核状态: " +
            (res.auditLogs[x].facilitatorStatus === 0
              ? "未审核"
              : res.auditLogs[x].facilitatorStatus === 1
              ? "待审核"
              : res.auditLogs[x].facilitatorStatus === 2
              ? "通过"
              : res.auditLogs[x].facilitatorStatus === 3
              ? "不通过"
              : "未知") +
            ", 审核结果: " +
            res.auditLogs[x].auditRemark +
            " --审核人: " +
            res.auditLogs[x].auditUserName +
            "\r\n" +
            "\r\n";
        }
        self.verifyEntity.facilitatorStatus =
          self.myList[index].facilitatorStatus;

        let x = 0;

        self.verifyShowFuShou = true;
      });
    },
    verifyCancel() {
      let self = this;
      self.verifyShow = false;
    },
    verifyCancelFuShou() {
      let self = this;
      self.verifyShowFuShou = false;
    },
    verifyOk() {
      let self = this;

      if (self.$util.isEmpty(self.verifyEntity.auditRemark)) {
        self.$Message.error("请输入审核结果!");
      } else {
        self.verifyEntity.auditUserId = self.$util.getUserId();
        self.verifyEntity.auditUserName = self.$util.getUserName();
        self.verifyEntity.cleanerId = self.verifyId;
        let refTypes = Cookies.get("refType");
        self.verifyEntity.refTypes = refTypes;
        self.$axios.post(self.auditUrl, self.verifyEntity).then(res => {
          self.tableLoading = true;
          self.$Notice.success({ title: "保洁员审核", desc: "审核成功" });
          self.verifyShow = false;
          self.queryMyList();
        });
      }
    },

    verifyFushouOk() {
      let self = this;

      if (self.$util.isEmpty(self.verifyEntity.auditRemark)) {
        self.$Message.error("请输入审核结果!");
      } else {
        self.verifyEntity.auditUserId = self.$util.getUserId();
        self.verifyEntity.auditUserName = self.$util.getUserName();
        self.verifyEntity.cleanerId = self.verifyId;
        let refTypes = Cookies.get("refType");
        self.verifyEntity.refTypes = refTypes;

        self.$axios.post(self.auditUrl, self.verifyEntity).then(res => {
          self.tableLoading = true;
          self.$Notice.success({ title: "保洁员审核", desc: "审核成功" });
          self.verifyShowFuShou = false;
          self.queryMyList();
        });
      }
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

