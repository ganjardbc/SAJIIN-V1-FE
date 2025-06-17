<template>
  <div id="App" class="w-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 w-full lg:w-sm m-auto">
      <div v-if="dataUser" class="flex-1 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-4">
        <AppCardAvatar
          :src="`${adminImageThumbnailUrl}${dataUser.image}`"
          size="large"
          shape="circle"
        />
        <div class="flex-1 flex flex-col">
          <div class="text-3xl text-black font-semibold text-center lg:text-left truncate flex flex-col lg:flex-row items-center">
            {{ dataUser && dataUser.name }}
            <AppCardCapsule :data="dataUser.status" class="ml-2" />
          </div>
          <div class="text-sm text-center lg:text-left text-gray-500">
            @{{ dataUser && dataUser.username }}
          </div>
          <div class="flex items-center justify-center lg:justify-start pt-2">
            <el-button size="medium" circle>
              <i class="fa fa-comment"></i>
            </el-button>
            <el-button size="medium" circle>
              <i class="fa fa-phone"></i>
            </el-button>
          </div>
        </div>
      </div>

      <div class="default-menu">
        <div class="text-md text-black font-semibold">
          Akun
        </div>

        <div
          v-for="(item, index) in listOfProfileMenu"
          :key="index"
          class="menu-item"
        >
          <div class="icon">
            <i class="fa fa-lw" :class="item.icon"></i>
          </div>
          <div class="label">
            {{ item.label }}
          </div>
          <div class="px-2">
            <i class="text-sm text-gray-500 fa fa-chevron-right"></i>
          </div>
        </div>
      </div>

      <div class="default-menu">
        <div class="text-md text-black font-semibold">
          Toko
        </div>

        <div
          v-for="(item, index) in listOfShopMenu"
          :key="index"
          class="menu-item"
        >
          <div class="icon">
            <i class="fa fa-lw" :class="item.icon"></i>
          </div>
          <div class="label">
            {{ item.label }}
          </div>
          <div class="px-2">
            <i class="text-sm text-gray-500 fa fa-chevron-right"></i>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <el-button class="w-full" @click="onLogout">
          <i class="fa fa-power-off mr-2"></i>
          Logout
        </el-button>
      </div>
    </div>

    <AppPopupConfirmed
      v-if="visibleConfirmedLogout"
      :title="'Logout dari akun Kamu ?'"
      @onClickNo="onClickNoLogout"
      @onClickYes="onClickYesLogout"
    />

    <AppPopupLoader v-if="visiblePopupLoader" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppCardAvatar from '../../../modules/AppCardAvatar'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Profile',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  components: {
    AppPopupConfirmed,
    AppPopupLoader,
    AppCardCapsule,
    AppCardAvatar,
  },
  data() {
    return {
      visibleConfirmedLogout: false,
      visiblePopupLoader: false,
      listOfProfileMenu: [
        { label: 'Informasi Publik', icon: 'fa-info-circle' },
        { label: 'Informasi Privat', icon: 'fa-user-secret' },
        { label: 'Ubah Password', icon: 'fa-lock' },
      ],
      listOfShopMenu: [
        { label: 'Informasi Toko', icon: 'fa-store' },
        { label: 'Pengaturan Toko', icon: 'fa-cog' },
        { label: 'Data Karyawan', icon: 'fa-users' },
      ],
    }
  },
  computed: {
    ...mapState({
      dataUser: (state) => state.storeAuth.user,
      dataEmployee: (state) => state.storeAuth.employee,
    }),
  },
  methods: {
    ...mapActions({
      logout: 'storeAuth/logout',
    }),

    // LOGOUT
    onLogout() {
      this.visibleConfirmedLogout = true
    },
    onClickNoLogout() {
      this.visibleConfirmedLogout = false
    },
    onClickYesLogout() {
      this.visiblePopupLoader = true
      this.visibleConfirmedLogout = false
      const token = this.$cookies.get('tokenBearer')
      this.logout(token)
        .then((res) => {
          if (res.data.status === 'ok') {
            this.$router.push({ name: 'login' })
          }
        })
        .finally(() => {
          this.visiblePopupLoader = false
        })
    },
  },
}
</script>
