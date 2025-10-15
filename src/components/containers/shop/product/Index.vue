<template>
  <div id="ProductHome" class="w-full lg:w-lg-false m-auto flex flex-col p-4">
    <AppTabLinks :data="tabs" @onChange="onChange" />
    <Products v-if="selectedIndex === 'products'" />
    <Categories v-if="selectedIndex === 'categories'" />
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
      selectedIndex: 'products',
      tabs: [
        { id: 1, title: 'Produk', path: 'products' },
        { id: 2, title: 'Kategori', path: 'categories' },
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
