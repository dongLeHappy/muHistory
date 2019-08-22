<template>
  <div class="container-fluid" >
    <Row>
      <Col span="11">
        <item-view v-bind:getMessage="dingdan"></item-view>
      </Col>
      <Col span="11" push="1">
        <item-view v-bind:getMessage="jiaoyi"></item-view>
      </Col>

      <!-- <Col span="8">{{getMessage.item3}}</Col> -->
    </Row>
    <Row class="orderflex">
      <Col span="11">
        <item-view v-bind:getMessage="shouru"></item-view>
      </Col>
        <Col span="11" push="1">
            <item-view v-bind:getMessage="baojieyuan"></item-view>
        </Col>
      <!-- <Col span="8">{{getMessage.item3}}</Col> -->
    </Row>
    <Row>

      <Col span="11">
        <!-- <item-view v-bind:getMessage="shouru"></item-view> -->
      </Col>
        <Col span="11" v-if="refType==3">
            <item-view v-bind:getMessage="huiyuan"></item-view>
        </Col>
      <!-- <Col span="8">{{getMessage.item3}}</Col> -->
    </Row>
  </div>
</template>

<script>
// import $ from 'jquery';
import itemView from "./item.vue";
import Cookies from "js-cookie";
import bjImg from "../../images/survey/保洁员@3x.png";
import srImg from "../../images/survey/今日收入@3x.png";
// import jyImg from "../../images/survey/今日交易额@3x.png";
import ddImg from "../../images/survey/订单总量1@3x.png";

export default {
  data() {
    return {
      queryUrl: "/order/preview",
      queryBody: {
        // 请求体
        pagination: {
          page: 1,
          total: 10,
          size: 10
        },
        req: {}
      },
      orderTotal: 0.0,
        toDayMonthOrderTotal:0.0,
      toDayOrderTotal: 0.0,
        toDayMonthTransaction:0.0,
      transaction: 0.0,
      toDayTransaction: 0.0,
      income: 0.0,
      toDayIncome: 0.0,
      memberNumber: 0.00,
      toDayMemberNumber: 0.0,
        toDayMonthMember:0.0,
      cleanNumber: 0.0,
        toDaycleanNumber: 0.0,
        toDayMonthCleanNumber:0.0,
        refType: Cookies.get("refType"),


      dingdan: {
        title: "订单概况",
        item1: "订单量总量",
        item2: "本月订单",
        item3: "今日订单",
        color: "#56D4D1",
        imgSrc: ddImg,
        total: this.orderTotal,
          month:this.toDayMonthOrderTotal,
          daday:this.toDayOrderTotal

      },
      jiaoyi: {
        title: "交易概况",
        item1: "交易总量",
        item2: "本月交易额",
        item3: "今日交易额",
        color: "#56D4D1",
        imgSrc: "",
          total: this.transaction,
          month:this.toDayMonthTransaction,
          daday:this.toDayTransaction
      },
      shouru: {
        title: "收入概况",
        item1: "总收入",
        item2: "月收入",
        item3: "今日收入",
        color: "#56D4D1",
        imgSrc: srImg,
          total: this.income,
          month:this.toDayMonthIncome,
          daday:this.toDayIncome
      },
      huiyuan: {
        title: "会员概况",
        item1: "会员总量",
        item2: "月会员量",
        item3: "今日会员量",
        color: "#5BD87E",
        imgSrc: "",
          total: this.memberNumber,
          month:this.toDayMonthMember,
          daday:this.toDayMemberNumber
      },
      baojieyuan: {
        title: "保洁员概况",
        item1: "保洁员总量",
        item2: "本月保洁员数量",
        item3: "今日新增保洁员数量",
        color: "#AB7BF2",
        imgSrc: bjImg,
          total:this.cleanNumber,
          month:this.toDayMonthCleanNumber,
          daday:this.toDaycleanNumber,

      }
    };
  },
  components: { itemView },
  name: "survey",
  mounted() {
    let slef = this;
    slef.queryMyList();
  },
  methods: {
    queryMyList() {
      let self = this;


      let userId = Cookies.get("userId");
      let refType = Cookies.get("refType");
      let token = Cookies.get("token");
      let agentStatus = Cookies.get("agentStatus");
      // 数据分割
      let cityCodes = Cookies.get('cityCode');
      //



      // 驗證登錄信息
      self.queryBody = {};
      self.queryBody.loginSession = {};
      self.queryBody.loginSession.refId = userId;
      self.queryBody.loginSession.refType = refType;
      self.queryBody.loginSession.loginToken = token;
      self.queryBody.req = {};
      self.queryBody.req.agentStatus = agentStatus;

      if (cityCodes !== undefined) {
        let cityList = self.$util.strConvertArray(cityCodes);
        if (cityList[0] !== 'null' && cityList[0] !== '') {
          self.queryBody.req.cityCodes = cityList;
        }
        //  self.$Message.error({content: '还不是服务商!'+ self.queryBody.req.cityCodes});
      }
      self.queryBody.req.refType = refType;
      self.queryBody.req.refId = userId;
        console.log(self.queryUrl)

      self.$axios.post(self.queryUrl, self.queryBody).then(res => {
      //  console.log(res)
        //订单统计
        self.orderTotal = res.orderTotal === null ? 0 : res.orderTotal;
          self.toDayMonthOrderTotal = res.toDayMonthOrderTotal === null ? 0 : res.toDayMonthOrderTotal;
          self.toDayOrderTotal = res.toDayOrderTotal === null ? 0 : res.toDayOrderTotal; //订单
       //   self.$Message.error({content: '还不是服务商!'+self.toDayMonthOrderTotal});
        //保洁员统计
        self.cleanNumber = res.cleanNumber === null ? 0 : res.cleanNumber; //保洁 员
        self.toDayMonthCleanNumber = res.toDayMonthCleanNumber === null ? 0 : res.toDayMonthCleanNumber;
        self.toDaycleanNumber = res.toDaycleanNumber === null ? 0 : res.toDaycleanNumber;
  //      self.$Message.error({content: '还不是服务商!'+self.toDaycleanNumber});
        //收入统计
        self.income = res.income === null ? 0 : res.income; //收入
        self.toDayIncome = res.toDayIncome === null ? 0 : res.toDayIncome;
        self.toDayMonthIncome = res.toDayMonthIncome === null ? 0 : res.toDayMonthIncome;
        //交易统计
        self.transaction = res.transaction === null ? 0 : res.transaction; //交易
        self.toDayMonthTransaction = res.toDayMonthTransaction === null ? 0 : res.toDayMonthTransaction;
        self.toDayTransaction = res.toDayTransaction === null ? 0 : res.toDayTransaction;

        //会员统计
        self.memberNumber = res.memberNumber === null ? 0 : res.memberNumber; //会员
        self.toDayMemberNumber = res.toDayMemberNumber === null ? 0 : res.toDayMemberNumber;
        self.toDayMonthMember = res.toDayMonthMember === null ? 0 : res.toDayMonthMember;


          self.dingdan.total = self.orderTotal;
          self.dingdan.month= self.toDayMonthOrderTotal;
          self.dingdan.daday = self.toDayOrderTotal;

        self.baojieyuan.total = self.cleanNumber;
        self.baojieyuan.month = self.toDayMonthCleanNumber;
        self.baojieyuan.daday = self.toDaycleanNumber;

          self.huiyuan.total = self.memberNumber;
          self.huiyuan.month = self.toDayMonthMember;
          self.huiyuan.daday = self.toDayMemberNumber;

        self.jiaoyi.total = self.transaction;
        self.jiaoyi.month = self.toDayMonthTransaction;
        self.jiaoyi.daday = self.toDayTransaction;

        self.shouru.total = self.income;
        self.shouru.month = self.toDayMonthIncome;
        self.shouru.daday = self.toDayIncome;





      });
    }
  }
};
</script>

<style scoped>
.container-fluid {
  padding: 30px 24px;
}
/*.orderflex{display: flex;*/
/*    display: -webkit-flex;justify-content: space-around;}*/
.itemTitle {
  font-family: PingFangSC-Semibold;
  font-size: 20px;
  color: #333333;
  letter-spacing: 0;
}
</style>
