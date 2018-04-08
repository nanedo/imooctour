<template>
  <div class="order-wrap">
      <h3>您的产品</h3>
      <div class="order-list-choose">
          <div class="order-list-option">
              选择产品：
              <v-selection :selections="products" @on-change="productChange"></v-selection>
          </div>
          <div class="order-list-option">
              开始日期：
              <v2-calendar :open-date="startDate" language="zh" :highlighted="highlightDay()" :disabled="limitDay2" :clear-button="true" format="yyyy-MM-dd" @selected="getStartDate"></v2-calendar>
          </div>
          <div class="order-list-option">
              结束日期：
              <v2-calendar :open-date="endDate || startDate" :disabled="limitDay" language="zh" :highlighted="highlightDay()" :clear-button="true" format="yyyy-MM-dd" @selected="getEndDate"></v2-calendar>
          </div>
          <div class="order-list-option">
              关键词：
              <input type="text" v-model.lazy="query" class="order-query">
          </div>
      </div>
      <div class="order-list-table">
          <table>
              <tr>
                  <th v-for="(head, index) in tableHeads" :key="index" @click="changeOrderType(head)" :class="{active: head.active}">{{ head.label }}</th>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index">
                  <td v-for="(head, inx) in tableHeads" :key="inx">{{ item[head.key] }}</td>
              </tr>
          </table>
      </div>
  </div>
</template>
<script>
import VSelection from '@/components/base/selection'
import VueTimepicker from 'vuejs-datepicker'

export default {
  components: {
    VSelection,
    V2Calendar: VueTimepicker
  },
  data () {
    return {
      query: '',
      productId: 0,
      endDate: '',
      startDate: new Date('2016-05-01'),
      products: [
        {
          label: '全部数据',
          value: -1
        },
        {
          label: '数据统计',
          value: 0
        },
        {
          label: '数据预测',
          value: 1
        },
        {
          label: '流量分析',
          value: 2
        },
        {
          label: '广告发布',
          value: 3
        }
      ],
      tableHeads: [
        {
          label: '订单号',
          key: 'orderId'
        },
        {
          label: '购买产品',
          key: 'product'
        },
        {
          label: '版本类型',
          key: 'version'
        },
        {
          label: '有效时间',
          key: 'period'
        },
        {
          label: '购买日期',
          key: 'date'
        },
        {
          label: '数量',
          key: 'buyNum'
        },
        {
          label: '总价',
          key: 'amount'
        }
      ],
      currentOrder: 'asc'
      // tableData: []
    }
  },
  computed: {
    tableData () {
      return this.$store.getters.getOrderList
    },
    limitDay () {
      return {
        from: new Date(),
        to: this.startDate
      }
    },
    limitDay2 () {
      return {
        // 禁止这天以后的日期
        from: this.endDate || new Date()/* ,
        // 禁止这天以前的日期
        to: new Date(this.startDate) */
      }
    }
  },
  methods: {
    highlightDay () {
      return {
        // Highlight all dates after specific date
        from: this.startDate,
        // Highlight all dates up to specific date
        to: this.endtDate,
        includeDisabled: true
      }
    },
    productChange (obj) {
      // this.productId = obj.value
      // this.getList()

      this.$store.commit('updateParams', {
        key: 'productId',
        val: parseInt(obj.value, 10)
      })
      this.getList()
    },
    changeOrderType (head) {
      this.tableHeads = this.tableHeads.map((item) => {
        item.active = false
        return item
      })
      head.active = true
      this.currentOrder = this.currentOrder === 'asc' ? 'desc' : 'asc'
      // this.tableData = _.orderBy(this.tableData, head.key, this.currentOrder)

      this.$store.commit('updateSortParam', {
        key: 'key',
        val: head.key
      })

      this.$store.commit('updateSortParam', {
        key: 'order',
        val: this.currentOrder
      })

      this.$store.dispatch('sortOrderList')
    },
    getStartDate (date) {
      /* this.startDate = date
      this.getList() */
      this.startDate = date
      this.$store.commit('updateParams', {
        key: 'startDate',
        val: date
      })
      this.getList()
    },
    getEndDate (date) {
      /* this.endDate = date
      this.getList() */
      this.endDate = date
      this.$store.commit('updateParams', {
        key: 'endDate',
        val: date
      })
      this.getList()
    },
    getList () {
      // 重置表格排序部分
      this.tableHeads = this.tableHeads.map((item) => {
        item.active = false
        return item
      })
      this.$store.dispatch('fetchOrderList')
    }
    /*       getList () {
          let reqParams = {
            query: this.query,
            productId: this.productId,
            startDate: this.startDate,
            endDate: this.endDate
          }
          this.$http.post('/api/getOrderList', reqParams)
          .then((res) => {
              this.tableData = res.data.list
          }, (err) => {
              console.log('getList: ',err)
          })
      } */
  },
  watch: {
    '$route': 'getList',
    query (value) {
      this.$store.commit('updateParams', {
        key: 'query',
        val: value
      })
      this.getList()
    }
  },
  mounted () {
    // this.getList()
    this.getList()
    console.log('store: ', this.$store)
  }
}
</script>
<style scoped>
.order-wrap {
  width: 1200px;
  min-height: 800px;
  margin: 20px auto;
  overflow: hidden;
}
.order-wrap h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
.order-query {
  height: 25px;
  line-height: 25px;
  border: 1px solid #e3e3e3;
  outline: none;
  text-indent: 10px;
}
.order-list-option {
  display: inline-block;
  padding-left: 15px;
}
.order-list-option:first-child {
  padding-left: 0;
}
.order-list-table {
  margin-top: 20px;
}
.order-list-table table {
  width: 100%;
  background: #fff;
}
.order-list-table td,
.order-list-table th {
  border: 1px solid #e3e3e3;
  text-align: center;
  padding: 10px 0;
}
.order-list-table th {
  background: #4fc08d;
  color: #fff;
  border: 1px solid #4fc08d;
  cursor: pointer;
}
.order-list-table th.active {
  background: #35495e;
}
</style>
