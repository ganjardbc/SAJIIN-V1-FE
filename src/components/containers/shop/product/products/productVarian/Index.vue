<template>
  <div id="App" class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <h1 class="flex-1 text-3xl text-black font-semibold">Varian</h1>
      <el-button
        v-if="isRoleOwner && isCanEdit"
        circle
        style="width: 40px; height: 40px;"
        @click="onCreate"
      >
        <i class="fa fa-lw fa-plus" />
      </el-button>
    </div>

    <el-alert
      v-if="!isRoleOwner"
      title="Tambah Varian Baru ?"
      description="Untuk menambahkan varian baru mohon hubungi Owner dari Toko ini."
      type="warning"
      :closable="true"
      show-icon
    >
    </el-alert>

    <div class="w-full flex flex-col gap-4">
      <AppEmpty v-if="productDetails.length === 0" />
      <Card
        v-if="productDetails.length > 0"
        :data.sync="productDetails"
        @onChangeCover="uploadImage"
        @onDetail="onDetail"
        @onEdit="onEdit"
        @onDelete="onDelete"
      />
    </div>

    <Form
      :open-form="openForm"
      @uploadImage="uploadImage"
      @removeImage="removeImage"
      @save="onOpenVisibleConfirmed"
      @close="onClose"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmed"
      :title="titleConfirmed"
      @onClickNo="onClickNo"
      @onClickYes="onClickYes"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmedDelete"
      :title="'Hapus varian ?'"
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
import AppEmpty from '../../../../../modules/AppEmpty'
import AppPopupLoader from '../../../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../../../modules/AppPopupAlert'
import Card from './Card'
import Form from './Form'

export default {
  name: 'App',
  data() {
    return {
      openForm: false,
      visibleConfirmed: false,
      visibleAlert: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
      visibleConfirmed: false,
      visibleConfirmedDelete: false,
      titleConfirmed: 'Simpan data ?',
    }
  },
  components: {
    AppEmpty,
    AppPopupLoader,
    AppPopupConfirmed,
    AppPopupAlert,
    Card,
    Form,
  },
  computed: {
    ...mapState({
      formProduct: (state) => state.storeProduct.form,
      formDetail: (state) => state.storeProduct.formDetail,
      typeForm: (state) => state.storeProduct.typeForm,
      typeFormDetail: (state) => state.storeProduct.typeFormDetail,
      loadingForm: (state) => state.storeProduct.loadingForm,
    }),
    productDetails() {
      return this.formProduct.details
    },
    typeFormDetail: {
      get() {
        return this.$store.state.storeProduct.typeFormDetail
      },
      set(value) {
        this.$store.state.storeProduct.typeFormDetail = value
      },
    },
    isCanEdit() {
      let status = false
      if (this.typeFormDetail === 'edit') {
        status = true
      }
      return status
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
  methods: {
    ...mapActions({
      resetFormDetail: 'storeProduct/resetFormDetail',
      setFormDetail: 'storeProduct/setFormDetail',
      createFormDetail: 'storeProduct/createFormDetail',
      editFormDetail: 'storeProduct/editFormDetail',
      deleteFormDetail: 'storeProduct/deleteFormDetail',
    }),
    uploadImage() {
      console.log('uploadImage')
    },
    removeImage() {
      console.log('removeImage')
    },
    onDelete() {
      console.log('onDelete')
    },

    // CLOSE
    onClose() {
      this.openForm = false
    },

    // CONFIRMED
    onClickNo() {
      this.visibleConfirmed = false
    },
    onClickYes() {
      this.openForm = false
      this.visibleConfirmed = false
      switch (this.typeFormDetail) {
        case 'create':
          this.createFormDetail({
            ...this.formDetail,
            product_id: this.formProduct.id,
          })
          break
        case 'edit':
          this.editFormDetail(this.formDetail)
          break
      }
    },

    // SAVE
    onOpenVisibleConfirmed() {
      this.visibleConfirmed = true
      switch (this.typeFormDetail) {
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
      this.typeFormDetail = 'create'
      this.resetFormDetail()
    },

    // DETAIL
    onDetail(data) {
      this.openForm = true
      this.typeFormDetail = 'detail'
      this.resetFormDetail()
      this.setFormDetail(data)
    },

    // EDIT
    onEdit(data) {
      this.openForm = true
      this.typeFormDetail = 'edit'
      this.resetFormDetail()
      this.setFormDetail(data)
    },

    // DELETE
    onDelete(data) {
      this.visibleConfirmedDelete = true
      this.setFormDetail(data)
    },
    onClickNoDelete() {
      this.visibleConfirmedDelete = false
    },
    onClickYesDelete() {
      this.visibleConfirmedDelete = false
      this.deleteFormDetail(this.formDetail)
    },
  },
}
</script>
