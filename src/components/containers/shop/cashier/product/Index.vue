<template>
  <div id="App">
    <div class="display-flex row-reverse align-center display-mobile">
      <SearchField
        class="width width-30 width-mobile"
        :placeholder="'Cari produk ..'"
        :enableResponsive="true"
        :onChange="(data) => onSearch(data)"
      />
      <AppButtonCapsuleSlider
        class="width width-70 width-mobile"
        :index.sync="selectedIndex"
        customAllLabel="Semua Produk"
        customIcon="fa fa-lw fa-box"
        :data="filteredCateogry"
        @onChange="onCategory"
      />
    </div>
    <div class="width width-100 padding padding-top-10px">
      <div v-loading="loadingProduct">
        <AppEmpty v-if="dataProduct.length === 0" />
        <CardProduct :data.sync="dataProduct" :column="column" />
      </div>
      <div
        class="width width-100 display-flex flex-end align-center padding padding-top-15px"
      >
        <div class="fonts fonts-10 normal black">Total {{ totalRecord }}</div>
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
import { mapActions, mapState } from 'vuex'
import SearchField from '../../../../modules/SearchField'
import AppEmpty from '../../../../modules/AppEmpty'
import AppButtonCapsuleSlider from '../../../../modules/AppButtonCapsuleSlider'
import CardProduct from './CardProduct'

export default {
  name: 'App',
  data() {
    return {
      currentPage: 1,
    }
  },
  mounted() {
    this.resetFilterCategory()
    this.getDataCategory()
    this.getDataProduct()
  },
  components: {
    AppEmpty,
    AppButtonCapsuleSlider,
    SearchField,
    CardProduct,
  },
  props: {
    column: {
      default: 'width width-100',
      required: false,
    },
  },
  computed: {
    ...mapState({
      dataProduct: (state) => state.storeCashierProduct.data,
      totalRecord: (state) => state.storeCashierProduct.totalRecord,
      limit: (state) => state.storeCashierProduct.limit,
      filter: (state) => state.storeCashierProduct.filter,
      loadingProduct: (state) => state.storeCashierProduct.loading,
      dataCategory: (state) => state.storeCashierCategory.data,
      loadingCategory: (state) => state.storeCashierCategory.loading,
    }),
    selectedIndex: {
      get() {
        return this.$store.state.storeCashierCategory.selectedIndex
      },
      set(value) {
        this.$store.state.storeCashierCategory.selectedIndex = value
      },
    },
    shopId() {
      return this.$store.state.storeSelectedShop.selectedData
    },
    filteredCateogry() {
      return this.dataCategory.map((item) => {
        return {
          id: item.id,
          label: item.name,
          image: item.image ? this.categoryImageThumbnailUrl + item.image : '',
          icon: 'fa fa-lw fa-box',
        }
      })
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.resetFilterCategory()
        this.getDataCategory()
        this.getDataProduct()
      }
    },
  },
  methods: {
    ...mapActions({
      getProduct: 'storeCashierProduct/getData',
      resetProductFilter: 'storeCashierProduct/resetFilter',
      setProductPagination: 'storeCashierProduct/setPagination',
      getCategory: 'storeCashierCategory/getData',
    }),
    onRefresh() {
      this.getDataProduct()
    },
    onSearch(data) {
      this.filter.search = data
      this.resetProductFilter()
      this.getDataProduct()
    },
    onCategory(data) {
      if (data === 'all') {
        this.filter.category = ''
      } else {
        this.filter.category = data
      }
      if (data !== this.selectedIndex) {
        this.selectedIndex = data
      }
      this.resetProductFilter()
      this.getDataProduct()
    },
    handleCurrentChange(value) {
      this.setProductPagination(value)
      this.getDataProduct()
    },
    resetFilterCategory() {
      if (this.selectedIndex === 'all') {
        this.filter.category = ''
      } else {
        this.filter.category = this.selectedIndex
      }
    },

    // LIST DATA
    getDataProduct() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getProduct({ token, shop_id })
      }
    },
    getDataCategory() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getCategory({ token, shop_id })
      }
    },
  },
}
</script>
