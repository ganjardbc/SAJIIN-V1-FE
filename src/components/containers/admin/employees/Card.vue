<template>
  <div id="App">
    <el-table :data="data" border empty-text="No Data" style="width: 100%">
      <el-table-column type="index" width="60" :index="indexMethod">
      </el-table-column>
      <el-table-column width="100">
        <template slot-scope="scope">
          <div class="relative p-2">
            <AppCardAvatar
              :src="shopImageThumbnailUrl + scope.row.image"
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
      <el-table-column prop="employee.name" label="Nama" width="180">
      </el-table-column>
      <el-table-column label="Role & Posisi" min-width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.role" style="text-transform: capitalize">{{
            scope.row.role.role_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Shift" min-width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.shift">{{ scope.row.shift.title }}</div>
          <div v-if="scope.row.shift">
            {{ scope.row.shift.start_time }} - {{ scope.row.shift.end_time }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="shop.name" label="Toko" min-width="200">
      </el-table-column>
      <el-table-column label="Status" width="120">
        <template slot-scope="scope">
          <div class="display-flex flex-start">
            <AppCardCapsule :data="scope.row.employee.status" />
          </div>
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
      offset: (state) => state.storeCategory.offset,
    }),
  },
  methods: {
    indexMethod(index) {
      return index + 1 + this.offset
    },

    // COVER
    onChangeCover(data) {
      this.$emit('onChangeCover', {
        ...data.employee,
        user: data.user,
      })
    },

    // DETAIL
    onDetail(data) {
      this.$emit('onDetail', {
        ...data.employee,
        user: data.user,
      })
    },

    // EDIT
    onEdit(data) {
      this.$emit('onEdit', {
        ...data.employee,
        user: data.user,
      })
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', {
        ...data.employee,
        user: data.user,
      })
    },
  },
}
</script>
