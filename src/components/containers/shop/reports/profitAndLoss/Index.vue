<template>
  <div class="width width-full">
    <div class="display-flex space-between align-center display-mobile padding padding-bottom-10px margin margin-bottom-15px border-bottom">
      <h1 class="fonts medium black bold margin margin-mobile-bottom-10px">Laba Rugi</h1>
      <div class="display-flex display-mobile" style="align-items: flex-end">
        <div class="width width-120px margin margin-right-15px no-margin-padding margin-mobile-bottom-10px width-mobile">
          <el-select
            v-model="filter.report_type"
            :clearable="false"
            placeholder="Pilih Tipe Laporan"
            no-data-text="Data Tidak Ditemukan"
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
        </div>
        <div class="width width-300px width-mobile margin no-margin-padding">
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
            style="width: 100% !important"
            @change="handleOrderDate"
          />
        </div>
      </div>
    </div>

    <div v-loading="loading" class="width width-full padding padding-15px border-full border-radius bg-white">
      <h1 class="fonts small align-center black semibold">LAPORAN LABA RUGI</h1>
      <h2 class="fonts fonts-14px align-center black semibold">
        PERIODE:
        <span v-if="rangeDate && rangeDate.length > 0">
          {{ rangeDate[0] | moment('DD MMMM YYYY') }} -
          {{ rangeDate[1] | moment('DD MMMM YYYY') }}
        </span>
        <span v-else>-</span>
      </h2>

      <div class="display-flex space-between align-center bg-white-grey margin margin-top-15px">
        <div class="fonts fonts-14px black semibold">Keterangan</div>
        <div class="fonts fonts-14px black semibold">Amount</div>
      </div>

      <div class="display-flex column margin margin-top-15px">
        <div class="fonts fonts-14px black semibold">Pendapatan</div>
        <div class="display-flex space-between align-center padding padding-left-15px">
          <div class="fonts fonts-14px black">Penjualan</div>
          <div class="fonts fonts-14px black">{{ format(cashIn) }}</div>
        </div>
        <div class="display-flex space-between align-center padding padding-left-15px">
          <div class="fonts fonts-14px black">Diskon Penjualan</div>
          <div class="fonts fonts-14px red">({{ format(discountOrder) }})</div>
        </div>
      </div>

      <div class="display-flex space-between align-center bg-white-grey margin margin-top-15px">
        <div class="fonts fonts-14px black semibold">A. Laba(rugi) Kotor</div>
        <div class="fonts fonts-14px black semibold">{{ format(lossProfit) }}</div>
      </div>

      <div class="display-flex column margin margin-top-15px">
        <div class="fonts fonts-14px black semibold">Beban</div>
        <div class="display-flex space-between align-center padding padding-left-15px">
          <div class="fonts fonts-14px black">Pengeluaran Outlet</div>
          <div class="fonts fonts-14px black">{{ format(cashOut) }}</div>
        </div>
      </div>

      <div class="display-flex space-between align-center margin margin-top-5px">
        <div class="fonts fonts-14px black semibold">B. Total Beban</div>
        <div class="fonts fonts-14px black">{{ format(cashOut) }}</div>
      </div>

      <div class="display-flex space-between align-center bg-white-grey margin margin-top-15px">
        <div class="fonts fonts-14px black semibold">C. Laba(rugi) Operasional (A+B)</div>
        <div class="fonts fonts-14px black semibold">{{ format(lossProfitOperational) }}</div>
      </div>

      <div class="display-flex column margin margin-top-15px">
        <div class="fonts fonts-14px black semibold">Pendapatan Lain - Lain</div>
        <div class="display-flex space-between align-center padding padding-left-15px">
          <div class="fonts fonts-14px black">Buku Kas</div>
          <div class="fonts fonts-14px black">{{ format(cashSummary) }}</div>
        </div>
      </div>

      <div class="display-flex space-between align-center margin margin-top-5px">
        <div class="fonts fonts-14px black semibold">D. Total Pendapatan Lain-lain</div>
        <div class="fonts fonts-14px black">{{ format(cashSummary) }}</div>
      </div>

      <div class="display-flex space-between align-center bg-white-grey margin margin-top-15px">
        <div class="fonts fonts-14px black semibold">E. Laba(rugi) Bersih (C+D)</div>
        <div class="fonts fonts-14px black semibold">{{ format(lossProfitClean) }}</div>
      </div>
    </div>

    <div class="main-content-footer">
      <div class="main-content-footer-container display-flex space-between">
        <button
          class="btn btn-main btn-full"
          :disabled="!isButtonReportEnable"
          @click="downloadReport"
        >
          <i class="icn icn-left fa fa-lw fa-download"></i> Download Report
        </button>
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
      return this.$store.state.storeSelectedShop.selectedData
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