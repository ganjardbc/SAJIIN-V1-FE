<template>
  <AppCardPopup title="Pilih Produk" @onClose="onClose">
    <div class="w-full flex flex-col gap-4">
      <SearchField
        :placeholder="'Cari produk ..'"
        :enableResponsive="true"
        :onChange="(data) => onSearch(data)"
      />

      <AppButtonCapsuleSlider
        :index.sync="selectedIndex"
        customAllLabel="Semua Kategori"
        customIcon="fa fa-lw fa-box"
        :data="filteredCateogry"
        @onChange="onCategory"
      />

      <div v-loading="loading" class="w-full flex flex-col gap-4">
        <AppEmpty v-if="data.length === 0" />
        <Card
          v-for="(dt, i) in data"
          :key="i"
          :data="dt"
          @addToCart="onClose"
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
  </AppCardPopup>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import SearchField from '../../../../../../modules/SearchField'
import AppEmpty from '../../../../../../modules/AppEmpty'
import AppCardPopup from '../../../../../../modules/AppCardPopup'
import AppButtonCapsuleSlider from '../../../../../../modules/AppButtonCapsuleSlider'
import Card from './Card'

export default {
  data() {
    return {
      currentPage: 1,
      selectedIndex: 'all',
    }
  },
  mounted() {
    this.resetFilterProduct()
    this.getCategory()
    this.getProduct()
  },
  components: {
    SearchField,
    AppEmpty,
    AppCardPopup,
    AppButtonCapsuleSlider,
    Card,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeOrders.product.data,
      loading: (state) => state.storeOrders.product.loading,
      filter: (state) => state.storeOrders.product.filter,
      limit: (state) => state.storeOrders.product.limit,
      offset: (state) => state.storeOrders.product.offset,
      totalRecord: (state) => state.storeOrders.product.totalRecord,
      dataCategory: (state) => state.storeOrders.category.data,
    }),
    shopId() {
      return this.$store.state.storeSelectedShop.selectedData
    },
    filteredCateogry() {
      const allData = this.dataCategory.map((item) => {
        return {
          id: item.id,
          label: item.name,
          image: item.image ? this.categoryImageThumbnailUrl + item.image : '',
          status: item.status,
          icon: 'fa fa-lw fa-box',
        }
      })
      const activeData = allData.filter((item) => item.status === 'active')
      const inactiveData = allData.filter((item) => item.status === 'inactive')

      return [...activeData, ...inactiveData]
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.resetFilterProduct()
        this.getCategory()
        this.getProduct()
      }
    },
  },
  methods: {
    ...mapActions({
      getDataProduct: 'storeOrders/getDataProduct',
      resetFilterProduct: 'storeOrders/resetFilterProduct',
      setPaginationProduct: 'storeOrders/setPaginationProduct',
      getDataCategory: 'storeOrders/getDataCategory',
    }),

    // PRODUCT
    getProduct() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.filter.category = this.selectedIndex === 'all' 
          ? null 
          : this.selectedIndex
        this.getDataProduct({ token, shop_id })
      }
    },
    onSearch(data) {
      this.filter.search = data
      this.resetFilterProduct()
      this.getProduct()
    },
    onRefresh() {
      this.getProduct()
    },
    onClose() {
      this.$emit('onClose')
    },
    handleCurrentChange(data) {
      this.setPaginationProduct(data)
      this.getProduct()
    },

    // CATEGORY
    getCategory() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getDataCategory({ token, shop_id })
      }
    },
    onCategory(data) {
      this.selectedIndex = data
      this.resetFilterProduct()
      this.getProduct()
    },
  },
}
</script>
