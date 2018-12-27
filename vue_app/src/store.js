import 'babel-polyfill'
import Vue from 'Vue'
import Vuex from 'Vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})
export default store
