<template>
  <div class="flex flex-col gap-4 p-4 w-full lg:w-sm mx-auto">
    <div class="flex flex-col gap-4">
      <div class="field-group">
        <div class="text-xs text-black font-semibold">Toko</div>

        <div class="flex items-center gap-4 justify-between">
          <div class="field-label">Status</div>
          <el-switch
            v-model="form.status"
            :active-value="'active'"
            :inactive-value="'inactive'"
            active-text="Aktif"
            inactive-text="Non-Aktif"
          ></el-switch>
        </div>
        <div v-if="errorMessage.status" class="field-error">
          {{ errorMessage.status && errorMessage.status[0] }}
        </div>

        <div class="flex items-center gap-4 justify-between mt-2">
          <div class="field-label">Is Non FnB</div>
          <el-switch
            v-model="form.is_non_fnb"
            active-text="Aktif"
            inactive-text="Non-Aktif"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </div>
        <div v-if="errorMessage.is_non_fnb" class="field-error">
          {{ errorMessage.is_non_fnb && errorMessage.is_non_fnb[0] }}
        </div>
      </div>

      <div class="field-group">
        <div class="text-xs text-black font-semibold">Pengunjung</div>
        <div class="flex items-center gap-4 justify-between">
          <div class="field-label">Digital Menu</div>
          <el-switch
            v-model="form.is_digital_menu_active"
            :active-value="1"
            :inactive-value="0"
            active-text="Aktif"
            inactive-text="Non-Aktif"
            @change="onChangeDigitalMenu"
          ></el-switch>
        </div>
        <div
          v-if="errorMessage.is_digital_menu_active"
          class="field-error"
        >
          {{
            errorMessage.is_digital_menu_active &&
            errorMessage.is_digital_menu_active[0]
          }}
        </div>

        <div class="flex items-center gap-4 justify-between mt-2">
          <div class="field-label">Digital Order</div>
          <el-switch
            v-model="form.is_digital_order_active"
            :active-value="1"
            :inactive-value="0"
            active-text="Aktif"
            inactive-text="Non-Aktif"
            @change="onChangeDigitalOrder"
          ></el-switch>
        </div>
        <div
          v-if="errorMessage.is_digital_order_active"
          class="field-error"
        >
          {{
            errorMessage.is_digital_order_active &&
            errorMessage.is_digital_order_active[0]
          }}
        </div>
      </div>

      <div v-if="form.is_digital_menu_active" class="field-group">
        <AppShopLink :link="`${initUrl}visitor/${form.shop_id}`" />
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
    onChangeDigitalMenu(data) {
      this.form.is_digital_menu_active = data
      this.form.is_digital_order_active = 0
    },
    onChangeDigitalOrder(data) {
      this.form.is_digital_order_active = data
      this.form.is_digital_menu_active = 1
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