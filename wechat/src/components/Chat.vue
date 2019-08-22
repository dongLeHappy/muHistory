<template>
  <div class="Chat">
    <div class="chat-header">
      <div class="goback fl" @click="$router.go(-1)">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
          <!--<polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(153,153,153);stroke-width:2"/>-->
        </svg>
      </div>
      {{receiveNickName}}

    </div>
    <div class="chat-content" @click="showEmoji = false">
      <div class="no-msg">没有更多消息啦~</div>

      <div class="x-message-group" :class="item.from == from_username ? 'x-message-right' : ''"
           v-for="item in chatHistory">
        <div class="x-message-user">{{item.nickName}}</div>
        <div class="x-message-content">
          <p class="x-message-text" v-html="handleMsg(item.sourceMsg)"></p>
        </div>
        <div class="x-message-time">
          {{item.time}}
          <span class="x-message-status"></span>
        </div>
      </div>

    </div>
    <div class="chat-footer">
      <div class="chat-ops">
        <div class="chat-ops-icon ib">
          <div class="ib">
            <a class="adropdown-trigger" @click="showEmoji = !showEmoji">
              <i class="iconfont icon-biaoqing2" style="color: rgba(0, 0, 0, 0.65);"></i>
              <ul class="faces-ul" v-show="showEmoji">
                <li v-for="(value,key) in emojiMap" :key="key" @click="clickFace(key)" class="webim-emoji-item">
                  <img :src="value" alt="emoj"/>
                </li>
              </ul>
            </a>
          </div>
        </div>
        <label class="chat-ops-icon ib" @click="clearChat">
          <i class="iconfont icon-shanchu"></i>
        </label>
      </div>
      <div class="chat-send">
        <span class="input-group-wrapper">
          <span class="input-wrapper" @click="showEmoji = false">
            <input type="text" placeholder="输入消息" id="inputcontent" @keyup.enter="sendTextMsg()" class="input-txt fl">
            <span class="input-group-addon" @click="sendTextMsg">
               <i class="iconfont icon-send" style="cursor: pointer;"></i>
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import ee_1 from '../assets/faces/ee_1.png'
  import ee_2 from '../assets/faces/ee_2.png'
  import ee_3 from '../assets/faces/ee_3.png'
  import ee_4 from '../assets/faces/ee_4.png'
  import ee_5 from '../assets/faces/ee_5.png'
  import ee_6 from '../assets/faces/ee_6.png'
  import ee_7 from '../assets/faces/ee_7.png'
  import ee_8 from '../assets/faces/ee_8.png'
  import ee_9 from '../assets/faces/ee_9.png'
  import ee_10 from '../assets/faces/ee_10.png'
  import ee_11 from '../assets/faces/ee_11.png'
  import ee_12 from '../assets/faces/ee_12.png'
  import ee_13 from '../assets/faces/ee_13.png'
  import ee_14 from '../assets/faces/ee_14.png'
  import ee_15 from '../assets/faces/ee_15.png'
  import ee_16 from '../assets/faces/ee_16.png'
  import ee_17 from '../assets/faces/ee_17.png'
  import ee_18 from '../assets/faces/ee_18.png'
  import ee_19 from '../assets/faces/ee_19.png'
  import ee_20 from '../assets/faces/ee_20.png'
  import ee_21 from '../assets/faces/ee_21.png'
  import ee_22 from '../assets/faces/ee_22.png'
  import ee_23 from '../assets/faces/ee_23.png'
  import ee_24 from '../assets/faces/ee_24.png'
  import ee_25 from '../assets/faces/ee_25.png'
  import ee_26 from '../assets/faces/ee_26.png'
  import ee_27 from '../assets/faces/ee_27.png'
  import ee_28 from '../assets/faces/ee_28.png'
  import ee_29 from '../assets/faces/ee_29.png'
  import ee_30 from '../assets/faces/ee_30.png'
  import ee_31 from '../assets/faces/ee_31.png'
  import ee_32 from '../assets/faces/ee_32.png'
  import ee_33 from '../assets/faces/ee_33.png'
  import ee_34 from '../assets/faces/ee_34.png'
  import ee_35 from '../assets/faces/ee_35.png'

  export default {
    name: 'Chat',
    data () {
      return {
        from_username: '', // url中的发起方用户名
        to_username: '', // url中的接收方用户名
        conn: {}, // 与环信的通信长连接
        chatHistory: [], // 聊天记录数组
        currentUserpwd: '123456', // 当前用户环信密码
        accence_token: '', // 权限token
        emojiMap: {
          '[):]': ee_1,
          '[:D]': ee_2,
          '[;)]': ee_3,
          '[:-o]': ee_4,
          '[:p]': ee_5,
          '[(H)]': ee_6,
          '[:@]': ee_7,
          '[:s]': ee_8,
          '[:$]': ee_9,
          '[:(]': ee_10,
          '[:\'(]': ee_11,
          '[:|]': ee_12,
          '[(a)]': ee_13,
          '[8o|]': ee_14,
          '[8-|]': ee_15,
          '[+o(]': ee_16,
          '[<o)]': ee_17,
          '[|-)]': ee_18,
          '[*-)]': ee_19,
          '[:-#]': ee_20,
          '[:-*]': ee_21,
          '[^o)]': ee_22,
          '[8-)]': ee_23,
          '[(|)]': ee_24,
          '[(u)]': ee_25,
          '[(S)]': ee_26,
          '[(*)]': ee_27,
          '[(#)]': ee_28,
          '[(R)]': ee_29,
          '[({)]': ee_30,
          '[(})]': ee_31,
          '[(k)]': ee_32,
          '[(F)]': ee_33,
          '[(W)]': ee_34,
          '[(D)]': ee_35
        }, // 表情集合
        showEmoji: false, // 是否显示表情
        myNickName: '', // 发送人昵称
        receiveNickName: '', //接收人昵称
        headimgurl: '' // 发送人头像
      }
    },
    computed: {
      getMyNickName () {
        return this.myNickName
      }
    },
    created () {
//      userPersonal().then(res => {
//        this.headimgurl = res.headimgurl
//      })
    },
    mounted () {
      // URL格式 http://localhost:8082/#/chatList/me/?from_username=1&to_username=2
      document.querySelector('#inputcontent').focus()
      let urlParams = this.getParamsFromUrl()
      if (urlParams.from_username && urlParams.to_username) {
        this.from_username = urlParams.from_username
        this.to_username = urlParams.to_username
        this.receiveNickName = decodeURI(urlParams.to_nickname)
        this.getChatListDataFromLocal()
        this.loginEasemob()
      } else {
        alert('路径错误,缺少用户名 路径格式如:http://localhost:8080/#/chat?from_username=2&to_username=1&to_nickname=孟')
      }
    },
    methods: {
      // 登录环信
      loginEasemob () {
        this.$imoption.user = this.from_username
        this.$imoption.pwd = this.currentUserpwd
        this.$imoption.success = (res) => {
          this.accence_token = res.access_token
          this.myNickName = res.user.nickname
          this.addListen()
        }
        this.$imconn.open(this.$imoption)
      },
      addListen () {
        this.$imconn.listen({
          onOpened: function (message) {
            console.log('用户已上线')
          },
          onClosed: function (message) {
            console.log('用户已下线')
          },
          onEmojiMessage: this.receiveEmojiMessage,
          onPictureMessage: this.receivePictureMessage,
          onTextMessage: this.receiveTextMsg
        })
      },
      // 接受文本消息
      // 从localstroage获取聊天历史记录
      getChatListDataFromLocal () {
        var chatData = JSON.parse(localStorage.getItem('chatData'))
        if (chatData) {
          var currentChatData = chatData.chatHistoryData[this.to_username]
          if (currentChatData) {
            this.chatHistory.push(...currentChatData)
          }
        }
      },
      // 接受文本消息
      receiveTextMsg (message) {
        console.log('收到消息' + message)
        // message:{"id":"465540634703299052","type":"chat","from":"1","to":"2","data":"5共和国","ext":{"weichat":{"originType":"webim"}},"sourceMsg":"5共和国","error":false,"errorText":"","errorCode":"","time":"2018-05-10T12:55:27.432Z"}
        let sendTimeWZ = message.time ? new Date(message.time) : new Date()
        let sendTime = sendTimeWZ.getMonth() + 1 + '-' + sendTimeWZ.getDate() + ' ' + sendTimeWZ.getHours() + ':' + sendTimeWZ.getMinutes()
        let receiveMessage = {
          from: message.from,
          sourceMsg: message.data,
          time: sendTime,
          nickName: this.receiveNickName
        }
        let to_username = this.to_username
        var chatData = JSON.parse(localStorage.getItem('chatData'))
        if (chatData) {
          chatData.chatHistoryData[to_username].push(receiveMessage)
          localStorage.setItem('chatData', JSON.stringify(chatData))
        } else {
          let chatHistoryData = {}
          chatHistoryData[to_username] = [receiveMessage]
          localStorage.setItem('chatData', JSON.stringify({chatHistoryData}))
        }
        this.chatHistory.push(receiveMessage)
      },
      // 接受表情消息
      receiveEmojiMessage (message) {
        this.chatHistory.push(message)
      },
      // 接受图片消息
      receivePictureMessage (message) {
        this.chatHistory.push(message)
      },
      // 发送文本消息
      sendTextMsg () {
        var text = document.querySelector('#inputcontent').value
        if (!text) {
          this.$createDialog({
            type: 'alert',
            title: '温馨提示',
            content: '发送内容不能为空'
          }).show()
          return
        }
        var id = this.$imconn.getUniqueId()
        var msg = new WebIM.message('txt', id)
        let fromUserName = this.from_username
        let to_username = this.to_username
        let _thisChatHistory = this.chatHistory
        let sendTime = this.getNowTime()
        let myNickName = this.getMyNickName
        let headimgurl = this.headimgurl
        msg.set({
          msg: text,
          action: 'action',                     //用户自定义，cmd消息必填
          ext: {'nickName': myNickName, headimgurl},    //用户自扩展的消息内容（群聊用法相同）
          to: this.to_username,
          roomType: false,
          success: function (id, serverMsgId) {
            document.querySelector('#inputcontent').value = ''
            let sendMessage = {
              from: fromUserName,
              sourceMsg: text,
              time: sendTime,
              nickName: myNickName
            }
            var chatData = JSON.parse(localStorage.getItem('chatData'))
            if (chatData) {
              if (chatData.chatHistoryData[to_username]) {
                chatData.chatHistoryData[to_username].push(sendMessage)
              } else {
                chatData.chatHistoryData[to_username] = [sendMessage]
              }
              localStorage.setItem('chatData', JSON.stringify(chatData))
            } else {
              let chatHistoryData = {}
              chatHistoryData[to_username] = [sendMessage]
              localStorage.setItem('chatData', JSON.stringify({chatHistoryData}))
            }
            _thisChatHistory.push(sendMessage)
          },
          fail: function (e) {
            console.log('Send private text error')
          }
        })
        msg.body.chatType = 'singleChat'
        this.$imconn.send(msg.body)
      },
      getNowTime () {
        let now = new Date()
        return now.getMonth() + 1 + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes()
      },
      // 获取url中的当前用户环信账号和聊天对象账号
      getParamsFromUrl () {
        var urlhash = location.hash //获取url中"?"符后的字串
        var theRequest = {}
        if (urlhash.indexOf('?') != -1) {
          var index = urlhash.indexOf('?') + parseInt(1)
          var str = urlhash.substr(index)
          var strArr = str.split('&')
          for (var i = 0; i < strArr.length; i++) {
            let arr = strArr[i].split('=')
            theRequest[arr[0]] = arr[1]
          }
        }
        return theRequest
      },
      //清空当前聊天记录
      clearChat () {
        localStorage.removeItem('chatData')
        this.chatHistory = []
      },
      // 选中一个表情 直接发送 不经过输入框直接发送
      clickFace (key) {
        var id = this.$imconn.getUniqueId()
        var msg = new WebIM.message('txt', id)
        let fromUserName = this.from_username
        let to_username = this.to_username
        let _thisChatHistory = this.chatHistory
        let sendTime = this.getNowTime()
        let myNickName = this.getMyNickName
        msg.set({
          msg: key,
          to: this.to_username,
          roomType: false,
          success: function (id, serverMsgId) {
            let sendMessage = {
              from: fromUserName,
              sourceMsg: key,
              time: sendTime,
              nickName: myNickName
            }
            var chatData = JSON.parse(localStorage.getItem('chatData'))
            if (chatData) {
              if (chatData.chatHistoryData[to_username]) {
                chatData.chatHistoryData[to_username].push(sendMessage)
              } else {
                chatData.chatHistoryData[to_username] = [sendMessage]
              }
              localStorage.setItem('chatData', JSON.stringify(chatData))
            } else {
              let chatHistoryData = {}
              chatHistoryData[to_username] = [sendMessage]
              localStorage.setItem('chatData', JSON.stringify({chatHistoryData}))
            }
            _thisChatHistory.push(sendMessage)
          },
          fail: function (e) {
            console.log('Send emoji text error')
          }
        })
        msg.body.chatType = 'singleChat'
        this.$imconn.send(msg.body)
      },
      hideEmoji () {
        this.showEmoji = false
      },
      handleMsg (msg) {
        if (this.emojiMap[msg]) {
          return `<img src="${this.emojiMap[msg]}"/>`
        } else {
          return msg
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "../assets/reset";
  @import "../assets/functions";
  @import "../assets/variables";
  @import "../assets/mixins";
  /*聊天页面*/
  @import "../assets/css/iconfont.css";

  .Chat {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: #fff;
    .chat-header {
      padding: 0 px2rem(20px);
      border-bottom: 1px solid #d6dce0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: px2rem(50px);
      line-height: px2rem(50px);
      color: #999;
      text-align: center;
      @include font-dpr(13px);
      .goback {
        width: px2rem(30px);
      }
      svg {
        fill: #555;
        @include setSize(px2rem(18px), px2rem(18px));
        vertical-align: middle;
      }

      .chat-action {
        @include font-dpr(18px);
        color: #999;
      }
    }

    .chat-content {
      position: absolute;
      left: 0;
      right: 0;
      top: px2rem(50px);
      bottom: px2rem(100px);
      padding: 0 px2rem(16px);
      overflow: scroll;
      .no-msg {
        width: px2rem(150px);
        height: px2rem(30px);
        line-height: px2rem(30px);
        background-color: rgb(136, 136, 136);
        color: rgb(255, 255, 255);
        border-radius: px2rem(15px);
        text-align: center;
        margin: px2rem(10px) auto;
      }
      .x-message-group {
        padding-top: 3px;
        @include font-dpr(14px);
        line-height: 1.5;
        .x-message-user {
          color: #1c2238;
        }
        .x-message-text {
          display: inline-block;
          padding: px2rem(10px) px2rem(15px);
          margin-top: px2rem(6px);
          border-radius: px2rem(25px);
          border: 1px solid #eceff1;
          min-width: 100px;
          img {
            display: block;
            @include setSize(px2rem(35px), px2rem(35px))
          }
        }
        .x-message-time {
          padding: 0 px2rem(2px) 0 px2rem(3px);
          @include font-dpr(12px);
          color: #888c98;
        }

      }

      .x-message-right {
        text-align: right;

        .x-message-text {
          max-width: 80%;
          text-align: left;
          background: #eceff1;
          word-wrap: break-word;
        }
      }

    }

    .faces-ul {
      z-index: 1;
      position: absolute;
      width: 100%;
      height: px2rem(200px);
      bottom: px2rem(105px);
      left: 0;
      border-radius: 2px;
      background: #fff;
      box-sizing: border-box;
      padding: 4px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px 0px;
      .webim-emoji-item {
        cursor: pointer;
        display: inline-block;
        margin: 2px 3px 0 3px;
        width: px2rem(35px);
        height: px2rem(35px);
        line-height: 1;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .chat-footer {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: px2rem(100px);
      line-height: px2rem(50px);
      background: #fff;
      border-top: 1px solid #d6dce0;
      .chat-ops {
        padding: 0 px2rem(8px);
        outline: none;
        margin-bottom: 0;
        list-style: none;
        z-index: 1050;
        color: rgba(0, 0, 0, 0.65);
        background: #fff;
        text-align: left;
        @include font-dpr(12px);
        line-height: px2rem(42px);
        height: px2rem(50px);
        overflow: hidden;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        .chat-ops-icon {
          @include font-dpr(20px);
          display: inline-block;
          padding: 0 px2rem(10px);
          cursor: pointer;
        }
        .iconfont {
          @include font-dpr(16px);
        }
      }

      .chat-send {
        width: 100%;
        height: px2rem(50px);
        padding: px2rem(10px) px2rem(16px) 0;
        box-sizing: border-box;
        .input-wrapper {
          position: relative;
          display: table;
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
        }

        .input-txt {
          float: left;
          width: 100%;
          margin-bottom: 0;
          display: table-cell;
          box-sizing: border-box;
          height: px2rem(28px);
          line-height: px2rem(28px);
          border: 0;
          @include font-dpr(14px);
          padding: 0;
          -webkit-box-shadow: 0 0 0 0;
          box-shadow: 0 0 0 0;
          @include font-dpr(13px)
        }

        .input-group-addon {
          width: px2rem(32px);
          height: px2rem(32px);
          display: table-cell;
          @include font-dpr(24px);
          font-weight: normal;
          line-height: 1;
          color: rgba(0, 0, 0, 0.65);
          text-align: center;
          border-radius: 2px;
          padding: 0;
        }
        .icon-send {
          position: absolute;
          top: px2rem(8px);
          right: px2rem(8px);
          @include font-dpr(18px)
        }
      }
    }

  }

</style>
