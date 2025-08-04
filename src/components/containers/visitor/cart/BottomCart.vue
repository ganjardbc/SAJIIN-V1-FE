<template>
  <div
    id="App"
    class="fixed bottom-0 left-0 right-0 py-4 flex flex-col gap-4 items-center justify-center"
  >
    <router-link :to="{ name: 'visitor-carts' }">
      <el-button
        size="large"
        type="primary"
        class="rounded-full shadow-lg"
      >
        <i class="fa fa-lg fa-shopping-cart mr-2"></i>
        <span class="text-sm text-white font-semibold">
          {{ orderQuantity }} produk | {{ format(orderSubtotal) }}
        </span>
      </el-button>
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState({
      data: (state) => state.storeVisitorOrder.form.details,
      dataShop: (state) => state.storeVisitorShop.data,
    }),
    orderQuantity() {
      let quantity = 0
      this.data &&
        this.data.map((item) => {
          quantity += item.quantity
        })
      return quantity
    },
    orderSubtotal() {
      let subtotal = 0
      this.data &&
        this.data.map((item) => {
          subtotal += item.subtotal
        })
      return subtotal
    },
  },
}
</script>
