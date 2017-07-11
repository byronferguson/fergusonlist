import Vue from 'vue'
import App from './App.vue'

import './firebase'
import VueFire from 'vuefire'
Vue.use(VueFire)

import { currency } from './currency'

Vue.filter('currency', currency)


new Vue({
  el: '#app',
  render: h => h(App)
})
