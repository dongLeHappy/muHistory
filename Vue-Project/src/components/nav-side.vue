<template>
  <div class="aside" >
    <el-col :span="12">
        <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        background-color="#4a6b8e"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu v-for="(item,i) in navData" :key="i" :index="item.id">
            <template slot="title">
            <i class="el-icon-notebook-2"></i>
            <span>{{item.name}}</span>
            </template>
            <el-menu-item-group>
            <el-menu-item @click="getIndex(item.name,item.id)" :index="item.id">菜单1</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        </el-menu>
    </el-col>
  </div>
</template>
<script>
  export default {
    props:['navData'], 
    data() {
      return {
           activeIndex: '1',
      }
    },
    watch: {
        navData(newval,oldVal) { // 监听变化
            let ins = localStorage.getItem("asideTabIndex") == 1 ? '111' : localStorage.getItem("asideTabIndex") == 2 ? '222' : '333' ;
            let val = {
                index: newval ? localStorage.getItem("asideTabName") : oldVal[0].name,
                val: newval ? ins : '111' 
            };
            this.$emit('getName',val)
            
        }
    },
    mounted() {
        this.activeIndex = localStorage.getItem("asideTabIndex") ? localStorage.getItem("asideTabIndex") : this.activeIndex; // 初始化的时候吧浏览器的值取出来
    },
    methods: {
        getIndex(name,index) { // 点击菜单传值
            localStorage.setItem("asideTabIndex",index); // 当前的tabIndex存到浏览器里面
            localStorage.setItem("asideTabName",name); // 当前的tabName存到浏览器里面
            this.indexFunc(name,index)
        },
        indexFunc(name,index) {
            let val = {
                index:name,
                val:index == 1 ? '111' : index == 2 ? '222' : '333'  
            };
            this.$emit('getName',val)
        }
    }
  }
</script>
<style scoped>
    .aside{
        height: 100%;
        width: 20%;
        background: #4a6b8e;
    }
    .el-col-12{
        width: 100%!important;
    }
    .el-menu{
        border: none;
    }
    .el-submenu{
        border-bottom: 1px solid #9da4ab; 
    }
    .el-submenu.is-active{
        background: green;
    }
    .el-submenu__title i{
        color: #f0f9eb!important;
    }
    .el-submenu__icon-arrow.el-icon-arrow-down{
        color: #f0f9eb!important;
    }
</style>