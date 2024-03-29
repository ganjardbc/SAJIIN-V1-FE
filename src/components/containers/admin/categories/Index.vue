<template>
  <div id="App" :class="formClass ? 'content-form' : 'content-form hide'">
    <div class="left">
      <div
        class="display-flex space-between display-mobile margin margin-bottom-15px"
      >
        <div class="width width-75 width-mobile display-flex space-between">
          <h1 class="fonts big black bold">Categories</h1>
          <div class="display-flex">
            <button class="btn btn-icon btn-white" @click="onRefresh">
              <i class="fa fa-lw fa-retweet"></i>
            </button>
            <button class="btn btn-icon btn-white" @click="onCreate">
              <i class="fa fa-lw fa-plus" />
            </button>
          </div>
        </div>
        <div class="width width-25 width-mobile">
          <SearchField
            :placeholder="'Cari categories ..'"
            :enableResponsive="true"
            :onChange="(data) => onSearch(data)"
          />
        </div>
      </div>

      <div v-loading="loading" class="margin margin-bottom-15px">
        <Card
          :data.sync="data"
          @onChangeCover="uploadImage"
          @onDetail="onDetail"
          @onEdit="onEdit"
          @onDelete="onDelete"
        />
        <div
          class="width width-100 display-flex flex-end align-center padding padding-top-15px"
        >
          <div class="fonts fonts-10 normal black">Total {{ totalRecord }}</div>
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

    <div class="right">
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
        :title="'Delete this category ?'"
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
    titleTemplate: '%s | Categories',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      formClass: false,
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
      filter: (state) => state.storeCategory.filter,
      form: (state) => state.storeCategory.form,
      data: (state) => state.storeCategory.data,
      totalRecord: (state) => state.storeCategory.totalRecord,
      limit: (state) => state.storeCategory.limit,
      loading: (state) => state.storeCategory.loading,
      loadingForm: (state) => state.storeCategory.loadingForm,
      typeForm: (state) => state.storeCategory.typeForm,
    }),
    typeForm: {
      get() {
        return this.$store.state.storeCategory.typeForm
      },
      set(value) {
        this.$store.state.storeCategory.typeForm = value
      },
    },
  },
  methods: {
    ...mapActions({
      getCategory: 'storeCategory/getData',
      setPagination: 'storeCategory/setPagination',
      resetFormData: 'storeCategory/resetFormData',
      resetFilter: 'storeCategory/resetFilter',
      setFormData: 'storeCategory/setFormData',
      createData: 'storeCategory/createData',
      updateData: 'storeCategory/updateData',
      deleteData: 'storeCategory/deleteData',
      uploadCover: 'storeCategory/uploadCover',
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

    // LIST DATA
    getData() {
      const token = this.$cookies.get('tokenBearer')
      this.getCategory({ token })
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
                message: 'Failed to save this category',
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
                message: 'Failed to edit this category',
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
          this.titleConfirmed = 'Save this category ?'
          break
        case 'edit':
          this.titleConfirmed = 'Edit this category ?'
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
          this.titleAlert = 'Failed to delete this category'
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
