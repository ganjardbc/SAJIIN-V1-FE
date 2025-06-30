<template>
  <div id="App" class="w-full flex flex-col gap-4">
    <div class="w-full flex flex-col gap-4">
      <div class="w-full flex flex-col gap-4">
        <el-select
          v-model="filter.report_type"
          :clearable="false"
          placeholder="Pilih Tipe Laporan"
          no-data-text="Data Tidak Ditemukan"
          class="w-[200px]"
          @change="handleReportType"
        >
          <el-option
            v-for="(item, i) in downloadList"
            :key="i"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
          :disabled="filter.report_type === 'custom' ? false : true"
          style="width: 100%"
          @change="handleOrderDate"
        />
      </div>

      <div v-loading="loading" class="w-full p-4 border border-gray-200 rounded-lg bg-white flex flex-col gap-4">
        <div class="w-full flex items-center">
          <div class="text-sm text-black font-semibold mr-2">
            PERIODE:
          </div>
          <div class="text-sm text-black font-normal overflow-ellipsis text-right">
            <span v-if="rangeDate && rangeDate.length > 0">
              {{ rangeDate[0] | moment('DD MMMM YYYY') }} -
              {{ rangeDate[1] | moment('DD MMMM YYYY') }}
            </span>
            <span v-else>-</span>
          </div>
        </div>

        <div class="bg-gray-100 rounded-md p-4 grid grid-cols-2 gap-4">
          <div class="flex-1 p-1 text-center border-r border-gray-300">
            <div class="flex justify-center items-center">
              <i class="fa fa-lw fa-info-circle mr-2 text-sm text-vermillion-500" />
              <span
                class="text-xs font-normal text-gray-500"
                >Modal</span
              >
            </div>
            <div
              class="text-md font-semibold text-black"
            >
              {{ format(cashModal) }}
            </div>
          </div>

          <div class="flex-1 p-1 text-center">
            <div class="flex justify-center items-center">
              <i class="fa fa-lw fa-info-circle mr-2 text-sm text-vermillion-500" />
              <span
                class="text-xs font-normal text-gray-500"
                >Keuntungan</span
              >
            </div>
            <div
              class="text-md font-semibold text-black"
            >
              {{ format(cashProfit) }}
            </div>
          </div>

          <div class="flex-1 p-1 text-center border-r border-gray-300">
            <div class="flex justify-center items-center">
              <i class="fa fa-lw fa-arrow-up mr-2 text-sm text-green-500" />
              <span
                class="text-xs font-normal text-gray-500"
                >Kas Masuk</span
              >
            </div>
            <div
              class="text-md font-semibold text-black"
            >
              {{ format(cashIn) }}
            </div>
          </div>

          <div class="flex-1 p-1 text-center">
            <div class="flex justify-center items-center">
              <i class="fa fa-lw fa-arrow-down mr-2 text-sm text-orange-500" />
              <span
                class="text-xs font-normal text-gray-500"
                >Kas Keluar</span
              >
            </div>
            <div
              class="text-md font-semibold text-black"
            >
              {{ format(cashOut) }}
            </div>
          </div>
        </div>

        <AppButtonCapsuleSlider
          v-if="cashBookList && cashBookList.length > 0"
          :index.sync="selectedCashBook"
          :disableAll="true"
          :returnIndex="true"
          :data="mappedTabs"
          @onChange="onSelectCashBook"
        />

        <AppTabs
          :selectedIndex.sync="selectedIndex"
          :isFull="true"
          :isScrollable="false"
          :data="tabs"
          :onChange="(data) => onChangeTabs(data)"
          class="margin margin-bottom-15px"
        />
        <CardOrder v-if="selectedIndex === 0" :data="getOrderList" />
        <CardExpense
          v-if="selectedIndex === 1"
          :data="getExpenseList"
          :order="getOrderList"
        />
      </div>
    </div>

    <div class="main-content-footer">
      <div class="main-content-footer-container">
        <el-button
          class="w-full"
          :disabled="!isButtonReportEnable"
          @click="downloadReport"
        >
          <i class="icn icn-left fa fa-lw fa-download"></i> Download
        </el-button>
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
import AppTabs from '../../../../modules/AppTabs'
import AppPopupLoader from '../../../../modules/AppPopupLoader'
import AppButtonCapsuleSlider from '../../../../modules/AppButtonCapsuleSlider'

const tabs = [
  { id: 1, label: 'Penjualan', status: 'active' },
  { id: 2, label: 'Pembelian', status: '' },
]

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Reports',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      currentPage: 1,
      dateType: 'daterange',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      tabs: tabs,
      selectedIndex: 0,
      selectedCashBook: 0,
    }
  },
  mounted() {
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
      dataShop: (state) => state.storeSelectedShop.form,
    }),
    mappedTabs() {
      const allTab = {
        id: 'all',
        icon: 'fa fa-lw fa-list-ul',
        label: 'Semua Buku Kas',
        status: this.selectedCashBook === 'all' ? 'active' : '',
      }
      return [
        allTab, 
        ...this.cashBookList.map((tab) => ({
          id: tab.id,
          icon: 'fa fa-lw fa-book-open',
          label: moment(tab.cash_date).format('DD MMMM YYYY'),
          status: '',
        })),
      ]
    },
    customOrderStatus() {
      if (this.isNonFnB) {
        return this.orderStatus.filter(
          (item) =>
            item.value !== 'on-progress' &&
            item.value !== 'ready' &&
            item.value !== 'delivered'
        )
      } else {
        return this.orderStatus
      }
    },
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
    isButtonApplyEnable() {
      return (
        this.filter.order_date &&
        this.filter.payment_status &&
        this.filter.order_status
      )
    },
    isButtonReportEnable() {
      return this.orderList.length > 0
    },
    shopId() {
      return this.$store.state.storeShop.form.id
    },
    getOrderList() {
      let payload = this.orderList
      if (this.selectedCashBook !== 'all') {
        payload = this.orderList.filter(
          (item) => item.order.cashbook_id === this.selectedCashBook
        )
      }
      return payload
    },
    getExpenseList() {
      let payload = this.expenseList
      if (this.selectedCashBook !== 'all') {
        payload = this.expenseList.filter(
          (item) => item.expense.cashbook_id === this.selectedCashBook
        )
      }
      return payload
    },
  },
  components: {
    CardOrder,
    CardExpense,
    AppTabs,
    AppPopupLoader,
    AppButtonCapsuleSlider,
  },
  methods: {
    ...mapActions({
      getData: 'storeReports/getData',
      download: 'storeReports/download',
      resetFilter: 'storeReports/resetFilter',
      setPagination: 'storeReports/setPagination',
    }),
    onChangeTabs(value) {
      this.selectedIndex = value
    },
    onSelectCashBook(value) {
      console.log('onSelectCashBook', value)
      this.selectedCashBook = value
    },
    getReport() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      const search = this.filter.search
      const orderStatus =
        this.filter.order_status !== 'all' ? this.filter.order_status : ''
      const paymentStatus =
        this.filter.payment_status !== 'all' ? this.filter.payment_status : ''
      let startDate = ''
      let endDate = ''

      if (this.filter.order_date && this.filter.order_date.length > 0) {
        startDate = moment(this.filter.order_date[0])
          .startOf('month')
          .format('YYYY-MM-DD 00:00:00')
        endDate = moment(this.filter.order_date[1]).format(
          'YYYY-MM-DD 23:59:59'
        )
      }

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
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getReport()
    },
    handleFilterSearch() {
      this.currentPage = 1
      this.handleCurrentChange(1)
    },
    handleFilterClear() {
      this.currentPage = 1
      this.dateType = 'daterange'
      this.resetFilter()
    },
    onSearch(data) {
      this.filter.search = data
      this.handleCurrentChange(1)
    },
    onRefresh() {
      console.log('onRefresh')
    },
    handleReportType(data) {
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

      this.handleFilterSearch()
    },
    handleOrderDate(data) {
      this.filter.order_date = data
      this.filter.order_status = 'done'
      this.filter.payment_status = '1'
      this.handleFilterSearch()
    },
    downloadReport() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      const search = this.filter.search
      const startDate = moment(this.filter.order_date[0]).format(
        'YYYY-MM-DD 00:00:00'
      )
      const endDate = moment(this.filter.order_date[1]).format(
        'YYYY-MM-DD 23:59:59'
      )
      const orderStatus =
        this.filter.order_status !== 'all' ? this.filter.order_status : ''
      const paymentStatus =
        this.filter.payment_status !== 'all' ? this.filter.payment_status : ''

      const payload = {
        search: search,
        status: orderStatus,
        payment_status: paymentStatus,
        start_date: startDate,
        end_date: endDate,
        shop_id: shop_id,
        token: token,
        download_type: 'order-reports',
      }

      this.download(payload).then((res) => {
        if (res.status === 200) {
          this.$message('Downloaded order report')
        } else {
          this.$message({
            message: 'Failed to download order report',
            type: 'error',
          })
        }
      })
    },
  },
}
</script>
