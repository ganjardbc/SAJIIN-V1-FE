<template>
  <AppSideForm
    :value="openForm"
    :title="title"
    :enableCustomFooter="true"
    @close="onClose"
  >
    <template #toolbar>
      <el-button
        size="small"
        circle
        :disabled="loadingReceipt"
        @click="onDownloadReceipt"
      >
        <i class="fa fa-lw fa-download"></i>
      </el-button>
    </template>

    <div class="w-full flex flex-col gap-4">
      <AppTabs
        class="w-full"
        :selectedIndex.sync="selectedIndex"
        :isFull="true"
        :isScrollable="false"
        :data="thermalSizing"
        :onChange="(data) => onChangeSize(data)"
      />

      <AppLoader v-if="loadingReceipt" />

      <div
        class="w-full"
        style="
          position: absolute;
          width: auto;
          margin: auto;
          top: 0;
          height: 1px;
          overflow: hidden;
        "
      >
        <div
          v-if="selectedData"
          id="component-to-print"
          class="flex flex-col gap-4"
          :style="`width: ${selectedData.sizeReceipt.x}; margin: auto;`"
        >
          <div class="w-full flex flex-col">
            <div class="text-sm text-black font-semibold text-center">
              {{ form.shop && form.shop.name }}
            </div>
            <div class="text-xs text-black text-center">
              {{ form.shop && form.shop.location }}
            </div>
            <div
              v-if="form.shop && form.shop.phone"
              class="text-xs text-black text-center"
            >
              {{ form.shop && form.shop.phone }}
            </div>
          </div>

          <div class="w-full flex flex-col border-b border-gray-200 pb-4">
            <div class="flex justify-between items-center gap-4">
              <div style="width: 75px">
                <div class="text-xs text-black">ID Transaksi</div>
              </div>
              <div style="width: calc(100% - 75px)">
                <div class="text-xs text-black">: {{ form.order_id }}</div>
              </div>
            </div>
            <div class="flex justify-between items-center gap-4">
              <div style="width: 75px">
                <div class="text-xs text-black">Tanggal</div>
              </div>
              <div style="width: calc(100% - 75px)">
                <div class="text-xs text-black">
                  : {{ form.created_at | moment('DD/MM/YYYY') }}
                </div>
              </div>
            </div>
            <div v-if="form.cashier_name" class="flex justify-between items-center gap-4">
              <div style="width: 75px">
                <div class="text-xs text-black">Kasir</div>
              </div>
              <div style="width: calc(100% - 75px)">
                <div class="text-xs text-black">
                  : {{ form.cashier_name || '-' }}
                </div>
              </div>
            </div>
            <div v-if="form.customer_name" class="flex justify-between items-center gap-4">
              <div style="width: 75px">
                <div class="text-xs text-black">Pelanggan</div>
              </div>
              <div style="width: calc(100% - 75px)">
                <div class="text-xs text-black">
                  : {{ form.customer_name || '-' }}
                </div>
              </div>
            </div>
            <div v-if="form.table_name" class="flex justify-between items-center gap-4">
              <div style="width: 75px">
                <div class="text-xs text-black">Meja</div>
              </div>
              <div style="width: calc(100% - 75px)">
                <div class="text-xs text-black">
                  : {{ form.table_name || '-' }}
                </div>
              </div>
            </div>
            <div v-if="form.platform_name" class="flex justify-between items-center gap-4">
              <div style="width: 75px">
                <div class="text-xs text-black">Platform</div>
              </div>
              <div style="width: calc(100% - 75px)">
                <div class="text-xs text-black">
                  : {{ form.platform_name || '-' }}
                </div>
              </div>
            </div>
          </div>

          <div class="w-full flex flex-col gap-2 border-b border-gray-200 pb-4">
            <div class="w-full flex justify-between items-center">
              <div style="width: calc(100% - 110px)">
                <span class="text-xs tet-black font-semibold">Produk</span>
              </div>
              <div style="width: 30px">
                <span class="text-xs tet-black font-semibold">Qty</span>
              </div>
              <div style="width: 80px">
                <span class="text-xs tet-black font-semibold">Total</span>
              </div>
            </div>

            <div
              v-for="(dt, index) in form.details"
              :key="index"
              class="w-full flex justify-between items-center"
            >
              <div style="width: calc(100% - 110px)">
                <div class="text-xs tet-black">
                  {{ dt.product_name }}
                  {{ dt.product_detail ? `- ${dt.product_detail}` : '' }}
                </div>
                <div class="text-xs tet-black">
                  {{ format(dt.price) }}
                </div>
              </div>
              <div style="width: 30px">
                <span class="text-xs tet-black">{{ dt.quantity }}</span>
              </div>
              <div style="width: 80px">
                <span class="text-xs tet-black">{{
                  format(dt.subtotal)
                }}</span>
              </div>
            </div>
          </div>

          <div class="w-full flex justify-between items-center border-b border-gray-200 pb-4">
            <div style="width: calc(100% - 80px)">
              <div class="text-xs tet-black">Total</div>
            </div>
            <div style="width: 80px">
              <div class="text-xs tet-black">
                {{ format(form.total_price) }}
              </div>
            </div>
          </div>

          <div
            v-if="isThereDiscountProduct || isThereDiscountTransaction"
            class="w-full flex justify-between items-center border-b border-gray-200 pb-4"
          >
            <div style="width: calc(100% - 80px)">
              <div class="text-xs tet-black">Diskon</div>
            </div>
            <div style="width: 80px">
              <div class="text-xs tet-black">
                {{ format(totalDiscount) }}
              </div>
            </div>
          </div>

          <div class="w-full flex flex-col gap-2 border-b border-gray-200 pb-4">
            <div class="w-full flex justify-between items-center">
              <div style="width: calc(100% - 80px)">
                <div class="text-xs tet-black">Bayar</div>
              </div>
              <div style="width: 80px">
                <div class="text-xs tet-black">
                  {{ format(form.bills_price) }}
                </div>
              </div>
            </div>
            <div class="w-full flex justify-between items-center">
              <div style="width: calc(100% - 80px)">
                <div class="text-xs tet-black">Kembali</div>
              </div>
              <div style="width: 80px">
                <div class="text-xs tet-black">
                  {{ format(form.change_price) }}
                </div>
              </div>
            </div>
          </div>

          <div class="w-full flex flex-col justify-center items-center gap-2">
            <div class="text-xs tet-black text-center">
              Scan Untuk Cek Transaksi
            </div>
            <div style="width: 150px">
              <VueQrcode
                :value="`${initUrl}visitor/${form.shop && form.shop.shop_id}/order/${form.order_id}`"
                errorCorrectionLevel="L"
                :width="150"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        id="component-to-place"
        class="w-full flex justify-center"
      />
    </div>

    <template #footer>
      <div class="w-full flex flex-col gap-4">
        <el-button
          class="w-full"
          :disabled="loadingReceipt"
          @click="onDownloadCanvas('component-to-place')"
        >
          Save As Image
        </el-button>
        <el-button
          v-if="isBluetoothSupported"
          type="primary"
          class="w-full"
          style="margin-left: 0"
          :disabled="loadingReceipt"
          @click="onPrintToThermal"
        >
          Print Nota
        </el-button>
      </div>
    </template>
    
    <PrintReceipt
      v-if="visiblePrintReceipt"
      @onPrint="onPrintThermal"
      @onClose="visiblePrintReceipt = false"
    />
  </AppSideForm>
</template>
<script>
import m from 'moment'
import ViewPdf from 'vue-pdf'
import { Printd } from 'printd'
import { mapState, mapActions } from 'vuex'
import html2canvas from 'html2canvas'
import VueQrcode from 'vue-qrcode'
import AppSideForm from '../../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'
import AppCardPriceSuggestion from '../../../../../modules/AppCardPriceSuggestion'
import AppLoader from '../../../../../modules/AppLoader'
import AppEmpty from '../../../../../modules/AppEmpty'
import AppTabs from '../../../../../modules/AppTabs'
import PrintReceipt from './PrintReceipt'
import printStyles from './styles'
import CMD from './markdown'
import { replaceString, formatCurrency } from '@/services/utils'

const thermalSizing = [
  {
    id: 1,
    label: '80mm',
    sizeThermal: { x: '80', y: '200' },
    sizeReceipt: { x: '302.36px', y: '755.90px' },
  },
  {
    id: 2,
    label: '72mm',
    sizeThermal: { x: '72', y: '200' },
    sizeReceipt: { x: '272.13px', y: '755.90px' },
  },
  {
    id: 3,
    label: '58mm',
    sizeThermal: { x: '51', y: '200' },
    sizeReceipt: { x: '192.755px', y: '755.90px' },
  },
]

export default {
  name: 'App',
  data() {
    return {
      title: 'Nota Transaksi',
      visiblePrintReceipt: false,
      selectedIndex: 0,
      selectedData: thermalSizing[0],
      thermalSizing: thermalSizing,
      printObj: {
        id: 'printMe',
        popTitle: '',
        extraHead: '',
      },
      fileUrl: '',
      canvas: {
        width: 120,
        height: 120,
      },
    }
  },
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  components: {
    VueQrcode,
    AppSideForm,
    AppCardCapsule,
    AppCardPriceSuggestion,
    AppLoader,
    AppEmpty,
    AppTabs,
    PrintReceipt,
    ViewPdf,
  },
  methods: {
    ...mapActions({
      download: 'storeOrders/download',
      downloadOnly: 'storeOrders/downloadOnly',
    }),

    onPrintPreview() {
      const printer = new Printd()
      printer.print(document.getElementById('component-to-print'), printStyles)
    },

    async onPrintToThermal() {
      try {
        const device = await navigator.bluetooth.requestDevice({
          filters: [
            {
              services: ['000018f0-0000-1000-8000-00805f9b34fb'],
              optionalServices: ['device_information'],
              acceptAllDevices: true,
            },
          ],
        })

        const server = await device.gatt.connect()
        const service = await server.getPrimaryService(
          '000018f0-0000-1000-8000-00805f9b34fb'
        )
        const printer = await service.getCharacteristic(
          '00002af1-0000-1000-8000-00805f9b34fb'
        )
        const data = this.form
        const encoder = new TextEncoder('utf-8')

        // Styling
        const fontNormal = CMD.TEXT_FORMAT.TXT_FONT_A
        const fontSmall = CMD.TEXT_FORMAT.TXT_FONT_B
        const fontBold = CMD.TEXT_FORMAT.TXT_BOLD_ON
        const fontBoldOff = CMD.TEXT_FORMAT.TXT_BOLD_OFF
        const alignLeft = CMD.TEXT_FORMAT.TXT_ALIGN_LT
        const alignCenter = CMD.TEXT_FORMAT.TXT_ALIGN_CT
        const alignRight = CMD.TEXT_FORMAT.TXT_ALIGN_RT
        const tabSpacing = CMD.FEED_CONTROL_SEQUENCES.CTL_HT

        // Header
        await printer.writeValue(
          encoder.encode(
            alignCenter +
              fontBold +
              fontNormal +
              data.shop.name +
              fontBoldOff +
              CMD.EOL
          )
        )
        if (data.shop.location) {
          await printer.writeValue(
            encoder.encode(replaceString(data.shop.location) + CMD.EOL)
          )
        }
        if (data.shop.phone) {
          await printer.writeValue(
            encoder.encode(replaceString(data.shop.phone) + CMD.EOL)
          )
        }
        await this.sendPrintLine(printer)

        // order
        await printer.writeValue(
          encoder.encode(alignLeft + 'ID Transaksi : ' + data.order_id + CMD.EOL)
        )
        await printer.writeValue(
          encoder.encode(
            'Tanggal    : ' + m(data.created_at).format('DD/MM/YYYY') + CMD.EOL
          )
        )
        if (data.customer_name) {
          await printer.writeValue(
            encoder.encode(
              'Pelanggan  : ' + replaceString(data.customer_name) + CMD.EOL
            )
          )
        }
        if (data.cashier_name) {
          await printer.writeValue(
            encoder.encode(
              'Kasir      : ' + replaceString(data.cashier_name) + CMD.EOL
            )
          )
        }
        if (data.table_name) {
          await printer.writeValue(
            encoder.encode(
              'Meja       : ' + replaceString(data.table_name) + CMD.EOL
            )
          )
        }
        if (data.platform_name) {
          await printer.writeValue(
            encoder.encode(
              'Platform   : ' + replaceString(data.platform_name) + CMD.EOL
            )
          )
        }
        await this.sendPrintLine(printer)

        // Products
        let totalDiscount = 0
        if (data.details && data.details.length > 0) {
          // await printer.writeValue(encoder.encode(fontBold + fontSmall + alignLeft + 'Products                          Subtotal' + fontBoldOff + fontNormal + CMD.EOL))

          for (let i = 0; i < data.details.length; i++) {
            const element = data.details[i]
            let productName = element.product_name
            if (element.product_detail) {
              productName += `, ${element.product_detail}`
            }
            if (element.is_discount) {
              totalDiscount += element.discount_price
            }

            await printer.writeValue(
              encoder.encode(alignLeft + productName + CMD.EOL)
            )
            await printer.writeValue(
              encoder.encode(
                alignRight +
                  element.quantity +
                  ' x ' +
                  formatCurrency(element.price) +
                  CMD.EOL
              )
            )
          }

          await this.sendPrintLine(printer)
        }

        // Total
        await printer.writeValue(
          encoder.encode(
            alignLeft +
              'Total      : ' +
              formatCurrency(data.total_price) +
              CMD.EOL
          )
        )

        // Discount
        await printer.writeValue(
          encoder.encode(
            alignLeft + 'Diskon     : ' + formatCurrency(0) + CMD.EOL
          )
        )
        if (data.discount_price || totalDiscount) {
          await printer.writeValue(
            encoder.encode(
              alignLeft +
                'Diskon     : ' +
                formatCurrency(data.discount_price + totalDiscount) +
                CMD.EOL
            )
          )
        }

        // Bills
        await printer.writeValue(
          encoder.encode(
            alignLeft +
              'Bayar      : ' +
              formatCurrency(data.bills_price) +
              CMD.EOL
          )
        )
        await printer.writeValue(
          encoder.encode(
            alignLeft +
              'Kembali    : ' +
              formatCurrency(data.change_price) +
              CMD.EOL
          )
        )

        await printer.writeValue(
          encoder.encode(CMD.EOL + alignCenter + 'THANK YOU FOR YOUR ORDER !')
        )
        await printer.writeValue(
          encoder.encode(
            CMD.EOL + alignCenter + fontSmall + 'Powered by Saji-In' + CMD.EOL
          )
        )

        await this.sendNewLine(printer)
      } catch (e) {
        console.log('printing error', e)
      }
    },

    async sendPrintLine(printer) {
      let encoder = new TextEncoder('utf-8')
      let line = encoder.encode(
        CMD.TEXT_FORMAT.TXT_ALIGN_LT +
          '--------------------------------' +
          CMD.EOL
      )
      // let line = encoder.encode(CMD.LINE_SPACING.LS_DEFAULT + CMD.EOL)

      await printer.writeValue(line)
    },

    async sendNewLine(printer) {
      let encoder = new TextEncoder('utf-8')
      let line = encoder.encode(CMD.LINE_SPACING.LS_DEFAULT + CMD.EOL)

      await printer.writeValue(line)
      await printer.writeValue(line)
    },

    onPrintThermal() {
      const payload = {
        data: {
          ...this.form,
          created_at: m(this.form.created_at).format('DD/MM/YYYY HH:mm:ss'),
          updated_at: m(this.form.updated_at).format('DD/MM/YYYY HH:mm:ss'),
          shop_image: `${this.shopImageThumbnailUrl}${this.form.shop_image}`,
        },
      }
      fetch(this.printerUrl + '/print-receipt', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.status === 'ok') {
            this.visiblePrintReceipt = false
            this.$message('Printing this order receipt')
          } else {
            this.$message({
              message: 'Failed to print this order receipt',
              type: 'error',
            })
          }
        })
    },
    onSetCanvas() {
      this.loadingReceipt = true
      this.onClearCanvas('#component-to-place')
      setTimeout(() => {
        this.onOpenCanvas('#component-to-print', '#component-to-place')
      }, 500)
    },
    onClearCanvas(toPlace) {
      document.querySelector(toPlace).innerHTML = ''
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
          this.loadingReceipt = false
        })
    },
    onDownloadCanvas(toPlace) {
      const fileName = `order-receipt-${this.form.order_id}.png`
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
    onDownloadReceipt() {
      const token = this.$cookies.get('tokenBearer')
      const order_id = this.form.order_id
      const size_x = this.selectedData.sizeThermal.x
      const size_y = this.selectedData.sizeThermal.y
      this.download({ token, order_id, size_x, size_y }).then((res) => {
        if (res.status === 200) {
          this.$message('Downloaded order receipt')
        } else {
          this.$message({
            message: 'Failed to download order receipt',
            type: 'error',
          })
        }
      })
    },
    // HIDDEN TEMPORARY
    // onViewDownloadReceipt () {
    //     this.fileUrl = ''
    //     const token = this.$cookies.get('tokenBearer')
    //     const order_id = this.form.order_id
    //     const size_x = this.selectedData.sizeThermal.x
    //     const size_y = this.selectedData.sizeThermal.y
    //     this.downloadOnly({ token, order_id, size_x, size_y }).then((res) => {
    //         if (res.status === 200) {
    //             var file = new Blob([res.data], {
    //                 type: 'application/pdf'
    //             })
    //             var fileUrl = URL.createObjectURL(file)
    //             this.fileUrl = fileUrl
    //         } else {
    //             this.$message({
    //                 message: 'Failed to download order receipt',
    //                 type: 'error'
    //             })
    //         }
    //     })
    // },
    onClose() {
      this.$emit('onClose')
    },
    onChangeSize(value) {
      const dataThermal = this.thermalSizing[value] || this.thermalSizing[0]
      this.selectedData = dataThermal
      // HIDDEN TEMPORARY
      // this.onViewDownloadReceipt()
      this.onSetCanvas()
    },
  },
  computed: {
    ...mapState({
      form: (state) => state.storeOrders.form,
      errorMessage: (state) => state.storeOrders.errorMessage,
      details: (state) => state.storeOrders.form.details,
      isBluetoothSupported: (state) => state.application.isBluetoothSupported,
    }),
    loadingReceipt: {
      set(value) {
        this.$store.state.storeOrders.loadingReceipt = value
      },
      get() {
        return this.$store.state.storeOrders.loadingReceipt
      },
    },
    orderId() {
      return this.form.order_id
    },
    totalDiscountProduct() {
      let price = 0
      this.form.details &&
        this.form.details.map((item) => {
          let quantity = item.quantity
          if (item.is_discount) {
            price += quantity * item.discount_price
          }
        })
      return price
    },
    isThereDiscountProduct() {
      let status = false
      this.form.details &&
        this.form.details.map((item) => {
          if (item.is_discount) {
            status = true
          }
        })
      return status
    },
    totalDiscountTransaction() {
      return this.form.discount_price
    },
    isThereDiscountTransaction() {
      let status = false
      if (this.form.discount_price) {
        status = true
      }
      return status
    },
    totalDiscount() {
      return this.totalDiscountProduct + this.totalDiscountTransaction
    },
  },
  watch: {
    orderId() {
      // HIDDEN TEMPORARY
      // this.onViewDownloadReceipt()
      this.onSetCanvas()
    },
  },
  mounted() {
    this.onSetCanvas()
  },
}
</script>
