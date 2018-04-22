<template>
  <div @click="resetSelect">
      <div class="app-head">
          <div class="app-head-inner">
              <router-link to="/"><img src="../assets/logo.png" alt=""></router-link>
              <div class="head-nav">
                  <ul class="nav-list">
                     <li><iframe src="https://ghbtns.com/github-btn.html?user=nanedo&repo=imooctour&type=watch&count=false&size=large" frameborder="0" scrolling="0" width="100px" height="30px"></iframe></li>
                      <li>{{ username }}</li>
                      <li v-if="username!==''" class="nav-pile">|</li>
                      <li v-if="username!==''" @click="logout">退出</li>
                      <li v-if="username===''" @click="logClick">登录</li>
                      <li class="nav-pile">|</li>
                      <li v-if="username===''" @click="regClick">注册</li>
                      <li v-if="username===''" class="nav-pile">|</li>
                      <li @click="aboutClick">关于</li>
                  </ul>
              </div>
          </div>
      </div>
      <div class="app-content">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
      </div>
      <div class="app-foot">
          <p>© 2018 Heyongqing MIT</p>
      </div>
      <my-dialog :isShow="isShowPop" @on-close="closeDialog">
          <component :is="popCom" @has-log="onSuccessLog"></component>
      </my-dialog>
  </div>
</template>
<script>
// import 'normalize.css'
import Vue from 'vue'
import MyDialog from './base/dialog'
import LogForm from './logForm'
import RegForm from './regForm'
import About from './about'
import VueCookies from 'vue-cookies'
import axios from 'axios'
import {eventBus} from '../eventBus'

Vue.use(VueCookies)

export default {
  components: {
    MyDialog,
    LogForm,
    RegForm,
    About
  },
  created () {
    // 在这里读取cookie，看是否为登录状态
    if (this.$cookies.get('username')) {
      this.username = this.$cookies.get('username')
    }
    // 如果没有登录， 则显示登录框
    let _this = this
    axios.interceptors.response.use(function (res) {
      let config = res.config
      let data = res.data
      console.log('axios config: ', config)
      if (data.nologin === true) {
        _this.isShowPop = true
        _this.popCom = 'LogForm'
        // 只有这样才能拦截后续的reslove处理
        return Promise.reject('nologin')
      } else {
        return res
      }
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    })
  },
  data () {
    return {
      isShowPop: false,
      popCom: 'Hello',
      username: ''
    }
  },
  methods: {
    logClick () {
      this.isShowPop = true
      this.popCom = 'LogForm'
    },
    regClick () {
      this.isShowPop = true
      this.popCom = 'RegForm'
    },
    aboutClick () {
      this.isShowPop = true
      this.popCom = 'About'
    },
    closeDialog () {
      this.isShowPop = false
    },
    onSuccessLog (data) {
      this.closeDialog()
      this.username = data.username
    },
    /*      onSuccessLogout (data) {
         this.username = data.username
     },
     quit () {
         // 应该由后端进行操作
         this.$cookies.set('username','')
         this.username = ''
     }, */
    logout () {
      this.$http.get('/api/logout').then(res => {
        this.username = ''
        console.log('退出登录后，直接重载页面清空所有状态是最方便的')
      }, err => {
        console.log('logout error: ', err)
      })
    },
    resetSelect () {
      eventBus.$emit('reset-component')
    }

  }
}
</script>
<style>
/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
a {
  color: inherit;
  text-decoration: none;
}
body {
  background: #f0f2f5;
  font-family: "Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3","Microsoft YaHei UI","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
  font-size: 14px;
  color: #444;
}
.app-head {
  background: #363636;
  color: #b2b2b2;
  height: 90px;
  line-height: 90px;
  width: 100%;
  min-width: 1200px;
}
.app-head-inner {
  width: 1200px;
  margin: 0 auto;
}
.head-logo {
  float: left;
}
.app-head-inner img {
  width: 50px;
  margin-top: 20px;
}
.head-nav {
  float: right;
}
.head-nav ul {
  overflow: hidden;
}
.head-nav li {
  cursor: pointer;
  float: left;
}
.nav-pile {
  padding: 0 10px;
}
.app-foot {
  text-align: center;
  height: 80px;
  width: 100%;
  line-height: 80px;
  background: #e3e4e8;
  clear: both;
  margin-top: 30px;
}
.container {
  width: 1200px;
  margin: 0 auto;
}
.hr {
  height: 1px;
  width: 100%;
  background: #ddd;
}
.button {
  background: #4fc08d;
  color: #fff;
  display: inline-block;
  padding: 10px 20px;
  cursor: pointer;
}
.button:hover {
  background: #019452;
}

.g-form-line {
  padding: 15px 0;
}
.g-form-label {
  width: 100px;
  font-size: 16px;
  display: inline-block;
}
.g-form-input {
  display: inline-block;
}
.g-form-input input {
  height: 30px;
  width: 200px;
  line-height: 30px;
  vertical-align: middle;
  padding: 0 10px;
  border: 1px solid #ccc;
}
.g-form-btn {
  padding-left: 100px;
}
.g-form-error {
  color: red;
  padding-left: 15px;
}
</style>
