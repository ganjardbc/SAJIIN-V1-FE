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
          </div>
          <div class="title">
            {{ metaTitle }}
          </div>
        </div>

        <router-link
          :to="{ name: 'admin-home' }"
          class="logo"
        >
          <img :src="logo" alt="" style="height: 100%" />
        </router-link>

        <div class="flex-1 flex items-center justify-end gap-2">
          <router-link :to="{ name: 'admin-profile' }" class="menu">
            <i class="icon fa-solid fa-user" />
            <span class="label">
              {{ dataUser ? dataUser.name : 'Profile' }}
            </span>
          </router-link>
        </div>
      </div>

      <div class="content--full transition-all duration-300">
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueLoadImage from 'vue-load-image'
import logo from '@/assets/img/logo.png'
import icon from '@/assets/img/icon.png'
import AppListMenu from '../../modules/AppListMenu'
import AppCardNotification from '../../modules/AppCardNotification'
import AppCardProfile from '../../modules/AppCardProfile'

export default {
  name: 'admin',
  data() {
    return {
      logo: logo,
      icon: icon,
      countNotif: 0,
      isCollapseDesktop: true,
      isCollapseMobile: true,
      sidebar: [
        {
          icon: 'fa fa-lg fa-list',
          label: 'Bizpar',
          value: 0,
          link: 'admin-bizpars',
          permission: 'bizpars',
        },
        {
          icon: 'fa fa-lg fa-calculator',
          label: 'Pembayaran',
          value: 0,
          link: 'admin-payments',
          permission: 'payments',
        },
        {
          icon: 'fa fa-lg fa-key',
          label: 'Permission',
          value: 0,
          link: 'admin-permissions',
          permission: 'permissions',
        },
        {
          icon: 'fa fa-lg fa-flag',
          label: 'Role',
          value: 0,
          link: 'admin-roles',
          permission: 'roles',
        },
        {
          icon: 'fa fa-lg fa-users',
          label: 'User',
          value: 0,
          link: 'admin-users',
          permission: 'users',
        },
        {
          icon: 'fa fa-lg fa-store',
          label: 'Toko',
          value: 0,
          link: 'admin-shops',
          permission: 'shops',
        },
      ],
    }
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
  },
  components: {
    VueLoadImage,
    AppListMenu,
    AppCardNotification,
    AppCardProfile,
  },
  methods: {
    ...mapActions({
      // new store
      getUserData: 'storeAuth/getUserData',
      getShop: 'storeSelectedShop/getData',

      // old store
      setToast: 'toast/setToast',
      setMultipleToast: 'toastmessage/setMultipleToast',
    }),
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
    getShopData() {
      const token = this.$cookies.get('tokenBearer')
      this.getShop({ token })
    },
  },
  computed: {
    ...mapState({
      data: (state) => state.storeAuth.data,
      deviceType: (state) => state.application.deviceType,
    }),
    metaTitle() {
      return this.$route.meta.title || 'Admin'
    },
    dataUser() {
      return this.data && this.data.user
    },
  },
  watch: {
    deviceType: {
      handler() {
        this.isCollapseDesktop = false
        this.isCollapseMobile = false
      },
      immediate: true,
    },
  },
  sockets: {
    orderList: function (data) {
      const lth = data.length
      const payload = data && data[lth - 1]
      this.makeMultipleToast(payload.title, payload.subtitle)
    },
  },
}
</script>
