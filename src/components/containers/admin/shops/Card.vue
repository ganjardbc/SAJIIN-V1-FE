<template>
  <div id="App">
    <el-table :data="data" border empty-text="No Data" style="width: 100%">
      <el-table-column type="index" width="60" :index="indexMethod">
      </el-table-column>
      <el-table-column width="100">
        <template slot-scope="scope">
          <div class="image image-padding border border-full">
            <img
              v-if="scope.row.shop.image"
              :src="shopImageThumbnailUrl + scope.row.shop.image"
              alt=""
              class="post-center"
            />
            <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
            <button
              class="btn btn-sekunder btn-small-icon btn-circle"
              style="position: absolute; bottom: 5px; right: 5px"
              @click="onChangeCover(scope.row.shop)"
            >
              <i
                class="post-middle-absolute fonts fonts-11 grey fa fa-lg fa-camera"
              />
            </button>
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
          <div class="display-flex flex-start">
            <AppCardCapsule :data="scope.row.shop.status" />
          </div>
        </template>
      </el-table-column>
      <el-table-column width="60">
        <template slot-scope="scope">
          <el-popover placement="bottom-end" width="180" trigger="click">
            <div class="width width-100">
              <button
                class="btn btn-white btn-full btn-align-left"
                @click="onDetail(scope.row.shop)"
              >
                <i class="icn icn-left fa fa-lw fa-align-left"></i> Detail
              </button>
              <button
                class="btn btn-white btn-full btn-align-left"
                @click="onEdit(scope.row.shop)"
              >
                <i class="icn icn-left fa fa-lw fa-edit"></i> Edit
              </button>
              <button
                class="btn btn-white btn-full btn-align-left"
                @click="onDelete(scope.row.shop)"
              >
                <i class="icn icn-left fa fa-lw fa-trash-alt"></i> Hapus
              </button>
            </div>
            <button slot="reference" class="btn btn-icon btn-sekunder">
              <i class="fa fa-lw fa-ellipsis-h"></i>
            </button>
          </el-popover>
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
