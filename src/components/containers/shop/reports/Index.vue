<template>
    <div id="App">
        <div class="width width-100">
            <div class="display-flex space-between align-center">
                <h1 class="fonts big black bold">Laporan</h1>
            </div>
            <div class="display-flex space-between display-mobile padding padding-bottom-10px margin margin-bottom-15px border-bottom" style="align-items: flex-end;">
                <div class="display-flex display-mobile" style="align-items: flex-end;">
                    <div class="width width-150px width-mobile margin margin-right-10px no-margin-padding">
                        <div class="field-group padding padding-bottom-5px">
                            <div class="field-label">Tipe Laporan</div>
                            <el-select 
                                v-model="filter.report_type" 
                                :clearable="false"
                                placeholder="Pilih"
                                no-data-text="Data Tidak Ditemukan"
                                @change="handleReportType">
                                <el-option
                                    v-for="(item, i) in downloadList"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div v-if="filter.report_type === 'custom'" class="width width-300px width-mobile margin margin-right-10px no-margin-padding">
                        <div class="field-group padding padding-bottom-5px">
                            <div class="field-label">Range Tanggal</div>
                            <el-date-picker
                                v-model="filter.order_date"
                                :type="dateType"
                                align="left"
                                unlink-panels
                                range-separator="To"
                                start-placeholder="Start date"
                                end-placeholder="End date"
                                format="dd MMMM yyyy"
                                :picker-options="pickerOptions"
                                @change="handleOrderDate"
                                style="width: 100% !important;">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="width width-150px width-mobile margin margin-right-10px no-margin-padding">
                        <div class="field-group padding padding-bottom-5px">
                            <div class="field-label">Status Pesanan</div>
                            <el-select 
                                v-model="filter.order_status" 
                                :clearable="false"
                                placeholder="Pilih"
                                no-data-text="Data Tidak Ditemukan"
                                :disabled="!filter.order_status">
                                <el-option
                                    v-for="(item, i) in orderStatus"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="width width-150px width-mobile margin margin-right-10px no-margin-padding">
                        <div class="field-group padding padding-bottom-5px">
                            <div class="field-label">Status Pembayaran</div>
                            <el-select 
                                v-model="filter.payment_status" 
                                :clearable="false"
                                placeholder="Pilih"
                                no-data-text="Data Tidak Ditemukan"
                                :disabled="!filter.payment_status">
                                <el-option
                                    v-for="(item, i) in orderPaymentStatus"
                                    :key="i"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                </div>
                <div class="display-flex flex-end">
                    <div class="field-group padding padding-bottom-5px">
                        <div class="display-flex space-between">
                            <div style="width: calc(50% - 5px); margin-right: 5px;">
                                <button class="btn btn-sekunder btn-full" :disabled="!isButtonApplyEnable" @click="handleFilterSearch">
                                    Apply
                                </button>
                            </div>
                            <div style="width: calc(50% - 5px); margin-left: 5px;">
                                <button class="btn btn-sekunder btn-full" :disabled="!isButtonApplyEnable" @click="handleFilterClear">
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-loading="loading" class="width width-100">
                <div class="width width-100 display-flex space-between align-center margin margin-bottom-10px">
                    <div class="fonts fonts-11 semibold black overflow-ellipsis">Periode</div>
                    <div class="fonts fonts-10 normal black overflow-ellipsis align-right">
                        <span v-if="rangeDate && rangeDate.length > 0">
                            {{ rangeDate[0] | moment("DD MMMM YYYY") }} - {{ rangeDate[1] | moment("DD MMMM YYYY") }}
                        </span>
                        <span v-else>Tanggal Kosong</span>
                    </div>
                </div>
                <!-- <div class="width width-100 display-flex align-center margin margin-bottom-15px">
                    <div style="width: calc(50% - 20px);">
                        <div class="fonts fonts-9 normal grey">Kas Summary</div>
                        <div class="fonts fonts-14 semibold main-color overflow-ellipsis">{{ format(cashSummary) }}</div>
                    </div>
                    <div class="image image-40px image-circle bg-white">
                        <i class="post-middle-absolute fonts fonts-10 fa fa-lg fa-equals"></i>
                    </div>
                    <div style="width: calc(50% - 20px);">
                        <div class="fonts fonts-9 normal grey align-right">Kas Aktual</div>
                        <div class="fonts fonts-14 semibold black overflow-ellipsis align-right">{{ format(cashActual) }}</div>
                    </div>
                </div> -->
                <div class="card bg-white-grey no-padding margin margin-bottom-15px">
                    <div class="width width-100 display-flex space-between align-center wrap">
                        <div class="width width-row-4 width-mobile-row-2 padding padding-top-10px padding-bottom-10px">
                            <div class="padding padding-5px content-center">
                                <div class="display-flex center align-center">
                                    <i class="fonts fonts-8 main-color fa fa-lg fa-info-circle margin margin-right-5px"></i>
                                    <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Modal</span>
                                </div>
                                <div class="fonts fonts-11 semibold black overflow-ellipsis align-center">{{ format(cashModal) }}</div>
                            </div>
                        </div>
                        <div class="width width-row-4 width-mobile-row-2 padding padding-top-10px padding-bottom-10px">
                            <div class="padding padding-5px border-left content-center">
                                <div class="display-flex center align-center">
                                    <i class="fonts fonts-8 main-color fa fa-lg fa-check-circle margin margin-right-5px"></i>
                                    <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Keuntungan</span>
                                </div>
                                <div class="fonts fonts-11 semibold black overflow-ellipsis align-center">{{ format(cashProfit) }}</div>
                            </div>
                        </div>
                        <div class="width width-row-4 width-mobile-row-2 padding padding-top-10px padding-bottom-10px">
                            <div class="padding padding-5px border-left border-mobile-none content-center">
                                <div class="display-flex center align-center">
                                    <i class="fonts fonts-8 green fa fa-lg fa-arrow-up margin margin-right-5px"></i>
                                    <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Kas Masuk</span>
                                </div>
                                <div class="fonts fonts-11 semibold black overflow-ellipsis align-center">{{ format(cashIn) }}</div>
                            </div>
                        </div>
                        <div class="width width-row-4 width-mobile-row-2 padding padding-top-10px padding-bottom-10px">
                            <div class="padding padding-5px border-left content-center">
                                <div class="display-flex center align-center">
                                    <i class="fonts fonts-8 orange fa fa-lg fa-arrow-down margin margin-right-5px"></i>
                                    <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Kas Keluar</span>
                                </div>
                                <div class="fonts fonts-11 semibold black overflow-ellipsis align-center">{{ format(cashOut) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="cashBookList && cashBookList.length > 0" class="display-flex space-between align-center wrap margin margin-bottom-10px">
                    <div class="horizontal-scroll" style="overflow-x: auto;">
                        <div style="margin: 0 5px 5px 0; flex-grow: 1; display: inline-block;">
                            <div 
                                :class="`card card-status ${selectedCashBook === 'all' ? 'active' : 'normal'} no-padding border-big-radius`" 
                                style="margin: 0 0;"
                                @click="onSelectCashBook('all')">
                                <div class="display-flex nowrap align-center" style="padding: 5px 10px 5px 5px;">
                                    <div class="width width-40px">
                                        <div class="image image-30px image-circle bg-white border-full">
                                            <i class="post-middle-absolute icn fa fa-lw fa-book-open"></i>
                                        </div>
                                    </div>
                                    <div style="width: calc(100% - 40px);">
                                        <div class="fonts fonts-10 black semibold">Semua Buku Kas</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-for="(dt, i) in cashBookList" :key="i" style="margin: 0 8px 5px 0; flex-grow: 1; display: inline-block;">
                            <div 
                                :class="`card card-status ${selectedCashBook === dt.id ? 'active' : 'normal'} no-padding border-big-radius`" 
                                style="margin: 0 0;"
                                @click="onSelectCashBook(dt.id)">
                                <div class="display-flex nowrap align-center" style="padding: 5px 10px 5px 5px;">
                                    <div class="width width-40px">
                                        <div class="image image-30px image-circle bg-white border-full">
                                            <i class="post-middle-absolute icn fa fa-lw fa-book-open"></i>
                                        </div>
                                    </div>
                                    <div style="width: calc(100% - 40px);">
                                        <div class="fonts fonts-10 black semibold">{{ dt.cash_date | moment("DD MMMM YYYY") }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AppTabs 
                    :selectedIndex.sync="selectedIndex" 
                    :isFull="true"
                    :isScrollable="false"
                    :data="tabs" 
                    :onChange="(data) => onChangeTabs(data)"
                    class="margin margin-bottom-15px"
                />
                <CardOrder v-if="selectedIndex === 0" :data="getOrderList" />
                <CardExpense v-if="selectedIndex === 1" :data="getExpenseList" :order="getOrderList" />
            </div>
        </div>

        <div class="main-content-footer">
            <div class="main-content-footer-container">
                <button class="btn btn-main btn-full" :disabled="!isButtonReportEnable" @click="downloadReport">
                    <i class="icn icn-left fa fa-lw fa-download"></i> Download Laporan
                </button>
            </div>
        </div>

        <AppPopupLoader v-if="loadingDownload" />
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import CardOrder from './CardOrder'
import CardExpense from './CardExpense'
import AppTabs from '../../../modules/AppTabs'
import AppPopupLoader from '../../../modules/AppPopupLoader'

const tabs = [
    {id: 1, label: 'Pesanan', status: 'active'},
    {id: 2, label: 'Pengeluaran', status: ''},
]

export default {
    name: 'App',
    metaInfo: {
        title: 'Shop',
        titleTemplate: '%s | Reports',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            currentPage: 1,
            dateType: 'daterange',
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            tabs: tabs,
            selectedIndex: 0,
            selectedCashBook: 'all',
        }
    },
    mounted () {
        this.handleFilterClear()
    },
    computed: {
        ...mapState({
            orderList: (state) => state.storeReports.data,
            filter: (state) => state.storeReports.filter,
            loading: (state) => state.storeReports.loading,
            loadingDownload: (state) => state.storeReports.loadingDownload,
            limit: (state) => state.storeReports.limit,
            grandItem: (state) => state.storeReports.grandItem,
            grandTotal: (state) => state.storeReports.grandTotal,
            cashModal: (state) => state.storeReports.cashModal,
            cashProfit: (state) => state.storeReports.cashProfit,
            cashIn: (state) => state.storeReports.cashIn,
            cashOut: (state) => state.storeReports.cashOut,
            cashSummary: (state) => state.storeReports.cashSummary,
            cashActual: (state) => state.storeReports.cashActual,
            totalRecord: (state) => state.storeReports.totalRecord,
            downloadList: (state) => state.storeReports.downloadList,
            orderStatus: (state) => state.storeReports.orderStatus,
            orderPaymentStatus: (state) => state.storeReports.orderPaymentStatus,
            cashBookList: (state) => state.storeReports.cashBookList,
            rangeDate: (state) => state.storeReports.rangeDate,
            expenseList: (state) => state.storeReports.expense.data,
        }),
        isButtonApplyEnable () {
            return this.filter.order_date && this.filter.payment_status && this.filter.order_status
        },
        isButtonReportEnable () {
            return this.orderList.length > 0
        },
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
        getOrderList () {
            let payload = this.orderList 
            if (this.selectedCashBook !== 'all') {
                payload = this.orderList.filter((item) => item.order.cashbook_id === this.selectedCashBook)
            }
            return payload
        },
        getExpenseList () {
            let payload = this.expenseList 
            if (this.selectedCashBook !== 'all') {
                payload = this.expenseList.filter((item) => item.expense.cashbook_id === this.selectedCashBook)
            }
            return payload
        }
    },
    components: {
        CardOrder,
        CardExpense,
        AppTabs,
        AppPopupLoader
    },
    methods: {
        ...mapActions({
            getData: 'storeReports/getData',
            download: 'storeReports/download',
            resetFilter: 'storeReports/resetFilter',
            setPagination: 'storeReports/setPagination'
        }),
        onChangeTabs (value) {
            this.selectedIndex = value
        },
        onSelectCashBook (value) {
            this.selectedCashBook = value 
        },
        getReport () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            const search = this.filter.search 
            const startDate = moment(this.filter.order_date[0]).format('YYYY-MM-DD 00:00:00')
            const endDate = moment(this.filter.order_date[1]).format('YYYY-MM-DD 23:59:59')
            const orderStatus = this.filter.order_status !== 'all' ? this.filter.order_status : ''
            const paymentStatus = this.filter.payment_status !== 'all' ? this.filter.payment_status : ''

            const payload = {
                search: search,
                status: orderStatus,
                payment_status: paymentStatus,
                start_date: startDate,
                end_date: endDate,
                shop_id: shop_id,
                token: token,
            }

            this.getData(payload)
        },
        handleCurrentChange (value) {
            this.setPagination(value)
            this.getReport()
        },
        handleFilterSearch () {
            this.currentPage = 1
            this.handleCurrentChange(1)
        },
        handleFilterClear () {
            this.currentPage = 1
            this.dateType = 'daterange'
            this.resetFilter()
        },
        onSearch (data) {
            this.filter.search = data 
            this.handleCurrentChange(1)
        },
        onRefresh () {
            console.log('onRefresh')
        },
        handleReportType (data) {
            let startDate = null
            let endDate = null 

            switch (data) {
                case 'daily':
                    endDate = moment()
                    startDate = moment()
                    break
                case 'this-week':
                    endDate = moment()
                    startDate = moment().subtract(7, 'days')
                    break
                case 'this-month':
                    endDate = moment()
                    startDate = moment().startOf('month')
                    break
                case 'this-year':
                    endDate = moment()
                    startDate = moment().startOf('year')
                    break
                default:
                    endDate = moment()
                    startDate = moment()
                    break
            }

            if (data === 'custom') {
                this.filter.order_status = ''
                this.filter.payment_status = ''
                this.filter.order_date = []
            } else {
                this.filter.order_status = 'done'
                this.filter.payment_status = '1'
                this.filter.order_date = [startDate, endDate]
            }
        },
        handleOrderDate (data) {
            this.filter.order_status = 'done'
            this.filter.payment_status = '1'
        },
        downloadReport () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            const search = this.filter.search 
            const startDate = moment(this.filter.order_date[0]).format('YYYY-MM-DD 00:00:00')
            const endDate = moment(this.filter.order_date[1]).format('YYYY-MM-DD 23:59:59')
            const orderStatus = this.filter.order_status !== 'all' ? this.filter.order_status : ''
            const paymentStatus = this.filter.payment_status !== 'all' ? this.filter.payment_status : ''

            const payload = {
                search: search,
                status: orderStatus,
                payment_status: paymentStatus,
                start_date: startDate,
                end_date: endDate,
                shop_id: shop_id,
                token: token,
            }

            this.download(payload).then((res) => {
                if (res.status === 200) {
                    this.$message('Downloaded order report')
                } else {
                    this.$message({
                        message: 'Failed to download order report',
                        type: 'error'
                    })
                }
            })
        }
    }
}
</script>