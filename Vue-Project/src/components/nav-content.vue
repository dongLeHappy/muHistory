<template>
  <div class="content-nav">
      <div class="dataContent">
        <h4>我是{{parmars.index}}下面的菜单1，我的数据是：{{parmars.val}}</h4>
        <el-input v-model="parmars.val" placeholder="请输入内容"></el-input>
        <el-button @click="newPage">新页面传值</el-button>
      </div>
  </div>
</template>
<script>
  export default {
    props:['name'], // 接收值
    data(){
        return {
            parmars:""
        }
    },
    watch: {
        name(newVal, oldVal){
            if(newVal != oldVal){
                this.parmars = newVal;
            }
        }
    },
    methods: {
        newPage() { // 路由跳转新页面。通过路由传参
            this.$router.push({path:'/newPage',query:{data:this.parmars}});
        }
    }
  }
</script>
<style scoped>
    .content-nav{
        width: 80%;
        height: 100%;
        background: #EBEEF5;
    }
    h4{
        text-align: center;
    }
    .el-input{
        width: 50%;
        margin-left: 20%; 
    }
    .dataContent{
        margin-top: 20%;
    }
    .el-button{
        margin: 10px 0 0 10px;
    }
</style>