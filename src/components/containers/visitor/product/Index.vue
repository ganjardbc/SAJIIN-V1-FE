<template>
  <div id="App">
    <Category v-if="isThereOpenedCashbook" />
    <Product v-if="isThereOpenedCashbook" />
    <AppEmpty v-if="!isThereOpenedCashbook" title="Toko Sedang Tutup" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Category from './category/Index'
import Product from './list/Index'
import AppEmpty from '../../../modules/AppEmpty'

export default {
  name: 'App',
  components: {
    AppEmpty,
    Category,
    Product,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeVisitorShop.data,
    }),
    cashBook() {
      return this.data && this.data.cashbook
    },
    isThereOpenedCashbook() {
      return this.cashBook && this.cashBook.cash_status === 'open'
    },
  },
}
</script>
