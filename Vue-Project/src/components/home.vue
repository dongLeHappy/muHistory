<template>
  <div class="home">
    <div class="header" >
      <navHeader @getNavData="listData"></navHeader>
    </div>
    <div class="container">
      <navAside @getName="getContentName" :navData="sideName"></navAside>
      <navContent :name="contentName"></navContent>
    </div>
  </div>
</template>

<script>
import navHeader from './nav-header' // 头部
import navAside from './nav-side' // 侧边栏
import navContent from './nav-content'  // 内容
export default {
  components:{  // 注册组件
    navHeader,
    navAside,
    navContent
  },
    data() {
      return {
        sideName:[ // 定义默认数据
          {id:'1',name:'下拉1-1'},
          {id:'2',name:'下拉1-2'},
          {id:'3',name:'下拉1-3'},
        ],
        contentName:{ // 默认数据
          index:'下拉1',
          val:111
        }
      };
    },

    methods: {
      listData(name) { // 组件传来的值（左侧栏需要用到的数据）
        this.sideName = name;
      },
      getContentName(val) { // 组件传来的值（内容里面需要用到的数据）
        this.contentName = val;
      }
    },
    beforeCreate() {
      console.log("创建前.....")
    },
    created() {
      console.log("创建完成.....")
    },
    beforeMount() {
      console.log("挂载前.....")
    },
    mounted() {
      console.log("挂载完成.....")
      this.sideName = JSON.parse(localStorage.getItem("asideList")) ? JSON.parse(localStorage.getItem("asideList")) : this.sideName;
    },
    beforeUpdate() {
      console.log("更新前.....")
    },
    updated() {
      console.log("更新完成.....")
    },
    beforeDestroy () {
      console.log("销毁前.....")
      debugger
    },
    destroyed() {
      console.log("销毁完成.....")
      debugger
    }
  }
</script>
<style scoped>
  .home{
    height: 100%;
  }
  .header{
    height: 7%;
  }
  .container{
    height: 93%;
    width: 100%;
    display: flex;
    flex-direction: row;
  }
</style>