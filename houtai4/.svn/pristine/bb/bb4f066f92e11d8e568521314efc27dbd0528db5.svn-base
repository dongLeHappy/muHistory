<template>
  <div id="content">
    <h3 class="title">{{getMessage.title}}</h3>
    <div class="items">
      <div class="item">
        <h5 class="itemName" :style="{'color':getMessage.color}">{{getMessage.item1}}</h5>
        <div
          class="count"
          :style="{'color':getMessage.color}"
        >{{getMessage.total ? getMessage.total : '0'}}</div>
      </div>
      <div class="item">
        <h5 class="itemName">{{getMessage.item2}}</h5>
        <div class="count">{{getMessage.month ? getMessage.month : '0'}}</div>
      </div>
      <div class="item">
        <h5 class="itemName">{{getMessage.item3}}</h5>
        <div class="count">{{getMessage.daday ? getMessage.daday : '0'}}</div>
      </div>
    </div>
    <img v-if="getMessage.imgSr != ''" :src="getMessage.imgSrc" class="itemImg">
  </div>
</template>
<script>
export default {
  data() {
    // s:''
    //   src="../../images/survey/新增保洁员@3x.png"
    //
    //   src="../../images/survey/保洁员@3x.png"
    // src="../../images/survey/新增会员@3x.png"
    //  src="../../images/survey/会员总数@3x.png"
    //  src="../../images/survey/今日收入@3x.png"
    //   src="../../images/survey/总收入@3x.png"
    //  src="../../images/survey/今日交易额@3x.png"
    //  src="../../images/survey/交易总额@3x.png"
    //  src="../../images/survey/今日订单@3x.png"
    //  src="../../images/survey/订单总量1@3x.png"
    return {
      data: ""
    };
  },
  props: ["getMessage"]
};
</script>
<style lang='less' scoped>
#content {
  text-align: center;
  margin-bottom: 45px;
  padding: 17px 0 30px 17px;
  background: #fff;

  .title {
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #333333;
    letter-spacing: 0;
    text-align: left;
    margin-bottom: 52px;
  }

  .items {
    width:100%;
    display: -moz-flex;
    display: -webkit-flex;
    display: flex;
    justify-content: space-around;
    flex-flow: row wrap;
    .item {
      .count{
        font-family: MicrosoftYaHei;

        letter-spacing: 0;
      }
      @media screen and (max-width: 300px) {
        .count {
          font-size:12px;
        }
      }
      @media (min-width:300px) and (max-width: 992px) {
        .count {
          font-size:14px;
        }
      }
      @media (min-width:992px) and (max-width: 1200px) {
        .count {
          font-size:16px;
        }
      }
      @media (min-width: 1200px) {
        .count {
          font-size:24px;
        }
      }
      .itemName {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #666;
        letter-spacing: 0;
        margin-bottom: 20px;
      }
    }
  }



  .itemImg {
    width: 110px;
    position: absolute;
    right: 0;
    top: 55px;
  }
}
.items .item .count{color:#999;}
.items .item:nth-child(2) .count{color:red;}
</style>
