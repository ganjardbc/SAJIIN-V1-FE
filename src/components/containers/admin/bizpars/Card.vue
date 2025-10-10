<template>
  <div id="App">
    <el-table :data="data" border empty-text="No Data" style="width: 100%">
      <el-table-column type="index" width="60" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="key" label="Key" width="180"> </el-table-column>
      <el-table-column prop="value" label="Value" min-width="180">
      </el-table-column>
      <el-table-column prop="type" label="Tipe" min-width="180">
      </el-table-column>
      <el-table-column width="180">
        <template slot-scope="scope">
          <el-button
            style="min-width: 40px;"
            circle
            @click="onDetail(scope.row)"
          >
            <i class="fa fa-lw fa-align-left"></i>
          </el-button>
          <el-button
            style="min-width: 40px;"
            circle
            @click="onEdit(scope.row)"
          >
            <i class="fa fa-lw fa-edit"></i>
          </el-button>
          <el-button
            style="min-width: 40px;"
            circle
            @click="onDelete(scope.row)"
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
import AppCardCapsule from '../../../modules/AppCardCapsule'

export default {
  name: 'App',
  components: {
    AppCardCapsule,
  },
  props: {
    data: null,
  },
  computed: {
    ...mapState({
      offset: (state) => state.storeBizpars.offset,
    }),
  },
  methods: {
    indexMethod(index) {
      return index + 1 + this.offset
    },

    // COVER
    onChangeCover(data) {
      this.$emit('onChangeCover', data)
    },

    // DETAIL
    onDetail(data) {
      this.$emit('onDetail', data)
    },

    // EDIT
    onEdit(data) {
      this.$emit('onEdit', data)
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', data)
    },
  },
}
</script>
