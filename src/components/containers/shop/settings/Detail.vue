<template>
  <div class="flex flex-col gap-4 p-4 w-full lg:w-sm mx-auto">
    <div class="flex flex-col gap-4">
      <div class="field-group">
        <div class="w-full flex flex-col md:flex-row items-center gap-4">
          <AppCardAvatar
            :src="getImage"
            size="large"
            fit="contain"
          />
          <div class="flex items-center">
            <el-button
              class="flex-1"
              @click="onButtonUpload"
            >
              Update Cover
            </el-button>
            <el-button
              v-if="form.is_digital_menu_active"
              class="flex-1"
              @click="onOpenQrCode"
            >
              QR-Code Toko
            </el-button>
          </div>
        </div>
      </div>

      <div class="field-group">
        <div class="field-label">ID Toko</div>
        <el-input
          placeholder=""
          type="text"
          v-model="form.shop_id"
          :disabled="true"
        ></el-input>
        <div v-if="errorMessage.shop_id" class="field-error">
          {{ errorMessage.shop_id && errorMessage.shop_id[0] }}
        </div>
      </div>

      <div class="field-group">
        <div class="field-label">Nama</div>
        <el-input
          placeholder=""
          type="text"
          v-model="form.name"
        ></el-input>
        <div v-if="errorMessage.name" class="field-error">
          {{ errorMessage.name && errorMessage.name[0] }}
        </div>
      </div>

      <div class="field-group">
        <div class="field-label">Keterangan</div>
        <el-input
          placeholder=""
          type="textarea"
          v-model="form.about"
          :autosize="{ minRows: 2, maxRows: 2 }"
        ></el-input>
        <div v-if="errorMessage.about" class="field-error">
          {{ errorMessage.about && errorMessage.about[0] }}
        </div>
      </div>

      <div class="field-group">
        <div class="field-label">Alamat</div>
        <el-input
          placeholder=""
          type="textarea"
          v-model="form.location"
          :autosize="{ minRows: 2, maxRows: 2 }"
        ></el-input>
        <div v-if="errorMessage.location" class="field-error">
          {{ errorMessage.location && errorMessage.location[0] }}
        </div>
      </div>

      <div class="flex items-center justify-end">
        <el-button class="w-full" type="primary" @click="onSaveSubmit">
          Simpan Perubahan
        </el-button>
      </div>
    </div>

    <AppFileUpload
      v-if="visibleUpdateCover"
      @onClose="onCloseCover"
      @onUpload="onUpdateCover"
    />

    <AppPopupConfirmed
      v-if="visibleConfirmedUpdate"
      :title="'Ubah data Toko ?'"
      @onClickNo="onClickNoUpdate"
      @onClickYes="onClickYesUpdate"
    />

    <AppPopupAlert
      v-if="visibleAlert"
      :title="titleAlert"
      :icon="iconAlert"
      @onClickOk="onClickOk"
    />

    <AppPopupQrCode
      :visibility.sync="visibleQrCode"
      :data="form"
      @onClose="onCloseQrCode"
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
import AppPopupQrCode from '../../../modules/AppPopupQrCode'
import AppShopLink from '../../../modules/AppShopLink'
import AppCardAvatar from '../../../modules/AppCardAvatar'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Settings',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      visibleUpdateCover: false,
      visibleConfirmedUpdate: false,
      visibleAlert: false,
      visibleQrCode: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
    }
  },
  mounted() {
    this.getData()
  },
  components: {
    AppFileUpload,
    AppPopupConfirmed,
    AppPopupLoader,
    AppPopupAlert,
    AppPopupQrCode,
    AppShopLink,
    AppCardAvatar,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeShop.form,
      errorMessage: (state) => state.storeShop.errorMessage,
      loading: (state) => state.storeShop.loading,
      loadingForm: (state) => state.storeShop.loadingForm,
    }),
    getImage() {
      return this.form.image ? this.shopImageThumbnailUrl + this.form.image : ''
    },
  },
  methods: {
    ...mapActions({
      getShopByID: 'storeShop/getByID',
      updateData: 'storeShop/updateData',
      uploadCover: 'storeShop/uploadCover',
      setDataAuth: 'storeAuth/setData',
    }),

    getData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.$route.params.shopId
      this.getShopByID({
        token: token,
        shop_id: shop_id,
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
          this.$message('Berhasil merubah data Toko')
        } else {
          this.$message({
            message: 'Gagal merubah data Toko',
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
          this.titleAlert = 'Gagal update cover'
        }
      })
    },

    // QR CODE
    onOpenQrCode() {
      this.visibleQrCode = true
    },
    onCloseQrCode() {
      this.visibleQrCode = false
    },
  },
}
</script>