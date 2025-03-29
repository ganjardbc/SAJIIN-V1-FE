<template>
  <div id="App">
    <div class="padding padding-top-50px padding-bottom-50px">
      <AppEmpty
        icon="fa fa-3x fa-shapes"
        title="WELCOME TO SAJI-IN SHOP PANEL"
      />
      <AppCardCircle :data="cards" />
    </div>
  </div>
</template>
<script>
import AppEmpty from '../../modules/AppEmpty'
import AppCardCircle from '../../modules/AppCardCircle'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Home',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      cards: [
        { title: 'Kasir', icon: 'fa fa-2x fa-laptop', link: 'shop-cashier', permission: 'cashier' },
        { title: 'Penjualan', icon: 'fa fa-2x fa-list-ul', link: 'shop-orders', permission: 'orders' },
        {
          title: 'Produksi',
          icon: 'fa fa-2x fa-cubes',
          link: 'shop-task-lists',
          permission: 'tasklists',
        },
        { title: 'Pembelian', icon: 'fa fa-2x fa-coins', link: 'shop-expense', permission: 'expense-list' },
        {
          title: 'Buku Kas',
          icon: 'fa fa-2x fa-money-check',
          link: 'shop-cash-book',
          permission: 'cashbooks',
        },
        {
          title: 'Lainnya',
          icon: 'fa fa-2x fa-bars',
          link: 'shop-more',
          permission: 'more',
        },
      ],
    }
  },
  components: {
    AppEmpty,
    AppCardCircle,
  },
}
</script>
