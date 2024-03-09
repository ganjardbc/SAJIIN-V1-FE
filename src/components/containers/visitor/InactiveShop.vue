<template>
  <div id="App">
    <AppMobileLayout title="Home" :enableLeftSlot="true">
      <div slot="left-button">
        <router-link :to="{ name: 'visitor-landing' }" class="logo">
          <img :src="logo" alt="SAJI-IN" style="height: 35px" />
        </router-link>
      </div>
      <div slot="right-button">
        <button class="btn btn-main-reverse with-hover btn-small-radius">
          Scan QR <i class="icn icn-right fa fa-lg fa-qrcode"></i>
        </button>
      </div>
      <div style="padding-top: 30px; padding-bottom: 30px">
        <div class="width width-400-px width-mobile width-center">
          <div v-if="!loading" class="display-flex column align-center">
            <div class="content-center margin margin-10px">
              <div class="width width-130px width-center">
                <div
                  class="image image-padding image-center image-circle border-full bg-white-grey"
                >
                  <img
                    v-if="selectedShop && selectedShop.image"
                    :src="
                      selectedShop && selectedShop.image
                        ? shopImageThumbnailUrl + selectedShop.image
                        : ''
                    "
                    alt=""
                  />
                  <i
                    v-else
                    class="post-middle-absolute fa fa-lg fa-store"
                    style="color: #999"
                  />
                </div>
              </div>
              <div
                class="fonts fonts-16 semibold align-center"
                style="margin-top: 30px"
              >
                {{ (selectedShop && selectedShop.name) || '-' }}
              </div>
              <div class="fonts align-center fonts-10 black">
                Pemilik dari Toko ini mengatur Digital Menu ke Non-Aktif.<br />
                Kamu tidak bisa melihat daftar produk atau membuat pesanan di
                Toko ini.
              </div>
            </div>
            <div class="margin margin-10px">
              <router-link :to="{ name: 'visitor-landing' }">
                <button class="btn btn-main">
                  <i class="icn icn-left fa fa-lw fa-home"></i> Kembali ke
                  Halaman Utama
                </button>
              </router-link>
            </div>
          </div>
          <div v-if="loading" class="display-flex column align-center">
            <AppLoader />
          </div>
        </div>
      </div>
    </AppMobileLayout>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import logo from '@/assets/img/logo.png'
import AppLoader from '../../modules/AppLoader'
import AppMobileLayout from '../../modules/AppMobileLayout'

export default {
  name: 'App',
  data() {
    return {
      logo: logo,
    }
  },
  components: {
    AppLoader,
    AppMobileLayout,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeVisitorShop.data,
      loading: (state) => state.storeVisitorShop.loading,
    }),
    selectedShop() {
      return this.data.shop
    },
    isDigitalMenuActive() {
      return this.selectedShop && this.selectedShop.is_digital_menu_active
    },
    isDigitalOrderActive() {
      return this.selectedShop && this.selectedShop.is_digital_order_active
    },
  },
}
</script>
