<template>
  <div id="Detail">
    <AppSideForm
      :title="'Detail Buku Kas'"
      :enableSaveButton="false"
      :enableCustomFooter="true"
      :onClose="onClose"
    >
      <div
        v-if="form.cash_status === 'open'"
        slot="toolbar"
        class="margin margin-right-10px"
      >
        <button
          class="btn btn-sekunder btn-full"
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
              class="icn icn-left fa fa-lg fa-info-circle"
            ></i>
            <div class="fonts fonts-10 normal red">
              Untuk menutup buku kas, semua penjualan harus diselesaikan terlebih
              dahulu.
            </div>
          </el-popover>
          Tutup
        </button>
      </div>
      <div class="width width-100">
        <el-alert
          v-if="form.cash_status === 'open'"
          title="Penutupan Buku Kas !"
          description="Untuk menutup buku kas, semua penjualan harus diselesaikan terlebih dahulu."
          type="info"
          :closable="true"
          :show-icon="true"
          style="margin: 15px 0"
        >
        </el-alert>
        <div class="width width-100 padding padding-top-5px">
          <div
            class="display-flex space-between align-center margin margin-bottom-15px"
          >
            <div>
              <div class="fonts fonts-9 normal grey">Periode</div>
              <div class="margin margin-right-5px">
                <span
                  v-if="form.cash_date !== form.cash_end_date"
                  class="fonts fonts-10 semibold"
                >
                  {{ form.cash_date | moment('DD MMMM YYYY') }} -
                  {{ form.cash_end_date | moment('DD MMMM YYYY') }}
                </span>
                <span v-else class="fonts fonts-10 semibold">
                  {{ form.cash_date | moment('DD MMMM YYYY') }}
                </span>
              </div>
            </div>
            <div class="display-flex">
              <div class="fonts fonts-9 normal grey">Toko</div>
              <AppCardCapsule
                :data="form.cash_status"
                class="margin margin-left-5px"
              />
            </div>
          </div>
          <div
            class="width width-100 display-flex align-center margin margin-bottom-15px"
          >
            <div style="width: calc(50% - 20px)">
              <div class="fonts fonts-9 normal grey">Kas Summary</div>
              <div class="display-flex align-center">
                <div
                  class="fonts fonts-11 semibold main-color overflow-ellipsis margin margin-right-10px"
                >
                  {{ format(form.cash_summary) }}
                </div>
                <el-popover placement="bottom" width="180" trigger="click">
                  <div class="width width-100">
                    <div class="fonts fonts-11 semibold black">Kas Summary</div>
                    <div class="display-flex margin margin-top-15px">
                      <div class="image image-20px">
                        <i
                          class="fonts fonts-12 green fa fa-lg fa-info-circle"
                        ></i>
                      </div>
                      <div style="width: calc(100% - 30px); margin-left: 10px">
                        <div class="fonts fonts-8 black">Modal</div>
                        <div class="fonts fonts-10 black semibold">
                          {{ format(form.cash_modal || 0) }}
                        </div>
                      </div>
                    </div>
                    <div class="display-flex margin margin-top-15px">
                      <div class="image image-20px">
                        <i
                          class="fonts fonts-12 green fa fa-lg fa-check-circle"
                        ></i>
                      </div>
                      <div style="width: calc(100% - 30px); margin-left: 10px">
                        <div class="fonts fonts-8 black">Keuntungan</div>
                        <div class="fonts fonts-10 black semibold">
                          {{ format(form.cash_profit || 0) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <i
                    slot="reference"
                    class="cursor-pointer fonts fonts-12 grey fa fa-lg fa-info-circle"
                  ></i>
                </el-popover>
              </div>
            </div>
            <div class="image image-40px image-circle bg-white">
              <i
                class="post-middle-absolute fonts fonts-10 fa fa-lg fa-equals"
              ></i>
            </div>
            <div style="width: calc(50% - 20px)">
              <div class="fonts fonts-9 normal grey align-right">
                Kas Aktual
              </div>
              <div
                class="fonts fonts-11 semibold black overflow-ellipsis align-right"
              >
                {{ format(form.cash_actual) }}
              </div>
            </div>
          </div>
          <div
            v-if="form.cash_status === 'closed'"
            class="width width-100 margin margin-bottom-15px"
          >
            <el-alert
              v-if="form.cash_summary > form.cash_actual"
              title="Kas Aktual Tidak Sama dengan Kas Summary !"
              description="Sepertinya Kas Summary dan kas aktual tidak sama, mohon cek kembali kas yang ada."
              type="error"
              :closable="true"
              show-icon
            >
            </el-alert>
          </div>
          <div class="width width-100 margin margin-bottom-15px">
            <div
              class="card bg-white border-full no-padding display-flex space-between align-center wrap"
            >
              <div
                class="width width-50 padding padding-top-10px padding-bottom-10px"
              >
                <div class="padding padding-5px content-center">
                  <div class="display-flex center align-center">
                    <i
                      class="fonts fonts-8 green fa fa-lg fa-arrow-up margin margin-right-5px"
                    ></i>
                    <span
                      class="fonts fonts-9 normal grey overflow-ellipsis align-center"
                      >Kas Masuk</span
                    >
                  </div>
                  <div class="display-flex center align-center">
                    <div
                      class="fonts fonts-10 semibold black overflow-ellipsis align-center"
                    >
                      {{ format(form.cash_in) }}
                    </div>
                    <el-popover
                      v-if="form.cash_detail"
                      placement="bottom"
                      width="180"
                      trigger="click"
                    >
                      <div class="width width-100">
                        <div class="fonts fonts-11 semibold black">
                          Kas Masuk
                        </div>
                        <div
                          v-for="(item, i) in form.cash_detail"
                          :key="i"
                          class="display-flex margin margin-top-15px"
                        >
                          <div class="image image-20px border-full">
                            <img
                              :src="
                                item.image
                                  ? paymentImageThumbnailUrl + item.image
                                  : ''
                              "
                              alt=""
                            />
                          </div>
                          <div
                            style="width: calc(100% - 30px); margin-left: 10px"
                          >
                            <div class="fonts fonts-8 black">
                              {{ item.name }}
                            </div>
                            <div class="fonts fonts-10 black semibold">
                              {{ format(item.cash_in) }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <i
                        slot="reference"
                        class="cursor-pointer fonts fonts-12 grey fa fa-lg fa-info-circle margin margin-left-10px"
                      ></i>
                    </el-popover>
                  </div>
                </div>
              </div>
              <div
                class="width width-50 padding padding-top-10px padding-bottom-10px"
              >
                <div class="padding padding-5px border-left content-center">
                  <div class="display-flex center align-center">
                    <i
                      class="fonts fonts-8 orange fa fa-lg fa-arrow-down margin margin-right-5px"
                    ></i>
                    <span
                      class="fonts fonts-9 normal grey overflow-ellipsis align-center"
                      >Kas Keluar</span
                    >
                  </div>
                  <div class="display-flex center align-center">
                    <div
                      class="fonts fonts-10 semibold black overflow-ellipsis align-center"
                    >
                      {{ format(form.cash_out) }}
                    </div>
                    <el-popover
                      v-if="form.cash_detail"
                      placement="bottom"
                      width="180"
                      trigger="click"
                    >
                      <div class="width width-100">
                        <div class="fonts fonts-11 semibold black">
                          Kas Keluar
                        </div>
                        <div
                          v-for="(item, i) in form.cash_detail"
                          :key="i"
                          class="display-flex margin margin-top-15px"
                        >
                          <div class="image image-20px border-full">
                            <img
                              :src="
                                item.image
                                  ? paymentImageThumbnailUrl + item.image
                                  : ''
                              "
                              alt=""
                            />
                          </div>
                          <div
                            style="width: calc(100% - 30px); margin-left: 10px"
                          >
                            <div class="fonts fonts-8 black">
                              {{ item.name }}
                            </div>
                            <div class="fonts fonts-10 black semibold">
                              {{ format(item.cash_out) }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <i
                        slot="reference"
                        class="cursor-pointer fonts fonts-12 grey fa fa-lg fa-info-circle margin margin-left-10px"
                      ></i>
                    </el-popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="width width-100 padding padding-bottom-15px">
          <AppTabs
            class="width width-100"
            :selectedIndex.sync="selectedIndex"
            :isFull="true"
            :isScrollable="false"
            :data="tabs"
            :onChange="(data) => onChangeTabs(data)"
          />
        </div>

        <div v-loading="loadingReport" class="width width-100">
          <div v-if="selectedIndex === 0" class="width width-100">
            <div class="margin margin-bottom-15px margin-top-5px">
              <OrderStatus :data="form" />
            </div>
            <AppEmpty v-if="dataOrder && dataOrder.length === 0" />
            <div
              v-for="(dt, i) in dataOrder"
              :key="i"
              class="card bg-white box-shadow margin margin-bottom-15px"
            >
              <div
                class="display-flex space-between align-center margin margin-bottom-8px"
              >
                <div class="fonts fonts-10 semibold black">
                  {{ dt.order.order_id }}
                </div>
                <AppCardCapsule :data="dt.order.status" />
              </div>
              <div class="display-flex space-between align-center">
                <div class="fonts fonts-10 normal black">Tanggal</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.order.created_at | moment('DD MMM YYYY') }}
                </div>
              </div>
              <div
                v-if="dt.order.cashier_name"
                class="display-flex space-between align-center"
              >
                <div class="fonts fonts-10 normal black">Kasir</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.order.cashier_name }}
                </div>
              </div>
              <div
                v-if="dt.order.customer_name"
                class="display-flex space-between align-center"
              >
                <div class="fonts fonts-10 normal black">Pelanggan</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.order.customer_name }}
                </div>
              </div>
              <div
                v-if="dt.order.table_id"
                class="display-flex space-between align-center"
              >
                <div class="fonts fonts-10 normal black">Meja</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.order.table_name }}
                </div>
              </div>
              <div
                v-if="dt.order.platform_id"
                class="display-flex space-between align-center"
              >
                <div class="fonts fonts-10 normal black">Platform</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.order.platform_name }}
                </div>
              </div>
              <div
                v-if="dt.order.payment_id"
                class="display-flex space-between align-center"
              >
                <div class="fonts fonts-10 normal black">Pembayaran</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.payment.name }}
                </div>
              </div>
              <div class="display-flex space-between">
                <div class="display-flex">
                  <div class="fonts fonts-10 normal black">Total</div>
                  <div
                    class="fonts fonts-10 semibold black align-right margin margin-left-5px"
                  >
                    ({{ dt.order.payment_status ? 'Dibayar' : 'Belum Bayar' }})
                  </div>
                </div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ format(dt.order.total_price) }}
                </div>
              </div>
              <AppCardCollapse
                :title="`${dt.order.total_item} Produk`"
                class="padding padding-top-15px"
              >
                <el-table
                  :data="dt.details"
                  border
                  empty-text="No Data"
                  class="margin margin-top-15px margin-bottom-15px"
                >
                  <el-table-column label="Produk" min-width="160">
                    <template slot-scope="scope">
                      <div class="fonts fonts-9 normal black">
                        {{ scope.row.product_name }}
                        {{
                          scope.row.product_detail
                            ? `- ${scope.row.product_detail}`
                            : ''
                        }}
                      </div>
                      <div class="fonts fonts-9 semibold black">
                        {{ format(scope.row.price) }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Qty" align="center" width="50">
                    <template slot-scope="scope">
                      <div class="fonts fonts-9 semibold black">
                        {{ scope.row.quantity }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Total" align="right" width="120">
                    <template slot-scope="scope">
                      <div class="fonts fonts-9 semibold black">
                        {{ format(scope.row.subtotal) }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </AppCardCollapse>
              <div class="padding padding-top-15px">
                <button
                  class="btn btn-full btn-sekunder"
                  @click="onRoute(dt.order)"
                >
                  Lihat Penjualan
                </button>
              </div>
            </div>
          </div>
          <div v-if="selectedIndex === 1" class="width width-100">
            <AppEmpty v-if="dataExpense && dataExpense.length === 0" />
            <div
              v-for="(dt, i) in dataExpense"
              :key="i"
              class="card bg-white box-shadow margin margin-bottom-15px"
            >
              <div
                class="display-flex space-between align-center margin margin-bottom-8px"
              >
                <div class="fonts fonts-10 semibold black">
                  {{ dt.expense.expense_list_id }}
                </div>
                <AppCardCapsule :data="dt.expense.status" />
              </div>
              <div class="display-flex space-between align-center">
                <div class="fonts fonts-10 normal black">Tanggal</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.expense.expense_date | moment('DD MMM YYYY') }}
                </div>
              </div>
              <div class="display-flex space-between align-center">
                <div class="fonts fonts-10 normal black">Biaya</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ format(dt.expense.expense_price) }}
                </div>
              </div>
              <div
                v-if="dt.type"
                class="display-flex space-between align-center"
              >
                <div class="fonts fonts-10 normal black">Tipe</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.type.name }}
                </div>
              </div>
              <div
                v-if="dt.payment"
                class="display-flex space-between align-center"
              >
                <div class="fonts fonts-10 normal black">Pembayaran</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.payment.name }}
                </div>
              </div>
              <div
                v-if="dt.expense.description"
                class="display-flex space-between align-center"
              >
                <div class="fonts fonts-10 normal black">Keterangan</div>
                <div class="fonts fonts-10 semibold black align-right">
                  {{ dt.expense.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer">
        <div v-if="selectedIndex === 0" class="margin margin-bottom-15px">
          <div class="display-flex space-between">
            <div class="fonts fonts-10 semibold black">Total Penjualan</div>
            <div class="display-flex column align-right">
              <div class="fonts fonts-10 semibold main-color align-right">
                {{ format(grandTotal) }}
              </div>
              <div v-if="grandItem" class="fonts fonts-9 normal black">
                {{ grandItem }} item
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedIndex === 1" class="margin margin-bottom-15px">
          <div class="display-flex space-between">
            <div class="fonts fonts-10 semibold black">Total Pembelian</div>
            <div class="display-flex column align-right">
              <div class="fonts fonts-10 semibold main-color align-right">
                {{ format(grandTotalExpense) }}
              </div>
              <div v-if="grandItemExpense" class="fonts fonts-9 normal black">
                {{ grandItemExpense }} item
              </div>
            </div>
          </div>
        </div>
        <button
          :disabled="form.cash_status === 'open'"
          class="btn btn-main btn-full"
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
              class="icn icn-left fa fa-lg fa-info-circle"
            ></i>
            <div class="fonts fonts-10 normal red">
              Kamu bisa download laporan setelah menutup buku kas ini.
            </div>
          </el-popover>
          Download Laporan
        </button>
      </div>
    </AppSideForm>
  </div>
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
      return this.$store.state.storeSelectedShop.selectedData
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
      let path = 'shop-orders'
      const roleName = this.$cookies.get('user')
        ? this.$cookies.get('user').role_name
        : ''

      if (roleName === 'owner') {
        path = 'shop-orders'
      } else {
        path = 'employee-orders'
      }

      this.$router
        .push({
          name: path,
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
