<template>
  <div class="flex flex-col gap-4 p-4 w-full lg:w-sm mx-auto">
    <div class="flex flex-col gap-4">
      <div class="field-group">
        <div class="field-label">Email</div>
        <el-input
          placeholder=""
          type="email"
          v-model="form.email"
        ></el-input>
        <div v-if="errorMessage.email" class="field-error">
          {{ errorMessage.email && errorMessage.email[0] }}
        </div>
      </div>

      <div class="field-group">
        <div class="field-label">Telepon</div>
        <el-input
          placeholder=""
          type="number"
          v-model="form.phone"
        ></el-input>
        <div v-if="errorMessage.phone" class="field-error">
          {{ errorMessage.phone && errorMessage.phone[0] }}
        </div>
      </div>

      <div class="flex items-center justify-end">
        <el-button class="w-full" type="primary" @click="onSaveSubmit">
          Simpan Perubahan
        </el-button>
      </div>
    </div>

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
import AppPopupQrCode from '../../../modules/AppPopupQrCode'
import AppShopLink from '../../../modules/AppShopLink'
import AppHeaderMobile from '../../../modules/AppHeaderMobile'

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
    AppPopupConfirmed,
    AppPopupLoader,
    AppPopupAlert,
    AppPopupQrCode,
    AppShopLink,
    AppHeaderMobile,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeShop.form,
      errorMessage: (state) => state.storeShop.errorMessage,
      loading: (state) => state.storeShop.loading,
      loadingForm: (state) => state.storeShop.loadingForm,
      dayLists: (state) => state.storeShop.dayLists,
    }),
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