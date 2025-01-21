<template>
  <div id="App">
    <AppHeaderMobile title="Laporan" />
    <AppTabLinks :data="tabs" @onChange="onChange" />
    <ProfitAndLoss v-if="selectedIndex === 'profit-and-loss'" />
    <CashFlows v-if="selectedIndex === 'cash-flows'" />
    <OrderExpense v-if="selectedIndex === 'financial-reports'" />
  </div>
</template>
<script>
import AppTabLinks from '../../../modules/AppTabLinks'
import AppHeaderMobile from '../../../modules/AppHeaderMobile'
import ProfitAndLoss from './profitAndLoss/Index'
import CashFlows from './cashFlows/Index'
import OrderExpense from './orderExpense/Index'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Reports',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      selectedIndex: 'profit-and-loss',
      tabs: [
        { id: 1, title: 'Laba Rugi', path: 'profit-and-loss' },
        { id: 2, title: 'Arus Kas', path: 'cash-flows' },
        { id: 4, title: 'Penjualan & Pembelian', path: 'financial-reports' },
      ],
    }
  },
  mounted() {

  },
  computed: {
    
  },
  components: {
    AppTabLinks,
    AppHeaderMobile,
    ProfitAndLoss,
    CashFlows,
    OrderExpense,
  },
  methods: {
    onChange(value) {
      this.selectedIndex = value.name
    },
  },
}
</script>
