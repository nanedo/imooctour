<template>
  <div class="login-form">
      <div class="g-form">
          <div class="g-form-line">
              <span class="g-form-label">用户名：</span>
              <div class="g-form-input">
                  <input type="text" v-model="usernameModel" placeholder="请输入用户名">
              </div>
              <span class="g-form-error">{{ userErrors.errorText }}</span>
          </div>
          <div class="g-form-line">
              <span class="g-form-label">密码：</span>
              <div class="g-form-input">
                  <input type="password" v-model="passwordModel" placeholder="请输入密码">
              </div>
              <span class="g-form-error">{{ passwordErrors.errorText }}</span>
          </div>
          <div class="g-form-line">
              <div class="g-form-btn">
                  <a @click="onLogin" class="button">登录</a>
              </div>
          </div>
          <p>{{ errorText }}</p>
      </div>
  </div>
</template>
<script>
/* import Vue from 'vue'
import VeeValidate from 'vue-validate'

Vue.use(VeeValidate) */

export default {
  props: {

  },
  data () {
    return {
      usernameModel: '',
      passwordModel: '',
      errorText: '',
      userFlag: false,
      passwordFlag: false,
      user: {

      }
    }
  },
  computed: {
    userErrors () {
      let errorText, status
      if (!/@/g.test(this.usernameModel)) {
        status = false
        errorText = '无效的邮箱账号'
      } else {
        status = true
        errorText = ''
      }

      if (!this.userFlag) {
        errorText = ''
        this.userFlag = true
      }

      return {
        status,
        errorText
      }
    },
    passwordErrors () {
      let errorText, status
      if (/^\w{1,5}$/g.test(this.passwordModel)) {
        status = false
        errorText = '密码不能少于6位'
      } else {
        status = true
        errorText = ''
      }
      // 判断是否第一次进入判断
      if (!this.passwordFlag) {
        errorText = ''
        this.passwordFlag = true
      }

      return {
        status,
        errorText
      }
    }
  },
  methods: {
    onLogin () {
      if (!this.userErrors.status || !this.passwordErrors.status) {
        this.errorText = '部分选项未通过'
      } else {
        console.log('这里显示登录状态，比如一个loading图标')
        this.errorText = ''
        this.$http.post('/api/login', {
          username: this.usernameModel,
          password: this.passwordModel
        })
          .then(res => {
            if (res.data.status === 'success') {
              this.$emit('has-log', res.data)
            } else {
              this.errorText = res.data.msg
            }
          }, err => {
            console.log('login error: ', err)
          })
      }
    }
  }
}
</script>
