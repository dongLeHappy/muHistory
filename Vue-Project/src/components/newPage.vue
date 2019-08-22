<template>
  <div class="newPage">
      <h4>我是【{{pageData ? pageData.index : ''}}】下面的【菜单1】下面的数据:{{pageData ? pageData.val : ''}}</h4>
  </div>
</template>
<script>
  export default {
    data() {
        return {
            pageData:""
        }
    },
    watch: { // 监听路由变化
        '$route.query.data': function(newVal, oldVal){
            this.pageData = newVal;
        }
    },
    mounted() { // 路由取值
        this.pageData = this.$route.query.data;
    }
  }
</script>
<style scoped>
    
</style>