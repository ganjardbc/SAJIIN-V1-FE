<template>
  <div class="w-full flex flex-col gap-4">
    <div class="w-full pt-4 px-4 lg:px-0 flex flex-col gap-4">
      <div class="w-full flex items-center justify-between">
        <div class="text-lg text-black font-semibold">
          Keranjang ({{ orderQuantity }})
        </div>
        <el-button
          size="small"
          @click="deleteAllProduct"
        >
          Hapus Semua
        </el-button>
      </div>

      <AppEmpty v-if="data.length === 0" />

      <Card
        v-if="data.length > 0"
        :data.sync="data"
      />
    </div>

    <div class="sticky bottom-0 bg-white z-10 w-full border-t border-gray-300 py-4 px-4 lg:px-0 flex flex-col gap-4">
      <div class="relative p-4 bg-gray-100 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="text-sm text-black font-semibold">
            Total ({{ orderQuantity }} produk)
          </div>
          <div class="text-sm text-vermillion-500 font-semibold text-right">
            {{ format(orderSubtotal) }}
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500 font-normal">
            Diskon
          </div>
          <div class="text-sm text-gray-500 font-normal text-right">
            {{ format(0) }}
          </div>
        </div>
      </div>

      <el-button
        type="primary"
        class="w-full"
        :disabled="!enableButtonCheckout"
        @click="onCheckOut"
      >
        Lanjut Check Out
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppLoader from '../../../modules/AppLoader'
import AppEmpty from '../../../modules/AppEmpty'
import Card from './Card'

export default {
  name: 'App',
  metaInfo: {
    title: 'Visitor',
    titleTemplate: '%s | Carts',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  components: {
    AppLoader,
    AppEmpty,
    Card,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeVisitorOrder.form.details,
      dataShop: (state) => state.storeVisitorShop.data,
    }),
    enableButtonCheckout() {
      return this.data && this.data.length > 0
    },
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
    orderPriceBeforeDiscount() {
      let price = 0
      this.data &&
        this.data.map((item) => {
          let quantity = item.quantity
          price += quantity * item.price
          // HIDDEN TEMPORARY
          // if (item.is_discount) {
          //     price += quantity * item.second_price
          // } else {
          //     price += quantity * item.price
          // }
        })
      return price
    },
    totalDiscount() {
      return this.orderPriceBeforeDiscount - this.orderSubtotal
    },
    isThereDiscount() {
      let status = false
      // this.data && this.data.map((item) => {
      //     if (item.is_discount) {
      //         status = true
      //     }
      // })
      return status
    },
  },
  methods: {
    ...mapActions({
      deleteAllProduct: 'storeVisitorOrder/deleteAllProduct',
    }),
    onCheckOut() {
      this.$router.push({ name: 'visitor-checkout' })
    },
  },
}
</script>
