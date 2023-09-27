<template>
    <div id="EmployeeHome">
        <AppTabLinks :data="tabs" @onChange="onChange" />
        <Products v-if="selectedIndex === 'products'" />
        <Categories v-if="selectedIndex === 'categories'" />
    </div>
</template>
<script>
import AppTabLinks from '../../../modules/AppTabLinks'
import Products from './products/Index'
import Categories from './categories/Index'

export default {
    name: 'EmployeeHome',
    data () {
        return {
            selectedIndex: 'products',
            tabs: [
                {id: 1, title: 'Produk', path: 'products'},
                {id: 2, title: 'Kategori', path: 'categories'},
            ]
        }
    },
    components: {
        AppTabLinks,
        Products,
        Categories,
    },
    methods: {
        onChange (value) {
            this.selectedIndex = value.name
        }
    }
}
</script>