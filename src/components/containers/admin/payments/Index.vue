<template>
  <div id="App" class="w-full lg:w-lg-false m-auto">
    <div class="w-full flex flex-col gap-4 p-4">
      <div class="w-full flex items-center justify-between">
        <h1 class="text-3xl text-black font-semibold">
          Pembayaran
        </h1>
        <el-button
          type="primary"
          @click="onCreate"
        >
          <i class="fa fa-lw fa-plus mr-2" /> Tambah Pembayaran
        </el-button>
      </div>

      <div class="w-full">
        <SearchField
          class="w-full"
          placeholder="Cari pembayaran .."
          :enableResponsive="true"
          :onChange="(data) => onSearch(data)"
        />
      </div>

      <div class="w-full flex flex-col gap-4">
        <div v-loading="loading" class="w-full">
          <Card
            :data.sync="data"
            @onChangeCover="uploadImage"
            @onDetail="onDetail"
            @onEdit="onEdit"
            @onDelete="onDelete"
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
      :open-form="openForm"
      @uploadImage="uploadImage"
      @removeImage="removeImage"
      @onSave="onOpenVisibleConfirmed"
      @onClose="onClose"
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
      :title="'Hapus pembayaran ?'"
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AppEmpty from '../../../modules/AppEmpty'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import AppFileUpload from '../../../modules/AppFileUpload'
import SearchField from '../../../modules/SearchField'
import Form from './Form'
import Card from './Card'

export default {
  name: 'App',
  metaInfo: {
    title: 'Admin',
    titleTemplate: '%s | Payments',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      openForm: false,
      visibleUpdateCover: false,
      visibleAlert: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
      visibleConfirmed: false,
      visibleConfirmedDelete: false,
      titleConfirmed: 'Simpan data ?',
      currentPage: 0,
    }
  },
  mounted() {
    this.getData()
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
  },
  computed: {
    ...mapState({
      filter: (state) => state.storePayment.filter,
      form: (state) => state.storePayment.form,
      data: (state) => state.storePayment.data,
      totalRecord: (state) => state.storePayment.totalRecord,
      limit: (state) => state.storePayment.limit,
      loading: (state) => state.storePayment.loading,
      loadingForm: (state) => state.storePayment.loadingForm,
      typeForm: (state) => state.storePayment.typeForm,
    }),
    typeForm: {
      get() {
        return this.$store.state.storePayment.typeForm
      },
      set(value) {
        this.$store.state.storePayment.typeForm = value
      },
    },
  },
  methods: {
    ...mapActions({
      getPayment: 'storePayment/getData',
      setPagination: 'storePayment/setPagination',
      resetFormData: 'storePayment/resetFormData',
      resetFilter: 'storePayment/resetFilter',
      setFormData: 'storePayment/setFormData',
      createData: 'storePayment/createData',
      updateData: 'storePayment/updateData',
      deleteData: 'storePayment/deleteData',
      uploadCover: 'storePayment/uploadCover',
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

    // LIST DATA
    getData() {
      const token = this.$cookies.get('tokenBearer')
      this.getPayment({ token })
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
                message: 'Gagal menyimpan pembayaran',
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
                message: 'Gagal mengubah pembayaran',
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
          this.titleAlert = 'Gagal menghapus pembayaran'
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
  },
}
</script>
