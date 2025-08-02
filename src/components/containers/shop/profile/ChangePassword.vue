<template>
  <div class="flex flex-col gap-4 p-4 w-full lg:w-sm mx-auto">
    <div class="flex flex-col gap-2">
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
      <el-button class="w-full" type="primary" :disabled="!isCanSave" @click="onSaveSubmit">
        Simpan Data
      </el-button>
    </div>

    <AppPopupConfirmed
      v-if="visibleConfirmedUpdate"
      :title="'Update data profil ?'"
      @onClickNo="onClickNoUpdate"
      @onClickYes="onClickYesUpdate"
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
      visibleConfirmedUpdate: false,
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
    isCanSave() {
      return this.form.password && this.form.password.length >= 6
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
  },
}
</script>