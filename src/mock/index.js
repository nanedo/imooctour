import Vue from 'vue'
import VueCookies from 'vue-cookies'

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {data as newsList} from './newsList'
import User from './user'
import orderList from './orderList'
console.log('user： ', User)
// https://github.com/ctimmerm/axios-mock-adapter

var mocker = new MockAdapter(axios)
// 请求最新消息
mocker.onGet('api/getNewsList').reply(function(cfg){
    console.log('api/getNewsList: ', cfg.data)
    return [200, newsList]
})

// 请求登录
mocker.onPost('api/login').reply(function(cfg){
    var params = JSON.parse(cfg.data)
    if(params.username && params.password){
        let isLogin = User.list.some((user) => {
            if(user.username === params.username && user.password === params.password){
                return true
            } else {
                return false
            }
        })
        if(isLogin){
            // 登录成功，写入cookie
            Vue.cookies.set('username', params.username)

            return [200, {
                status: 'success',
                username: params.username,
                msg: '登录成功'
            }]
        }else{
            return [200, {
                status: 'fail',
                msg: '登录失败，错误的用户名或者密码~'
            }]
        }
    }else{
        return [200, {
            status: 'fail',
            msg: '登录失败，错误的用户名或者密码~'
        }]
    }
})

// 请求登出
mocker.onGet('api/logout').reply(function(cfg){
    // 清除登录cookie
    Vue.cookies.set('username','')
    return [200, {status: 'success',
    username: ''}];
})

// 请求注册
mocker.onPost('api/register').reply(function(cfg){
    var params = JSON.parse(cfg.data)
    if(params.username && params.password){
        let hasRegisted = User.list.some((user) => {
            if(user.username === params.username && user.password === params.password){
                return true
            } else {
                return false
            }
        })
        if(hasRegisted){
            return [200, {
                status: 'fail',
                username: '',
                msg: '注册失败，用户名 ' + params.username + ' 已存在'
            }]
        }else{
            // 注册成功，写入cookie
            Vue.cookies.set('username', params.username)
            User.list.push(params)

            return [200, {
                status: 'success',
                msg: '注册成功，自动为您登录',
                username: params.username
            }]
        }
    }else{
        return [200, {
            status: 'fail',
            msg: '注册失败，用户名或者密码不符合要求'
        }]
    }
})

// 请求价格
mocker.onPost('api/getPrice').reply(function(cfg){

    return [200, {
        amount: 500
    }]
})

// 请求下单
mocker.onPost('api/createOrder').reply(function(cfg){

    return [200, {
        orderId: 'asfasdfsa'
    }];
})

// 获取订单列表
mocker.onPost('api/getOrderList').reply(function(cfg){
    console.log('api/getOrderList: ', cfg.data)
    return [200, orderList]
})

// 判断是否支付成功
mocker.onPost('api/checkOrder').reply(function(cfg){
    if(Math.random() > 0.5){
        return [500, {
            status: 'fail',
            msg: '支付失败，请检查您的银行卡余额'
        }]
    }else{
        return [200, {
            status: 'success',
            msg: '支付成功'
        }]
    }
   
})

export {mock}
