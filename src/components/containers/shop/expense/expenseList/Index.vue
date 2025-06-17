<template>
  <div id="App" class="w-full">
    <div class="w-full flex flex-col gap-4 p-4">
      <div class="w-full flex items-center justify-between">
        <h1 class="text-3xl text-black font-semibold">
          Pembelian
        </h1>
        <el-button type="primary" @click="onCreate">
          <i class="fa fa-lw fa-plus mr-2" /> Tambah Pembelian
        </el-button>
      </div>

      <div class="w-full flex flex-col md:flex-row gap-2 items-center justify-between">
        <SearchField
          class="flex-1 w-full"
          :placeholder="'Cari transaksi ..'"
          :enableResponsive="true"
          :onChange="(data) => onSearch(data)"
        />

        <div class="w-full md:w-xs flex flex-col md:flex-row gap-2 items-center justify-between">
          <el-select
            v-model="filter.status"
            @change="handleFilterSearch"
            clearable
            placeholder="Select status"
            no-data-text="Data Tidak Ditemukan"
            class="w-full"
          >
            <el-option
              v-for="(item, i) in statusOptions"
              :key="i"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <cashbook-field
            :value.sync="filter.cashbook_id"
            class="w-full"
            @onChange="handleFilterCashbook"
          ></cashbook-field>
        </div>
      </div>

      <div class="w-full">
        <ExpenseType @onChange="onChangeType" />
      </div>

      <div class="w-full flex flex-col gap-4">
        <div v-loading="loading" class="w-full">
          <AppEmpty v-if="data.length === 0" />
          <Card
            :data.sync="data"
            @onChangeCover="uploadImage"
            @onDetail="onDetail"
            @onEdit="onEdit"
            @onDelete="onDelete"
            @onChangeStatus="onChangeStatus"
            @onQrCode="onOpenQrCode"
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
    >
    </Form>

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
      :title="'Hapus transaksi ?'"
      @onClickNo="onClickNoDelete"
      @onClickYes="onClickYesDelete"
    />

    <AppPopupAlert
      v-if="visibleAlert"
      :title="titleAlert"
      :icon="iconAlert"
      @onClickOk="onClickOk"
    />

    <AppPopupQrCode
      v-if="visibleQrCode"
      :code="`${initUrl}visitor/${paramShopId}/${form.table_id}`"
      @onClose="onCloseQrCode"
    />

    <AppPopupLoader v-if="loadingForm" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AppEmpty from '../../../../modules/AppEmpty'
import AppPopupLoader from '../../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../../modules/AppPopupAlert'
import AppFileUpload from '../../../../modules/AppFileUpload'
import AppPopupQrCode from '../../../../modules/AppPopupQrCode'
import SearchField from '../../../../modules/SearchField'
import CashbookField from '../../cashBook/Field'
import ExpenseType from '../expenseType/Slider'
import Form from './Form'
import Card from './Card'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Pembelian',
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
      visibleUpdateCover: false,
      visibleAlert: false,
      visibleQrCode: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
      visibleConfirmed: false,
      visibleConfirmedDelete: false,
      titleConfirmed: 'Simpan data ?',
      currentPage: 0,
    }
  },
  mounted() {
    this.getPaymentData()
    this.getData()
  },
  components: {
    AppEmpty,
    AppPopupLoader,
    AppPopupConfirmed,
    AppPopupAlert,
    AppFileUpload,
    AppPopupQrCode,
    SearchField,
    CashbookField,
    ExpenseType,
    Form,
    Card,
  },
  computed: {
    ...mapState({
      filter: (state) => state.storeExpenseList.filter,
      form: (state) => state.storeExpenseList.form,
      data: (state) => state.storeExpenseList.data,
      totalRecord: (state) => state.storeExpenseList.totalRecord,
      limit: (state) => state.storeExpenseList.limit,
      loading: (state) => state.storeExpenseList.loading,
      loadingForm: (state) => state.storeExpenseList.loadingForm,
      typeForm: (state) => state.storeExpenseList.typeForm,
      // dataExpenseType: (state) => state.storeExpenseList.expenseType.data,
      // loadingExpenseType: (state) => state.storeExpenseList.expenseType.loading,
    }),
    typeForm: {
      get() {
        return this.$store.state.storeExpenseList.typeForm
      },
      set(value) {
        this.$store.state.storeExpenseList.typeForm = value
      },
    },
    shopId() {
      return this.$store.state.storeShop.form.id
    },
    paramShopId() {
      return this.$route.params.shopId
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.getPaymentData()
        // this.getExpenseTypeData()
        this.getData()
      }
    },
  },
  methods: {
    ...mapActions({
      getDataExpenseList: 'storeExpenseList/getData',
      // getDataExpenseType: 'storeExpenseList/getDataExpenseType',
      getDataPayment: 'storeExpenseList/getDataPayment',
      setPagination: 'storeExpenseList/setPagination',
      resetFormData: 'storeExpenseList/resetFormData',
      resetFilter: 'storeExpenseList/resetFilter',
      setFormData: 'storeExpenseList/setFormData',
      createData: 'storeExpenseList/createData',
      updateData: 'storeExpenseList/updateData',
      deleteData: 'storeExpenseList/deleteData',
      uploadCover: 'storeExpenseList/uploadCover',
    }),
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getData()
    },
    onChangeType(data) {
      if (data === 'all') {
        this.filter.expense_type_id = ''
      } else {
        this.filter.expense_type_id = data
      }
      this.resetFilter()
      this.getData()
    },
    onClose() {
      this.formClass = false
    },
    onRefresh() {
      this.getData()
    },

    // LIST DATA
    getPaymentData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getDataPayment({
          token,
          shop_id: shop_id,
        })
      }
    },
    getCashBookData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getDataCashBook({
          token,
          shop_id: shop_id,
        })
      }
    },
    getData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getDataExpenseList({ token, shop_id })
      }
    },
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getData()
    },
    handleFilterSearch() {
      this.currentPage = 1
      this.handleCurrentChange(1)
    },
    handleFilterCashbook(value) {
      this.filter.cashbook_id = value
      this.getData()
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
              this.getData()
            } else {
              this.$message({
                message: 'Gagal menyimpan transaksi',
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
              this.getData()
            } else {
              this.$message({
                message: 'Gagal merubah transaksi',
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
          this.getData()
        } else {
          this.visibleAlert = true
          this.titleAlert = 'Gagal menghapus transaksi'
        }
      })
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
          this.getData()
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
          this.$message(
            `Berhasil merubah status transaksi ${data.expense_list_id}.`
          )
        } else {
          this.$message(
            `Gagal merubah status transaksi ${data.expense_list_id}.`
          )
        }
      })
    },

    // QR CODE
    onOpenQrCode(data) {
      this.visibleQrCode = true
      this.setFormData(data)
    },
    onCloseQrCode() {
      this.visibleQrCode = false
    },
  },
}
</script>
