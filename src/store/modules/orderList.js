import Vue from 'vue'
import _ from 'lodash'

const state = {
  orderList: [],
  params: {},
  sortParams: {
    key: '',
    order: 'asc'
  }
}
const getters = {
  getOrderList: state => state.orderList
}
const actions = {
  fetchOrderList ({ commit, state }) {
    Vue.axios.post('/api/getOrderList', state.params)
      .then((res) => {
        commit('updateOrderList', res.data.list)
      }, (err) => {
        console.log('fetch: ', err)
      })
  },
  sortOrderList ({ commit, state }) {
    commit('updateOrderList', _.orderBy(state.orderList, state.sortParams.key, state.sortParams.order))
  }
}
const mutations = {
  updateOrderList (state, payload) {
    state.orderList = payload
  },
  updateParams (state, {key, val}) {
    state.params[key] = val
  },
  updateParams2 (state, payload) {
    state.params[payload.key] = payload.val
  },
  updateSortParam (state, payload) {
    state.sortParams[payload.key] = payload.val
  },
  resetSortParam (state) {
    state.sortParams = {
      key: '',
      order: 'asc'
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
