import Vue from 'vue'
import VueCookies from 'vue-cookies'

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {data as newsList} from './newsList'
import User from './user'
import orderList from './orderList'
console.log('user： ', User)
// https://github.com/ctimmerm/axios-mock-adapter

function saveData () {
  localStorage.orderList = JSON.stringify(orderList.list)
}

function fetchData () {
  if (localStorage.orderList) {
    orderList.list = JSON.parse(localStorage.orderList)
  }
}

fetchData()

Vue.use(VueCookies)

var mock = new MockAdapter(axios)
// 请求最新消息
mock.onGet('api/getNewsList').reply(function (cfg) {
  console.log('api/getNewsList: ', cfg.data)
  return [200, newsList]
})

// 请求登录
mock.onPost('api/login').reply(function (cfg) {
  var params = JSON.parse(cfg.data)
  if (params.username && params.password) {
    let isLogin = User.list.some((user) => {
      if (user.username === params.username && user.password === params.password) {
        return true
      } else {
        return false
      }
    })
    if (isLogin) {
      // 登录成功，写入cookie
      Vue.cookies.set('username', params.username)

      return [200, {
        status: 'success',
        username: params.username,
        msg: '登录成功'
      }]
    } else {
      return [200, {
        status: 'fail',
        msg: '登录失败，错误的用户名或者密码~'
      }]
    }
  } else {
    return [200, {
      status: 'fail',
      msg: '登录失败，错误的用户名或者密码~'
    }]
  }
})

// 请求登出
mock.onGet('api/logout').reply(function (cfg) {
  // 清除登录cookie
  Vue.cookies.set('username', '')
  return [200, {status: 'success', username: ''}]
})

// 请求注册
mock.onPost('api/register').reply(function (cfg) {
  var params = JSON.parse(cfg.data)
  if (params.username && params.password) {
    let hasRegisted = User.list.some((user) => {
      if (user.username === params.username && user.password === params.password) {
        return true
      } else {
        return false
      }
    })
    if (hasRegisted) {
      return [200, {
        status: 'fail',
        username: '',
        msg: '注册失败，用户名 ' + params.username + ' 已存在'
      }]
    } else {
      // 注册成功，写入cookie
      Vue.cookies.set('username', params.username)
      User.list.push(params)

      return [200, {
        status: 'success',
        msg: '注册成功，自动为您登录',
        username: params.username
      }]
    }
  } else {
    return [200, {
      status: 'fail',
      msg: '注册失败，用户名或者密码不符合要求'
    }]
  }
})

// 请求价格
mock.onPost('api/getPrice').reply(function (cfg) {
  return [200, {
    amount: 500
  }]
})

// 请求下单
const productHash = ['数据统计', '数据预测', '流量分析', '广告发布']
mock.onPost('api/createOrder').reply(function (cfg) {
  console.log(`orderinfo:`, cfg)

  let user = Vue.cookies.get('username')
  let body = JSON.parse(cfg.data)
  let theDay = new Date()
  let item = {
    'orderId': Math.random().toString().slice(2),
    'productId': body.productId || 0,
    'product': productHash[body.productId],
    'version': body.version || '基础版',
    'period': (body.period || 1) + '年',
    'buyNum': body.buyNum || 1,
    'date': theDay.getFullYear() + '-' + (theDay.getMonth() + 1) + '-' + theDay.getDate(),
    'amount': parseInt(10000 * Math.random()) + '元'
  }
  if (user) {
    console.log('createOrder success~~', item)
    orderList.list.push(item)
    saveData()
  }
  return [200, user ? {
    orderId: item.orderId
  } : {
    nologin: true
  }]
})

// 获取订单列表
// query endDate startDate productId
mock.onPost('api/getOrderList').reply(function (cfg) {
  console.log('api/getOrderList: ', cfg.data)
  let user = Vue.cookies.get('username')
  let params = JSON.parse(cfg.data)
  let resList = orderList.list
  if (user) {
    if (params.query) {
      resList = resList.filter((item) => {
        return JSON.stringify(item).indexOf(params.query) > -1
      })
    }
    if (typeof params.productId !== 'undefined' && params.productId !== -1) {
      resList = resList.filter((item) => {
        return item.productId === params.productId
      })
    }
    if (params.startDate) {
      resList = resList.filter((item) => {
        return new Date(item.date) >= new Date(params.startDate)
      })
    }
    if (params.endDate) {
      resList = resList.filter((item) => {
        return new Date(item.date) <= new Date(params.endDate)
      })
    }
  }
  return [200, user ? {list: resList} : {
    nologin: true
  }]
})

// 判断是否支付成功
mock.onPost('api/checkOrder').reply(function (cfg) {
  let user = Vue.cookies.get('username')
  if (!user) {
    return [200, {
      nologin: true
    }]
  }
  if (Math.random() > 0.5) {
    return [500, {
      status: 'fail',
      msg: '支付失败，请检查您的银行卡余额'
    }]
  } else {
    return [200, {
      status: 'success',
      msg: '支付成功'
    }]
  }
})

export {mock}
