<template>
  <div id="App" class="flex flex-col gap-4 p-4 w-full lg:w-sm m-auto">
    <div class="padding padding-bottom-15px">
      <h1 class="text-3xl text-black font-semibold">
        Profil
      </h1>
    </div>

    <div
      v-loading="loading"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-row gap-4 items-center">
        <AppCardAvatar
          :src="getImage"
          size="large"
          shape="circle"
        />

        <el-button @click="onButtonUpload">
          Ubah Cover
        </el-button>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-4">
          <AppTabs
            :isFull="true"
            :selectedIndex.sync="selectedIndex"
            :data="tabs"
            :onChange="(data) => onChangeTabs(data)"
            class="margin margin-bottom-20px"
          />

          <div v-if="selectedIndex === 0" class="flex flex-col gap-4">
            <div class="w-full rounded-lg border border-gray-300 p-4 shadow-sm bg-white flex flex-col gap-4">
              <div class="text-lg text-black font-semibold">Informasi</div>

              <div class="field-group">
                <div class="field-label">ID</div>
                <el-input
                  placeholder=""
                  type="text"
                  v-model="form.id"
                  :disabled="true"
                ></el-input>
                <div v-if="errorMessage.id" class="field-error">
                  {{ errorMessage.id && errorMessage.id[0] }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Nama Lengkap</div>
                <el-input
                  placeholder=""
                  type="text"
                  v-model="form.name"
                  :disabled="false"
                ></el-input>
                <div v-if="errorMessage.name" class="field-error">
                  {{ errorMessage.name && errorMessage.name[0] }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Email</div>
                <div class="field-caption">
                  Masukan email baru untuk merubah email yang lama
                </div>
                <el-input
                  placeholder=""
                  type="email"
                  v-model="form.email"
                  :disabled="false"
                ></el-input>
                <div v-if="errorMessage.email" class="field-error">
                  {{ errorMessage.email && errorMessage.email[0] }}
                </div>
              </div>
              <div class="field-group">
                <div class="field-label">Username</div>
                <el-input
                  placeholder=""
                  type="text"
                  v-model="form.username"
                  :disabled="false"
                  @input="onChangeUsername"
                ></el-input>
                <div v-if="errorMessage.username" class="field-error">
                  {{ errorMessage.username && errorMessage.username[0] }}
                </div>
              </div>
            </div>

            <div class="w-full rounded-lg border border-gray-300 p-4 shadow-sm bg-white flex flex-col gap-4">
              <div class="text-lg text-black font-semibold">Privat</div>
              <div class="field-group">
                <div class="field-label">Role</div>
                <el-input
                  placeholder=""
                  type="text"
                  v-model="form.role_name"
                  :disabled="true"
                ></el-input>
                <div v-if="errorMessage.role_name" class="field-error">
                  {{ errorMessage.role_name && errorMessage.role_name[0] }}
                </div>
              </div>
            </div>

            <div class="display-flex flex-end">
              <el-button type="primary" class="w-full" @click="onSaveSubmit">
                Simpan Data
              </el-button>
            </div>
          </div>

          <div v-if="selectedIndex === 1" class="flex flex-col gap-4">
            <div class="w-full rounded-lg border border-gray-300 p-4 shadow-sm bg-white flex flex-col gap-4">
              <div class="text-lg text-black font-semibold">Ubah Password</div>
              <div class="field-group">
                <div class="field-label">Password Baru</div>
                <div class="field-caption">
                  Masukan password baru untuk merubah password yang lama
                </div>
                <el-input
                  placeholder=""
                  type="password"
                  v-model="form.password"
                  :disabled="false"
                  show-password
                ></el-input>
                <div v-if="errorMessage.password" class="field-error">
                  {{ errorMessage.password && errorMessage.password[0] }}
                </div>
              </div>
            </div>

            <div class="display-flex flex-end">
              <el-button
                :disabled="form.password ? false : true"
                type="primary"
                class="w-full"
                @click="onSaveSubmit"
              >
                Ubah Password
              </el-button>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-300">
          <el-button
            class="w-full"
            @click="onLogout"
          >
            Logout
          </el-button>
        </div>
      </div>
    </div>

    <AppFileUpload
      v-if="visibleUpdateCover"
      @onClose="onCloseCover"
      @onUpload="onUpdateCover"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmedUpdate"
      :title="'Update data profil ?'"
      @onClickNo="onClickNoUpdate"
      @onClickYes="onClickYesUpdate"
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

    <AppPopupLoader v-if="loadingForm" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import AppFileUpload from '../../../modules/AppFileUpload'
import AppTabs from '../../../modules/AppTabs'
import AppCardAvatar from '../../../modules/AppCardAvatar'

const tabs = [
  { id: 1, label: 'Data', status: 'active' },
  { id: 2, label: 'Ubah Password', status: '' },
]

export default {
  name: 'App',
  metaInfo: {
    title: 'Owner',
    titleTemplate: '%s | Profile',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      tabs: tabs,
      selectedIndex: 0,
      visibleUpdateCover: false,
      visibleConfirmedUpdate: false,
      visibleConfirmedLogout: false,
      visibleAlert: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
    }
  },
  mounted() {
    this.getData()
  },
  components: {
    AppTabs,
    AppFileUpload,
    AppPopupConfirmed,
    AppPopupLoader,
    AppPopupAlert,
    AppCardAvatar,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeProfile.form,
      errorMessage: (state) => state.storeProfile.errorMessage,
      loading: (state) => state.storeProfile.loading,
      loadingForm: (state) => state.storeProfile.loadingForm,
    }),
    getImage() {
      return this.form.image
        ? this.adminImageThumbnailUrl + this.form.image
        : ''
    },
  },
  methods: {
    ...mapActions({
      getUser: 'storeProfile/getData',
      logout: 'storeProfile/logout',
      updateData: 'storeProfile/updateData',
      uploadCover: 'storeProfile/uploadCover',
      setDataAuth: 'storeAuth/setData',
    }),
    onChangeUsername(value) {
      this.form.username = value.replace(/[ ]/g, '_')
    },
    onChangeTabs(data) {
      this.selectedIndex = data
    },
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

    // UPDATE
    onSaveSubmit() {
      this.visibleConfirmedUpdate = true
    },
    onClickNoUpdate() {
      this.visibleConfirmedUpdate = false
    },
    onClickYesUpdate() {
      this.visibleConfirmedUpdate = false
      const token = this.$cookies.get('tokenBearer')
      this.updateData({
        ...this.form,
        token,
      }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.getData()
          this.$message('Sukses edit profil')
        } else {
          this.$message({
            message: 'Gagal merubah profil',
            type: 'error',
          })
        }
      })
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
      this.visibleConfirmedLogout = false
      const token = this.$cookies.get('tokenBearer')
      this.logout(token).then((res) => {
        if (res.data.status === 'ok') {
          this.$cookies.remove('token')
          this.$cookies.remove('tokenBearer')
          this.$cookies.remove('user')
          this.$cookies.remove('role')
          this.$cookies.remove('shop')
          this.$cookies.remove('employee')
          this.$cookies.remove('permissions')

          this.$router.push({ name: 'login' })
        }
      })
    },
  },
}
</script>
