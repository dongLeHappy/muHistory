<template>
  <div class="header-nav">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#314458"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="1">下拉1</el-menu-item>
      <el-menu-item index="2">下拉2</el-menu-item>
      <el-menu-item index="3">下拉3</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex' //注册 action 和 state
export default {
    data() {
      return {
       
        activeIndex2: '1',
        navSideName:[
          {id:'1',name:'下拉1-1'},
          {id:'2',name:'下拉1-2'},
          {id:'3',name:'下拉1-3'},
        ],
        navSideName2:[
          {id:'1',name:'下拉2-1'},
          {id:'2',name:'下拉2-2'},
          {id:'3',name:'下拉2-3'},
        ],
        navSideName3:[
          {id:'1',name:'下拉3-1'},
          {id:'2',name:'下拉3-2'},
          {id:'3',name:'下拉3-3'},
        ]
      };
    },
    mounted() {
      this.activeIndex2 = localStorage.getItem("headTabIndex") ? localStorage.getItem("headTabIndex") : this.activeIndex2; // 初始化的时候吧浏览器的值取出来
    },
    methods: {
      handleSelect(key, keyPath) { // 判断点击的是哪个
        localStorage.setItem("headTabIndex",key); // 当前的tabIndex存到浏览器里面
        switch (key) {
          case '1':
            this.$emit('getNavData',this.navSideName)
            localStorage.setItem("asideList",JSON.stringify(this.navSideName));
            break;
          case '2':
            this.$emit('getNavData',this.navSideName2)
            localStorage.setItem("asideList",JSON.stringify(this.navSideName2));
            break;
          case '3':
            this.$emit('getNavData',this.navSideName3)
            localStorage.setItem("asideList",JSON.stringify(this.navSideName3));
            break;
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-menu-item{
  padding: none;
  width: 33.3%;
  text-align: center;
  border-bottom: none!important;
  border-right: #d1dde8 2px solid;
  background-color: #5b7da0!important;
}
.el-menu--horizontal>.el-menu-item.is-active{
  background: #405d7b!important;
  border: none!important;
  color: #ffffff!important;
}
</style>
