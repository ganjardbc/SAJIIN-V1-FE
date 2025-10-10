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
      <el-table-column label="Toko" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.shop.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Owner" min-width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.owner.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120">
        <template slot-scope="scope">
          <AppCardCapsule :data="scope.row.shop.status" />
        </template>
      </el-table-column>
      <el-table-column width="180">
        <template slot-scope="scope">
          <el-button
            style="min-width: 40px;"
            circle
            @click="onDetail(scope.row.shop)"
          >
            <i class="fa fa-lw fa-align-left"></i>
          </el-button>
          <el-button
            style="min-width: 40px;"
            circle
            @click="onEdit(scope.row.shop)"
          >
            <i class="fa fa-lw fa-edit"></i>
          </el-button>
          <el-button
            style="min-width: 40px;"
            circle
            @click="onDelete(scope.row.shop)"
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
      offset: (state) => state.storeShopAdmin.offset,
    }),
  },
  methods: {
    indexMethod(index) {
      return index + 1 + this.offset
    },

    onManage(data) {
      this.$store.state.storeSelectedShop.selectedData = data.id
      this.$router.push({ name: 'shop-home', params: { shopId: data.shop_id } })
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
