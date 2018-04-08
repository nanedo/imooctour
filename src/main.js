// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Layout from './components/layout'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
// 改为直接引入mock数据 
import './mock'

// 测试环境下引入mock库
// if(process.env.NODE_ENV === 'development'){
//  console.log('import mock data~~~')
//  require('./mock')
//} 

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { Layout },
  template: '<Layout/>'
})
