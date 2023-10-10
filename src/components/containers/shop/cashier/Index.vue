<template>
    <div id="App">
        <div class="cashier-container">
            <div class="display-flex space-between margin margin-bottom-5px">
                <h1 class="fonts big black bold">Kasir</h1>
                <CashBookNotification />
            </div>
            <CashBook @onOpenOrderList="onOpenOrderList" />
            <Product v-if="isThereOpenedCashbook" />
        </div>

        <div :class="`content-form ${!visibleCart && 'hide'}`">
            <div class="right">
                <Cart 
                    @onCreateOrder="onCreateOrder"
                    @onCheckOut="onOpenCheckOut"
                    @onClose="onCloseCart" />
            </div>
        </div>

        <div :class="`content-form ${!visibleCheckOut && 'hide'}`">
            <div class="right">
                <CheckOut 
                    @onCreateOrder="onCreateOrder"
                    @onClose="onCloseCheckOut" />
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

        <div :class="`content-form ${!visibleCashBookDetail && 'hide'}`">
            <div class="right">
                <CashBookDetail 
                    @onClosingCashBook="onOpenCashBook"
                    @onDownload="onDownloadReport"
                    @onClose="onCloseOrderList">
                </CashBookDetail>
            </div>
        </div>

        <CartPopup 
            v-if="isThereOpenedCashbook"
            @onClick="onOpenCart" />
        
        <CloseCashbook 
            v-if="visibleCashBookClosing"
            @onClose="onCloseCashBook"
            @onSave="onSaveCashBook"
        />

        <AppPopupConfirmed 
            v-if="visibleConfirmedCashBook"
            :title="titleConfirmedCashBook"
            @onClickNo="onClickNoCashBook"
            @onClickYes="onClickYesCashBook"
        />

        <AppPopupConfirmed 
            v-if="visibleConfirmed"
            :title="titleConfirmed"
            @onClickNo="onClickNo"
            @onClickYes="onClickYes"
        />

        <AppPopupAlert 
            v-if="visibleAlert"
            :title="titleAlert"
            :icon="iconAlert"
            @onClickOk="onClickOk"
        />

        <AppPopupLoader 
            v-if="loading"
        />

        <AppPopupLoader 
            v-if="loadingDownload"
        />
    </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import FormReceipt from '../order/orders/receipt/Index'
import CashBook from './cashBook/Index'
import CashBookNotification from './cashBook/Notification'
import Product from './product/Index'
import Cart from './cart/Index'
import CartPopup from './cart/CartPopup'
import CheckOut from './checkOut/Index'
import CashBookDetail from '../cashBook/Detail'
import CloseCashbook from '../cashBook/CloseCashbook'

export default {
    name: 'App',
    metaInfo: {
        title: 'Shop',
        titleTemplate: '%s | Cashier',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            typeForm: 'carts',
            visibleForm: false,
            visibleCart: false,
            visibleCheckOut: false,
            visibleFormReceipt: false,
            visibleCashBookDetail: false,
            visibleCashBookClosing: false,
            visibleAlert: false,
            titleAlert: 'Gagal memproses data',
            iconAlert: 'fa fa-4x fa-info-circle',
            visibleConfirmed: false,
            visibleConfirmedDelete: false,
            titleConfirmed: 'Buat pesanan ini ?',
            visibleConfirmedCashBook: false,
            titleConfirmedCashBook: 'Buat Buku Kas ?',
        }
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.resetOrder()
            }
        }
    },
    components: {
        AppPopupLoader,
        AppPopupConfirmed,
        AppPopupAlert,
        FormReceipt,
        CashBook,
        CashBookNotification,
        Product,
        Cart,
        CartPopup,
        CheckOut,
        CashBookDetail,
        CloseCashbook,
    },
    computed: {
        ...mapState({
            form: (state) => state.storeCashier.form,
            formCashBook: (state) => state.storeCashBook.form,
            dataCurrent: (state) => state.storeCashBook.dataCurrent,
            loadingDownload: (state) => state.storeReports.loadingDownload,
        }),
        currentCashBook () {
            return this.dataCurrent && this.dataCurrent.current_cashbook
        },
        isThereOpenedCashbook () {
            return this.currentCashBook && this.currentCashBook.cash_status === 'open'
        },
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
        loading: {
            get () {
                return this.$store.state.storeCashier.loading
            },
            set (value) {
                this.$store.state.storeCashier.loading = value 
            }
        },
        typeFormCashBook: {
            get () {
                return this.$store.state.storeCashBook.typeForm
            },
            set (value) {
                this.$store.state.storeCashBook.typeForm = value
            }
        },
    },
    methods: {
        ...mapActions({
            resetOrder: 'storeCashier/resetOrder',
            createOrder: 'storeCashier/createOrder',
            getById: 'storeCashier/getById',
            setFormData: 'storeOrders/setFormData',
            getCashBook: 'storeCashBook/getCurrent',
            setFormCashBook: 'storeCashBook/setFormData',
            updateDataCashBook: 'storeCashBook/updateData',
            download: 'storeReports/download',
            reports: 'storeReports/getData',
            getMatrix: 'storeDashboard/getMatrix',
        }),
        onOpenCart () {
            this.visibleCart = true
        },
        onCloseCart () {
            this.visibleCart = false
        },
        onOpenCheckOut () {
            this.visibleCheckOut = true
        },
        onCloseCheckOut () {
            this.visibleCheckOut = false 
        },
        onCreateOrder () {
            this.visibleConfirmed = true 
        },
        getDashboardMatrix () {
            const shop_id = this.shopId
            const payload = {
                token: this.$cookies.get('tokenBearer'),
                shop_id: shop_id,
            }
            this.getMatrix(payload)
        },

        // RECEIPT 
        onOpenReceipt (data) {
            const token = this.$cookies.get('tokenBearer')
            this.getById({
                token: token,
                order_id: data.order.order_id,
            }).then((res) => {
                const response = res.data.data 
                const payload = {
                    ...response.order,
                    shop_image: response.shop.image,
                    address: response.address,
                    customer: response.customer,
                    details: response.details,
                    payment: response.payment,
                    shipment: response.shipment,
                    shop: response.shop,
                    table: response.table
                }
                if (payload.payment_status) {
                    this.visibleFormReceipt = true 
                    this.setFormData(payload)
                }
            })
        },
        onCloseReceipt () {
            this.visibleFormReceipt = false
        },
        onPrintReceipt () {
            alert('onPrintReceipt')
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
            const cashbook_id = this.currentCashBook && this.currentCashBook.id 
            const payload = {
                ...this.form,
                order: {
                    ...this.form.order,
                    cashbook_id: cashbook_id,
                },
                token: token
            }
            this.createOrder(payload).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.onCloseCart()
                    this.onCloseCheckOut()
                    this.resetOrder()
                    this.getDataCashBook()
                    this.getDashboardMatrix()
                    this.onOpenReceipt(res.data.data)
                    this.$message(`Pesanan berhasil dibuat.`)
                } else {
                    this.visibleAlert = true 
                    this.titleAlert = 'Gagal membuat pesanan'
                }
            })
        },

        // CASH BOOK
        getDataCashBook () {
            const token = this.$cookies.get('tokenBearer')
            const today = new Date()
            const shop_id = this.shopId
            if (shop_id) {
                this.getCashBook({ token, today: today, shop_id: shop_id })
            }
        },
        onCloseOrderList () {
            this.visibleCashBookDetail = false 
        },
        onOpenOrderList (data) {
            this.setFormCashBook(data)
            this.visibleCashBookDetail = true 
        },
        onDownloadReport (data) {
            const token = this.$cookies.get('tokenBearer')
            const shopId = this.shopId
            const search = ''
            const startDate = moment(data.cash_date).format('YYYY-MM-DD 00:00:00')
            const endDate = moment(data.cash_date).format('YYYY-MM-DD 23:59:59')
            const orderStatus = 'done'
            // const paymentStatus = '1'
            const cashbookId = data.id

            const payload = {
                search: search,
                status: orderStatus,
                // payment_status: paymentStatus,
                start_date: startDate,
                end_date: endDate,
                shop_id: shopId,
                cashbook_id: cashbookId,
                token: token,
            }

            this.download(payload).then((res) => {
                if (res.status === 200) {
                    this.$message('Download laporan keuangan')
                } else {
                    this.$message({
                        message: 'Gagal download laporan keuangan',
                        type: 'error'
                    })
                }
            })
        },
        onGetReport (data) {
            const token = this.$cookies.get('tokenBearer')
            const shopId = this.shopId
            const search = ''
            const startDate = moment(data.cash_date).format('YYYY-MM-DD 00:00:00')
            const endDate = moment(data.cash_date).format('YYYY-MM-DD 23:59:59')
            const orderStatus = ''
            // const paymentStatus = '1'
            const cashbookId = data.id

            const payload = {
                search: search,
                status: orderStatus,
                // payment_status: paymentStatus,
                start_date: startDate,
                end_date: endDate,
                shop_id: shopId,
                cashbook_id: cashbookId,
                token: token,
                disable_limit: true,
            }

            this.reports(payload).then((res) => {
                if (res.status === 200) {
                    this.visibleCashBookDetail = true 
                }
            })
        },

        // CLOSING CASH BOOK
        onCloseCashBook () {
            this.visibleCashBookClosing = false 
        },
        onOpenCashBook (data) {
            this.visibleCashBookClosing = true 
            this.typeFormCashBook = 'edit'
        },
        onSaveCashBook (data) {
            this.visibleConfirmedCashBook = true
            this.titleConfirmedCashBook = 'Tutup Buku Kas ?'
        },
        onClickNoCashBook () {
            this.visibleConfirmedCashBook = false 
        },
        onClickYesCashBook () {
            this.loading = true 
            this.visibleConfirmedCashBook = false
            const token = this.$cookies.get('tokenBearer')
            this.updateDataCashBook({
                ...this.formCashBook,
                cash_status: 'closed',
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.visibleCashBookDetail = false 
                    this.visibleCashBookClosing = false 
                    this.getDataCashBook()
                } else {
                    this.$message({
                        message: 'Gagal menutup Buku Kas',
                        type: 'error'
                    })
                }
            }).finally(() => {
                this.loading = false 
            })
        }
    }
}
</script>