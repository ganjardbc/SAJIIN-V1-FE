<template>
  <div id="App" class="w-full flex flex-col gap-4 p-4">
    <div class="w-full flex items-center justify-between">
      <h1 class="text-3xl text-black font-semibold">
        Meja
      </h1>
      <el-button
        v-if="isRoleOwner"
        @click="onCreate"
      >
        <i class="fa fa-lw fa-plus mr-2" /> Tambah Meja
      </el-button>
    </div>

    <SearchField
      :placeholder="'Cari meja ..'"
      :enableResponsive="true"
      :onChange="(data) => onSearch(data)"
    />

    <el-alert
      v-if="!isRoleOwner"
      title="Tambah Meja Baru ?"
      description="Untuk menambahkan meja baru mohon hubungi Owner dari Toko ini."
      type="warning"
      :closable="true"
      show-icon
    />

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
      :open-form="openForm"
      @uploadImage="uploadImage"
      @removeImage="removeImage"
      @save="onOpenVisibleConfirmed"
      @close="onClose"
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
      :title="'Hapus data meja ?'"
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
    title: 'Shop',
    titleTemplate: '%s | Tables',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      tabs: tabs,
      openForm: false,
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
    AppEmpty,
    AppPopupLoader,
    AppPopupConfirmed,
    AppPopupAlert,
    AppFileUpload,
    AppPopupQrCode,
    AppTabs,
    SearchField,
    Form,
    Card,
  },
  computed: {
    ...mapState({
      filter: (state) => state.storeTable.filter,
      form: (state) => state.storeTable.form,
      data: (state) => state.storeTable.data,
      totalRecord: (state) => state.storeTable.totalRecord,
      limit: (state) => state.storeTable.limit,
      loading: (state) => state.storeTable.loading,
      loadingForm: (state) => state.storeTable.loadingForm,
      typeForm: (state) => state.storeTable.typeForm,
    }),
    typeForm: {
      get() {
        return this.$store.state.storeTable.typeForm
      },
      set(value) {
        this.$store.state.storeTable.typeForm = value
      },
    },
    shopId() {
      return this.$store.state.storeSelectedShop.selectedData
    },
    paramShopId() {
      return this.$route.params.shopId
    },
    isRoleOwner() {
      let status = false
      const user = this.$cookies.get('user')
      if (user.role_name === 'owner') {
        status = true
      }
      return status
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.getData()
      }
    },
  },
  methods: {
    ...mapActions({
      getTable: 'storeTable/getData',
      setPagination: 'storeTable/setPagination',
      resetFormData: 'storeTable/resetFormData',
      resetFilter: 'storeTable/resetFilter',
      setFormData: 'storeTable/setFormData',
      createData: 'storeTable/createData',
      updateData: 'storeTable/updateData',
      deleteData: 'storeTable/deleteData',
      uploadCover: 'storeTable/uploadCover',
    }),
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getData()
    },
    onClose() {
      this.openForm = false
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
      const shop_id = this.shopId
      if (shop_id) {
        this.getTable({ token, shop_id })
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
              this.openForm = false
              this.getData()
            } else {
              this.$message({
                message: 'Gagal menyimpan data meja',
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
              this.openForm = false
              this.getData()
            } else {
              this.$message({
                message: 'Gagal merubah data meja',
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
      this.openForm = true
      this.typeForm = 'create'
      this.resetFormData()
      this.form.shop_id = this.shopId
    },

    // DETAIL
    onDetail(data) {
      this.openForm = true
      this.typeForm = 'detail'
      this.resetFormData()
      this.setFormData(data)
    },

    // EDIT
    onEdit(data) {
      this.openForm = true
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
          this.titleAlert = 'Gagal menghapus data meja'
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
          this.$message(`Berhasil merubah status meja ${data.name}.`)
        } else {
          this.$message(`Gagal merubah status meja ${data.name}.`)
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
