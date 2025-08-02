<template>
  <div
    id="SelectShop"
    class="w-full px-4"
    v-loading="loading"
  >
    <div
      class="mx-auto rounded-lg shadow-md bg-white"
      style="max-width: 500px;"
    >
      <div class="p-4 border-b border-gray-200">
        <div class="text-lg md:text-2xl text-black font-semibold">
          Masuk ke Toko
        </div>
        <div class="text-xs text-gray-600">
          Pilih toko yang ingin Kamu masuki untuk mengelola pesanan dan produk.
        </div>
      </div>

      <div class="w-full overflow-y-auto" style="max-height: 360px;">
        <div class="p-4 border-b border-gray-200">
          <el-alert
            title="Tambah Toko baru ?"
            description="Untuk menambah toko baru mohon hubungi Admin Sajiin dan ikuti arahan selanjutnya."
            type="success"
            :closable="false"
            show-icon
          />
        </div>

        <div
          v-for="(item, index) in data"
          :key="index"
          class="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-4 justify-between"
        >
          <div class="flex items-center gap-4">
            <el-avatar
              size="large"
              :src="`${shopImageThumbnailUrl}${item.shop.image}`"
              class="shadow-lg"
              shape="square"
            />
            <div class="flex-1 flex flex-col">
              <div class="text-md font-semibold">{{ item.shop.name }}</div>
              <div class="text-sm text-gray-600">{{ item.shop.location }}</div>
            </div>
          </div>

          <el-button
            size="medium"
            :disabled="item.shop.status !== 'active'"
            @click="$router.replace({ name: 'shop-home', params: { shopId: item.shop.shop_id } })"
          >
            Masuk
          </el-button>
        </div>
      </div>

      <div class="p-4 w-full flex justify-between items-center gap-2">
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
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'SelectShop',

  data() {
    return {
      currentPage: 1,
    }
  },

  computed: {
    ...mapState({
      filter: (state) => state.storeShop.filter,
      data: (state) => state.storeShop.data,
      totalRecord: (state) => state.storeShop.totalRecord,
      limit: (state) => state.storeShop.limit,
      loading: (state) => state.storeShop.loading
    }),
  },

  mounted() {
    this.getData()
  },

  methods: {
    ...mapActions({
      getShop: 'storeShop/getData',
      setPagination: 'storeShop/setPagination',
    }),

    // LIST DATA
    getData() {
      const token = this.$cookies.get('tokenBearer')
      this.filter.status = 'active'
      this.getShop({ token })
    },
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getData()
    },
    handleFilterSearch() {
      this.currentPage = 1
      this.handleCurrentChange(1)
    },
  },
}
</script>
