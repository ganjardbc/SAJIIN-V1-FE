<template>
  <AppSideForm
    :value="openForm"
    title="Detail Buku Kas"
    :enableSaveButton="false"
    :enableCustomFooter="true"
    @close="onClose"
  >
    <template
      v-if="form.cash_status === 'open'"
      slot="toolbar"
    >
      <el-button
        size="small"
        :disabled="isCanClosing(form)"
        @click="onClosingCashBook(form)"
      >
        <el-popover
          v-if="isCanClosing(form)"
          placement="left"
          width="210"
          trigger="hover"
          style="word-break: break-word"
        >
          <i
            slot="reference"
            class="text-sm text-gray-500 fa fa-info-circle mr-2"
          ></i>
          <div class="text-xs text-red-500 text-nowrap">
            Untuk menutup buku kas, semua penjualan harus diselesaikan terlebih
            dahulu.
          </div>
        </el-popover>
        Tutup
      </el-button>
    </template>

    <div class="w-full flex flex-col gap-4">
      <el-alert
        v-if="form.cash_status === 'open'"
        title="Penutupan Buku Kas !"
        description="Untuk menutup buku kas, semua penjualan harus diselesaikan terlebih dahulu."
        type="info"
        :closable="true"
        :show-icon="true"
      />

      <div class="flex justify-between items-center">
        <div class="flex-1">
          <div class="text-xs text-gray-500">Periode</div>
          <div class="w-full text-sm text-black font-semibold">
            <span v-if="form.cash_date !== form.cash_end_date">
              {{ form.cash_date | moment('DD MMMM YYYY') }} -
              {{ form.cash_end_date | moment('DD MMMM YYYY') }}
            </span>
            <span v-else>
              {{ form.cash_date | moment('DD MMMM YYYY') }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-xs text-gray-500">Toko</div>
          <AppCardCapsule :data="form.cash_status" />
        </div>
      </div>

      <CashSummary
        :cash-summary="form.cash_summary"
        :cash-modal="form.cash_modal"
        :cash-actual="form.cash_actual"
        :cash-profit="form.cash_profit"
        :cash-in="form.cash_in"
        :cash-out="form.cash_out"
        :cash-detail="form.cash_detail"
        :enable-cash-warning="form.cash_status === 'closed'"
      />

      <AppTabs
        class="w-full"
        :selectedIndex.sync="selectedIndex"
        :isFull="true"
        :isScrollable="false"
        :data="tabs"
        :onChange="(data) => onChangeTabs(data)"
      />

      <div v-loading="loadingReport" class="w-full flex flex-col gap-4">
        <div v-if="selectedIndex === 0" class="w-full flex flex-col gap-4">
          <OrderStatus :data="form" />

          <AppEmpty v-if="dataOrder && dataOrder.length === 0" />

          <div
            v-for="(dt, i) in dataOrder"
            :key="i"
            class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
          >
            <div class="w-full flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <div class="text-xs text-black font-semibold">
                  {{ dt.order.order_id }}
                </div>
                <AppCardCapsule :data="dt.order.status" />
              </div>
              <div class="flex justify-between items-center">
                <div class="text-xs text-black">Tanggal</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.order.created_at | moment('DD MMM YYYY') }}
                </div>
              </div>
              <div
                v-if="dt.order.cashier_name"
                class="flex justify-between items-center"
              >
                <div class="text-xs text-black">Kasir</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.order.cashier_name }}
                </div>
              </div>
              <div
                v-if="dt.order.customer_name"
                class="flex justify-between items-center"
              >
                <div class="text-xs text-black">Pelanggan</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.order.customer_name }}
                </div>
              </div>
              <div
                v-if="dt.order.table_id"
                class="flex justify-between items-center"
              >
                <div class="text-xs text-black">Meja</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.order.table_name }}
                </div>
              </div>
              <div
                v-if="dt.order.platform_id"
                class="flex justify-between items-center"
              >
                <div class="text-xs text-black">Platform</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.order.platform_name }}
                </div>
              </div>
              <div
                v-if="dt.order.payment_id"
                class="flex justify-between items-center"
              >
                <div class="text-xs text-black">Pembayaran</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.payment.name }}
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div class="flex gap-1 items-center">
                  <div class="text-xs text-black">Total</div>
                  <div class="text-xs text-black font-semibold text-right margin margin-left-5px">
                    ({{ dt.order.payment_status ? 'Dibayar' : 'Belum Bayar' }})
                  </div>
                </div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ format(dt.order.total_price) }}
                </div>
              </div>
            </div>

            <AppCardCollapse :title="`${dt.order.total_item} Produk`">
              <el-table
                :data="dt.details"
                border
                empty-text="No Data"
                class="w-full mt-2"
              >
                <el-table-column label="Produk" min-width="160">
                  <template slot-scope="scope">
                    <div class="text-xs text-black">
                      {{ scope.row.product_name }}
                      {{
                        scope.row.product_detail
                          ? `- ${scope.row.product_detail}`
                          : ''
                      }}
                    </div>
                    <div class="text-xs text-black font-semibold">
                      {{ format(scope.row.price) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Qty" align="center" width="50">
                  <template slot-scope="scope">
                    <div class="text-xs text-black font-semibold">
                      {{ scope.row.quantity }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="Total" align="right" width="120">
                  <template slot-scope="scope">
                    <div class="text-xs text-black font-semibold">
                      {{ format(scope.row.subtotal) }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </AppCardCollapse>

            <el-button
              class="w-full"
              @click="onRoute(dt.order)"
            >
              Lihat Penjualan
            </el-button>
          </div>
        </div>

        <div v-if="selectedIndex === 1" class="w-full flex flex-col gap-4">
          <AppEmpty v-if="dataExpense && dataExpense.length === 0" />

          <div
            v-for="(dt, i) in dataExpense"
            :key="i"
            class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
          >
            <div class="w-full flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <div class="text-xs text-black font-semibold">
                  {{ dt.expense.expense_list_id }}
                </div>
                <AppCardCapsule :data="dt.expense.status" />
              </div>
              <div class="flex justify-between items-center">
                <div class="text-xs text-black">Tanggal</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.expense.expense_date | moment('DD MMM YYYY') }}
                </div>
              </div>
              <div class="flex justify-between items-center">
                <div class="text-xs text-black">Biaya</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ format(dt.expense.expense_price) }}
                </div>
              </div>
              <div
                v-if="dt.type"
                class="flex justify-between items-center"
              >
                <div class="text-xs text-black">Tipe</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.type.name }}
                </div>
              </div>
              <div
                v-if="dt.payment"
                class="flex justify-between items-center"
              >
                <div class="text-xs text-black">Pembayaran</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.payment.name }}
                </div>
              </div>
              <div
                v-if="dt.expense.description"
                class="flex justify-between items-center"
              >
                <div class="text-xs text-black">Keterangan</div>
                <div class="text-xs text-black font-semibold text-right">
                  {{ dt.expense.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="w-full flex flex-col gap-4">
        <div v-if="selectedIndex === 0" class="flex justify-between">
          <div class="text-xs text-black font-semibold">Total Penjualan</div>
          <div class="flex flex-col items-end">
            <div class="text-sm text-vermillion-500 font-semibold text-right">
              {{ format(grandTotal) }}
            </div>
            <div v-if="grandItem" class="text-xs text-black text-right">
              {{ grandItem }} item
            </div>
          </div>
        </div>

        <div v-if="selectedIndex === 1" class="flex justify-between">
          <div class="text-xs text-black font-semibold">Total Pembelian</div>
          <div class="flex flex-col items-end">
            <div class="text-sm text-vermillion-500 font-semibold text-right">
              {{ format(grandTotalExpense) }}
            </div>
            <div v-if="grandItemExpense" class="text-sm text-black text-right">
              {{ grandItemExpense }} item
            </div>
          </div>
        </div>

        <el-button
          type="primary"
          :disabled="form.cash_status === 'open'"
          class="w-full"
          @click="onDownload(form)"
        >
          <el-popover
            v-if="form.cash_status === 'open'"
            placement="left"
            width="210"
            trigger="hover"
            style="word-break: break-word"
          >
            <i
              slot="reference"
              class="text-sm text-white fa fa-info-circle mr-2"
            ></i>
            <div class="text-xs text-red-500">
              Kamu bisa download laporan setelah menutup buku kas ini.
            </div>
          </el-popover>
          Download Laporan
        </el-button>
      </div>
    </template>
  </AppSideForm>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import AppSideForm from '../../../modules/AppSideForm'
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppCardCollapse from '../../../modules/AppCardCollapse'
import AppTabs from '../../../modules/AppTabs'
import AppEmpty from '../../../modules/AppEmpty'
import CardOrder from '../reports/orderExpense/CardOrder'
import OrderStatus from './OrderStatus'
import CashSummary from './CashSummary'

export default {
  name: 'Detail',
  data() {
    return {
      selectedIndex: 0,
      tabs: [
        { id: 1, label: 'Penjualan', status: 'active' },
        { id: 2, label: 'Pembelian', status: '' },
      ],
    }
  },
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  watch: {
    form() {
      this.getReport()
    },
  },
  computed: {
    ...mapState({
      form: (state) => state.storeCashBook.form,
      errorMessage: (state) => state.storeCashBook.errorMessage,
      dataOrder: (state) => state.storeReports.data,
      cashIn: (state) => state.storeReports.cashIn,
      cashOut: (state) => state.storeReports.cashOut,
      cashModal: (state) => state.storeReports.cashModal,
      cashSummary: (state) => state.storeReports.cashSummary,
      cashProfit: (state) => state.storeReports.cashProfit,
      grandItem: (state) => state.storeReports.grandItem,
      grandTotal: (state) => state.storeReports.grandTotal,
      grandBills: (state) => state.storeReports.grandBills,
      grandChange: (state) => state.storeReports.grandChange,
      loadingReport: (state) => state.storeReports.loading,
      dataExpense: (state) => state.storeReports.expense.data,
      grandItemExpense: (state) => state.storeReports.expense.grandItem,
      grandTotalExpense: (state) => state.storeReports.expense.grandTotal,
    }),
    shopId() {
      return this.$store.state.storeShop.form.id
    },
  },
  components: {
    AppSideForm,
    AppCardCapsule,
    AppCardCollapse,
    AppTabs,
    AppEmpty,
    CardOrder,
    OrderStatus,
    CashSummary,
  },
  methods: {
    ...mapActions({
      download: 'storeReports/download',
      getReportsData: 'storeReports/getData',
    }),
    isCanClosing(data) {
      let status = true
      if (data.status === 'active') {
        if (data.order_done < data.order_total) {
          status = true
        } else {
          status = false
        }
      }
      return status
    },
    onRoute(data) {
      this.$router
        .push({
          name: 'shop-orders',
          query: {
            search: data.order_id,
          },
        })
        .catch((error) => {
          if (error.name != 'NavigationDuplicated') {
            throw error
          }
        })
    },
    getReport() {
      const data = this.form
      const token = this.$cookies.get('tokenBearer')
      const shopId = this.shopId
      const search = ''
      const startDate = moment(data.cash_date).format('YYYY-MM-DD 00:00:00')
      const endDate = moment(data.cash_date).format('YYYY-MM-DD 23:59:59')
      const orderStatus = ''
      const paymentStatus = ''
      const cashbookId = data.id

      const payload = {
        search: search,
        status: orderStatus,
        payment_status: paymentStatus,
        start_date: startDate,
        end_date: endDate,
        shop_id: shopId,
        cashbook_id: cashbookId,
        token: token,
        disable_limit: true,
      }

      if (data.id) {
        this.getReportsData(payload)
      }
    },
    onChangeTabs(value) {
      this.selectedIndex = value
    },
    onDownload(data) {
      this.$emit('onDownload', data)
    },
    onClose() {
      this.$emit('onClose')
    },
    onClosingCashBook(data) {
      this.$emit('onClosingCashBook', data)
    },
  },
}
</script>
