<template>
  <div id="App" class="w-full flex flex-col gap-4">
    <AppButtonCapsuleSlider
      v-loading="loading"
      :index.sync="selectedIndex"
      customAllLabel="Semua Shift"
      customIcon="fa fa-lw fa-clock"
      :enableCreateButton="isRoleOwner"
      :enableEditButton="isRoleOwner"
      :data="filteredShift"
      @onChange="onChange"
      @onCreate="onCreate"
      @onEdit="onEdit"
    />

    <Form
      v-if="formClass"
      @uploadImage="uploadImage"
      @removeImage="removeImage"
      @onSave="onOpenVisibleConfirmed"
      @onClose="onClose"
      @onDelete="onDelete"
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
      :title="'Delete this shift ?'"
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
import AppButtonCapsuleSlider from '../../../../modules/AppButtonCapsuleSlider'
import AppEmpty from '../../../../modules/AppEmpty'
import AppPopupLoader from '../../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../../modules/AppPopupAlert'
import AppFileUpload from '../../../../modules/AppFileUpload'
import AppTabs from '../../../../modules/AppTabs'
import SearchField from '../../../../modules/SearchField'
import Form from './FormPopup'
import Card from './Card'

const tabs = [
  { id: 1, label: 'Aktif', status: 'active' },
  { id: 2, label: 'Non-Aktif', status: '' },
]

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Shifts',
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
    }
  },
  mounted() {
    this.handleFilterSearch()
  },
  components: {
    AppButtonCapsuleSlider,
    AppEmpty,
    AppPopupLoader,
    AppPopupConfirmed,
    AppPopupAlert,
    AppFileUpload,
    AppTabs,
    SearchField,
    Form,
    Card,
  },
  computed: {
    ...mapState({
      filter: (state) => state.storeShift.filter,
      form: (state) => state.storeShift.form,
      data: (state) => state.storeShift.data,
      totalRecord: (state) => state.storeShift.totalRecord,
      limit: (state) => state.storeShift.limit,
      loading: (state) => state.storeShift.loading,
      loadingForm: (state) => state.storeShift.loadingForm,
      typeForm: (state) => state.storeShift.typeForm,
      filterEmployee: (state) => state.storeEmployee.filter,
    }),
    typeForm: {
      get() {
        return this.$store.state.storeShift.typeForm
      },
      set(value) {
        this.$store.state.storeShift.typeForm = value
      },
    },
    selectedIndex: {
      get() {
        return this.$store.state.storeShift.selectedIndex
      },
      set(value) {
        this.$store.state.storeShift.selectedIndex = value
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
    filteredShift() {
      const allData = this.data.map((item) => {
        return {
          id: item.shift.id,
          label: item.shift.title,
          status: item.shift.status,
          icon: 'fa fa-lw fa-clock',
        }
      })
      const activeData = allData.filter((item) => item.status === 'active')
      const inactiveData = allData.filter((item) => item.status === 'inactive')
      let data = [...activeData, ...inactiveData]
      return data
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
      getShift: 'storeShift/getData',
      setPagination: 'storeShift/setPagination',
      resetFormData: 'storeShift/resetFormData',
      resetFilter: 'storeShift/resetFilter',
      setFormData: 'storeShift/setFormData',
      createData: 'storeShift/createData',
      updateData: 'storeShift/updateData',
      deleteData: 'storeShift/deleteData',
      uploadCover: 'storeShift/uploadCover',
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
    onChange(data) {
      if (data === 'all') {
        this.filterEmployee.shift_id = ''
      } else {
        this.filterEmployee.shift_id = data
      }
      if (data !== this.selectedIndex) {
        this.selectedIndex = data
      }
      this.$emit('onChange', data)
    },

    // LIST DATA
    getData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.filter.status = ''
        this.getShift({ token, shop_id: shop_id })
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
              this.formClass = false
              this.getData()
            } else {
              this.$message({
                message: 'Gagal meyimpan shift',
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
                message: 'Gagal merubah shift',
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
      const find = this.data.find((item) => item.shift.id === data.id)
      if (find !== undefined) {
        this.formClass = true
        this.typeForm = 'edit'
        this.resetFormData()
        this.setFormData(find.shift)
      }
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
          this.formClass = false
          this.getData()
        } else {
          this.visibleAlert = true
          this.titleAlert = 'Gagal menghapus shift'
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
          this.$message(`Berhasil merubah status shift ${data.name}.`)
        } else {
          this.$message({
            message: `Gagal merubah status shift ${data.name}.`,
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
