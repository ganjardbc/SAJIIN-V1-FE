<template>
  <div class="default-layout w-full h-full">
    <div class="header">
      <div
        v-if="isHomePage"
        class="w-full lg:w-sm mx-auto flex items-center justify-center gap-4"
      >
        <router-link :to="{ name: 'visitor-home' }" class="logo">
          <img :src="logo" alt="SAJI-IN" style="height: 35px" />
        </router-link>
      </div>
      <div
        v-else
        class="w-full lg:w-sm mx-auto flex items-center justify-start gap-4"
      >
        <el-button
          size="large"
          circle
          class="border-none"
          @click="onClickBack"
        >
          <i class="fa fa-lg fa-arrow-left" />
        </el-button>
        <div class="text-md text-black font-semibold">
          {{ metaTitle }}
        </div>
      </div>
    </div>

    <div
      class="w-full overflow-y-auto"
      style="height: calc(100vh - 60px)"
    >
      <div class="w-full lg:w-sm mx-auto">
        <keep-alive>
          <router-view />
        </keep-alive>
        <router-view name="visitorLayoutReload" />
      </div>
    </div>

    <!-- <div v-else>
      <InactiveShop />
    </div> -->
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import logo from '@/assets/img/logo.png'
import AppLoader from '../../modules/AppLoader'
import InactiveShop from './InactiveShop'

export default {
  name: 'App',
  metaInfo: {
    title: 'SAJI-IN',
    titleTemplate: '%s | Serve All You Want',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      logo: logo,
    }
  },
  mounted() {
    this.getShopData()
  },
  components: {
    AppLoader,
    InactiveShop,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeVisitorShop.data,
      loading: (state) => state.storeVisitorShop.loading,
    }),
    selectedShop() {
      return this.data.shop
    },
    metaTitle() {
      return this.$route.meta.title || 'Kembali';
    },
    isHomePage() {
      return this.$route.name === 'visitor-home';
    },
    // isDigitalMenuActive () {
    //     return this.selectedShop && this.selectedShop.is_digital_menu_active
    // },
    // isDigitalOrderActive () {
    //     return this.selectedShop && this.selectedShop.is_digital_order_active
    // }
  },
  methods: {
    ...mapActions({
      getShop: 'storeVisitorShop/getShop',
      setOrder: 'storeVisitorOrder/setOrder',
    }),
    getShopData() {
      const shop_id = this.$route.params.shopId
      this.getShop({ shop_id }).then((res) => {
        const data = res.data.data
        const payload = {
          total_item: 0,
          total_price: 0,
          shop: data.shop,
        }
        this.setOrder(payload)
      })
    },
    onClickBack() {
      this.$router.back()
    },
  },
}
</script>
