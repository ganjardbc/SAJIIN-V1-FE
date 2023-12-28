<template>
    <div id="App" class="display-flex wrap">
        <div v-for="(dt, i) in data" :key="i" class="column-3 mobile-column">
            <div class="margin margin-15px margin-mobile-left-none margin-mobile-right-none">
                <div class="card bg-white box-shadow">
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
                    <!-- <div class="display-flex space-between margin margin-bottom-0">
                        <div class="fonts fonts-9 normal grey">Pelanggan</div>
                        <div class="fonts fonts-10 semibold black overflow-ellipsis">{{ dt.order.customer_name || '-' }}</div>
                    </div>
                    <div class="display-flex space-between margin margin-bottom-0">
                        <div class="fonts fonts-9 normal grey">Meja</div>
                        <div class="fonts fonts-10 semibold black overflow-ellipsis">{{ dt.order.table_name || '-' }}</div>
                    </div>
                    <div class="display-flex space-between margin margin-bottom-0">
                        <div class="fonts fonts-9 normal grey">Kasir</div>
                        <div class="fonts fonts-10 semibold black overflow-ellipsis">{{ dt.order.cashier_name || '-' }}</div>
                    </div> -->
                    <div class="display-flex space-between margin margin-bottom-15px">
                        <div class="fonts fonts-9 normal grey">Produk</div>
                        <AppCardProgressProduct :data="dt.details" />
                    </div>
                    <div class="width width-100 change-scrollbar margin margin-bottom-15px" style="max-height: 270px;">
                        <div v-for="(detail, j) in dt.details" :key="j" :style="`margin: 0 2px; margin-bottom: ${j < (dt.details.length - 1) ? '15px' : ''};`">
                            <div class="card bg-white border border-full">
                                <div class="display-flex space-between margin margin-bottom-15px">
                                    <div class="width width-45px margin margin-right-15px">
                                        <div class="image image-padding border-full">
                                            <img 
                                                v-if="detail.product_image" 
                                                :src="productImageThumbnailUrl + detail.product_image" 
                                                alt="" 
                                                class="post-center">
                                            <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                                        </div>
                                    </div>
                                    <div style="width: calc(100% - 160px);">
                                        <div class="fonts fonts-11 semibold">{{ detail.product_name }}</div>
                                        <div class="fonts fonts-10 normal grey">{{ detail.quantity }} x {{ detail.product_detail }}</div>
                                        <div v-if="detail.note" class="fonts fonts-10 normal grey">{{ detail.note }}</div>
                                    </div>
                                    <div class="width width-100px display-flex flex-end">
                                        <AppCardCapsule :data="detail.status" />
                                    </div>
                                </div>
                                <div class="padding padding-top-15px border-top">
                                    <div v-if="detail.employee" class="margin margin-bottom-15px">
                                        <div class="display-flex space-between margin margin-bottom-15px">
                                            <div class="width width-35px margin margin-right-15px">
                                                <div class="image image-padding image-circle border-full">
                                                    <img 
                                                        v-if="detail.employee.image" 
                                                        :src="employeeImageThumbnailUrl + detail.employee.image" 
                                                        alt="" 
                                                        class="post-center">
                                                    <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                                                </div>
                                            </div>
                                            <div style="width: calc(100% - 50px);">
                                                <div class="fonts fonts-11 semibold">{{ detail.employee.name }}</div>
                                                <div class="fonts fonts-9 grey">{{ detail.employee.employee_id }}</div>
                                                <div class="fonts fonts-9 grey">{{ detail.updated_at | moment("DD/MM/YYYY hh:mm") }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        v-if="detail.status === 'to-do'" 
                                        class="btn btn-sekunder btn-full"
                                        @click="onChangeStatus(detail, 'on-progress')">Kerjakan Item</button>
                                    <button 
                                        v-if="detail.status === 'on-progress'" 
                                        class="btn btn-green btn-full"
                                        :disabled="detail && detail.employee && detail.employee.id !== dataUser.owner_id"
                                        @click="onChangeStatus(detail, 'done')">Tandai Selesai</button>
                                    <button 
                                        v-if="detail.status === 'done'" 
                                        class="btn btn-main-reverse with-border with-hover btn-full"
                                        :disabled="detail && detail.employee && detail.employee.id !== dataUser.owner_id"
                                        @click="onChangeStatus(detail, 'to-do')">Re-Open</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="display-flex flex-end width width-100">
                        <button 
                            class="btn btn-sekunder btn-full"
                            @click="onChangeOrderStatus(dt.order, 'ready')">
                            Siap Diantarkan
                        </button>
                    </div>
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
    computed: {
        dataUser () {
            return this.$cookies.get('user')
        },
    },
    methods: {
        onChangeStatus (data, status) {
            const user_id = this.dataUser.id 
            let payload = {
                ...data, 
                status: status,
                assigned_id: user_id,
            }
            this.$emit('onChangeStatus', payload)
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