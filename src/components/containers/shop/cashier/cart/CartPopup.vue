<template>
  <div id="CartPopup" class="cart-popup">
    <div class="bg-white w-full p-4 shadow-lg rounded-lg">
      <div class="flex justify-between items-center">
        <div style="width: 50px">
          <div
            class="relative bg-vermillion-100 rounded-lg flex flex-col justify-center items-center"
            style="width: 40px; height: 40px;"
          >
            <i
              class="icn fa fa-lw fa-shopping-cart text-sm text-vermillion-500"
            ></i>
          </div>
        </div>
        <div style="width: calc(100% - 90px)">
          <div class="text-xs text-gray-500">Keranjang</div>
          <div class="display-flex">
            <span class="text-sm text-gray-900 font-semibold"
              >{{ orderQuantity }} Produk</span
            >
            <span class="text-sm text-gray-900" style="margin: 0 3px">|</span>
            <span class="text-sm text-gray-900 font-semibold">{{
              format(orderPrice)
            }}</span>
          </div>
        </div>
        <div style="width: 40px">
          <el-button
            size="medium"
            circle
            style="width: 40px; height: 40px;"
            @click="onClick"
          >
            <i class="fa fa-lw fa-arrow-right"></i>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'CartPopup',
  computed: {
    ...mapState({
      form: (state) => state.storeCashier.form,
      details: (state) => state.storeCashier.form.details,
    }),
    orderQuantity() {
      return (this.details || []).reduce((sum, item) => sum + item.quantity, 0)
    },
    orderPrice() {
      return (this.details || []).reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      )
    },
    isThereDetails() {
      return this.details.length > 0
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick')
    },
  },
}
</script>
