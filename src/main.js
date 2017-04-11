import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  //回调，表示如何修改app的内容
  render: h => h(App)
});
