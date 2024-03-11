<template>
  <div id="App" class="right-form-container">
    <CartPopup
      v-if="isThereOpenedCashbook"
      class="mobile-medium-visible"
      @onClick="onOpenCart"
    />
    <div
      :class="`right-form-card ${visibleCart && 'show'} bg-white box-shadow`"
    >
      <div
        class="right-form-header display-flex space-between align-center bg-white"
      >
        <h1 class="fonts fonts-12 black semibold">
          Keranjang
          <span v-if="orderQuantity" class="fonts fonts-9"
            >({{ orderQuantity }})</span
          >
        </h1>
        <div class="display-flex align-center">
          <button
            class="btn btn-small btn-main-reverse with-border with-hover"
            :disabled="!isThereDetails"
            @click="deleteAllProduct"
          >
            Hapus Produk
          </button>
          <button
            class="btn btn-white btn-icon btn-circle margin margin-left-10px mobile-medium-visible"
            @click="onCloseCart"
          >
            <i class="fa fa-lg fa-times"></i>
          </button>
        </div>
      </div>
      <CashierMain
        @onCreateOrder="onCreateOrder"
        @onCheckOut="onCheckOut"
      ></CashierMain>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import CashierMain from './Main'
import CartPopup from './CartPopup'

export default {
  name: 'App',
  data() {
    return {
      visibleCart: false,
    }
  },
  components: {
    CashierMain,
    CartPopup,
  },
  computed: {
    ...mapState({
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
    onOpenCart() {
      this.visibleCart = true
    },
    onCloseCart() {
      this.visibleCart = false
    },
  },
}
</script>
