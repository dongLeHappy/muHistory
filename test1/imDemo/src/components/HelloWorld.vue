<template>
  <div class="hello">
    <div class="talk-head">
      <p>{{userName}}</p>
    </div>
    <div class="message-content">

    </div>
  </div>
</template>

<script>
require('../assets/lib/webim.config')
let WebIM = require('easemob-websdk');
const conn = new WebIM.connection({
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
  user: '1',
  pwd: 'xiuxiutrip123456', // 待会会进行覆盖
  appKey: WebIM.config.appkey,
  success:function (re) {
    console.log('登陆成功')
  },
  error:function (err) {
    alert(err)
  }
}
export default {
  name: 'HelloWorld',
  data () {
    return {
      $imconn: {},
      $imoption: {},
      userName:"",
    }
  },
  created () {
    this.$imconn = conn;
    this.$imoption = options;
    this.loginWebIM();
  },
  methods: {
    loginWebIM () {
      this.$imoption.user = '13713863630';
      this.$imoption.pwd = 'dl323238';
      this.$imoption.success = (res) => {
        this.accence_token = res.access_token
        this.userName = res.user.username
        this.$imconn.listen({
          onOpened: function (message) {
            console.log('用户已上线')
            _this.getGroupOfWebIM();
            // 由于我们用的是聊天室，所以登录成功后必须加入聊天室
            _this.joinRoom();
          },
          onClosed: function (message) {
            console.log('用户已下线')
          },
          onEmojiMessage: function (message) {
            console.log('这儿接收到了表情')
          },
          onPictureMessage: function (message) {
            console.log('这儿接收到了图片')
          },
          onTextMessage: function (message) {
            // 每次接收信息都会在这儿监听到
            console.log('这儿接收到了文本信息');
            console.log(message)
          },
          onPresence: function ( message ) {
          // 加入聊调室后，这儿会被执行
            console.log('这儿是监听聊天室')
            _this.handlePresence(message)
          }
        })
      }
      this.$imconn.open(this.$imoption);
      // let _this = this;
      // this.$imconn.listen({
      //   onOpened: function (message) {
      //     console.log('用户已上线')
      //     _this.getGroupOfWebIM();
      //     // 由于我们用的是聊天室，所以登录成功后必须加入聊天室
      //     _this.joinRoom();
      //   },
      //   onClosed: function (message) {
      //     console.log('用户已下线')
      //   },
      //   onEmojiMessage: function (message) {
      //     console.log('这儿接收到了表情')
      //   },
      //   onPictureMessage: function (message) {
      //     console.log('这儿接收到了图片')
      //   },
      //   onTextMessage: function (message) {
      //     // 每次接收信息都会在这儿监听到
      //     console.log('这儿接收到了文本信息');
      //     console.log(message)
      //   },
      //   onPresence: function ( message ) {
      //    // 加入聊调室后，这儿会被执行
      //     console.log('这儿是监听聊天室')
      //      _this.handlePresence(message)
      //   }
      // })



    //   this.$options.user = this.from_username
    //   this.$options.pwd = this.currentUserpwd
    //   this.$conn.open(this.$options)
    //   this.$conn.listen({
    //     onOpened: function (message) {
    //         console.log('用户已上线')
    //     },
    //     onClosed: function (message) {
    //         console.log('用户已下线')
    //     },
    //     onEmojiMessage: this.receiveEmojiMessage,
    //     onPictureMessage: this.receivePictureMessage,
    //     onTextMessage: this.receiveTextMsg
    //   })
    },
    handlePresence (e) {
      // 官网给出的例子是
      e.type == 'joinChatRoomSuccess' // 加入成功
      e.type == 'joinChatRoomFailed'  // 加入失败
      e.type == 'deleteGroupChat'  // 聊天室被删除
     // 但是实际操作的时候，不管有没得聊天室id，都能返回joinChatRoomSuccess
     // 所以实际判断的时候，如果加入聊天室失败，会返回一个error的属性，所有正确的判断应该是
     if (e.error) {
        console.log('加入失败')
      } else {
        console.log('加入成功')
      }
    },
    joinRoom () {
    // 加入聊天室
      this.$imconn.joinChatRoom({
          roomId: this.roomId // 聊天室id
      });
    },
    closeWebIM () {
      // 退出聊天室，每次离开聊天室的时候一定要退出聊天室
      this.$imconn.quitChatRoom({
        roomId: this.roomId // 聊天室id
      });
      this.$imconn.close(); // 如果是退出登录，那么这一句必须要，否则会出现，第一次可以登录，第二次登录掉线或者无法登陆的情况
    }
  }
}
</script>

// <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.talk-head{
  line-height: 35px;
  background-color: gray;
}
.talk-head p{
  text-align: center;
}
.message-content{
  
}
</style>
