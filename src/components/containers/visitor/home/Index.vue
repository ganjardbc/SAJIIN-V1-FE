<template>
  <div id="App">
    <AppMobileLayout title="Home" :enableLeftSlot="true">
      <div slot="left-button">
        <router-link :to="{ name: 'visitor-home' }" class="logo">
          <img :src="logo" alt="SAJI-IN" style="height: 35px" />
        </router-link>
      </div>
      <div slot="right-button">
        <button
          class="btn btn-main-reverse with-hover btn-small-radius"
          @click="onClickExit"
        >
          Keluar <i class="icn icn-right fa fa-lg fa-sign-out-alt"></i>
        </button>
      </div>

      <div v-loading="loading" class="width width-100">
        <!-- <div class="padding padding-15px">
                    <button class="btn btn-main btn-full" @click="onSendNotification">Send Notif</button>
                </div> -->

        <div class="padding padding-15px" style="padding-bottom: 0">
          <div class="width width-80px width-center" style="position: relative">
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
        </div>

        <div class="padding padding-15px" style="padding-bottom: 0">
          <h1 class="fonts fonts-11 semibold align-center">
            {{ (selectedShop && selectedShop.name) || '-' }}
          </h1>
          <div
            class="fonts fonts-10 grey normal align-center overflow-ellipsis"
          >
            {{ (selectedShop && selectedShop.location) || '-' }}
          </div>
        </div>

        <div class="padding padding-15px display-flex bottom-dividings">
          <div class="width width-50">
            <div class="display-flex align-center margin margin-top-5px">
              <div style="width: 30px; text-align: left">
                <div class="card-value center small">
                  <i class="fonts fonts-9 white fa fa-lg fa-calendar-alt"></i>
                </div>
              </div>
              <div style="width: calc(100% - 30px)">
                <div class="fonts fonts-10 normal grey overflow-ellipsis">
                  {{ selectedShop && selectedShop.open_day }} -
                  {{ selectedShop && selectedShop.close_day }}
                </div>
              </div>
            </div>
            <div class="display-flex align-center margin margin-top-5px">
              <div style="width: 30px; text-align: left">
                <div class="card-value center small">
                  <i class="fonts fonts-9 white fa fa-lg fa-phone"></i>
                </div>
              </div>
              <div style="width: calc(100% - 30px)">
                <div class="fonts fonts-10 normal grey overflow-ellipsis">
                  {{ selectedShop && selectedShop.phone }}
                </div>
              </div>
            </div>
          </div>
          <div class="width width-50">
            <div class="display-flex align-center margin margin-top-5px">
              <div style="width: 30px; text-align: left">
                <div class="card-value center small">
                  <i class="fonts fonts-9 white fa fa-lg fa-clock"></i>
                </div>
              </div>
              <div style="width: calc(100% - 30px)">
                <div class="fonts fonts-10 normal grey overflow-ellipsis">
                  {{ selectedShop && selectedShop.open_time }} -
                  {{ selectedShop && selectedShop.close_time }}
                </div>
              </div>
            </div>
            <div class="display-flex align-center margin margin-top-5px">
              <div style="width: 30px; text-align: left">
                <div class="card-value center small">
                  <i class="fonts fonts-9 white fa fa-lg fa-info-circle"></i>
                </div>
              </div>
              <div style="width: calc(100% - 30px)">
                <div class="fonts fonts-10 normal grey overflow-ellipsis">
                  Toko {{ isThereOpenedCashbook ? 'Buka' : 'Tutup' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!isDigitalMenuActive && !isDigitalOrderActive"
          class="padding padding-10px"
        >
          <el-alert
            title="Digital Menu Non-Aktif"
            description="Kamu tidak dapat melihat daftar produk dan membuat pesanan di Toko ini, karena fitur Digital Menu di Non-Aktifkan oleh Owner."
            type="warning"
            :closable="false"
            show-icon
          >
          </el-alert>
        </div>
        <div
          v-if="isDigitalMenuActive && !isDigitalOrderActive"
          class="padding padding-10px"
        >
          <el-alert
            title="Digital Order Non-Aktif"
            description="Kamu tidak dapat membuat pesanan di Toko ini, karena digital order untuk Toko ini di Non-Aktifkan oleh Owner."
            type="warning"
            :closable="false"
            show-icon
          >
          </el-alert>
        </div>
        <div
          v-if="
            isDigitalMenuActive &&
            isDigitalOrderActive &&
            !isThereOpenedCashbook
          "
          class="padding padding-10px"
        >
          <el-alert
            title="Toko Sedang Tutup"
            description="Kamu tidak dapat melihat daftar produk dan membuat pesanan karena Toko sedang tutup."
            type="warning"
            :closable="false"
            show-icon
          >
          </el-alert>
        </div>

        <div v-if="isDigitalMenuActive">
          <ProductList
            :style="`padding-bottom: ${isDigitalOrderActive ? '55px' : '0'};`"
          />
          <BottomCart v-if="isDigitalOrderActive && isThereOpenedCashbook" />
        </div>
      </div>
    </AppMobileLayout>

    <AppPopupConfirmed
      v-if="visibleConfirmed"
      :title="'Keluar dari Toko ?'"
      @onClickNo="onClickNo"
      @onClickYes="onClickYes"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import logo from '@/assets/img/logo.png'
import BottomCart from '../cart/BottomCart'
import ProductList from '../product/Index'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppMobileLayout from '../../../modules/AppMobileLayout'
import AppCardCapsule from '../../../modules/AppCardCapsule'

export default {
  name: 'App',
  metaInfo: {
    title: 'Visitor',
    titleTemplate: '%s | Home',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      logo: logo,
      visibleConfirmed: false,
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.storeVisitorShop.data,
      loading: (state) => state.storeVisitorShop.loading,
    }),
    cashBook() {
      return this.data && this.data.cashbook
    },
    isThereOpenedCashbook() {
      return this.cashBook && this.cashBook.cash_status === 'open'
    },
    selectedShop() {
      return this.data && this.data.shop
    },
    isDigitalMenuActive() {
      return this.selectedShop && this.selectedShop.is_digital_menu_active
    },
    isDigitalOrderActive() {
      return this.selectedShop && this.selectedShop.is_digital_order_active
    },
  },
  components: {
    BottomCart,
    ProductList,
    AppPopupConfirmed,
    AppMobileLayout,
    AppCardCapsule,
  },
  methods: {
    onClickExit() {
      this.visibleConfirmed = true
    },
    onClickYes() {
      this.visibleConfirmed = false
      this.$router.replace({ name: 'login' })
    },
    onClickNo() {
      this.visibleConfirmed = false
    },
    // onSendNotification () {
    //     const payload = {
    //         shopId: "SP0001",
    //         orderId: "ODR-1700894024824",
    //         shopName: "SAJIIN CAFFE",
    //         tableName: null,
    //         customerName: "test",
    //         type: "order",
    //         message: "Ada pesanan baru (ODR-1700894024824)"
    //     }
    //     this.$socket.emit('notification', payload)
    // },
  },
}
</script>
