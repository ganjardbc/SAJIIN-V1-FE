<template>
  <div id="App" class="w-full">
    <div class="w-full flex flex-col gap-4 p-4">
      <div class="w-full flex items-center justify-between">
        <h1 class="text-3xl text-black font-semibold">
          Produk
        </h1>
        <el-button
          v-if="isRoleOwner"
          type="primary"
          @click="onCreate"
        >
          <i class="fa fa-lw fa-plus mr-2" /> Tambah Produk
        </el-button>
      </div>

      <div class="w-full flex flex-col md:flex-row gap-2 items-center justify-between">
        <SearchField
          class="flex-1 w-full"
          placeholder="Cari produk .."
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

      <el-alert
        v-if="!isRoleOwner"
        title="Tambah produk baru ?"
        description="Untuk menambah produk baru mohon hubungi Owner dari Toko ini."
        type="warning"
        :closable="true"
        show-icon
      />

      <div class="w-full">
        <Category @onChange="onChangeCategory" />
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
            @onChangeProductStatus="onChangeProductStatus"
            @onChangeVarianStatus="onChangeVarianStatus"
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
      :title="'Hapus produk ?'"
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
import AppEmpty from '../../../../modules/AppEmpty'
import AppPopupLoader from '../../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../../modules/AppPopupAlert'
import AppFileUpload from '../../../../modules/AppFileUpload'
import AppHeaderMobile from '../../../../modules/AppHeaderMobile'
import SearchField from '../../../../modules/SearchField'
import Category from '../categories/Slider'
import Form from './Form'
import Card from './Card'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Products',
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
    AppHeaderMobile,
    SearchField,
    Category,
    Form,
    Card,
  },
  computed: {
    ...mapState({
      filter: (state) => state.storeProduct.filter,
      form: (state) => state.storeProduct.form,
      data: (state) => state.storeProduct.data,
      totalRecord: (state) => state.storeProduct.totalRecord,
      limit: (state) => state.storeProduct.limit,
      loading: (state) => state.storeProduct.loading,
      loadingForm: (state) => state.storeProduct.loadingForm,
      typeForm: (state) => state.storeProduct.typeForm,
      formVarian: (state) => state.storeProductDetail.form,
    }),
    typeForm: {
      get() {
        return this.$store.state.storeProduct.typeForm
      },
      set(value) {
        this.$store.state.storeProduct.typeForm = value
      },
    },
    shopId() {
      return this.$store.state.storeShop.form.id
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
      getproduct: 'storeProduct/getData',
      setPagination: 'storeProduct/setPagination',
      resetFormData: 'storeProduct/resetFormData',
      resetFilter: 'storeProduct/resetFilter',
      setFormData: 'storeProduct/setFormData',
      createData: 'storeProduct/createData',
      updateData: 'storeProduct/updateData',
      deleteData: 'storeProduct/deleteData',
      uploadCover: 'storeProduct/uploadCover',
      setLoadingForm: 'storeProduct/setLoadingForm',
      updateDataVarian: 'storeProductDetail/updateData',
      setFormDataVarian: 'storeProductDetail/setFormData',
    }),
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getData()
    },
    onChangeCategory(data) {
      if (data === 'all') {
        this.filter.category = ''
      } else {
        this.filter.category = data
      }
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
      const shop_id = this.shopId
      if (shop_id) {
        this.getproduct({ token, shop_id })
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
                message: 'Gagal menyimpan produk',
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
                message: 'Gagal merubah produk',
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
      this.resetFormData()
      this.form.shop_id = this.shopId
      this.typeForm = 'create'
    },

    // DETAIL
    onDetail(data) {
      this.openForm = true
      this.resetFormData()
      this.setFormData(data)
      this.typeForm = 'detail'
    },

    // EDIT
    onEdit(data) {
      this.openForm = true
      this.resetFormData()
      this.setFormData(data)
      this.typeForm = 'edit'
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
          this.titleAlert = 'Gagal menghapus produk'
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
    onChangeProductStatus(data) {
      this.setFormData(data)
      const token = this.$cookies.get('tokenBearer')
      this.updateData({
        ...this.form,
        token: token,
      }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.$message(`Berhasil merubah status produk ${data.name}.`)
        } else {
          this.$message({
            message: `Gagal merubah status produk ${data.name}.`,
            type: 'error',
          })
        }
      })
    },
    onChangeVarianStatus(data) {
      this.setLoadingForm(true)
      this.setFormDataVarian(data)
      const token = this.$cookies.get('tokenBearer')
      this.updateDataVarian({
        ...this.formVarian,
        token: token,
      })
        .then((res) => {
          const status = res.data.status
          if (status === 'ok') {
            this.$message(`Berhasil merubah status varian ${data.name}.`)
          } else {
            this.$message({
              message: `Gagal merubah status varian ${data.name}.`,
              type: 'error',
            })
          }
        })
        .finally(() => {
          this.setLoadingForm(false)
        })
    },
  },
}
</script>
