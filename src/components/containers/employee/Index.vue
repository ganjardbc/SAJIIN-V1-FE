<template>
  <div id="App">
    <div class="padding padding-top-50px padding-bottom-50px">
      <AppEmpty
        icon="fa fa-3x fa-shapes"
        title="WELCOME TO SAJI-IN EMPLOYEE PANEL"
      />
      <AppCardCircle :data="remappedCards" />
    </div>
  </div>
</template>
<script>
import AppEmpty from '../../modules/AppEmpty'
import AppCardCircle from '../../modules/AppCardCircle'

export default {
  name: 'App',
  metaInfo: {
    title: 'Employee',
    titleTemplate: '%s | Home',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      cards: [],
    }
  },
  mounted() {
    const role = this.$cookies.get('role')
    switch (role.role_name) {
      case 'kitchen':
        this.cards = [
          {
            title: 'Produksi',
            icon: 'fa fa-2x fa-list-alt',
            link: 'employee-task-lists',
          },
          {
            title: 'Profil',
            icon: 'fa fa-2x fa-user',
            link: 'employee-profile',
          },
        ]
        break
      case 'waiter':
        this.cards = [
          {
            title: 'Penjualan',
            icon: 'fa fa-2x fa-list-ul',
            link: 'employee-orders',
          },
          {
            title: 'Profil',
            icon: 'fa fa-2x fa-user',
            link: 'employee-profile',
          },
        ]
        break
      case 'cashier':
        this.cards = [
          {
            title: 'Kasir',
            icon: 'fa fa-2x fa-laptop',
            link: 'employee-cashier',
          },
          {
            title: 'Penjualan',
            icon: 'fa fa-2x fa-list-ul',
            link: 'employee-orders',
          },
          {
            title: 'Buku Kas',
            icon: 'fa fa-2x fa-book-open',
            link: 'employee-cash-book',
          },
          {
            title: 'Produk',
            icon: 'fa fa-2x fa-box',
            link: 'employee-products',
          },
        ]
        break
      case 'supervisor':
        this.cards = [
          {
            title: 'Kasir',
            icon: 'fa fa-2x fa-book-open',
            link: 'employee-cash-book',
          },
          {
            title: 'Penjualan',
            icon: 'fa fa-2x fa-list-ul',
            link: 'employee-orders',
          },
          {
            title: 'Produk',
            icon: 'fa fa-2x fa-box',
            link: 'employee-products',
          },
          {
            title: 'Karyawan',
            icon: 'fa fa-2x fa-users',
            link: 'employee-employees',
          },
        ]
        break
    }
  },
  computed: {
    dataShop() {
      return this.$cookies.get('shop')
    },
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
    remappedCards() {
      return this.cards.map((card) => {
        if (this.isNonFnB && card.title === 'Pesanan') {
          return {
            ...card,
            title: 'Penjualan',
          }
        }
        return card
      })
    },
  },
  components: {
    AppEmpty,
    AppCardCircle,
  },
}
</script>
