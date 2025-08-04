<template>
  <div v-loading="loading" class="w-full flex flex-col gap-4 p-4">
    <div class="w-full flex justify-center">
      <AppCardAvatar
        :src="`${shopImageThumbnailUrl}${selectedShop.image}`"
        shape="circle"
        size="large"
        fit="contain"
        custom-class="shadow-none border border-gray-200"
      />
    </div>

    <div class="w-full flex flex-col items-center justify-center">
      <h1 class="text-lg text-black text-center font-semibold">
        {{ (selectedShop && selectedShop.name) || '-' }}
      </h1>
      <div class="text-sm text-gray-600 text-center truncate">
        {{ (selectedShop && selectedShop.location) || '-' }}
      </div>
    </div>

    <div class="w-full flex items-center justify-between gap-4">
      <div class="flex-1 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <div
            class="rounded-full bg-vermillion-100 flex items-center justify-center"
            style="width: 30px; height: 30px"
          >
            <i class="text-sm text-vermillion-500 fa fa-lg fa-calendar-alt"></i>
          </div>
          <div style="width: calc(100% - 30px)">
            <div class="text-sm text-gray-900">
              {{ selectedShop && selectedShop.open_day }} -
              {{ selectedShop && selectedShop.close_day }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div
            class="rounded-full bg-vermillion-100 flex items-center justify-center"
            style="width: 30px; height: 30px"
          >
            <i class="text-sm text-vermillion-500 fa fa-lg fa-phone"></i>
          </div>
          <div style="width: calc(100% - 30px)">
            <div class="text-sm text-gray-900">
              {{ selectedShop && selectedShop.phone }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <div
            class="rounded-full bg-vermillion-100 flex items-center justify-center"
            style="width: 30px; height: 30px"
          >
            <i class="text-sm text-vermillion-500 fa fa-lg fa-clock"></i>
          </div>
          <div style="width: calc(100% - 30px)">
            <div class="text-sm text-gray-900">
              {{ selectedShop && selectedShop.open_time }} -
              {{ selectedShop && selectedShop.close_time }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div
            class="rounded-full bg-vermillion-100 flex items-center justify-center"
            style="width: 30px; height: 30px"
          >
            <i class="text-sm text-vermillion-500 fa fa-lg fa-info-circle"></i>
          </div>
          <div style="width: calc(100% - 30px)">
            <div class="text-sm text-gray-900">
              Toko {{ isThereOpenedCashbook ? 'Buka' : 'Tutup' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-alert
      v-if="!isDigitalMenuActive && !isDigitalOrderActive"
      title="Digital Menu Non-Aktif"
      description="Kamu tidak dapat melihat daftar produk dan membuat pesanan di Toko ini, karena fitur Digital Menu di Non-Aktifkan oleh Owner."
      type="warning"
      :closable="false"
      show-icon
    />

    <el-alert
      v-if="isDigitalMenuActive && !isDigitalOrderActive"
      title="Digital Order Non-Aktif"
      description="Kamu tidak dapat membuat pesanan di Toko ini, karena digital order untuk Toko ini di Non-Aktifkan oleh Owner."
      type="warning"
      :closable="false"
      show-icon
    />

    <el-alert
      v-if="
        isDigitalMenuActive &&
        isDigitalOrderActive &&
        !isThereOpenedCashbook
      "
      title="Toko Sedang Tutup"
      description="Kamu tidak dapat melihat daftar produk dan membuat pesanan karena Toko sedang tutup."
      type="warning"
      :closable="false"
      show-icon
    />

    <ProductList
      v-if="isDigitalMenuActive"
      :style="`padding-bottom: ${isDigitalOrderActive ? '55px' : '0'};`"
    />

    <BottomCart
      v-if="
        isDigitalMenuActive &&
        isDigitalOrderActive &&
        isThereOpenedCashbook
      "
    />

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
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppCardAvatar from '../../../modules/AppCardAvatar'

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
    AppCardCapsule,
    AppCardAvatar,
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
