<template>
  <div id="App" class="p-4 flex flex-col gap-4">
    <h1 class="text-3xl text-black font-semibold">
      Toko
    </h1>

    <SearchField
      :placeholder="'Cari toko ..'"
      :enableResponsive="true"
      :onChange="(data) => onSearch(data)"
    />

    <el-alert
      title="Tambah Toko baru ?"
      description="Untuk menambah toko baru mohon hubungi Admin Sajiin dan ikuti arahan selanjutnya."
      type="warning"
      :closable="true"
      show-icon
    >
    </el-alert>

    <AppTabs
      class="w-full"
      :selectedIndex.sync="selectedIndex"
      :isFull="true"
      :isScrollable="false"
      :data="tabs"
      :onChange="(data) => onChangeTabs(data)"
    />

    <div class="w-full flex flex-col gap-4">
      <div v-loading="loading" class="w-full">
        <AppEmpty v-if="data.length === 0" />
        <Card
          :data.sync="data"
          @onChangeCover="uploadImage"
          @onDetail="onDetail"
          @onEdit="onEdit"
          @onDelete="onDelete"
          @onManage="onManage"
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

    <Form
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
      :title="'Delete this shop ?'"
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
      :visibility.sync="visibleQrCode"
      :data="form"
      @onClose="onCloseQrCode"
    />

    <AppPopupLoader v-if="loadingForm" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AppEmpty from '../../../modules/AppEmpty'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import AppFileUpload from '../../../modules/AppFileUpload'
import AppPopupQrCode from '../../../modules/AppPopupQrCode'
import AppTabs from '../../../modules/AppTabs'
import SearchField from '../../../modules/SearchField'
import Form from './Form'
import Card from './Card'

const tabs = [
  { id: 1, label: 'Aktif', status: 'active' },
  { id: 2, label: 'Non-Aktif', status: '' },
]

export default {
  name: 'App',
  metaInfo: {
    title: 'Owner',
    titleTemplate: '%s | Shops',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      tabs: tabs,
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
      selectedIndex: 0,
    }
  },
  mounted() {
    this.onChangeTabs(0)
  },
  components: {
    AppTabs,
    AppEmpty,
    AppPopupLoader,
    AppPopupConfirmed,
    AppPopupAlert,
    AppFileUpload,
    AppPopupQrCode,
    SearchField,
    Form,
    Card,
  },
  computed: {
    ...mapState({
      filter: (state) => state.storeShop.filter,
      form: (state) => state.storeShop.form,
      data: (state) => state.storeShop.data,
      totalRecord: (state) => state.storeShop.totalRecord,
      limit: (state) => state.storeShop.limit,
      loading: (state) => state.storeShop.loading,
      loadingForm: (state) => state.storeShop.loadingForm,
      typeForm: (state) => state.storeShop.typeForm,
      dataAuth: (state) => state.storeAuth.data,
    }),
    dataUser() {
      return this.dataAuth && this.dataAuth.user
    },
    typeForm: {
      get() {
        return this.$store.state.storeShop.typeForm
      },
      set(value) {
        this.$store.state.storeShop.typeForm = value
      },
    },
  },
  methods: {
    ...mapActions({
      getShop: 'storeShop/getData',
      setPagination: 'storeShop/setPagination',
      resetFormData: 'storeShop/resetFormData',
      resetFilter: 'storeShop/resetFilter',
      setFormData: 'storeShop/setFormData',
      createData: 'storeShop/createData',
      updateData: 'storeShop/updateData',
      deleteData: 'storeShop/deleteData',
      uploadCover: 'storeShop/uploadCover',
    }),
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getData()
    },
    onClose() {
      this.formClass = false
    },
    onRefresh() {
      this.getData()
    },
    onChangeTabs(data) {
      this.selectedIndex = data
      switch (this.selectedIndex) {
        case 0:
          this.filter.status = 'active'
          break
        case 1:
          this.filter.status = 'inactive'
          break
      }
      this.handleFilterSearch()
    },

    // LIST DATA
    getData() {
      const token = this.$cookies.get('tokenBearer')
      this.getShop({ token })
    },
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getData()
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
              this.getData()
            } else {
              this.$message({
                message: 'Failed to save this shop',
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
                message: 'Failed to edit this shop',
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
          this.titleConfirmed = 'Save this shop ?'
          break
        case 'edit':
          this.titleConfirmed = 'Edit this shop ?'
          break
      }
    },

    // CREATE
    onCreate() {
      this.formClass = true
      this.typeForm = 'create'
      this.resetFormData()
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
          this.titleAlert = 'Failed to delete this shop'
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

    // MANAGE
    onManage(data) {
      this.$store.state.storeSelectedShop.selectedData = data.id
      this.$router.push({ name: 'shop-home', params: { shopId: data.shop_id } })
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
          this.$message(`Success changed status for shop ${data.name}.`)
        } else {
          this.$message({
            message: `Failed to change status for shop ${data.name}.`,
            type: 'error',
          })
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
