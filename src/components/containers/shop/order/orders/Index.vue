<template>
    <div id="App">
        <div class="width width-100">
            <div class="display-flex space-between align-center" style="padding-bottom: 10px;">
                <h1 class="fonts big black bold">Pesanan</h1>
                <button 
                    class="btn btn-icon btn-white" 
                    @click="onRefresh">
                    <i class="fa fa-lw fa-retweet"></i>
                </button>
            </div>

            <div class="width width-100 display-flex space-between display-mobile">
                <div class="width width-300px width-mobile display-flex space-between" style="padding-bottom: 15px;">
                    <el-input
                        class="margin margin-right-14px margin-mobile-right-none"
                        placeholder="Cari pesanan .."
                        suffix-icon="el-icon-search"
                        clearable
                        v-model="filter.search"
                        @clear="onClear"
                        @change="onSearch">
                    </el-input>
                </div>
                <div class="width width-400px width-mobile display-flex space-between" style="padding-bottom: 15px;">
                    <el-select 
                        v-model="filter.payment_status" 
                        @change="handleFilterSearch"
                        clearable
                        placeholder="Select payment"
                        no-data-text="Data Tidak Ditemukan"
                        class="margin margin-right-7px">
                        <el-option
                            v-for="(item, i) in orderPaymentStatus"
                            :key="i"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <cashbook-field 
                        :value.sync="filter.cashbook_id"
                        @onChange="handleFilterCashbook"
                        class="margin margin-left-7px"></cashbook-field>
                </div>
            </div>

            <div 
                class="width width-100"
                style="padding-bottom: 10px;">
                <!-- START HIDDEN TEMPORARY -->
                <!-- <AppTabs 
                    :selectedIndex.sync="selectedIndex" 
                    :isFull="true"
                    :isScrollable="false"
                    :data="tabs" 
                    :onChange="(data) => onChangeTabs(data)"
                /> -->
                <!-- END HIDDEN TEMPORARY -->
                <AppButtonCapsuleSlider
                    :index.sync="selectedIndex" 
                    :disableAll="true"
                    :returnIndex="true"
                    customIcon="fa fa-lw fa-list-ul"
                    :data="tabs"
                    @onChange="onChangeTabs" />
            </div>

            <div class="width width-100">
                <div v-loading="loading">
                    <AppEmpty v-if="data.length === 0" />
                    <Card 
                        :data.sync="data"
                        @onDetail="onDetail"
                        @onEdit="onEdit"
                        @onDelete="onDelete"
                        @onChangeStatus="onChangeStatus"
                        @onCheckout="onOpenCheckout"
                        @onReceipt="onOpenReceipt" />
                </div>
                <div class="width width-100 display-flex flex-end align-center padding padding-top-15px">
                    <div class="fonts fonts-10 normal black">Total {{ totalRecord }}</div>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="limit"
                        :pager-count="5"
                        layout="prev, pager, next"
                        :total="totalRecord">
                    </el-pagination>
                </div>
            </div>

        </div>

        <div :class="`content-form ${!visibleFormOrder && 'hide'}`">
            <div class="right">
                <DetailOrder 
                    @onSave="onOpenVisibleConfirmed"
                    @onClose="onClose"
                    @onChangeStatus="onChangeStatus"
                    @onCheckout="onOpenCheckout"
                    @onReceipt="onOpenReceipt"
                    @onProduct="onOpenProduct"
                    @onCustomer="onOpenCustomer">
                </DetailOrder>
            </div>
        </div>

        <div :class="`content-form ${!visibleFormCheckout && 'hide'}`">
            <div class="right">
                <FormCheckout 
                    @onSave="onSaveCheckout"
                    @onClose="onCloseCheckout"
                    @onCreateOrder="onOpenVisibleConfirmed">
                </FormCheckout>
            </div>
        </div>

        <div :class="`content-form ${!visibleFormReceipt && 'hide'}`">
            <div class="right">
                <FormReceipt 
                    @onSave="onOpenReceipt"
                    @onClose="onCloseReceipt"
                    @onPrint="onPrintReceipt">
                </FormReceipt>
            </div>
        </div>

        <div :class="`content-form ${!visibleFormCustomer && 'hide'}`">
            <div class="right">
                <FormCustomer 
                    @onSave="onSaveCustomer"
                    @onClose="onCloseCustomer">
                </FormCustomer>
            </div>
        </div>

        <div :class="`content-form ${!visibleFormProduct && 'hide'}`">
            <div class="right">
                <FormProduct 
                    @onSave="onSaveProduct"
                    @onClose="onCloseProduct">
                </FormProduct>
            </div>
        </div>

        <AppPopupConfirmed 
            v-if="visibleConfirmed"
            :title="titleConfirmed"
            @onClickNo="onClickNo"
            @onClickYes="onClickYes"
        />

        <AppPopupConfirmed 
            v-if="visibleConfirmedStatus"
            :title="titleConfirmedStatus"
            @onClickNo="onClickNoStatus"
            @onClickYes="onClickYesStatus"
        />

        <AppPopupConfirmed 
            v-if="visibleConfirmedProduct"
            :title="titleConfirmedProduct"
            @onClickNo="onClickNoProduct"
            @onClickYes="onClickYesProduct"
        />

        <AppPopupConfirmed 
            v-if="visibleConfirmedDelete"
            :title="'Hapus pesanan ?'"
            @onClickNo="onClickNoDelete"
            @onClickYes="onClickYesDelete"
        />

        <AppPopupAlert 
            v-if="visibleAlert"
            :title="titleAlert"
            :icon="iconAlert"
            @onClickOk="onClickOk"
        />

        <AppPopupLoader 
            v-if="loadingForm"
        />
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { replaceToMoreValue } from '@/services/utils'
import AppEmpty from '../../../../modules/AppEmpty'
import AppPopupLoader from '../../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../../modules/AppPopupAlert'
import SearchField from '../../../../modules/SearchField'
import AppTabs from '../../../../modules/AppTabs'
import AppButtonCapsuleSlider from '../../../../modules/AppButtonCapsuleSlider'
import CashbookField from '../../cashBook/Field'
import DetailOrder from './DetailOrder'
import Card from './Card'
import FormCheckout from './checkOut/Index'
import FormReceipt from './receipt/Index'
import FormProduct from './product/Index'
import FormCustomer from './customer/Index'

export default {
    name: 'App',
    metaInfo: {
        title: 'Shop',
        titleTemplate: '%s | Orders',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            formClass: false,
            visibleFormOrder: false,
            visibleFormCheckout: false,
            visibleFormReceipt: false,
            visibleFormProduct: false,
            visibleFormCustomer: false,
            visibleAlert: false,
            titleAlert: 'Gagal memproses data',
            iconAlert: 'fa fa-4x fa-info-circle',
            visibleConfirmed: false,
            visibleConfirmedDelete: false,
            visibleConfirmedStatus: false,
            visibleConfirmedProduct: false,
            titleConfirmed: 'Simpan data ?',
            titleConfirmedStatus: 'Update status pesanan ?',
            titleConfirmedProduct: 'Update produk di pesanan ini ?',
            currentPage: 1,
            selectedData: null,
        }
    },
    mounted () {
        this.onChangeTabs(this.selectedIndex)
        this.getDashboardMatrix()
    },
    created () {
        this.filter.search = this.paramOrderId
    },
    components: {
        AppEmpty,
        AppPopupLoader,
        AppPopupConfirmed,
        AppPopupAlert,
        AppTabs,
        AppButtonCapsuleSlider,
        CashbookField,
        SearchField,
        DetailOrder,
        Card,
        FormCheckout,
        FormReceipt,
        FormProduct,
        FormCustomer,
    },
    computed: {
        ...mapState({
            filter: (state) => state.storeOrders.filter,
            form: (state) => state.storeOrders.form,
            data: (state) => state.storeOrders.data,
            totalRecord: (state) => state.storeOrders.totalRecord,
            orderPaymentStatus: (state) => state.storeOrders.orderPaymentStatus,
            limit: (state) => state.storeOrders.limit,
            loading: (state) => state.storeOrders.loading,
            loadingForm: (state) => state.storeOrders.loadingForm,
            formVarian: (state) => state.storeOrdersDetail.form,
            matrixDashboard: (state) => state.storeDashboard.matrix,
        }),
        typeForm: {
            get () {
                return this.$store.state.storeOrders.typeForm
            },
            set (value) {
                this.$store.state.storeOrders.typeForm = value
            }
        },
        selectedIndex: {
            get () {
                return this.$store.state.storeOrders.selectedIndex
            },
            set (value) {
                this.$store.state.storeOrders.selectedIndex = value
            }
        },
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
        paramShopId () {
            const shop = this.$cookies.get('shop')
            return shop.shop_id
        },
        paramOrderId () {
            return this.$route.query.search || ''
        },
        tabs () {
            const newOrder = this.matrixDashboard.newOrder
            const onProgress = this.matrixDashboard.onProgress
            const ready = this.matrixDashboard.ready
            const delivered = this.matrixDashboard.delivered
            const all = newOrder + onProgress + ready + delivered
            return [
                {id: 1, icon: 'fa fa-lw fa-list-ul', label: 'Semua Pesanan', value: replaceToMoreValue(all), status: 'active'},
                {id: 2, icon: 'far fa-lw fa-clock', label: `Baru Masuk`, value: replaceToMoreValue(newOrder), status: ''},
                {id: 3, icon: 'fa fa-lw fa-stopwatch', label: `Disiapkan`, value: replaceToMoreValue(onProgress), status: ''},
                {id: 5, icon: 'fa fa-lw fa-truck', label: `Diantarkan`, value: replaceToMoreValue(ready), status: ''},
                {id: 6, icon: 'far fa-lw fa-thumbs-up', label: `Diterima`, value: replaceToMoreValue(delivered), status: ''},
                {id: 7, icon: 'far fa-lw fa-check-circle', label: `Selesai`, status: ''},
                {id: 8, icon: 'far fa-lw fa-times-circle', label: `Dibatalkan`, status: ''},
            ]
        }
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.getData()
            }
        },
        paramOrderId () {
            this.filter.search = this.paramOrderId
            this.getData()
        }
    },
    methods: {
        ...mapActions({
            getOrder: 'storeOrders/getData',
            setPagination: 'storeOrders/setPagination',
            resetFormData: 'storeOrders/resetFormData',
            resetFilter: 'storeOrders/resetFilter',
            setFormData: 'storeOrders/setFormData',
            createData: 'storeOrders/createData',
            updateData: 'storeOrders/updateData',
            deleteData: 'storeOrders/deleteData',
            updateDataProduct: 'storeOrders/updateDataProduct',
            setLoadingForm: 'storeOrders/setLoadingForm',
            getMatrix: 'storeDashboard/getMatrix',
        }),
        onSearch (data) {
            this.filter.search = data 
            this.resetFilter()
            this.getData()
        },
        onClear () {
            this.filter.search = ''
            this.$router.replace({'query': null})
            this.resetFilter()
            this.getData()
        },
        onClose () {
            this.visibleFormOrder = false
        },
        onRefresh () {
            this.getData()
            this.getDashboardMatrix()
        },
        onChangeTabs (data) {
            if (data !== this.selectedIndex) {
                this.selectedIndex = data
            }
            switch (this.selectedIndex) {
                case 0:
                    this.filter.status = ''
                    break
                case 1:
                    this.filter.status = 'new-order'
                    break
                case 2:
                    this.filter.status = 'on-progress'
                    break
                case 3:
                    this.filter.status = 'ready'
                    break
                case 4:
                    this.filter.status = 'delivered'
                    break
                case 5:
                    this.filter.status = 'done'
                    break
                case 6:
                    this.filter.status = 'canceled'
                    break
            }
            this.handleFilterSearch()
        },
        getDashboardMatrix () {
            const shop_id = this.shopId
            const payload = {
                token: this.$cookies.get('tokenBearer'),
                shop_id: shop_id,
            }
            this.getMatrix(payload)
        },

        // LIST DATA 
        getData () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            if (shop_id) {
                this.getOrder({ token, shop_id })
            }
        },
        handleCurrentChange (value) {
            this.setPagination(value)
            this.getData()
        },
        handleFilterSearch () {
            this.currentPage = 1
            this.handleCurrentChange(1)
        },
        handleFilterCashbook (value) {
            this.filter.cashbook_id = value 
            this.getData()
        },

        // ALERT
        onClickOk () {
            this.visibleAlert = false
        },

        // CONFIRMED
        onClickNo () {
            this.visibleConfirmed = false 
        },
        onClickYes () {
            this.visibleConfirmed = false 
            const token = this.$cookies.get('tokenBearer')
            this.updateData({
                ...this.form,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.visibleFormOrder = false 
                    this.visibleFormCheckout = false 
                    this.visibleFormCustomer = false 
                    this.getData()
                    this.getDashboardMatrix()
                    this.$message('Pesanan berhasil di-edit')

                    if (this.typeForm === 'checkout') {
                        this.visibleFormReceipt = true 
                    }
                } else {
                    this.visibleAlert = true 
                    this.titleAlert = 'Gagal menyimpan pesanan'
                }
            })
        },

        // SAVE
        onOpenVisibleConfirmed () {
            this.visibleConfirmed = true
            this.titleConfirmed = 'Simpan pesanan ?'
        },

        // CREATE
        onCreate () {
            this.visibleFormOrder = true
            this.resetFormData()
            this.form.shop_id = this.shopId
            this.typeForm = 'create'
        },

        // DETAIL
        onDetail (data) {
            this.visibleFormOrder = true
            this.resetFormData()
            this.setFormData(data)
            this.typeForm = 'detail'
        },

        // EDIT
        onEdit (data) {
            this.visibleFormOrder = true
            this.resetFormData()
            this.setFormData(data)
            this.typeForm = 'edit'
        },

        // DELETE
        onDelete (data) {
            this.visibleConfirmedDelete = true 
            this.setFormData(data)
        },
        onClickNoDelete () {
            this.visibleConfirmedDelete = false 
        },
        onClickYesDelete () {
            this.visibleConfirmedDelete = false 
            const token = this.$cookies.get('tokenBearer')
            this.deleteData({
                ...this.form,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.getData()
                    this.$message('Pesanan ini berhasil dihapus')
                } else {
                    this.visibleAlert = true 
                    this.titleAlert = 'Gagal menghapus pesanan'
                }
            })
        },

        // STATUS
        onClickNoStatus () {
            this.visibleConfirmedStatus = false 
        },
        onClickYesStatus () {
            this.visibleFormOrder = false
            this.visibleConfirmedStatus = false 

            const token = this.$cookies.get('tokenBearer')
            this.setFormData(this.selectedData)
            this.updateData({
                ...this.form,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.getData()
                    this.getDashboardMatrix()
                    this.onSendNotification(this.selectedData)
                    this.$message(`Berhasil merubah status pesanan ${this.selectedData.order_id}.`)
                } else {
                    this.$message(`Gagal merubah status pesanan ${this.selectedData.order_id}.`)
                }
            })
        },
        onChangeStatus (data) {
            if (data.status === 'new-order') {
               this.titleConfirmedStatus = 'Re-Open pesanan ?'
            }
            if (data.status === 'on-progress') {
               this.titleConfirmedStatus = 'Terima pesanan ?'
            }
            if (data.status === 'ready') {
               this.titleConfirmedStatus = 'Pesanan siap diantarkan ?'
            }
            if (data.status === 'delivered') {
               this.titleConfirmedStatus = 'Pesanan sudah diterima ?'
            }
            if (data.status === 'done') {
               this.titleConfirmedStatus = 'Tandai "Selesai" untuk pesanan ?'
            }
            if (data.status === 'canceled') {
               this.titleConfirmedStatus = 'Batalkan pesanan ?'
            }
            this.visibleConfirmedStatus = true 
            this.selectedData = data 
        },

        // CHECKOUT 
        onOpenCheckout (data) {
            this.visibleFormCheckout = true 
            this.typeForm = 'checkout'
            this.setFormData(data)
        },
        onCloseCheckout () {
            this.visibleFormCheckout = false
        },
        onSaveCheckout () {
            this.visibleFormCheckout = false 
        },

        // RECEIPT 
        onOpenReceipt (data) {
            this.visibleFormReceipt = true 
            this.typeForm = 'receipt'
            this.setFormData(data)
        },
        onCloseReceipt () {
            this.visibleFormReceipt = false
        },
        onPrintReceipt () {
            alert('onPrintReceipt')
        },

        // CUSTOMER
        onOpenCustomer (data) {
            this.visibleFormCustomer = true 
            this.typeForm = 'edit-customer'
            this.setFormData(data)
        },
        onSaveCustomer () {
            this.visibleConfirmed = true
            this.titleConfirmed = 'Edit pesanan ?'
        },
        onCloseCustomer () {
            this.visibleFormCustomer = false 
        },

        // PRODUCT 
        onOpenProduct (data) {
            this.visibleFormProduct = true 
            this.typeForm = 'edit-product'
            this.setFormData(data)
        },
        onCloseProduct () {
            this.visibleFormProduct = false
        },
        onSaveProduct () {
            this.visibleConfirmedProduct = true
        },
        onClickNoProduct () {
            this.visibleConfirmedProduct = false 
        },
        onClickYesProduct () {
            this.visibleConfirmedProduct = false 

            const token = this.$cookies.get('tokenBearer')
            const order = this.form 
            const details = this.form.details

            delete order.shop_image
            delete order.details
            delete order.shop 
            delete order.table 
            delete order.payment
            delete order.cashier
            delete order.created_by
            delete order.created_at

            this.updateDataProduct({
                order: order,
                details: details,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.visibleFormOrder = false
                    this.visibleFormProduct = false
                    this.getData()
                    this.$message(`Berhasil merubah produk untuk pesanan ${this.form.order_id}.`)
                } else {
                    this.$message(`Gagal merubah produk untuk pesanan ${this.form.order_id}.`)
                }
            })
        },

        // SEND NOTIFICATION
        onSendNotification (data) {
            const payload = {
                shopId: this.paramShopId,
                orderId: data.order_id,
                shopName: data.shop_name,
                tableName: data.table_name,
                customerName: data.customer_name,
                type: "order-status",
                message: `
                    Status pesanan 
                    ${data.customer_name ? ' atas nama ' + data.customer_name : ''} 
                    berhasil diubah
                `,
            }
            this.$socket.emit('notification', payload)
        },
    }
}
</script>