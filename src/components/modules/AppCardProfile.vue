<template>
  <div id="App">
    <el-popover placement="bottom-end" width="250" trigger="click">
      <div class="width width-100 content-center">
        <div
          class="padding margin margin-bottom-15px padding padding-bottom-15px border-bottom"
        >
          <div
            class="image image-80px image-center image-circle border-full"
            style="text-align: center; margin-bottom: 15px"
          >
            <img
              v-if="data && data.image"
              :src="
                data && data.image ? adminImageThumbnailUrl + data.image : ''
              "
              alt=""
            />
            <i
              v-else
              class="post-top fa fa-lg fa-user-circle"
              style="color: #999"
            />
          </div>
          <div class="fonts fonts-11 align-center semibold black">
            {{ data && data.name }}
          </div>
          <div class="fonts fonts-9 align-center grey uppercase">
            {{ data && data.role_name }}
          </div>
        </div>
        <slot name="customMenu" />
        <button class="btn btn-full btn-sekunder" @click="onLogout">
          <i class="icn icn-left fa fa-lw fa-power-off"></i> Logout
        </button>
      </div>
      <button
        v-if="isBigButton"
        slot="reference"
        class="btn btn-sekunder btn-circle"
      >
        <i class="icn icn-left fa fa-lw fa-user"></i>
        {{ data && data.username }}
        <i class="icn icn-right fa fa-lw fa-caret-down"></i>
      </button>
      <button v-else slot="reference" class="btn btn-white btn-circle">
        <i class="icon icn-left fa fa-lw fa-user"></i>
        <span class="fonts micro capitalize">
          {{ data && data.role_name }}
        </span>
      </button>
    </el-popover>

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
import { mapActions } from 'vuex'
import AppPopupConfirmed from './AppPopupConfirmed'
import AppPopupLoader from './AppPopupLoader'

export default {
  name: 'App',
  data() {
    return {
      visibleConfirmedLogout: false,
      visiblePopupLoader: false,
    }
  },
  components: {
    AppPopupConfirmed,
    AppPopupLoader,
  },
  props: {
    data: null,
    isBigButton: false,
  },
  methods: {
    ...mapActions({
      logout: 'storeProfile/logout',
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
            this.$cookies.remove('token')
            this.$cookies.remove('tokenBearer')
            this.$cookies.remove('user')
            this.$cookies.remove('role')
            this.$cookies.remove('shop')
            this.$cookies.remove('employee')
            this.$cookies.remove('permissions')
            this.$cookies.remove('thermalStatus')
            this.$cookies.remove('thermalUrl')

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
