<template>
  <div id="App" class="w-full flex flex-col">
    <div class="flex flex-col gap-4 p-4 w-full lg:w-sm m-auto">
      <div v-if="dataUser" class="flex-1 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-4">
        <div class="relative flex items-center justify-center">
          <AppCardAvatar
            :src="`${adminImageThumbnailUrl}${dataUser.image}`"
            size="large"
            shape="circle"
          />
          <el-button
            size="medium"
            circle
            class="absolute bottom-0 right-0"
            @click="onButtonUpload"
          >
            <i class="fa fa-camera"></i>
          </el-button>
        </div>
        <div class="flex-1 flex flex-col">
          <div class="text-3xl text-black font-semibold text-center lg:text-left truncate flex flex-col lg:flex-row items-center">
            {{ dataUser && dataUser.name }}
            <AppCardCapsule :data="dataUser.status" class="ml-2" />
          </div>
          <div class="text-sm text-center lg:text-left text-gray-500">
            @{{ dataUser && dataUser.username }}
          </div>
        </div>
      </div>

      <div class="default-menu">
        <div class="text-md text-black font-semibold">
          Akun
        </div>

        <router-link
          v-for="(item, index) in listOfProfileMenu"
          :key="index"
          class="menu-item"
          :to="{ name: item.link }"
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
        </router-link>
      </div>

      <div class="default-menu">
        <div class="text-md text-black font-semibold">
          Toko
        </div>

        <router-link
          v-for="(item, index) in listOfShopMenu"
          :key="index"
          class="menu-item"
          :to="{ name: item.link }"
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
        </router-link>
      </div>

      <div class="pt-4 border-t border-gray-200">
        <el-button class="w-full" @click="onLogout">
          <i class="fa fa-power-off mr-2"></i>
          Logout
        </el-button>
      </div>
    </div>

    <AppFileUpload
      v-if="visibleUpdateCover"
      @onClose="onCloseCover"
      @onUpload="onUpdateCover"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmedLogout"
      :title="'Logout dari akun Kamu ?'"
      @onClickNo="onClickNoLogout"
      @onClickYes="onClickYesLogout"
    />

    <AppPopupAlert
      v-if="visibleAlert"
      :title="titleAlert"
      :icon="iconAlert"
      @onClickOk="onClickOk"
    />

    <AppPopupLoader v-if="visiblePopupLoader" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppFileUpload from '../../../modules/AppFileUpload'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppCardAvatar from '../../../modules/AppCardAvatar'
import AppPopupAlert from '../../../modules/AppPopupAlert'

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
    AppFileUpload,
    AppPopupConfirmed,
    AppPopupLoader,
    AppCardCapsule,
    AppCardAvatar,
    AppPopupAlert,
  },
  data() {
    return {
      visibleUpdateCover: false,
      visibleConfirmedLogout: false,
      visiblePopupLoader: false,
      visibleAlert: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
      listOfProfileMenu: [
        { label: 'Ubah Profil', icon: 'fa-user-circle', link: 'shop-change-profile' },
        { label: 'Ubah Password', icon: 'fa-lock', link: 'shop-change-password' },
      ],
      listOfShopMenu: [
        { label: 'Detail Toko', icon: 'fa-store', link: 'shop-detail' },
        { label: 'Operasional', icon: 'fa-clock', link: 'shop-operational' },
        { label: 'Kontak', icon: 'fa-phone', link: 'shop-contact' },
        { label: 'Konfigurasi', icon: 'fa-cog', link: 'shop-configuration' },
      ],
    }
  },
  computed: {
    ...mapState({
      form: (state) => state.storeProfile.form,
      dataUser: (state) => state.storeAuth.user,
      dataEmployee: (state) => state.storeAuth.employee,
    }),
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapActions({
      logout: 'storeAuth/logout',
      getUser: 'storeProfile/getData',
      uploadCover: 'storeProfile/uploadCover',
      setDataAuth: 'storeAuth/setData',
    }),

    getData() {
      const token = this.$cookies.get('tokenBearer')
      this.getUser(token).then((res) => {
        const data = res.data.data
        this.setDataAuth(data)
        this.$cookies.set('user', data.user)
      })
    },

    // ALERT
    onClickOk() {
      this.visibleAlert = false
    },

    // IMAGE
    onButtonUpload() {
      this.visibleUpdateCover = true
    },
    onCloseCover() {
      this.visibleUpdateCover = false
    },
    onUpdateCover(data) {
      this.visibleUpdateCover = false
      const token = this.$cookies.get('tokenBearer')
      this.uploadCover({
        ...this.form,
        image: data,
        token: token,
      }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.getData()
        } else {
          this.visibleAlert = true
          this.titleAlert = 'Gagal upload cover'
        }
      })
    },

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
