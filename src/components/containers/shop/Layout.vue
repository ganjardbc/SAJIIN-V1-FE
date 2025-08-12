<template>
  <div
    class="default-layout"
    :class="{
      'collapse': isCollapseDesktop,
      'mobile-collapse': isCollapseMobile,
    }"
  >
    <div class="w-full h-full">
      <div class="header">
        <div class="flex-1 flex gap-2 items-center">
          <div class="menu" @click="onOpenSidebar">
            <el-badge
              :hidden="!isThereCounterMenu"
              is-dot
            >
              <i 
                class="icon fa-solid"
                :class="deviceType === 'mobile' 
                  ? {
                    'fa-bars-staggered': !isCollapseMobile,
                    'fa-bars': isCollapseMobile,
                  }
                  : {
                    'fa-bars-staggered': !isCollapseDesktop,
                    'fa-bars': isCollapseDesktop,
                  }
                "
              />
            </el-badge>
          </div>
          <div class="title">
            {{ metaTitle }}
          </div>
        </div>

        <router-link
          :to="{ name: 'shop-home', params: { shopId: shopId } }"
          class="logo"
        >
          <img :src="logo" alt="" style="width: 100%; height: 100%" />
        </router-link>

        <div class="flex-1 flex items-center justify-end gap-2">
          <div class="navbar">
            <router-link :to="{ name: 'shop-home' }" class="menu mobile-only">
              <i class="icon fa-solid fa-house" />
              <span class="label">Home</span>
            </router-link>
            <router-link :to="{ name: 'shop-notifications' }" class="menu">
              <el-badge
                :hidden="totalUnread === 0"
                is-dot
              >
                <i class="icon fa-solid fa-bell" />
              </el-badge>
              <span class="label">Notifikasi</span>
            </router-link>
            <router-link :to="{ name: 'shop-profile' }" class="menu">
              <i class="icon fa-solid fa-user" />
              <span class="label">Profil</span>
            </router-link>
          </div>
          <div class="divider desktop-only" />
          <div class="flex flex-end items-center gap-2">
            <el-popover placement="bottom-end" class="flex-1" trigger="click" width="360">
              <div
                class="flex flex-col gap-2"
                v-loading="loadingShop"
              >
                <div class="text-sm text-black font-semibold">
                  Daftar Toko
                </div>
                <div
                  v-if="dataShop.length > 0"
                  class="flex flex-col gap-2 overflow-y-auto"
                  style="max-height: 360px"
                >
                  <div
                    v-for="(item, index) in dataShop"
                    :key="index"
                    class="flex items-center gap-3 p-3 rounded-md bg-white hover:bg-gray-100 border border-gray-200 cursor-pointer"
                    :class="{
                      'bg-vermillion-50 hover:bg-vermillion-100': isShopSelected(item.shop.id),
                      'border-vermillion-200': isShopSelected(item.shop.id),
                    }"
                    @click="goShop(item.shop.shop_id)"
                  >
                    <AppCardAvatar
                      :src="`${shopImageThumbnailUrl}${item.shop.image}`"
                      size="small"
                      fit="contain"
                    />
                    <div class="flex-1 flex flex-col gap-1">
                      <div class="text-sm text-black font-semibold">
                        {{ item.shop.name }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ item.shop.location }}
                      </div>
                    </div>
                    <AppCardCapsule
                      v-if="isShopSelected(item.shop.id)"
                      type="success"
                      label="Aktif"
                    />
                  </div>
                </div>
              </div>
              <div slot="reference" class="menu">
                <i  class="icon fa-solid fa-store" />
              </div>
            </el-popover>
          </div>
        </div>
      </div>

      <div class="content transition-all duration-300">
        <div class="sidebar transition-all duration-300">
          <div class="header mobile-only z-10 bg-white">
            <div class="flex-1 text-lg text-black font-semibold">
              Menu
            </div>
            <el-button
              size="large"
              circle
              class="border-none"
              @click="onOpenSidebar"
            >
              <i class="fa fa-lg fa-times" />
            </el-button>
          </div>

          <div class="flex flex-col gap-4 p-4">
            <AppListMenu
              :data.sync="sidebar"
              @onClick="onMenuSidebar"
            />
          </div>
        </div>

        <div class="viewer transition-all duration-300">
          <router-view />
        </div>
      </div>
    </div>

    <AppPopupLoader
      v-if="loadingFormShop"
      title="Loading Shop Data..."
    />
  </div>
</template>

<script>
import logo from '@/assets/img/logo.png'
import icon from '@/assets/img/icon.png'
import notifSoundOne from '@/assets/sounds/notifications-1.wav'
import AppListMenu from '../../modules/AppListMenu'
import AppPopupLoader from '../../modules/AppPopupLoader'
import AppCardAvatar from '../../modules/AppCardAvatar'
import AppCardCapsule from '../../modules/AppCardCapsule'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'admin',
  data() {
    return {
      logo: logo,
      icon: icon,
      isCollapseDesktop: true,
      isCollapseMobile: true,
    }
  },
  components: {
    AppPopupLoader,
    AppListMenu,
    AppCardAvatar,
    AppCardCapsule,
  },
  methods: {
    ...mapActions({
      // new store
      removeData: 'storeAuth/removeData',
      getUserData: 'storeAuth/getUserData',
      getCashBook: 'storeCashBook/getCurrent',
      getShopAll: 'storeShop/getData',
      getShopById: 'storeShop/getByID',
      getMatrix: 'storeDashboard/getMatrix',
      getNotification: 'storeNotification/getData',

      // old store
      setToast: 'toast/setToast',
      setMultipleToast: 'toastmessage/setMultipleToast',
    }),
    getShopAllData() {
      const token = this.$cookies.get('tokenBearer')
      this.filterShop.status = 'active'
      this.getShopAll({ token })
        .catch((e) => {
          console.error(e)
          this.setToast({
            type: 'error',
            message: 'Gagal mendapatkan data toko.',
          })
        })
    },
    getShopByIdData() {
      const token = this.$cookies.get('tokenBearer')
      this.getShopById({ token, shop_id: this.shopId })
        .then((res) => {
          if (res && res.data && res.data.data) {
            this.getMatrixData(res.data.data.id)
            this.getCashBookData(res.data.data.id)
            this.getNotificationData(res.data.data.id)
          }
        })
        .catch((e) => {
          console.error(e)
          this.setToast({
            type: 'error',
            message: 'Gagal mendapatkan data toko.',
          })
        })
    },
    getMatrixData(shop_id) {
      const token = this.$cookies.get('tokenBearer')
      this.getMatrix({ token, shop_id })
        .catch((e) => {
          console.error(e)
          this.setToast({
            type: 'error',
            message: 'Gagal mendapatkan data matriks.',
          })
        })
    },
    getCashBookData(shop_id) {
      const token = this.$cookies.get('tokenBearer')
      this.getCashBook({ token, shop_id })
        .catch((e) => {
          console.error(e)
          this.setToast({
            type: 'error',
            message: 'Gagal mendapatkan data buku kas.',
          })
        })
    },
    getNotificationData(shop_id) {
      const token = this.$cookies.get('tokenBearer')
      this.getNotification({ token, shop_id })
        .catch((e) => {
          console.error(e)
          this.setToast({
            type: 'error',
            message: 'Gagal mendapatkan notifikasi.',
          })
        })
    },
    goProfile() {
      this.$router.push({ name: 'shop-profile' })
    },
    goShop(value) {
      this.$router.push({ name: 'shop-home', params: { shopId: value } })
    },
    onOpenSidebar() {
      if (this.deviceType === 'mobile') {
        this.isCollapseDesktop = false
        this.isCollapseMobile = !this.isCollapseMobile
      } else {
        this.isCollapseDesktop = !this.isCollapseDesktop
        this.isCollapseMobile = false
      }
    },
    onMenuSidebar() {
      if (this.deviceType === 'mobile') {
        this.isCollapseMobile = false
      }
    },
    isShopSelected(value) {
      const shop = this.selectedShop
      if (shop && shop.id === value) {
        return true
      }
      return false
    },
    userData() {
      const token = this.$cookies.get('tokenBearer')
      this.getUserData(token)
        .catch(() => {
          this.removeData()
          this.$router.replace({ name: 'login' })
        })
    },
    addShopSocket() {
      const data = this.selectedShop

      if (!data || !data.id) return

      const payload = {
        id: data.id,
        shopId: data.shop_id,
        name: data.name,
        image: data.image,
      }
      this.$socket.emit('addShop', payload)
    },
    playNotif(enablePlay) {
      const audio = new Audio(notifSoundOne)
      audio.muted = !enablePlay
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch((e) => {
          if (e)
            this.$message({
              message:
                'This site can not play audio notification, please allow the Sound in your browser settings.',
              type: 'error',
            })
          window.addEventListener(
            'click',
            () => {
              if (enablePlay) audio.play()
            },
            { once: true }
          )
        })
      })
    },
  },
  computed: {
    ...mapState({
      deviceType: (state) => state.application.deviceType,
      dataShop: (state) => state.storeShop.data,
      filterShop: (state) => state.storeShop.filter,
      loadingShop: (state) => state.storeShop.loading,
      loadingFormShop: (state) => state.storeShop.loadingForm,
      selectedShop: (state) => state.storeShop.form,
      matrix: (state) => state.storeDashboard.matrix,
      cashbook: (state) => state.storeCashBook.dataCurrent,
      totalUnread: (state) => state.storeNotification.totalUnread,
    }),
    shopId() {
      return this.$route.params.shopId
    },
    metaTitle() {
      return this.$route.meta.title || 'Shop'
    },
    isThereCounterMenu() {
      return (
        this.totalOrder > 0 ||
        this.totalCashbook > 0
      )
    },
    totalOrder() {
      if (!this.matrix) return 0
      return (
        this.matrix.newOrder +
        this.matrix.onProgress +
        this.matrix.ready +
        this.matrix.delivered
      )
    },
    totalCashbook() {
      return this.cashbook ? this.cashbook.opened_cashbook.length : 0
    },
    sidebar() {
      return [
        {
          icon: 'fa fa-lg fa-laptop',
          label: 'Kasir',
          value: 0,
          link: 'shop-cashier',
          permission: 'cashier',
        },
        {
          icon: 'fa fa-lg fa-list-ul',
          label: 'Penjualan',
          value: this.totalOrder || 0,
          link: 'shop-orders',
          permission: 'orders',
        },
        {
          icon: 'fa fa-lg fa-coins',
          label: 'Pembelian',
          value: 0,
          link: 'shop-expense',
          permission: 'expense-list',
        },
        {
          icon: 'fa fa-lg fa-cubes',
          label: 'Produksi',
          value: 0,
          link: 'shop-task-lists',
          permission: 'tasklists',
        },
        {
          icon: 'fa fa-lg fa-book-open',
          label: 'Buku Kas',
          value: this.totalCashbook || 0,
          link: 'shop-cash-book',
          permission: 'cashbooks',
        },
        {
          icon: 'fa fa-lg fa-box',
          label: 'Produk',
          value: 0,
          link: 'shop-products',
          permission: 'products',
        },
        {
          icon: 'fa fa-lg fa-th-large',
          label: 'Daftar Meja',
          value: 0,
          link: 'shop-tables',
          permission: 'tables',
        },
        {
          icon: 'fa fa-lg fa-users',
          label: 'Karyawan',
          value: 0,
          link: 'shop-employees',
          permission: 'employees',
        },
        {
          icon: 'fa fa-lg fa-percent',
          label: 'Diskon',
          value: 0,
          link: 'shop-discounts',
          permission: 'products',
        },
        {
          icon: 'fa fa-lg fa-flag',
          label: 'Platform',
          value: 0,
          link: 'shop-platforms',
          permission: 'products',
        },
        {
          icon: 'fa fa-lg fa-calendar-alt',
          label: 'Laporan',
          value: 0,
          link: 'shop-reports',
          permission: 'reports',
        },
      ]
    },
  },
  watch: {
    shopId(value, oldValue) {
      if (value === oldValue) return

      this.getShopByIdData()
      this.addShopSocket()
    },
    deviceType: {
      handler(newValue) {
        if (newValue === 'mobile') {
          this.isCollapseDesktop = false
          this.isCollapseMobile = false
        } else {
          this.isCollapseDesktop = true
          this.isCollapseMobile = true
        }
      },
      immediate: true,
    },
  },
  beforeMount() {
    if (!this.$cookies.get('token')) {
      this.$router.push({ name: 'login' })
    }
    if (this.$cookies.get('token')) {
      this.userData()
    }
  },
  created() {
    this.getShopAllData()
    this.getShopByIdData()
    this.playNotif(false)
  },
  sockets: {
    connect: function () {
      this.addShopSocket()
    },
    notification: function () {
      this.playNotif(true)
    },
  },
}
</script>
