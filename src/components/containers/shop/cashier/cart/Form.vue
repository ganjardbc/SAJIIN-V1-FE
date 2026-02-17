<template>
  <div id="App" class="w-full flex flex-col">
    <div class="sticky top-0 w-full bg-white p-4 flex justify-between items-center z-10 border-b border-dashed-200">
      <h1 class="text-sm text-black font-semibold">
        Keranjang
        <span
          v-if="orderQuantity"
          class="text-sm text-gray-500"
        >
          ({{ orderQuantity }})
        </span>
      </h1>

      <div class="flex items-center justify-end">
        <el-button
          size="mini"
          :disabled="!isThereDetails"
          @click="deleteAllProduct"
        >
          Hapus Produk
        </el-button>
        <el-button
          v-if="deviceType !== 'desktop'"
          class="border-none"
          circle
          @click="onClose"
        >
          <i class="fa fa-lg fa-times"></i>
        </el-button>
      </div>
    </div>

    <CashierMain
      @onCreateOrder="onCreateOrder"
      @onCheckOut="onCheckOut"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CashierMain from './Main'

export default {
  name: 'App',
  components: {
    CashierMain,
  },
  computed: {
    ...mapState({
      deviceType: (state) => state.application.deviceType,
      details: (state) => state.storeCashier.form.details,
      dataCurrent: (state) => state.storeCashBook.dataCurrent,
    }),
    currentCashBook() {
      return this.dataCurrent && this.dataCurrent.current_cashbook
    },
    orderQuantity() {
      let quantity = 0
      this.details &&
        this.details.map((item) => {
          quantity += item.quantity
        })
      return quantity
    },
    isThereDetails() {
      return this.details.length > 0
    },
    isThereOpenedCashbook() {
      return this.currentCashBook && this.currentCashBook.cash_status === 'open'
    },
  },
  methods: {
    ...mapActions({
      deleteAllProduct: 'storeCashier/deleteAllProduct',
    }),
    onCreateOrder() {
      this.$emit('onCreateOrder')
    },
    onCheckOut() {
      this.$emit('onCheckOut')
    },
    onClose() {
      this.$emit('onClose')
    },
  },
}
</script>
