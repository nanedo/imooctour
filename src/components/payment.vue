<template>
  <div>
    <my-dialog :is-show="isShow" @on-close="hidePayDialog">
        <table class="buy-dialog-table">
          <tr>
            <th v-for="(item, index) in items" :key="index">{{ item.label}}</th>
          </tr>
          <tr>
            <td v-for="(item, index) in items" :key="index">
              <template v-if="Array.isArray(item.value)">
                <span v-for="(item2, index2) in item.value" :key="index2"> {{ item2.label }} </span>
              </template>
              <template v-else>
                {{ item.value }}
              </template>
            </td>
          </tr>
        </table>
        <h3 class="buy-dialog-title">请选择银行</h3>
        <bank-chooser @on-change="onChangeBanks"></bank-chooser>
        <div class="button buy-dialog-btn" @click="confirmBuy">
          确认购买
        </div>
      </my-dialog>
      <my-dialog :is-show="isShowErrDialog" @on-close="hideErrDialog">
        支付失败！
      </my-dialog>
      <check-order :is-show-check-dialog="isShowCheckOrder" :order-id="orderId" @on-close-check-dialog="hideCheckOrder"></check-order>
  </div>
</template>

<script>
import MyDialog from '@/components/base/dialog'
import CheckOrder from '@/components/checkOrder'
import BankChooser from '@/components/bankChooser'

export default {
  components: {
    MyDialog,
    CheckOrder,
    BankChooser
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    isShow: {
      type: Boolean,
      default: false,
      required: true
    },
    reqParams: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      bankId: '',
      isShowCheckOrder: false,
      isShowErrDialog: false,
      orderId: ''
    }
  },
  filters: {
    makeHtml (value) {
      return value
    }
  },
  methods: {
    onChangeBanks (bankObj) {
      this.bankId = bankObj.id
    },
    hidePayDialog () {
      this.$emit('close')
    },
    hideCheckOrder () {
      this.isShowCheckOrder = false
    },
    hideErrDialog () {
      this.isShowErrDialog = false
    },
    confirmBuy () {
      this.$http.post('/api/createOrder', Object.assign({
        bankId: this.bankId
      }, this.reqParams))
        .then((res) => {
          this.orderId = res.data.orderId
          this.isShowCheckOrder = true
          this.$emit('close')
        }, (err) => {
          console.log(err)
          this.$emit('close')
          this.isShowErrDialog = true
        })
    }
  }
}
</script>

<style scoped>
.buy-dialog-title {
  font-size: 16px;
  font-weight: bold;
}
.buy-dialog-btn {
  margin-top: 20px;
}
.buy-dialog-table {
  width: 100%;
  margin-bottom: 20px;
}
.buy-dialog-table td,
.buy-dialog-table th{
  border: 1px solid #e3e3e3;
  text-align: center;
  padding: 5px 0;
}
.buy-dialog-table th {
  background: #4fc08d;
  color: #fff;
  border: 1px solid #4fc08d;
}
</style>
