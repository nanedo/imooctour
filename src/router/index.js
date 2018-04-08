import Vue from 'vue'
import Router from 'vue-router'
import IndexPage from '@/pages/index'
import OrderList from '@/pages/orderList'
import DetailPage from '@/pages/detail'
import CountPage from '@/pages/detail/count'
import ForecastPage from '@/pages/detail/forecast'
import AnalysisPage from '@/pages/detail/analysis'
import PublishPage from '@/pages/detail/publish'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexPage
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: OrderList
    },
    {
      path: '/detail',
      name: 'detail',
      redirect: '/detail/count',
      component: DetailPage,
      children: [
        {
          path: "forecast",
          component: ForecastPage
        },
        {
          path: "count",
          component: CountPage
        },
        {
          path: "analysis",
          component: AnalysisPage
        },
        {
          path: "publish",
          component: PublishPage
        }
      ]
    }
  ]
})
