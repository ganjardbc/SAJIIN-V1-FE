<template>
    <div id="App">
        <AppMobileLayout title="Order Tracking" :enableLeftSlot="true">
            <div slot="left-button">
                <router-link :to="{name: 'visitor-home'}" class="logo">
                    <img :src="logo" alt="SAJI-IN" style="height: 35px;">
                </router-link>
            </div>
            <div slot="right-button">
                <button class="btn btn-white" @click="onClickExit">
                    <i class="icn icn-left fa fa-lg fa-store"></i> Toko
                </button>
            </div>

            <AppLoader v-if="loading" />

            <div v-else>
                <div v-if="!data">
                    <AppEmpty title="The Order(s) Not Found" />
                    <div class="display-flex center">
                        <button class="btn btn-sekunder" @click="onClickExit">
                            Buat Pesanan Baru ?
                        </button>
                    </div>
                </div>

                <div v-else class="width width-100">
                    <div v-if="data.order.status === 'canceled'">
                        <AppEmpty title="Pesanan ini dibatalkan oleh Toko." icon="fa fa-3x fa-times-circle" />
                        <div class="display-flex center">
                            <button class="btn btn-sekunder" @click="onClickExit">
                                Buat Pesanan Baru ?
                            </button>
                        </div>
                    </div> 

                    <div v-if="data.order.status !== 'canceled'">
                        <div class="bottom-dividing padding padding-15px">
                            <el-alert
                                v-if="!data.order.payment_status"
                                title="Pesanan Belum Dibayar !"
                                description="Untuk melakukan pembayaran bisa langsung menuju Kasir."
                                type="info"
                                :closable="true"
                                :show-icon="true"
                                style="margin-bottom: 15px;">
                            </el-alert>
                            <div class="display-flex space-between align-center margin margin-bottom-10px">
                                <div class="fonts fonts-13 semibold black">Detail Pesanan</div>
                                <button class="btn btn-small-icon btn-circle btn-sekunder" @click="getData">
                                    <i class="fa fa-lw fa-retweet"></i>
                                </button>
                            </div>
                            <div class="fonts fonts-11 semibold black">Pesanan</div>
                            <div class="display-flex space-between margin margin-bottom-5px">
                                <div class="fonts fonts-10 grey">
                                    ID Pesanan
                                </div>
                                <div class="fonts fonts-10 semibold black align-right">
                                    {{ data.order.order_id }}
                                </div>
                            </div>
                            <div class="display-flex space-between margin margin-bottom-5px">
                                <div class="fonts fonts-10 grey">
                                    Tanggal
                                </div>
                                <div class="fonts fonts-10 black semibold align-right">
                                    {{ data.order.created_at | moment("dddd, DD MMM YYYY") }}
                                </div>
                            </div>
                            <div class="display-flex space-between margin margin-bottom-5px">
                                <div class="fonts fonts-10 grey">
                                    Pelanggan
                                </div>
                                <div class="fonts fonts-10 black semibold">
                                    {{ data.order.customer_name ? data.order.customer_name : '-' }}
                                </div>
                            </div>
                            <div class="display-flex space-between margin margin-bottom-5px">
                                <div class="fonts fonts-10 grey">
                                    Meja
                                </div>
                                <div class="fonts fonts-10 black semibold align-right">
                                    {{ data.order.table_name ? data.order.table_name : '-' }}
                                </div>
                            </div>
                            <div class="display-flex space-between margin margin-bottom-5px">
                                <div class="fonts fonts-10 grey">
                                    Platform
                                </div>
                                <div class="fonts fonts-10 black semibold align-right">
                                    {{ data.order.platform_name ? data.order.platform_name : '-' }}
                                </div>
                            </div>
                            <div class="display-flex space-between">
                                <div class="fonts fonts-10 grey">
                                    Toko
                                </div>
                                <div class="fonts fonts-10 black semibold align-right">
                                    {{ data.shop && data.shop.name || '-' }}
                                </div>
                            </div>
                        </div>

                        <div class="bottom-dividing padding padding-15px">
                            <div class="display-flex space-between align-center">
                                <div class="fonts fonts-11 semibold black">Status</div>
                                <AppCardCapsule 
                                    v-if="!isCanViewStatus(data.order)"
                                    :data="data.order.status" />
                            </div>
                            <div 
                                v-if="isCanViewStatus(data.order)" 
                                class="width width-100 margin margin-top-15px">
                                <div v-for="(dt, i) in orderStatus" :key="i" class="display-flex" style="padding: 7.5px 0;">
                                    <div style="width: 70px;">
                                        <div :class="`image image-circle ${i === orderIndex ? 'image-52px' : 'image-45px'}`" :style="`background-color: ${dt.isActive ? dt.color : '#f5f5f5'};`">
                                            <i :class="`post-middle-absolute ${dt.icon}`" :style="`font-size: ${dt.isActive ? '22px' : '16px'}; color: ${dt.isActive ? dt.iconColor : '#999'};`"></i>
                                        </div>
                                    </div>
                                    <div :style="`width: calc(100% - 70px); height: 40px; padding-top: ${dt.isActive ? '5px' : '5px'}; padding-bottom: ${dt.isActive ? '20px' : '10px'};`" :class="`${(i < (orderStatus.length - 1)) ? 'border-bottom' : ''}`">
                                        <div class="post-top">
                                            <div :class="`fonts ${dt.isActive ? 'fonts-11 black semibold' : 'fonts-10 grey'}`" style="line-height: 1.5;">{{ dt.title }}</div>
                                            <div v-if="dt.isActive" class="fonts fonts-9 grey" style="line-height: 1.5;">{{ dt.subtitle }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bottom-dividing padding padding-15px">
                            <div class="fonts fonts-11 semibold black">Produk</div>
                            <div class="display-flex space-between margin margin-bottom-10px">
                                <div class="width width-70">
                                    <div class="fonts fonts-10 grey">Produk</div>
                                </div>
                                <div class="width width-30">
                                    <div class="fonts fonts-10 grey">Harga</div>
                                </div>
                            </div>

                            <div 
                                v-for="(dt, index) in data.details" 
                                :key="index" 
                                class="display-flex space-between margin margin-bottom-15px">
                                <div class="width width-70 display-flex">
                                    <div style="width: 40px; margin-right: 15px;">
                                        <div class="image image-padding border-full">
                                            <img v-if="dt.product_image" :src="productImageThumbnailUrl + dt.product_image" alt="" class="post-center">
                                            <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                                        </div>
                                    </div>
                                    <div style="width: calc(100% - 60px);">
                                        <div class="fonts fonts-10 semibold black">
                                            {{ dt.product_name }}
                                            <span v-if="dt.product_detail" class="fonts fonts-10 normal black"> - {{ dt.product_detail }}</span>
                                        </div>
                                        <div class="fonts fonts-9 grey">
                                            {{ dt.quantity }} x {{ format(dt.price) }}
                                            <span v-if="dt.is_discount" class="fonts fonts-9 grey text-line">{{ format(dt.second_price) }}</span>
                                        </div>
                                        <div v-if="dt.note" class="fonts fonts-9 grey">
                                            {{ dt.note }}
                                        </div>
                                    </div>
                                </div>
                                <div class="width width-30">
                                    <div class="fonts fonts-10 semibold black">{{ format(dt.subtotal) }}</div>
                                </div>
                            </div>

                            <div class="padding padding-bottom-5px margin margin-bottom-15px border-bottom"></div>

                            <div class="display-flex space-between">
                                <div class="width width-70">
                                    <div class="fonts fonts-10 semibold black">Total ({{ data.order.total_item }} produk)</div>
                                </div>
                                <div class="width width-30">
                                    <div class="fonts fonts-10 semibold black">{{ format(data.order.total_price) }}</div>
                                </div>
                            </div>

                            <div v-if="data.order.is_discount" class="padding padding-bottom-15px margin margin-bottom-15px border-bottom"></div>

                            <div v-if="data.order.is_discount" class="display-flex space-between">
                                <div class="width width-70">
                                    <div class="fonts fonts-10 normal black">Diskon</div>
                                </div>
                                <div class="width width-30">
                                    <div class="fonts fonts-10 normal black">{{ format(data.order.total_discount) }}</div>
                                </div>
                            </div>
                        </div>

                        <div class="bottom-dividing padding padding-15px">
                            <div class="fonts fonts-11 semibold black">Pembayaran</div>
                            <div class="display-flex space-between">
                                <div class="width width-70">
                                    <div class="fonts fonts-10 black">Status</div>
                                </div>
                                <div class="width width-30 display-flex">
                                    <div class="fonts fonts-10 black semibold">{{ data.order.payment_status ? 'Dibayar' : 'Belum Bayar' }}</div>
                                </div>
                            </div>
                            <div class="display-flex space-between margin margin-bottom-10px">
                                <div class="width width-70">
                                    <div class="fonts fonts-10 black">Metode</div>
                                </div>
                                <div class="width width-30">
                                    <div class="fonts fonts-10 black semibold">{{ data.order.payment_name ? data.order.payment_name : '-' }}</div>
                                </div>
                            </div>

                            <div class="fonts fonts-11 semibold black">Tagihan</div>
                            <div class="display-flex space-between">
                                <div class="width width-70">
                                    <div class="fonts fonts-10 black">Bayar</div>
                                </div>
                                <div class="width width-30">
                                    <div class="fonts fonts-10 black semibold">{{ format(data.order.bills_price) }}</div>
                                </div>
                            </div>
                            <div class="display-flex space-between">
                                <div class="width width-70">
                                    <div class="fonts fonts-10 black">Kembali</div>
                                </div>
                                <div class="width width-30">
                                    <div class="fonts fonts-10 black semibold">{{ format(data.order.change_price) }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="padding padding-15px">
                            <button 
                                class="btn btn-main btn-full" 
                                :disabled="!isCanDownloadNota(data.order)"
                                @click="onDownloadReceipt">
                                <el-popover 
                                    v-if="!isCanDownloadNota(data.order)"
                                    placement="left"
                                    width="210"
                                    trigger="hover"
                                    style="word-break: break-word;">
                                    <i slot="reference" class="icn icn-left fa fa-lg fa-info-circle"></i>
                                    <div class="fonts fonts-10 normal red">Kamu bisa download nota setelah melakukan pembayaran.</div>
                                </el-popover>
                                Download Nota 
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppMobileLayout>
        
        <AppPopupLoader 
            v-if="loadingForm"
        />
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import logo from '@/assets/img/logo.png'
import AppMobileLayout from '../../../modules/AppMobileLayout'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import AppLoader from '../../../modules/AppLoader'
import AppEmpty from '../../../modules/AppEmpty'
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppPopupLoader from '../../../modules/AppPopupLoader'

const defaultPayloadOrderStatus = [
    {
        title: 'Antrian', 
        subtitle: 'Pesananmu sudah masuk dalam antrian.', 
        icon: 'fa fa-lg fa-info', 
        color: '#38c172', 
        iconColor: '#fff', 
        isActive: false
    },
    {
        title: 'Disiapkan', 
        subtitle: 'Tunggu ya, pesananmu sedang disiapkan.', 
        icon: 'fa fa-lg fa-fire', 
        color: '#f6993f', 
        iconColor: '#fff', 
        isActive: false
    },
    {
        title: 'Diantarkan', 
        subtitle: 'Yee! Pesananmu sedang diantarkan.', 
        icon: 'fa fa-lg fa-truck', 
        color: '#e3342f', 
        iconColor: '#fff', 
        isActive: true
    }
]

export default {
    name: 'App',
    metaInfo: {
        title: 'Visitor',
        titleTemplate: '%s | Order Tracking',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            logo: logo,
            orderIndex: 1,
            orderStatus: [],
            visibleAlert: false,
            titleAlert: 'Gagal memproses data',
            iconAlert: 'fa fa-4x fa-info-circle',
            visibleConfirmed: false,
            titleConfirmed: 'Keluar dari Toko ?'
        }
    },
    mounted () {
        this.setOrderStatus()
        this.getData()
    },
    components: {
        AppMobileLayout,
        AppLoader,
        AppPopupConfirmed,
        AppPopupAlert,
        AppEmpty,
        AppCardCapsule,
        AppPopupLoader,
    },
    computed: {
        ...mapState({
            data: (state) => state.storeVisitorOrder.data,
            loading: (state) => state.storeVisitorOrder.loading,
            loadingForm: (state) => state.storeVisitorOrder.loadingForm,
            dataShop: (state) => state.storeVisitorShop.data,
        }),
        selectedShop () {
            return this.dataShop.shop
        },
    },
    methods: {
        ...mapActions({
            getById: 'storeVisitorOrder/getById',
            download: 'storeVisitorOrder/download',
        }),
        isCanViewStatus (value) {
            let status = false 
            if (
                value.status === 'new-order' ||
                value.status === 'on-progress' ||
                value.status === 'ready' 
            ) {
                status = true
            }
            return status 
        },
        isCanDownloadNota (value) {
            let status = false 
            if (value.payment_status && value.status === 'done') {
                status = true
            }
            return status 
        },
        getData () {
            const order_id = this.$route.params.orderId
            this.getById({ order_id }).then((res) => {
                this.setOrderStatus()
            })
        },
        setOrderStatus () {
            const status = this.data && this.data.order && this.data.order.status 
            this.orderIndex = status ? status === 'new-order' ? 0 : status === 'on-progress' ? 1 : status === 'ready' ? 2 : null : null
            let newPayload = defaultPayloadOrderStatus && defaultPayloadOrderStatus.map((dt, i) => {
                const status = (i <= this.orderIndex) ? true : false 
                return {
                    ...dt, 
                    isActive: status 
                }
            })
            this.orderStatus = newPayload
        },
        onClickExit () {
            this.$router.push({ name: 'visitor-home' })
        },
        onDownloadReceipt () {
            const order_id = this.$route.params.orderId
            const size_x = '302.36px'
            const size_y = '755.90px'
            this.download({ order_id, size_x, size_y }).then((res) => {
                if (res.status === 200) {
                    this.$message('Order receipt downloaded')
                } else {
                    this.$message({
                        message: 'Failed to download order receipt',
                        type: 'error'
                    })
                }
            })
        },
    }
}
</script>