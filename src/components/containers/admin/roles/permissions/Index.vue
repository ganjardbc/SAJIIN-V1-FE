<template>
  <div id="App" class="w-full lg:w-lg-false m-auto">
    <div class="w-full flex flex-col gap-4">
      <div class="w-full flex items-center justify-between">
        <h1 class="text-3xl text-black font-semibold">
          Permission
        </h1>
        <el-button
          v-if="roleTypeForm !== 'detail'"
          type="primary"
          @click="onCreate"
        >
          <i class="fa fa-lw fa-plus" />
        </el-button>
      </div>

      <div class="w-full">
        <SearchField
          class="w-full"
          placeholder="Cari permission .."
          :enableResponsive="true"
          :onChange="(data) => onSearch(data)"
        />
      </div>

      <div class="w-full flex flex-col gap-4">
        <div v-loading="loading" class="w-full">
          <Card
            :data.sync="data"
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
      @onSelect="onSelect"
      @onSave="onSelect"
      @onClose="onClose"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmed"
      :title="titleConfirmed"
      @onClickNo="onClickNo"
      @onClickYes="onClickYes"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmedDelete"
      :title="'Delete this permission ?'"
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
import SearchField from '../../../../modules/SearchField'
import Form from './Form'
import Card from './Card'

export default {
  name: 'App',
  data() {
    return {
      openForm: false,
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
    SearchField,
    Form,
    Card,
  },
  computed: {
    ...mapState({
      filter: (state) => state.storeRolePermissions.filter,
      form: (state) => state.storeRolePermissions.form,
      data: (state) => state.storeRolePermissions.data,
      totalRecord: (state) => state.storeRolePermissions.totalRecord,
      limit: (state) => state.storeRolePermissions.limit,
      loading: (state) => state.storeRolePermissions.loading,
      loadingForm: (state) => state.storeRolePermissions.loadingForm,
      typeForm: (state) => state.storeRolePermissions.typeForm,
      roleForm: (state) => state.storeRoles.form,
      roleTypeForm: (state) => state.storeRoles.typeForm,
    }),
    typeForm: {
      get() {
        return this.$store.state.storeRolePermissions.typeForm
      },
      set(value) {
        this.$store.state.storeRolePermissions.typeForm = value
      },
    },
  },
  methods: {
    ...mapActions({
      getRoles: 'storeRolePermissions/getData',
      setPagination: 'storeRolePermissions/setPagination',
      resetFormData: 'storeRolePermissions/resetFormData',
      resetFilter: 'storeRolePermissions/resetFilter',
      setFormData: 'storeRolePermissions/setFormData',
      createData: 'storeRolePermissions/createData',
      deleteData: 'storeRolePermissions/deleteData',
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
      const role_id = this.roleForm.id
      this.getRoles({ token: token, role_id: role_id })
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

    // CREATE
    onCreate() {
      this.openForm = true
      this.typeForm = 'create'
      this.resetFormData()
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
          this.titleAlert = 'Failed to delete this permission'
        }
      })
    },

    // SELECT
    onSelect(data) {
      const token = this.$cookies.get('tokenBearer')
      const payload = {
        token: token,
        role_id: this.roleForm.id,
        permission_id: data.id,
      }
      this.createData(payload).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.openForm = false
          this.getData()
        } else {
          this.$message({
            message: 'Failed to add this permission',
            type: 'error',
          })
        }
      })
    },
  },
}
</script>
