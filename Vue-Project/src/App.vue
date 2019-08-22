<template>
  <div id="app">
    <keep-alive>
      <router-view :key="$route.fullPath"/>
    </keep-alive>
    
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
  #app{
    height: 100%;
  }
</style>>
