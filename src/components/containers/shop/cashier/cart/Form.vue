<template>
  <div id="App" class="right-form-card bg-white box-shadow">
    <div
      class="right-form-header display-flex space-between align-center bg-white"
    >
      <h1 class="fonts small black bold">
        Keranjang
        <span v-if="orderQuantity">({{ orderQuantity }})</span>
      </h1>
      <button
        v-if="isThereDetails"
        class="btn btn-small btn-main-reverse with-border with-hover"
        :disabled="!isThereDetails"
        @click="deleteAllProduct"
      >
        Hapus Semua
      </button>
    </div>
    <div>
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

export default {
  name: 'App',
  components: {
    CashierMain,
  },
  computed: {
    ...mapState({
      details: (state) => state.storeCashier.form.details,
    }),
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
  },
}
</script>
