<template>
    <div id="App">
        <!-- <div v-if="isDigitalMenuActive"> -->
            <keep-alive>
                <router-view />
            </keep-alive>
            <router-view name="visitorLayoutReload" />
        <!-- </div> -->

        <!-- <div v-else>
            <InactiveShop />
        </div> -->
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import logo from '@/assets/img/logo.png'
import AppLoader from '../../modules/AppLoader'
import InactiveShop from './InactiveShop'

export default {
    name: 'App',
    metaInfo: {
        title: 'SAJI-IN',
        titleTemplate: '%s | Serve All You Want',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            logo: logo,
        }
    },
    mounted () {
        this.getShopData()
    },
    components: {
        AppLoader,
        InactiveShop
    },
    computed: {
        ...mapState({
            data: (state) => state.storeVisitorShop.data,
            loading: (state) => state.storeVisitorShop.loading,
        }),
        selectedShop () {
            return this.data.shop
        },
        // isDigitalMenuActive () {
        //     return this.selectedShop && this.selectedShop.is_digital_menu_active
        // },
        // isDigitalOrderActive () {
        //     return this.selectedShop && this.selectedShop.is_digital_order_active
        // }
    },
    methods: {
        ...mapActions({
            getShop: 'storeVisitorShop/getShop',
            setOrder: 'storeVisitorOrder/setOrder',
        }),
        getShopData () {
            const shop_id = this.$route.params.shopId
            this.getShop({ shop_id }).then((res) => {
                const data = res.data.data
                const payload = {
                    total_item: 0,
                    total_price: 0,
                    shop: data.shop,
                }
                this.setOrder(payload)
            })
        },
    }
}
</script>