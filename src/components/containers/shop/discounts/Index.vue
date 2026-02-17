<template>
  <div id="App" class="w-full lg:w-lg-false m-auto">
    <div class="w-full flex flex-col gap-4 p-4">
      <div class="w-full flex items-center justify-between">
        <h1 class="text-3xl text-black font-semibold">
          Diskon
        </h1>
        <el-button
          v-if="isRoleOwner"
          type="primary"
          @click="onCreate"
        >
          <i class="fa fa-lw fa-plus mr-2" /> Tambah Diskon
        </el-button>
      </div>

      <div class="w-full flex flex-col md:flex-row gap-2 items-center justify-between">
        <SearchField
          class="flex-1 w-full"
          placeholder="Cari diskon .."
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
        title="Tambah Diskon Baru ?"
        description="Untuk menambah diskon baru mohon hubungi Owner dari Toko ini."
        type="warning"
        :closable="true"
        show-icon
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
      :title="'Hapus data platform ?'"
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
import AppHeaderMobile from '../../../modules/AppHeaderMobile'
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
    title: 'Shop',
    titleTemplate: '%s | Tables',
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
    AppHeaderMobile,
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
      filter: (state) => state.storeDiscount.filter,
      form: (state) => state.storeDiscount.form,
      data: (state) => state.storeDiscount.data,
      totalRecord: (state) => state.storeDiscount.totalRecord,
      limit: (state) => state.storeDiscount.limit,
      loading: (state) => state.storeDiscount.loading,
      loadingForm: (state) => state.storeDiscount.loadingForm,
      typeForm: (state) => state.storeDiscount.typeForm,
    }),
    typeForm: {
      get() {
        return this.$store.state.storeDiscount.typeForm
      },
      set(value) {
        this.$store.state.storeDiscount.typeForm = value
      },
    },
    shopId() {
      return this.$store.state.storeShop.form.id
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
      getPlatform: 'storeDiscount/getData',
      setPagination: 'storeDiscount/setPagination',
      resetFormData: 'storeDiscount/resetFormData',
      resetFilter: 'storeDiscount/resetFilter',
      setFormData: 'storeDiscount/setFormData',
      createData: 'storeDiscount/createData',
      updateData: 'storeDiscount/updateData',
      deleteData: 'storeDiscount/deleteData',
      uploadCover: 'storeDiscount/uploadCover',
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
      const shop_id = this.shopId
      if (shop_id) {
        this.getPlatform({ token, shop_id })
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
                message: 'Gagal menyimpan data platform',
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
                message: 'Gagal merubah data platform',
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
          this.titleConfirmed = 'Simpan data?'
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
          this.titleAlert = 'Gagal menghapus platform'
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
          this.$message(`Berhasil merubah status platform ${data.name}.`)
        } else {
          this.$message(`Gagal merubah status platform ${data.name}.`)
        }
      })
    },
  },
}
</script>
