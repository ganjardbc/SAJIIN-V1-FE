<template>
  <div id="App" class="w-full flex flex-col gap-4">
    <div class="w-full flex flex-col gap-4">
      <el-select
        v-model="filter.report_type"
        :clearable="false"
        placeholder="Pilih Tipe Laporan"
        no-data-text="Data Tidak Ditemukan"
        class="w-full"
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

    <div v-loading="loading" class="w-full p-4 border border-gray-200 rounded-lg bg-white">
      <h1 class="text-xl font-semibold text-center">LAPORAN LABA RUGI</h1>
      <h2 class="text-sm text-gray-500 text-center mt-2">
        PERIODE:
        <span v-if="rangeDate && rangeDate.length > 0">
          {{ rangeDate[0] | moment('DD MMMM YYYY') }} -
          {{ rangeDate[1] | moment('DD MMMM YYYY') }}
        </span>
        <span v-else>-</span>
      </h2>

      <div class="flex justify-between justify-center bg-gray-100 py-2 mt-4">
        <div class="text-sm text-black font-semibold">Keterangan</div>
        <div class="text-sm text-black font-semibold">Amount</div>
      </div>

      <div class="flex flex-col mt-4">
        <div class="text-sm text-black font-semibold">Pendapatan</div>
        <div class="flex justify-between justify-center pl-4">
          <div class="text-sm text-black">Penjualan</div>
          <div class="text-sm text-black">{{ format(cashIn) }}</div>
        </div>
        <div class="flex justify-between justify-center pl-4">
          <div class="text-sm text-black">Diskon Penjualan</div>
          <div class="text-sm text-red-500">({{ format(discountOrder) }})</div>
        </div>
      </div>

      <div class="flex justify-between justify-center bg-gray-100 py-2 mt-4">
        <div class="text-sm text-black font-semibold">A. Laba(rugi) Kotor</div>
        <div class="text-sm text-black font-semibold">{{ format(lossProfit) }}</div>
      </div>

      <div class="flex flex-col mt-4">
        <div class="text-sm text-black font-semibold">Beban</div>
        <div class="flex justify-between justify-center pl-4">
          <div class="text-sm text-black">Pengeluaran Outlet</div>
          <div class="text-sm text-black">{{ format(cashOut) }}</div>
        </div>
      </div>

      <div class="flex justify-between justify-center mt-1">
        <div class="text-sm text-black font-semibold">B. Total Beban</div>
        <div class="text-sm text-black">{{ format(cashOut) }}</div>
      </div>

      <div class="flex justify-between justify-center bg-gray-100 py-2 mt-4">
        <div class="text-sm text-black font-semibold">C. Laba(rugi) Operasional (A+B)</div>
        <div class="text-sm text-black font-semibold">{{ format(lossProfitOperational) }}</div>
      </div>

      <div class="flex flex-col mt-4">
        <div class="text-sm text-black font-semibold">Pendapatan Lain - Lain</div>
        <div class="flex justify-between justify-center pl-4">
          <div class="text-sm text-black">Buku Kas</div>
          <div class="text-sm text-black">{{ format(cashSummary) }}</div>
        </div>
      </div>

      <div class="flex justify-between justify-center mt-1">
        <div class="text-sm text-black font-semibold">D. Total Pendapatan Lain-lain</div>
        <div class="text-sm text-black">{{ format(cashSummary) }}</div>
      </div>

      <div class="flex justify-between justify-center bg-gray-100 py-2 mt-4">
        <div class="text-sm text-black font-semibold">E. Laba(rugi) Bersih (C+D)</div>
        <div class="text-sm text-black font-semibold">{{ format(lossProfitClean) }}</div>
      </div>
    </div>

    <div class="main-content-footer">
      <div class="main-content-footer-container flex justify-between">
        <el-button
          class="w-full"
          :disabled="!isButtonReportEnable"
          @click="downloadReport"
        >
          <i class="fa fa-lw fa-download"></i> Download Report
        </el-button>
      </div>
    </div>

    <AppPopupLoader v-if="loadingDownload" />
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import AppPopupLoader from '../../../../modules/AppPopupLoader'

export default {
  name: 'ProfitAndLoss',
  components: {
    AppPopupLoader,
  },
  data() {
    return {
      dateType: 'daterange',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state.storeReports.loading,
      loadingDownload: (state) => state.storeReports.loadingDownload,
      filter: (state) => state.storeReports.filter,
      orderList: (state) => state.storeReports.data,
      downloadList: (state) => state.storeReports.downloadList,
      rangeDate: (state) => state.storeReports.rangeDate,
      grandItem: (state) => state.storeReports.grandItem,
      grandTotal: (state) => state.storeReports.grandTotal,
      cashModal: (state) => state.storeReports.cashModal,
      cashProfit: (state) => state.storeReports.cashProfit,
      cashIn: (state) => state.storeReports.cashIn,
      cashOut: (state) => state.storeReports.cashOut,
      cashSummary: (state) => state.storeReports.cashSummary,
      cashActual: (state) => state.storeReports.cashActual,
      discountOrder: (state) => state.storeReports.discountOrder,
      lossProfit: (state) => state.storeReports.lossProfit,
      lossProfitOperational: (state) => state.storeReports.lossProfitOperational,
      lossProfitClean: (state) => state.storeReports.lossProfitClean,
    }),
    isButtonReportEnable() {
      return this.orderList && this.orderList.length > 0
    },
    shopId() {
      return this.$store.state.storeShop.form.id
    },
  },
  mounted() {
    this.resetFilter()
  },
  methods: {
    ...mapActions({
      getData: 'storeReports/getData',
      download: 'storeReports/download',
      resetFilter: 'storeReports/resetFilter',
    }),
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

      this.getReport()
    },
    handleOrderDate(data) {
      this.filter.order_date = data
      this.filter.order_status = 'done'
      this.filter.payment_status = '1'

      this.getReport()
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
        download_type: 'profit-and-loss',
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