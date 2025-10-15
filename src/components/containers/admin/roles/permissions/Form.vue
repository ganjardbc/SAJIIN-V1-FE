<template>
  <AppSideForm
    :title="title"
    :value="openForm"
    :enableSaveButton="false"
    @save="onSave"
    @close="onClose"
  >
    <div class="w-full flex flex-col gap-4">
      <CardForm
        :data.sync="data"
        @onSelect="onSelect"
      />
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
  </AppSideForm>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppSideForm from '../../../../modules/AppSideForm'
import CardForm from './CardForm'

export default {
  name: 'App',
  data() {
    return {
      currentPage: 0,
    }
  },
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  mounted() {
    this.getData()
  },
  computed: {
    ...mapState({
      offset: (state) => state.storeRolePermissions.permission.offset,
      limit: (state) => state.storeRolePermissions.permission.limit,
      totalRecord: (state) => state.storeRolePermissions.permission.totalRecord,
      form: (state) => state.storeRolePermissions.permission.form,
      errorMessage: (state) =>
        state.storeRolePermissions.permission.errorMessage,
      typeForm: (state) => state.storeRolePermissions.permission.typeForm,
      data: (state) => state.storeRolePermissions.permission.data,
    }),
    title() {
      let currentTitle = 'Pilih Permission'
      return currentTitle
    },
    isDetailForm() {
      let status = false
      if (this.typeForm === 'detail') {
        status = true
      }
      return status
    },
  },
  components: {
    AppSideForm,
    CardForm,
  },
  methods: {
    ...mapActions({
      getDataPermission: 'storeRolePermissions/getDataPermission',
      setPaginationPermission: 'storeRolePermissions/setPaginationPermission',
    }),
    getData() {
      const token = this.$cookies.get('tokenBearer')
      this.getDataPermission({ token })
    },
    handleCurrentChange(value) {
      this.setPaginationPermission(value)
      this.getData()
    },
    onSelect(data) {
      this.$emit('onSelect', data)
    },
    onSave() {
      this.$emit('onSave')
    },
    onClose() {
      this.$emit('onClose')
    },
  },
}
</script>
