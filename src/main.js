import Vue from 'vue'
import App from './App.vue'

import axios from 'axios';
Vue.prototype.$http = axios;
Vue.prototype.$moralis = require('moralis/node');

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
