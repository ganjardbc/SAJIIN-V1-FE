<template>
  <div id="App">
    <el-table :data="data" border empty-text="No Data" style="width: 100%">
      <el-table-column type="index" width="60" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="shift.title" label="Judul" width="180">
      </el-table-column>
      <el-table-column label="Jam" width="180">
        <template slot-scope="scope">
          <span
            >{{ scope.row.shift.start_time }} -
            {{ scope.row.shift.end_time }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="Toko" min-width="200">
      </el-table-column>
      <el-table-column label="Status" width="120">
        <template slot-scope="scope">
          <AppCardCapsule :data="scope.row.shift.status" />
        </template>
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
      offset: (state) => state.storeCategory.offset,
    }),
  },
  methods: {
    indexMethod(index) {
      return index + 1 + this.offset
    },

    // COVER
    onChangeCover(data) {
      this.$emit('onChangeCover', data.shift)
    },

    // DETAIL
    onDetail(data) {
      this.$emit('onDetail', data.shift)
    },

    // EDIT
    onEdit(data) {
      this.$emit('onEdit', data.shift)
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', data.shift)
    },
  },
}
</script>
