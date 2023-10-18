<template>
    <div id="App" class="display-flex wrap">
        <div v-for="(dt, i) in data" :key="i" class="width width-100 width-mobile">
            <div class="card box-shadow margin margin-bottom-15px">
                <div class="display-flex space-between align-center padding padding-bottom-15px margin margin-bottom-15px border-bottom">
                    <div style="width: calc(100% - 100px);" class="display-flex align-center">
                        <div class="width width-30px">
                            <i class="fa fa-1x fa-list-alt fonts main-color"></i>
                        </div>
                        <div style="width: calc(100% - 30px);">
                            <div class="fonts fonts-10 semibold">{{ dt.order.order_id }}</div>
                            <div class="fonts fonts-10 grey">{{ dt.order.created_at | moment("DD MMMM YYYY") }}</div>
                        </div>
                    </div>
                    <div class="width width-100px display-flex flex-end align-center">
                        <AppCardCapsule :data="dt.order.status" />
                    </div>
                </div>

                <div class="display-flex space-between display-mobile margin margin-bottom-15px">
                    <div class="width width-25 width-mobile display-flex column space-between display-row-mobile margin margin-top-5px margin-bottom-5px">
                        <div class="fonts fonts-9 normal grey margin margin-bottom-5px">Pelanggan</div>
                        <div class="fonts fonts-10 semibold black overflow-ellipsis">{{ dt.order.customer_name || '-' }}</div>
                    </div>
                    <div class="width width-25 width-mobile display-flex column space-between display-row-mobile margin margin-top-5px margin-bottom-5px">
                        <div class="fonts fonts-9 normal grey margin margin-bottom-5px">Meja</div>
                        <div class="fonts fonts-10 semibold black overflow-ellipsis">{{ dt.order.table_name || '-' }}</div>
                    </div>
                    <div class="width width-25 width-mobile display-flex column space-between display-row-mobile margin margin-top-5px margin-bottom-5px">
                        <div class="fonts fonts-9 normal grey margin margin-bottom-5px">Kasir</div>
                        <div class="fonts fonts-10 semibold black overflow-ellipsis">{{ dt.order.cashier_name || '-' }}</div>
                    </div>
                    <div class="width width-25 width-mobile display-flex column space-between display-row-mobile margin margin-top-5px margin-bottom-5px">
                        <div class="fonts fonts-9 normal grey margin margin-bottom-5px">Produk</div>
                        <AppCardProgressProduct :data="dt.details" />
                    </div>
                </div>

                <div class="display-flex flex-end width width-100">
                    <button 
                        class="btn btn-sekunder"
                        @click="onChangeOrderStatus(dt.order, 'ready')">
                        Siap Diantarkan
                    </button>
                    <button 
                        class="btn btn-sekunder margin margin-left-10px" 
                        @click="onViewProduct(dt)">
                        Detail
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import VueLoadImage from 'vue-load-image'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardProgressProduct from '../../../../modules/AppCardProgressProduct'

export default {
    name: 'App',
    props: {
        data: null 
    },
    components: {
        VueLoadImage,
        AppCardCapsule,
        AppCardProgressProduct
    },
    methods: {
        onViewProduct (data) {
            this.$emit('onViewProduct', data)
        },
        onChangeOrderStatus (data, status) {
            let payload = {
                ...data, 
                status: status,
            }
            this.$emit('onChangeOrderStatus', payload)
        }
    }
}
</script>