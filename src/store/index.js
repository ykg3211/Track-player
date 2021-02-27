import Vue from 'vue';
import Vuex from 'vuex';
import store from './store';
const debug = process.env.NODE_ENV !== 'production';
Vue.use(Vuex);
 export default new Vuex.Store({
 modules: {
    store
 },
 strict: debug, //开启严格模式
   plugins: debug ? [createLogger()] : []
 })