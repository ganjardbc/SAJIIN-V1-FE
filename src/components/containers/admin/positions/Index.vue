<template>
  <div id="App" :class="formClass ? 'content-form' : 'content-form hide'">
    <div class="left">
      <div
        class="display-flex space-between display-mobile margin margin-bottom-15px"
      >
        <div class="width width-75 width-mobile display-flex space-between">
          <h1 class="fonts big black bold">Positions</h1>
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
            :placeholder="'Cari positions ..'"
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
        :title="'Delete this position ?'"
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
    titleTemplate: '%s | Positions',
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
      filter: (state) => state.storePositionAdmin.filter,
      form: (state) => state.storePositionAdmin.form,
      data: (state) => state.storePositionAdmin.data,
      totalRecord: (state) => state.storePositionAdmin.totalRecord,
      limit: (state) => state.storePositionAdmin.limit,
      loading: (state) => state.storePositionAdmin.loading,
      loadingForm: (state) => state.storePositionAdmin.loadingForm,
      typeForm: (state) => state.storePositionAdmin.typeForm,
    }),
    typeForm: {
      get() {
        return this.$store.state.storePositionAdmin.typeForm
      },
      set(value) {
        this.$store.state.storePositionAdmin.typeForm = value
      },
    },
  },
  methods: {
    ...mapActions({
      getPosition: 'storePositionAdmin/getData',
      setPagination: 'storePositionAdmin/setPagination',
      resetFormData: 'storePositionAdmin/resetFormData',
      resetFilter: 'storePositionAdmin/resetFilter',
      setFormData: 'storePositionAdmin/setFormData',
      createData: 'storePositionAdmin/createData',
      updateData: 'storePositionAdmin/updateData',
      deleteData: 'storePositionAdmin/deleteData',
      uploadCover: 'storePositionAdmin/uploadCover',
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
      this.getPosition({ token })
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
                message: 'Failed to save this position',
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
                message: 'Failed to edit this position',
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
          this.titleConfirmed = 'Save this position ?'
          break
        case 'edit':
          this.titleConfirmed = 'Edit this position ?'
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
          this.titleAlert = 'Failed to delete this position'
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
