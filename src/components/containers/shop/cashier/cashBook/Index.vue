<template>
    <div 
        id="CashierCashBook" 
        class="margin margin-bottom-15px">
        <div v-loading="loading" class="width width-100">
            <el-alert
                v-if="showWarning"
                title="Mohon Buka Kasir !"
                description="Kamu tidak bisa membuat pesanan baru karena Buku Kas untuk Toko ini masih kosong."
                type="warning"
                :closable="true"
                show-icon
                style="margin-bottom: 15px;">
            </el-alert>

            <div class="display-flex space-between align-center margin margin-bottom-15px">
                <div class="width width-50">
                    <div class="display-flex align-center margin margin-bottom-2px">
                        <div class="fonts small black semibold margin margin-right-10px">Buku Kas</div>
                        <AppCardCapsule v-if="currentCashBook" :data="currentCashBook.cash_status" />
                    </div>
                    <div v-if="currentCashBook" class="fonts fonts-9 semibold">
                        {{ currentCashBook.cash_date | moment("DD MMMM YYYY") }}
                    </div>
                    <div v-else class="fonts fonts-9 normal">No Date</div>
                </div>
                <div class="width width-50 display-flex flex-end">
                    <div v-if="currentCashBook" class="display-flex column align-right">
                        <div class="fonts fonts-9 normal">Kas Summary</div>
                        <div class="display-flex flex-end align-center">
                            <el-popover
                                placement="left-start"
                                width="180"
                                trigger="click">
                                <div class="width width-100">
                                    <div class="fonts fonts-11 semibold black">Detail Summary</div>
                                    <div class="display-flex margin margin-top-15px">
                                        <div class="image image-20px">
                                            <i class="fonts fonts-12 green fa fa-lg fa-info-circle"></i>
                                        </div>
                                        <div style="width: calc(100% - 30px); margin-left: 10px;">
                                            <div class="fonts fonts-8 black">Modal</div>
                                            <div class="fonts fonts-10 black semibold">{{ format(currentCashBook && currentCashBook.cash_modal || 0) }}</div>
                                        </div>
                                    </div>
                                    <div class="display-flex margin margin-top-15px">
                                        <div class="image image-20px">
                                            <i class="fonts fonts-12 green fa fa-lg fa-check-circle"></i>
                                        </div>
                                        <div style="width: calc(100% - 30px); margin-left: 10px;">
                                            <div class="fonts fonts-8 black">Keuntungan</div>
                                            <div class="fonts fonts-10 black semibold">{{ format(currentCashBook && currentCashBook.cash_profit || 0) }}</div>
                                        </div>
                                    </div>
                                </div>
                                <i slot="reference" class="cursor-pointer fonts fonts-12 grey fa fa-lg fa-info-circle margin margin-right-10px"></i>
                            </el-popover>
                            <div class="fonts fonts-14 semibold main-color overflow-ellipsis align-right">
                                {{ format(currentCashBook && currentCashBook.cash_summary || 0) }}
                            </div>
                        </div>
                    </div>
                    <button 
                        v-else 
                        class="btn btn-main" 
                        @click="createCashBook">
                        <i class="icn icn-left fa fa-lg fa-plus"></i> Buka Kasir
                    </button>
                </div>
            </div>

            <div class="card bg-white border-full no-padding margin margin-bottom-15px">
                <div class="width width-100 display-flex space-between align-center wrap">
                    <div class="width width-50 padding padding-top-10px padding-bottom-10px">
                        <div class="padding padding-5px content-center">
                            <div class="display-flex center align-center">
                                <i class="fonts fonts-8 green fa fa-lg fa-arrow-up margin margin-right-5px"></i>
                                <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Kas Masuk</span>
                            </div>
                            <div class="display-flex center align-center">
                                <div class="fonts fonts-10 semibold black overflow-ellipsis">
                                    {{ format(currentCashBook && currentCashBook.cash_in || 0) }}
                                </div>
                                <el-popover 
                                    v-if="currentCashBook"
                                    placement="bottom"
                                    width="180"
                                    trigger="click">
                                    <div class="width width-100">
                                        <div class="fonts fonts-11 semibold black">Kas Masuk</div>
                                        <div v-for="(item, i) in currentCashBook.cash_detail" :key="i" class="display-flex margin margin-top-15px">
                                            <div class="image image-20px border-full">
                                                <img :src="item.image ? paymentImageThumbnailUrl + item.image : ''" alt="">
                                            </div>
                                            <div style="width: calc(100% - 30px); margin-left: 10px;">
                                                <div class="fonts fonts-8 black">{{ item.name }}</div>
                                                <div class="fonts fonts-10 black semibold">{{ format(item.cash_in) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <i slot="reference" class="cursor-pointer fonts fonts-12 grey fa fa-lg fa-info-circle margin margin-left-10px"></i>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                    <div class="width width-50 padding padding-top-10px padding-bottom-10px">
                        <div class="padding padding-5px border-left content-center">
                            <div class="display-flex center align-center">
                                <i class="fonts fonts-8 orange fa fa-lg fa-arrow-down margin margin-right-5px"></i>
                                <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Kas Keluar</span>
                            </div>
                            <div class="display-flex center align-center">
                                <div class="fonts fonts-10 semibold black overflow-ellipsis margin margin-right-10px">
                                    {{ format(currentCashBook && currentCashBook.cash_out || 0) }}
                                </div>
                                <el-popover 
                                    v-if="currentCashBook"
                                    placement="bottom"
                                    width="180"
                                    trigger="click">
                                    <div class="width width-100">
                                        <div class="fonts fonts-11 semibold black">Kas Keluar</div>
                                        <div v-for="(item, i) in currentCashBook.cash_detail" :key="i" class="display-flex margin margin-top-15px">
                                            <div class="image image-20px border-full">
                                                <img :src="item.image ? paymentImageThumbnailUrl + item.image : ''" alt="">
                                            </div>
                                            <div style="width: calc(100% - 30px); margin-left: 10px;">
                                                <div class="fonts fonts-8 black">{{ item.name }}</div>
                                                <div class="fonts fonts-10 black semibold">{{ format(item.cash_out) }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <i slot="reference" class="cursor-pointer fonts fonts-12 grey fa fa-lg fa-info-circle"></i>
                                </el-popover>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <OrderStatus 
                :data="currentCashBook"
                :enableButton="true"
                @onClick="onOpenOrderList" />
            
            <AppEmpty 
                v-if="!isThereOpenedCashbook" 
                title="Mohon Buka Kasir untuk Membuat Pesanan Baru" />
            
            <div 
                v-if="!isThereOpenedCashbook" 
                class="display-flex center">
                <button 
                    class="btn btn-main" 
                    @click="createCashBook">
                    <i class="icn icn-left fa fa-lg fa-plus"></i> Buka Kasir
                </button>
            </div>
        </div>

        <Form 
            v-if="visibleForm" 
            @onSave="saveCashBook"
            @onClose="closeCashBook" />
        
        <AppPopupConfirmed 
            v-if="visibleConfirmed"
            :title="'Simpan Data ?'"
            @onClickNo="onClickNo"
            @onClickYes="onClickYes"
        />
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppEmpty from '../../../../modules/AppEmpty'
import Form from './Form'
import OrderStatus from '../../cashBook/OrderStatus'

export default {
    name: 'CashierCashBook',
    data () {
        return {
            showWarning: false,
            visibleForm: false,
            visibleConfirmed: false,
        }
    },
    mounted () {
        this.getData()
    },
    components: {
        AppCardCapsule,
        AppPopupConfirmed,
        AppEmpty,
        Form,
        OrderStatus
    },
    computed: {
        ...mapState({
            form: (state) => state.storeCashBook.form,
            dataCurrent: (state) => state.storeCashBook.dataCurrent,
            loading: (state) => state.storeCashBook.loading,
        }),
        currentCashBook () {
            return this.dataCurrent && this.dataCurrent.current_cashbook
        },
        openedCashBook () {
            return this.dataCurrent && this.dataCurrent.opened_cashbook
        },
        shopCashBook () {
            return this.dataCurrent && this.dataCurrent.shop 
        },
        isThereOpenedCashbook () {
            return this.currentCashBook && this.currentCashBook.cash_status === 'open'
        },
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.getData()
            }
        }
    },
    methods: {
        ...mapActions({
            setFormData: 'storeCashBook/setFormData',
            getCurrent: 'storeCashBook/getCurrent',
            createData: 'storeCashBook/createData'
        }),
        getData () {
            const token = this.$cookies.get('tokenBearer')
            const today = new Date()
            const shop_id = this.shopId
            if (shop_id) {
                this.getCurrent({ token, today: today, shop_id: shop_id })
                    .then((res) => {
                        const data = res.data.data.current_cashbook
                        if (!data) {
                            this.showWarning = true  
                        }
                    })
            }
        },
        onClickNo () {
            this.visibleConfirmed = false 
        },
        onClickYes () {
            this.visibleConfirmed = false 
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            this.createData({
                ...this.form,
                shop_id: shop_id,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.closeCashBook()
                    this.getData()
                } else {
                    this.$message({
                        message: 'Gagal menyimpan Buku Kas !',
                        type: 'error'
                    })
                }
            })
        },
        saveCashBook () {
            this.visibleConfirmed = true 
        },
        createCashBook () {
            this.visibleForm = true 
            this.setFormData(null)
        },
        closeCashBook () {
            this.visibleForm = false 
        },
        onOpenOrderList () {
            this.$emit('onOpenOrderList', this.currentCashBook)
        }
    }
}
</script>