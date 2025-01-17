<template>
  <div id="ProductHome">
    <AppHeaderMobile title="Produk" />
    <AppTabLinks :data="tabs" @onChange="onChange" />
    <Categories v-if="selectedIndex === 'categories'" />
    <Products v-if="selectedIndex === 'products'" />
  </div>
</template>
<script>
import AppTabLinks from '../../../modules/AppTabLinks'
import AppHeaderMobile from '../../../modules/AppHeaderMobile'
import Products from './products/Index'
import Categories from './categories/Index'

export default {
  name: 'ProductHome',
  data() {
    return {
      selectedIndex: 'categories',
      tabs: [
        { id: 1, title: 'Kategori', path: 'categories' },
        { id: 2, title: 'Produk', path: 'products' },
      ],
    }
  },
  components: {
    AppTabLinks,
    AppHeaderMobile,
    Products,
    Categories,
  },
  methods: {
    onChange(value) {
      this.selectedIndex = value.name
    },
  },
}
</script>
