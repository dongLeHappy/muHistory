// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
require('./assets/lib/webim.config')


// let WebIM = require('easemob-websdk')


// const conn = new WebIM.connection({
//   isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
//   https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
//   url: WebIM.config.xmppURL,
//   heartBeatWait: WebIM.config.heartBeatWait,
//   autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
//   autoReconnectInterval: WebIM.config.autoReconnectInterval,
//   apiUrl: WebIM.config.apiURL,
//   isAutoLogin: true
// })
// const options = {
//   apiUrl: WebIM.config.apiURL,
//   user: '1',
//   pwd: 'xiuxiutrip123456', // 待会会进行覆盖
//   appKey: WebIM.config.appkey,
//   success:function (re) {
//     console.log('登陆成功')
//   },
//   error:function (err) {
//     alert(err)
//   }
// }
Vue.prototype.$webim = WebIM
// Vue.prototype.$options = options
// Vue.prototype.$conn = conn
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
