<template>
  <div id="App" class="w-full">
    <div class="w-full flex flex-col gap-4 p-4">
      <div class="w-full flex items-center justify-between">
        <h1 class="text-3xl text-black font-semibold">
          Buku Kas
        </h1>
        <el-button type="primary" @click="onCreate">
          <i class="fa fa-lw fa-plus mr-2" /> Buat Buku Kas
        </el-button>
      </div>

      <div class="w-full flex flex-col md:flex-row gap-2 items-center justify-between">
        <SearchField
          :search-value.sync="filter.search"
          class="flex-1 w-full"
          placeholder="Cari buku kas .."
          :enableResponsive="true"
          :onChange="(data) => onSearch(data)"
        />

        <el-select
          v-model="filter.status"
          @change="handleFilterSearch"
          clearable
          placeholder="Select status"
          no-data-text="Data Tidak Ditemukan"
          class="w-full md:w-xxs"
        >
          <el-option
            v-for="(item, i) in statusOptions"
            :key="i"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="w-full flex flex-col gap-4">
        <div v-loading="loading" class="w-full">
          <AppEmpty v-if="data.length === 0" />
          <Card
            :data.sync="data"
            @onChangeCover="uploadImage"
            @onDetail="onDetail"
            @onReOpen="onReOpen"
            @onDelete="onDelete"
            @onChangeStatus="onChangeStatus"
            @onDownload="onDownloadReport"
            @onOpenCashBook="onOpenCashBook"
            @onOpenOrderList="onOpenOrderList"
            @onOpenDetail="onOpenDetail"
          />
        </div>
        <div class="w-full flex justify-between items-center gap-2">
          <div class="text-md text-black">
            Total {{ totalRecord }}
          </div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="limit"
            :pager-count="5"
            layout="prev, pager, next"
            :total="totalRecord"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <Form
      :open-form="formClass"
      @uploadImage="uploadImage"
      @removeImage="removeImage"
      @onSave="onOpenVisibleConfirmed"
      @onClose="onClose"
    />

    <OrderList
      :open-form="formOrderClass"
      @onDownload="onDownloadReport"
      @onClose="onCloseOrderList"
    />

    <Detail
      :open-form="formDetailClass"
      @onClosingCashBook="onOpenCashBook"
      @onDownload="onDownloadReport"
      @onClose="onCloseDetail"
    />

    <CloseCashbook
      v-if="visibleCashBook"
      @onClose="onCloseCashBook"
      @onSave="onSaveCashBook"
    />

    <AppFileUpload
      v-if="visibleUpdateCover"
      @onClose="onCloseCover"
      @onUpload="onUpdateCover"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmed"
      :title="titleConfirmed"
      @onClickNo="onClickNo"
      @onClickYes="onClickYes"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmedDelete"
      :title="'Hapus buku kas ?'"
      @onClickNo="onClickNoDelete"
      @onClickYes="onClickYesDelete"
    />

    <AppPopupAlert
      v-if="visibleAlert"
      :title="titleAlert"
      :icon="iconAlert"
      @onClickOk="onClickOk"
    />

    <AppPopupLoader v-if="loadingForm" />

    <AppPopupLoader v-if="loadingDownload" />
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapState } from 'vuex'
import AppEmpty from '../../../modules/AppEmpty'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import AppFileUpload from '../../../modules/AppFileUpload'
import SearchField from '../../../modules/SearchField'
import Form from './Form'
import Card from './Card'
import CloseCashbook from './CloseCashbook'
import OrderList from './OrderList'
import Detail from './Detail'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Cash Book',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      statusOptions: [
        { label: 'Status Aktif', value: 'active' },
        { label: 'Status Non Aktif', value: 'inactive' },
      ],
      formClass: false,
      formOrderClass: false,
      formDetailClass: false,
      visibleCreateButton: false,
      visibleUpdateCover: false,
      visibleAlert: false,
      visibleQrCode: false,
      visibleCashBook: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
      visibleConfirmed: false,
      visibleConfirmedDelete: false,
      titleConfirmed: 'Simpan data ?',
      currentPage: 0,
    }
  },
  mounted() {
    this.getAllData()
  },
  created() {
    this.filter.search = this.paramCashbookId
  },
  components: {
    AppEmpty,
    AppPopupLoader,
    AppPopupConfirmed,
    AppPopupAlert,
    AppFileUpload,
    SearchField,
    Form,
    Card,
    CloseCashbook,
    OrderList,
    Detail,
  },
  computed: {
    ...mapState({
      filter: (state) => state.storeCashBook.filter,
      form: (state) => state.storeCashBook.form,
      data: (state) => state.storeCashBook.data,
      dataCurrent: (state) => state.storeCashBook.dataCurrent,
      totalRecord: (state) => state.storeCashBook.totalRecord,
      limit: (state) => state.storeCashBook.limit,
      loading: (state) => state.storeCashBook.loading,
      loadingForm: (state) => state.storeCashBook.loadingForm,
      typeForm: (state) => state.storeCashBook.typeForm,
      loadingDownload: (state) => state.storeReports.loadingDownload,
    }),
    typeForm: {
      get() {
        return this.$store.state.storeCashBook.typeForm
      },
      set(value) {
        this.$store.state.storeCashBook.typeForm = value
      },
    },
    shopId() {
      return this.$store.state.storeShop.form.id
    },
    paramShopId() {
      return this.$route.params.shopId
    },
    paramCashbookId() {
      return this.$route.query.search || ''
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.getAllData()
      }
    },
    paramCashbookId() {
      this.filter.search = this.paramCashbookId
      this.getAllData()
    },
  },
  methods: {
    ...mapActions({
      getCashBook: 'storeCashBook/getData',
      getCurrentCashBook: 'storeCashBook/getCurrent',
      setPagination: 'storeCashBook/setPagination',
      resetFormData: 'storeCashBook/resetFormData',
      resetFilter: 'storeCashBook/resetFilter',
      setFormData: 'storeCashBook/setFormData',
      createData: 'storeCashBook/createData',
      updateData: 'storeCashBook/updateData',
      deleteData: 'storeCashBook/deleteData',
      uploadCover: 'storeCashBook/uploadCover',
      download: 'storeReports/download',
      reports: 'storeReports/getData',
    }),
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getAllData()
    },
    onClear() {
      this.filter.search = ''
      this.$router.replace({ query: null })
      this.resetFilter()
      this.getAllData()
    },
    onClose() {
      this.formClass = false
    },
    onRefresh() {
      this.getAllData()
    },

    // LIST DATA
    getAllData() {
      this.getDataCurrent()
      this.getData()
    },
    getDataCurrent() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getCurrentCashBook({ token, shop_id: shop_id }).then((res) => {
          const data = res.data.data
          if (
            data &&
            data.current_cashbook &&
            data.current_cashbook.cash_status === 'open'
          ) {
            this.visibleCreateButton = false
          } else {
            this.visibleCreateButton = true
          }
        })
      }
    },
    getData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getCashBook({ token, shop_id: shop_id })
      }
    },
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getAllData()
    },
    handleFilterSearch() {
      this.currentPage = 1
      this.handleCurrentChange(1)
    },

    // ALERT
    onClickOk() {
      this.visibleAlert = false
    },

    // CONFIRMED
    onClickNo() {
      this.visibleConfirmed = false
    },
    onClickYes() {
      this.visibleConfirmed = false
      const token = this.$cookies.get('tokenBearer')
      switch (this.typeForm) {
        case 'create':
          this.createData({
            ...this.form,
            token: token,
          }).then((res) => {
            const status = res.data.status
            if (status === 'ok') {
              this.formClass = false
              this.visibleCashBook = false
              this.getAllData()
            } else {
              this.$message({
                message: 'Gagal menyimpan buku kas',
                type: 'error',
              })
            }
          })
          break
        case 'edit':
          this.updateData({
            ...this.form,
            token: token,
          }).then((res) => {
            const status = res.data.status
            if (status === 'ok') {
              this.formClass = false
              this.visibleCashBook = false
              this.getAllData()
            } else {
              this.$message({
                message: 'Gagal merubah buku kas',
                type: 'error',
              })
            }
          })
          break
      }
    },

    // SAVE
    onOpenVisibleConfirmed() {
      this.visibleConfirmed = true
      switch (this.typeForm) {
        case 'create':
          this.titleConfirmed = 'Simpan data ?'
          break
        case 'edit':
          this.titleConfirmed = 'Simpan perubahan ?'
          break
      }
    },

    // CREATE
    onCreate() {
      this.formClass = true
      this.typeForm = 'create'
      this.resetFormData()
      this.form.shop_id = this.shopId
    },

    // DETAIL
    onDetail(data) {
      this.formClass = true
      this.typeForm = 'detail'
      this.resetFormData()
      this.setFormData(data)
    },

    // EDIT
    onEdit(data) {
      this.formClass = true
      this.typeForm = 'edit'
      this.resetFormData()
      this.setFormData(data)
    },

    // DELETE
    onDelete(data) {
      this.visibleConfirmedDelete = true
      this.setFormData(data)
    },
    onClickNoDelete() {
      this.visibleConfirmedDelete = false
    },
    onClickYesDelete() {
      this.visibleConfirmedDelete = false
      const token = this.$cookies.get('tokenBearer')
      this.deleteData({
        ...this.form,
        token: token,
      }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.getAllData()
        } else {
          this.visibleAlert = true
          this.titleAlert = 'Gagal menghapus buku kas'
        }
      })
    },

    // ON RE-OPEN
    onReOpen(data) {
      this.resetFormData()
      this.setFormData(data)
      this.typeForm = 'edit'
      this.visibleConfirmed = true
      this.titleConfirmed = 'Re-open buku kas ?'
    },

    // IMAGE
    uploadImage(data) {
      this.visibleUpdateCover = true
      this.setFormData(data)
    },
    removeImage() {
      console.log('removeImage')
    },
    onCloseCover() {
      this.visibleUpdateCover = false
    },
    onUpdateCover(data) {
      this.visibleUpdateCover = false
      const token = this.$cookies.get('tokenBearer')
      this.uploadCover({
        ...this.form,
        image: data,
        token: token,
      }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.getAllData()
        } else {
          this.visibleAlert = true
          this.titleAlert = 'Gagal upload cover'
        }
      })
    },

    // STATUS
    onChangeStatus(data) {
      this.setFormData(data)
      const token = this.$cookies.get('tokenBearer')
      this.updateData({
        ...this.form,
        token: token,
      }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.$message(`Berhasil merubah status.`)
          this.getDataCurrent()
        } else {
          this.$message({
            message: `Gagal merubah status.`,
            type: 'error',
          })
        }
      })
    },

    // DOWNLOAD
    onDownloadReport(data) {
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
          this.$message('Laporan berhasil di download')
        } else {
          this.$message({
            message: 'Gagal download laporan',
            type: 'error',
          })
        }
      })
    },
    getReport(data) {
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

      this.reports(payload).then((res) => {
        if (res.status === 200) {
          this.formOrderClass = true
        }
      })
    },

    // CASH BOOK
    onCloseCashBook() {
      this.visibleCashBook = false
    },
    onOpenCashBook(data) {
      this.visibleCashBook = true
      this.typeForm = 'edit'
      this.setFormData(data)
    },
    onSaveCashBook(data) {
      this.visibleConfirmed = true
      this.titleConfirmed = 'Tutup buku kas ?'
      this.setFormData(data)
    },

    // ORDER LIST
    onOpenOrderList(data) {
      this.setFormData(data)
      this.getReport(data)
    },
    onCloseOrderList() {
      this.formOrderClass = false
    },

    // DETAIL
    onOpenDetail(data) {
      this.setFormData(data)
      this.formDetailClass = true
    },
    onCloseDetail() {
      this.formDetailClass = false
    },
  },
}
</script>
