<template>
  <div id="App">
    <el-table :data="data" border empty-text="No Data" style="width: 100%">
      <el-table-column type="index" width="60" :index="indexMethod">
      </el-table-column>
      <el-table-column width="100">
        <template slot-scope="scope">
          <div class="relative p-2">
            <AppCardAvatar
              :src="paymentImageThumbnailUrl + scope.row.image"
              size="small"
              shape="square"
            />

            <el-button
              style="position: absolute; bottom: 5px; right: 5px; width: 32px; height: 32px; padding: 0px;"
              size="mini"
              circle
              @click="onChangeCover(scope.row)"
            >
              <i class="fa fa-lg fa-camera" />
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Nama" width="180"> </el-table-column>
      <el-table-column prop="description" label="Keterangan" min-width="200">
      </el-table-column>
      <el-table-column label="Status" width="120">
        <template slot-scope="scope">
          <AppCardCapsule :data="scope.row.status" />
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
import AppCardAvatar from '../../../modules/AppCardAvatar'

export default {
  name: 'App',
  components: {
    AppCardCapsule,
    AppCardAvatar,
  },
  props: {
    data: null,
  },
  computed: {
    ...mapState({
      offset: (state) => state.storePayment.offset,
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
