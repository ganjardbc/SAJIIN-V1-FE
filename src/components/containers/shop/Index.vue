<template>
    <div id="App">
        <div class="padding padding-top-50px padding-bottom-50px">
            <AppEmpty 
                icon="fa fa-3x fa-shapes"
                title="WELCOME TO SAJI-IN SHOP PANEL" />
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
            amp: true
        }
    },
    data () {
        return {
            cards: [
                {title: 'Kasir', icon: 'fa fa-2x fa-laptop', link: 'shop-cashier'},
                {title: 'Pesanan', icon: 'fa fa-2x fa-list-ul', link: 'shop-order'},
                {title: 'Buku Kas', icon: 'fa fa-2x fa-book-open', link: 'shop-cash-book'},
                {title: 'Produk', icon: 'fa fa-2x fa-box', link: 'shop-product'},
            ]
        }
    },
    components: {
        AppEmpty,
        AppCardCircle,
    }
}
</script>