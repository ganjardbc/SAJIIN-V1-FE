<template>
  <div id="App">
    <button
      :class="
        (buttonClass ? buttonClass : 'btn btn-main') +
        (buttonFull ? ' btn-full' : '')
      "
      @click="onButtonShop"
    >
      <i :class="'icn icn-left ' + (icon ? icon : 'fa fa-lg fa-qrcode')" />
      {{ title ? title : 'Scan QR Code' }}
    </button>

    <AppPopupForm
      v-if="openCreateShop"
      :enableRadius="true"
      :title="'Scan QR Code'"
      :onClose="onButtonShop"
    >
      <div>
        <div v-if="error" style="padding: 10px">
          <div class="card box-shadow">
            <p class="fonts fonts-11 red semibold">{{ error }}</p>
          </div>
        </div>

        <div v-if="visibleLoader">
          <AppLoader />
        </div>

        <div v-else>
          <div
            v-if="!selectedIndex"
            class="card-qr-camera"
            style="margin-top: 10px; margin-bottom: 10px"
          >
            <qrcode-stream @decode="onDecode" @init="onInit">
              <div v-if="loading" class="post-middle-absolute">
                <AppLoader />
              </div>
            </qrcode-stream>
          </div>

          <div v-else style="padding-left: 10px; padding-right: 10px">
            <div
              class="card box-shadow"
              style="margin-top: 15px; margin-bottom: 15px; overflow: unset"
            >
              <div
                class="display-flex space-between"
                style="padding-top: 5px; padding-bottom: 5px"
              >
                <div style="width: 60px; margin-right: 15px">
                  <div class="image image-padding border border-full">
                    <i
                      v-if="!selectedIndex.image"
                      class="post-middle-absolute fa fa-lg fa-store"
                      style="font-size: 32px; color: #999"
                    />
                    <img
                      v-else
                      :src="shopImageThumbnailUrl + selectedIndex.image"
                      alt=""
                      class="post-center"
                    />
                  </div>
                </div>
                <div style="width: calc(100% - 75px)">
                  <div class="display-flex" style="margin-bottom: 5px">
                    <div
                      class="fonts fonts-11 semibold"
                      style="margin-top: 3px"
                    >
                      {{ selectedIndex.name }}
                    </div>
                    <div
                      :class="
                        'card-capsule ' +
                        (selectedIndex.status === 'active' ? 'active' : '')
                      "
                      style="margin-left: 10px; text-transform: capitalize"
                    >
                      {{ selectedIndex.status }}
                    </div>
                  </div>
                  <div>
                    <div class="fonts fonts-10 grey">
                      {{ selectedIndex.open_time }} -
                      {{ selectedIndex.close_time }}
                    </div>
                    <div class="fonts fonts-10 grey">
                      {{ selectedIndex.location }}
                    </div>
                  </div>
                </div>
              </div>
              <div style="padding-top: 15px">
                <button
                  class="btn btn-full btn-main"
                  @click="onChangeShop(selectedIndex)"
                >
                  Enter This Shop
                </button>

                <button
                  class="btn btn-full btn-grey"
                  style="margin-top: 10px"
                  @click="rescanQR"
                >
                  Re-scan QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppPopupForm>

    <AppAlert
      v-if="visibleAlertSave"
      :isLoader="visibleLoaderAction"
      :title="'Enter this shop ?'"
      :onClose="onShowHideSave"
      :onSave="onChooseShop"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import AppPopupForm from './AppPopupForm'
import AppAlert from './AppAlert'
import AppLoader from './AppLoader'
import VueQrcode from 'vue-qrcode'
import axios from 'axios'

const shop = {
  id: '',
  shop_id: '',
  image: '',
  name: '',
  email: '',
  phone: '',
  about: '',
  status: '',
}

export default {
  name: 'App',
  data() {
    return {
      loading: false,
      result: '',
      error: '',
      validCode: '',
      visibleAlertSave: false,
      visibleLoaderAction: false,
      visibleLoader: false,
      openCreateShop: false,
      selectedShop: null,
      selectedIndex: null,
      datas: [],
    }
  },
  mounted() {
    const shopData = this.$cookies.get('shop')
    this.selectedShop = shopData ? shopData : shop
    this.validCode = this.code
      ? this.code
      : 'https://www.instagram.com/ganjar_hadiatna/'
    // this.getData()
    // this.getByID('SP0002')
  },
  components: {
    AppLoader,
    AppAlert,
    VueQrcode,
    AppPopupForm,
  },
  props: {
    buttonFull: {
      type: Boolean,
      required: false,
    },
    buttonClass: {
      type: String,
      required: false,
    },
    code: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    onChange: {
      type: Function,
      required: false,
    },
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      customer: 'customer/data',
    }),
  },
  methods: {
    ...mapActions({
      setShop: 'store/setData',
      setToast: 'toast/setToast',
    }),
    makeToast(title) {
      const payload = {
        visible: true,
        title: title,
      }
      this.setToast(payload)
    },
    onDecode(result) {
      this.result = result
      this.getByID(this.result)
    },

    async onInit(promise) {
      this.loading = true

      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = 'ERROR: you need to grant camera access permisson'
        } else if (error.name === 'NotFoundError') {
          this.error = 'ERROR: no camera on this device'
        } else if (error.name === 'NotSupportedError') {
          this.error = 'ERROR: secure context required (HTTPS, localhost)'
        } else if (error.name === 'NotReadableError') {
          this.error = 'ERROR: is the camera already in use?'
        } else if (error.name === 'OverconstrainedError') {
          this.error = 'ERROR: installed cameras are not suitable'
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = 'ERROR: Stream API is not supported in this browser'
        }
      } finally {
        this.loading = false
      }
    },
    rescanQR() {
      this.selectedIndex = null
    },
    onShowHideSave() {
      this.visibleAlertSave = !this.visibleAlertSave
      this.selectedIndex = null
    },
    onButtonShop() {
      this.openCreateShop = !this.openCreateShop
      this.selectedIndex = null
      this.error = ''
      this.result = ''
    },
    onChangeShop(data) {
      this.onShowHideSave()
      this.selectedIndex = data
    },
    onChooseShop() {
      this.selectedShop = this.selectedIndex
      this.openCreateShop = !this.openCreateShop
      this.setShop(this.selectedShop)
      this.$cookies.set('shop', this.selectedShop)
      this.$cookies.remove('table')
      this.$router.push({ name: 'customer-main' })
    },
    async getByID(id) {
      this.visibleLoader = true
      this.error = ''

      const token = 'Bearer '.concat(this.$cookies.get('token'))
      const payload = {
        shop_id: id,
      }

      const rest = await axios.post('/api/shop/getByID', payload, {
        headers: { Authorization: token },
      })

      if (rest && rest.status === 200) {
        const data = rest.data.data

        if (data) {
          this.selectedIndex = data.shop
        } else {
          this.error = 'Shop not found, please re-scan QR Code.'
        }

        this.visibleLoader = false
      } else {
        this.visibleLoader = false
        this.error = 'There is an error, please try again.'
      }
    },
    async getData() {
      this.visibleLoader = true

      const token = 'Bearer '.concat(this.$cookies.get('token'))
      const payload = {
        limit: 1000,
        offset: 0,
        status: 'active',
      }

      const rest = await axios.post('/api/shop/getAllOnlyShop', payload, {
        headers: { Authorization: token },
      })

      if (rest && rest.status === 200) {
        const data = rest.data.data

        this.datas = data
        this.visibleLoader = false
      } else {
        this.visibleLoader = false
      }
    },
  },
  watch: {
    code(props) {
      if (props) {
        this.validCode = props
      }
    },
  },
}
</script>
