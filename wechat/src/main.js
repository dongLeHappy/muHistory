// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/setView'               //不同dpr手机兼容
require('./assets/webim.config.js')
let WebIM = require('easemob-websdk')
Vue.prototype.$webim = WebIM

const conn = new WebIM.connection  ({
  isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
  https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
  url: WebIM.config.xmppURL,
  heartBeatWait: WebIM.config.heartBeatWait,
  autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
  autoReconnectInterval: WebIM.config.autoReconnectInterval,
  apiUrl: WebIM.config.apiURL,
  isAutoLogin: true
})

const options = {
  apiUrl: WebIM.config.apiURL,
  user: '',
  pwd: '',
  appKey: WebIM.config.appkey,
  success: function (re) {
    console.log('链接服务器正常')
  },
  error: function (err) {
    alert(err)
  }
}
Vue.prototype.$imconn = conn
Vue.prototype.$imoption = options

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
