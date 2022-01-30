import Vue from 'vue'
import Vuex from 'vuex'
import sop from './modules/sop'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    sop
  },
})
