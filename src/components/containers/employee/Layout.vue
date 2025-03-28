<template>
  <div id="admin" class="mobile-admin">
    <div class="sidebar mobile-sidebar">
      <div class="header mobile-hidden">
        <div class="header-content display-flex center align-center">
          <router-link
            :to="{ name: 'employee-home' }"
            class="width width-90px display-flex align-center"
          >
            <img :src="logo" alt="" style="width: 100%" />
          </router-link>
        </div>
      </div>
      <div class="content with-header">
        <AppListMenu
          :data.sync="sidebar"
          :isSidebarSmall="false"
          :enableResponsive="true"
          @onClick="onCloseSidebar"
        />
      </div>
    </div>
    <div class="main mobile-main">
      <div class="header">
        <div class="header-content-fixed">
          <div class="header-content-main">
            <div class="width width-auto">
              <router-link
                :to="{ name: 'employee-home' }"
                class="header-content-main-link"
              >
                <img
                  v-if="storeLogo"
                  :src="storeLogo"
                  alt=""
                  class="header-content-main-logo"
                />
                <div v-else class="fonts fonts-12 bold">
                  {{ dataShop && dataShop.name }}
                </div>
              </router-link>
            </div>
            <div class="header-content-main-right">
              <AppCardNotification />
              <AppCardProfile
                :data.sync="dataUser"
                class="margin margin-left-10px"
              >
                <div
                  slot="customMenu"
                  class="padding margin margin-bottom-15px padding padding-bottom-15px border-bottom"
                >
                  <button
                    class="btn btn-white btn-align-left btn-full"
                    @click="toProfile"
                  >
                    <i class="icn icn-left fa fa-user"></i>
                    Profil
                    <i
                      class="icn icn-float-right fonts grey fa fa-lg fa-chevron-right"
                    ></i>
                  </button>
                </div>
              </AppCardProfile>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="main-content-smalls">
          <router-view />
        </div>
        <div class="display-flex center padding padding-20px">
          <div class="fonts fonts-10 grey align-center">{{ appVersion }}</div>
        </div>
      </div>
    </div>

    <AppToast />

    <AppToastMessage />

    <AppPopupLoader v-if="loadingShop" title="Getting Shop Data, Please Wait" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { replaceToMoreValue } from '@/services/utils'
import VueLoadImage from 'vue-load-image'
import logo from '@/assets/img/logo.png'
import icon from '@/assets/img/icon.png'
import notifSoundOne from '@/assets/sounds/notifications-1.wav'
import AppListMenu from '../../modules/AppListMenu'
import AppToast from '../../modules/AppToast'
import AppToastMessage from '../../modules/AppToastMessage'
import AppCardNotification from '../../modules/AppCardNotification'
import AppCardProfile from '../../modules/AppCardProfile'
import AppPopupLoader from '../../modules/AppPopupLoader'

export default {
  name: 'admin',
  data() {
    return {
      logo: logo,
      icon: icon,
      visibleSidebar: false,
      countNotif: 0,
    }
  },
  components: {
    VueLoadImage,
    AppToastMessage,
    AppToast,
    AppListMenu,
    AppCardNotification,
    AppCardProfile,
    AppPopupLoader,
  },
  methods: {
    ...mapActions({
      // new store
      getUserData: 'storeAuth/getUserData',
      setShop: 'storeSelectedShop/setSelectedData',
      getShop: 'storeSelectedShop/getData',
      getCashBook: 'storeCashBook/getCurrent',
      resetCashBook: 'storeCashBook/restDataCurrent',

      // old store
      setToast: 'toast/setToast',
      setMultipleToast: 'toastmessage/setMultipleToast',
    }),
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
    toProfile() {
      this.$router.push({ name: 'employee-profile' })
    },
    onOpenSidebar() {
      this.visibleSidebar = true
    },
    onCloseSidebar() {
      this.visibleSidebar = false
    },
    onChangeMenu(data) {
      this.selectedLabel = this.menuShops[data].label
    },
    makeToast(title, subtitle) {
      const time = new Date().getTime()
      const payload = {
        visible: true,
        title: title,
        subtitle: subtitle,
      }
      this.setToast(payload)
    },
    makeMultipleToast(title, subtitle) {
      const time = new Date().getTime()
      const payload = {
        id: time,
        visible: true,
        title: title,
        subtitle: subtitle,
      }
      this.setMultipleToast(payload)
    },
    userData() {
      const token = this.$cookies.get('tokenBearer')
      this.getUserData(token)
        .then((res) => {
          const data = res.data.data

          this.$cookies.set('user', data.user)
          this.$cookies.set('role', data.role)
          this.$cookies.set('shop', data.shop)
          this.$cookies.set('employee', data.employee)
          this.$cookies.set('permissions', JSON.stringify(data.permissions))
        })
        .catch(() => {
          this.$cookies.remove('token')
          this.$cookies.remove('tokenBearer')
          this.$cookies.remove('user')
          this.$cookies.remove('role')
          this.$cookies.remove('shop')
          this.$cookies.remove('employee')
          this.$cookies.remove('permissions')
          this.$cookies.remove('thermalStatus')
          this.$cookies.remove('thermalUrl')

          this.$router.replace({ name: 'login' })
        })
    },
    setShopData() {
      const shop = this.$cookies.get('shop')
      this.setShop(shop && shop.id)
    },
    getShopData() {
      const token = this.$cookies.get('tokenBearer')
      this.getShop({ token }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.setShopData()
          this.addShopSocket()
        } else {
          this.$message({
            message: 'Failed getting shop',
            type: 'error',
          })
        }
      })
    },
    getDataCashBook(shop_id) {
      const token = this.$cookies.get('tokenBearer')
      const today = new Date()
      if (shop_id) {
        this.resetCashBook()
        this.getCashBook({ token, today: today, shop_id: shop_id }).then(
          (res) => {
            const status = res.data.status
            if (status !== 'ok') {
              this.$message({
                message: 'Failed getting cash book',
                type: 'error',
              })
            }
          }
        )
      }
    },
    addShopSocket() {
      const data = this.$cookies.get('shop')
      if (data) {
        const payload = {
          id: data.id,
          shopId: data.shop_id,
          name: data.name,
          image: data.image,
        }
        this.$socket.emit('addShop', payload)
      }
    },
  },
  computed: {
    ...mapState({
      data: (state) => state.storeAuth.data,
      loadingShop: (state) => state.storeSelectedShop.loading,
      matrixDashboard: (state) => state.storeDashboard.matrix,
      dataCurrent: (state) => state.storeCashBook.dataCurrent,
    }),
    shopId() {
      return this.$store.state.storeSelectedShop.selectedData
    },
    dataUser() {
      return this.data && this.data.user
    },
    dataRole() {
      return this.$cookies.get('role')
    },
    dataShop() {
      return this.$cookies.get('shop')
    },
    storeLogo() {
      return this.dataShop
        ? this.shopImageThumbnailUrl + this.dataShop.image
        : ''
    },
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
    getTotalOrder() {
      let total = 0
      if (
        this.matrixDashboard.newOrder > 0 ||
        this.matrixDashboard.onProgress > 0 ||
        this.matrixDashboard.ready > 0 ||
        this.matrixDashboard.delivered > 0
      ) {
        total =
          this.matrixDashboard.newOrder +
          this.matrixDashboard.onProgress +
          this.matrixDashboard.ready +
          this.matrixDashboard.delivered
      }
      return total
    },
    getTotalOpenedCashbook() {
      return (
        this.dataCurrent &&
        this.dataCurrent.opened_cashbook &&
        this.dataCurrent.opened_cashbook.length
      )
    },
    getAllTotalSidebar() {
      const total = this.getTotalOrder + this.getTotalOpenedCashbook
      return replaceToMoreValue(total)
    },
    sidebar() {
      return [
        {
          icon: 'fa fa-lg fa-database',
          label: 'TOKO',
          value: 0,
          disableMenu: false,
          menu: [
            {
              icon: 'fa fa-lg fa-laptop',
              label: 'Kasir',
              value: 0,
              link: 'employee-cashier',
              permission: 'cashier',
            },
            {
              icon: 'fa fa-lg fa-list-ul',
              label: 'Penjualan',
              value: replaceToMoreValue(this.getTotalOrder),
              link: 'employee-orders',
              permission: 'orders',
            },
            {
              icon: 'fa fa-lg fa-coins',
              label: 'Pembelian',
              value: 0,
              link: 'employee-expense',
              permission: 'expense-list',
            },
            {
              icon: 'fa fa-lg fa-list-alt',
              label: 'Produksi',
              value: 0,
              link: 'employee-task-lists',
              permission: 'tasklists',
            },
            {
              icon: 'fa fa-lg fa-book-open',
              label: 'Buku Kas',
              value: replaceToMoreValue(this.getTotalOpenedCashbook),
              link: 'employee-cash-book',
              permission: 'cashbooks',
            },
            {
              icon: 'fa fa-lg fa-bars',
              label: 'Lainnya',
              value: 0,
              link: 'employee-more',
              permission: 'more',
            },
          ],
        },
      ]
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.getDataCashBook(this.shopId)
      }
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
  mounted() {
    this.getShopData()
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
