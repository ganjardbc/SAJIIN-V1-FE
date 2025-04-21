<template>
    <AppCardPopup
      v-if="visibilityQrToko"
      title="QR Toko"
      size="xs"
      @onClose="onClose('#component-to-place')"
    >
      <div
        class="w-full flex flex-col items-center py-4 bg-white rounded-lg border border-gray-200"
      >
        <AppLoader v-if="previewLoader" />

        <!-- Template -->
        <div
          style="
            position: relative;
            width: auto;
            margin: auto;
            top: 0;
            height: 1px;
            overflow: hidden;
          "
        >
          <div
            id="component-to-print"
            class="p-4 bg-white flex flex-col gap-4"
          >
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <!-- <img :src="shopImageThumbnailUrl + data.image" alt="" style="height: 25px;"> -->
              <div
                class="text-xs font-semibold text-black"
                style="margin-top: -11px;"
              >
                {{ data.name }}
              </div>
              <img :src="logo" alt="" style="height: 24px" />
            </div>

            <div class="w-full px-2">
              <div style="width: 240px; margin: auto">
                <div
                  style="
                    width: 100%;
                    border-width: 4px;
                    border-style: solid;
                    border-color: #fb3640;
                    border-radius: 20px;
                    margin-bottom: 15px;
                    overflow: hidden;
                  "
                >
                  <VueQrcode
                    :value="`${initUrl}visitor/${data.shop_id}`"
                    style="
                      width: 100%;
                      height: 100%;
                      background-color: #fff;
                      border-radius: 20px;
                      overflow: hidden;
                    "
                  />
                </div>
                <div
                  class="bg-vermillion-500"
                  style="
                    position: relative;
                    width: 100%;
                    height: 42px;
                    border-radius: 8px;
                  "
                >
                  <div
                    class="flex justify-center"
                    style="
                      position: absolute;
                      top: -8px;
                      left: 0;
                      width: 100%;
                    "
                  >
                    <div
                      style="
                        width: 16px;
                        height: 16px;
                        background-color: #fb3640;
                        transform: rotate(45deg);
                      "
                    ></div>
                  </div>
                  <div
                    class="relative w-full text-xs font-semibold text-white text-center"
                    style="top: 5px;"
                  >
                    MENU & ORDER
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Result -->
        <div id="component-to-place"></div>
      </div>

      <template #footer>
        <div class="w-full flex flex-col gap-4">
          <AppShopLink
            v-if="!previewLoader && data.is_digital_menu_active"
            :link="`${initUrl}visitor/${data.shop_id}`"
            :disableLabel="true"
          />
          <el-button
            class="w-full"
            type="primary"
            :disabled="previewLoader"
            @click="onDownloadCanvas('component-to-place')"
          >
            Save As Image
          </el-button>
        </div>
      </template>
    </AppCardPopup>
</template>
<script>
import VueQrcode from 'vue-qrcode'
import html2canvas from 'html2canvas'
import AppCardPopup from './AppCardPopup'
import AppShopLink from './AppShopLink'
import AppLoader from './AppLoader'
import logo from '@/assets/img/logo.png'

export default {
  name: 'AppPopupQrCode',
  data() {
    return {
      logo: logo,
      selectedIndex: 0,
      visibilityQrToko: false,
      previewLoader: false,
      howToOrder: [
        {
          id: 1,
          title: 'Scan QR',
          description: 'Scan QR dengan kamera smartphone.',
        },
        {
          id: 2,
          title: 'Pilih Menu',
          description: 'Pilih menu & tambah ke Keranjang.',
        },
        {
          id: 3,
          title: 'Buat Pesanan',
          description: 'Isi data diri & buat pesanan.',
        },
      ],
      info: [
        {
          id: 1,
          icon: 'fab fa-lg fa-instagram',
          title: 'Instagram',
          value: '@sajiin_id',
        },
        {
          id: 2,
          icon: 'fa fa-lg fa-globe',
          title: 'Website',
          value: 'www.sajiin.com',
        },
        {
          id: 3,
          icon: 'fa fa-lg fa-envelope',
          title: 'Email',
          value: 'sajiin.official@gmail.com',
        },
      ],
    }
  },
  props: {
    data: null,
    visibility: false,
  },
  watch: {
    visibility(props) {
      if (props) {
        this.onOpen()
      } else {
        this.previewLoader = false
        this.visibilityQrToko = false
      }
    },
  },
  components: {
    VueQrcode,
    AppCardPopup,
    AppShopLink,
    AppLoader,
  },
  methods: {
    onClose(toPlace) {
      document.querySelector(toPlace).innerHTML = ''
      this.$emit('onClose')
    },
    onOpen() {
      this.previewLoader = true
      this.visibilityQrToko = true
      setTimeout(() => {
        this.onOpenCanvas('#component-to-print', '#component-to-place')
      }, 500)
    },
    onOpenCanvas(toPrint, toPlace) {
      html2canvas(document.querySelector(toPrint), {
        allowTaint: true,
        tainttest: true,
        logging: false,
        useCORS: true,
      })
        .then((canvas) => {
          document.querySelector(toPlace).appendChild(canvas)
        })
        .finally(() => {
          this.previewLoader = false
        })
    },
    onDownloadCanvas(toPlace) {
      const fileName = `qr-toko-${this.data.shop_id}.png`
      const canvasElement = document.getElementById(toPlace).children[0]
      const canvasUrl = canvasElement
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream')

      const downloadLink = document.createElement('a')
      downloadLink.href = canvasUrl
      downloadLink.download = fileName

      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    },
  },
}
</script>
