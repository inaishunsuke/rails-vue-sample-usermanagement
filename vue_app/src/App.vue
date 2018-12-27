<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
//import store from './store.js'

export default {
  name: 'App',
  mounted() {

//   console.log(this.$store.state.count)
   this.$store.commit('increment')
//   console.log(this.$store.state.count)
/*
   console.log(store.state.count)
   store.commit('increment')
   console.log(store.state.count)
   */
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /*
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  */
  color: #2c3e50;
  margin: 20px 20px;
}
</style>
