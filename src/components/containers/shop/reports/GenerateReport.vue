<template>
  <div>
    <AppCardPopup
      :title="`Buat ${report ? report.title : 'Laporan'}`"
      width="900px"
      height="150px"
      @onClose="onClose"
    >
      <div class="display-flex display-mobile">
        <div class="width width-35 width-mobile">
          <div class="field-group padding padding-top-0px">
            <div class="field-label">Periode</div>
            <el-select
              v-model="filter.report_type"
              :clearable="false"
              placeholder="Pilih"
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
          <div
            v-if="filter.report_type === 'custom'"
            class="field-group padding padding-top-0px"
          >
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
              style="width: 100% !important"
            >
            </el-date-picker>
          </div>
          <div class="field-group padding padding-top-0px">
            <div class="field-label">Status Pesanan</div>
            <el-select
              v-model="filter.order_status"
              :clearable="false"
              placeholder="Pilih"
              no-data-text="Data Tidak Ditemukan"
              :disabled="!filter.order_status"
            >
              <el-option
                v-for="(item, i) in orderStatus"
                :key="i"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="field-group padding padding-top-0px">
            <div class="field-label">Status Pembayaran</div>
            <el-select
              v-model="filter.payment_status"
              :clearable="false"
              placeholder="Pilih"
              no-data-text="Data Tidak Ditemukan"
              :disabled="!filter.payment_status"
            >
              <el-option
                v-for="(item, i) in orderPaymentStatus"
                :key="i"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div
            class="width width-100 padding padding-top-10px padding-bottom-25px"
          >
            <button
              class="btn btn-sekunder btn-full"
              :disabled="!isButtonApplyEnable"
              @click="onViewDownloadReport"
            >
              Lihat Laporan
            </button>
          </div>
        </div>
        <div
          v-loading="loadingDownloadOnly"
          class="width width-65 width-mobile"
        >
          <div
            class="padding padding-left-15px padding-right-15px padding-mobile-none"
          >
            <div
              class="display-flex align-center space-between padding padding-bottom-10px"
            >
              <div class="fonts fonts-11 semibold">Hasil Laporan</div>
              <button
                class="btn btn-main-reverse btn-small"
                :disabled="!isButtonApplyEnable"
                @click="hanldeResetFilter"
              >
                Reset
              </button>
            </div>
            <div style="overflow-y: auto; height: calc(100vh - 250px)">
              <div v-if="fileUrl !== ''">
                <template>
                  <ViewPdf
                    :src="fileUrl"
                    style="display: none"
                    @num-pages="numPages = $event"
                  />
                  <ViewPdf
                    v-for="i in numPages"
                    :key="i"
                    :page="i"
                    :src="fileUrl"
                    ref="myPdfComponent"
                    style="height: 100%"
                  />
                </template>
              </div>
              <AppEmpty v-else title="LAPORAN TIDAK DITEMUKAN" />
            </div>
            <div class="padding padding-top-10px padding-bottom-10px">
              <button
                class="btn btn-main btn-full"
                :disabled="!isButtonReportEnable"
                @click="onDownloadReport"
              >
                Download Laporan
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppCardPopup>
    <AppPopupLoader v-if="loadingDownload" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import ViewPdf from 'vue-pdf'
import moment from 'moment'
import AppCardPopup from '../../../modules/AppCardPopup'
import AppEmpty from '../../../modules/AppEmpty'
import AppPopupLoader from '../../../modules/AppPopupLoader'

export default {
  data() {
    return {
      dateType: 'daterange',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      fileUrl: '',
      numPages: 0,
    }
  },
  components: {
    ViewPdf,
    AppCardPopup,
    AppEmpty,
    AppPopupLoader,
  },
  props: {
    report: Object,
  },
  computed: {
    ...mapState({
      orderList: (state) => state.storeReports.data,
      filter: (state) => state.storeReports.filter,
      loading: (state) => state.storeReports.loading,
      loadingDownload: (state) => state.storeReports.loadingDownload,
      loadingDownloadOnly: (state) => state.storeReports.loadingDownloadOnly,
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
    isButtonApplyEnable() {
      return (
        this.filter.order_date &&
        this.filter.payment_status &&
        this.filter.order_status
      )
    },
    isButtonReportEnable() {
      return this.fileUrl
    },
    shopId() {
      return this.$store.state.storeSelectedShop.selectedData
    },
  },
  methods: {
    ...mapActions({
      download: 'storeReports/download',
      downloadOnly: 'storeReports/downloadOnly',
      resetFilter: 'storeReports/resetFilter',
    }),
    onClose() {
      this.$emit('onClose')
    },
    hanldeResetFilter() {
      this.fileUrl = ''
      this.resetFilter()
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
    },
    handleOrderDate(data) {
      this.filter.order_status = 'done'
      this.filter.payment_status = '1'
    },
    handleFilterSearch() {
      this.currentPage = 1
    },
    onDownloadReport() {
      // this.$refs.myPdfComponent.print()
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
    onViewDownloadReport() {
      this.fileUrl = ''
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
      }

      this.downloadOnly(payload).then((res) => {
        if (res.status === 200) {
          var file = new Blob([res.data], {
            type: 'application/pdf',
          })
          var fileUrl = URL.createObjectURL(file)
          this.fileUrl = fileUrl
          this.$message('Getting order report')
        } else {
          this.$message({
            message: 'Failed to get order receipt',
            type: 'error',
          })
        }
      })
    },
  },
}
</script>
