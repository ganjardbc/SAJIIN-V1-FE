<template>
  <div id="App">
    <el-table :data="data" border empty-text="No Data" style="width: 100%">
      <el-table-column type="index" width="60" :index="indexMethod" />
      <el-table-column prop="permission_name" label="Permission" />
      <el-table-column width="70">
        <template slot-scope="scope">
          <el-button
            @click="onDelete(scope.row)"
            style="min-width: 40px;"
            circle
            :disabled="roleTypeForm === 'detail'"
          >
            <i class="fa fa-lw fa-trash-alt"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  props: {
    data: null,
  },
  computed: {
    ...mapState({
      offset: (state) => state.storeRolePermissions.offset,
      roleTypeForm: (state) => state.storeRoles.typeForm,
    }),
  },
  methods: {
    indexMethod(index) {
      return index + 1 + this.offset
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', data)
    },
  },
}
</script>
