<template>
  <div id="App">
    <AppSideForm
      title="Nota Produksi"
      :enableCustomFooter="true"
      :onClose="onClose"
    >
      <div class="display-flex align-center">
        <button
          v-for="(dt, i) in thermalSizing"
          :key="i"
          :class="`card card-status ${selectedIndex === dt.id ? 'active' : 'normal'} border-big-radius margin margin-5px`"
          @click.stop="onChangeSize(dt)"
        >
          {{ dt.sizeThermal.x }}{{ dt.sizeThermal.x !== '100%' ? 'mm' : '' }}
        </button>
      </div>

      <div v-if="loadingReceipt">
        <AppLoader />
      </div>

      <div
        class="width width-100"
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
          id="tasklist-to-print"
          :style="`width: ${selectedData.sizeReceipt.x}; margin: auto;`"
        >
          <div class="padding padding-10px">
            <div v-if="selected && selected.shop" class="width width-100 margin margin-bottom-5px">
              <div
                class="fonts fonts-11 semibold align-center margin margin-top-7px margin-bottom-2px"
              >
                {{ selected.shop && selected.shop.name }}
              </div>
              <div class="fonts fonts-9 normal align-center">
                {{ selected.shop && selected.shop.location }}
              </div>
              <div
                v-if="selected.shop && selected.shop.phone"
                class="fonts fonts-9 normal align-center"
              >
                {{ selected.shop && selected.shop.phone }}
              </div>
            </div>
            <div v-if="selected && selected.order" class="margin margin-top-7px margin-bottom-7px">
              <div class="display-flex space-between">
                <div style="width: 75px">
                  <div class="fonts fonts-9">ID Transaksi</div>
                </div>
                <div style="width: calc(100% - 75px)">
                  <div class="fonts fonts-9">: {{ selected.order.order_id }}</div>
                </div>
              </div>
              <div class="display-flex space-between">
                <div style="width: 75px">
                  <div class="fonts fonts-9">Tanggal</div>
                </div>
                <div style="width: calc(100% - 75px)">
                  <div class="fonts fonts-9">
                    : {{ selected.order.created_at | moment('DD/MM/YYYY') }}
                  </div>
                </div>
              </div>
              <div v-if="selected.order.cashier_name" class="display-flex space-between">
                <div style="width: 75px">
                  <div class="fonts fonts-9">Kasir</div>
                </div>
                <div style="width: calc(100% - 75px)">
                  <div class="fonts fonts-9">
                    : {{ selected.order.cashier_name || '-' }}
                  </div>
                </div>
              </div>
              <div v-if="selected.order.customer_name" class="display-flex space-between">
                <div style="width: 75px">
                  <div class="fonts fonts-9">Pelanggan</div>
                </div>
                <div style="width: calc(100% - 75px)">
                  <div class="fonts fonts-9">
                    : {{ selected.order.customer_name || '-' }}
                  </div>
                </div>
              </div>
              <div v-if="selected.order.table_name" class="display-flex space-between">
                <div style="width: 75px">
                  <div class="fonts fonts-9">Meja</div>
                </div>
                <div style="width: calc(100% - 75px)">
                  <div class="fonts fonts-9">
                    : {{ selected.order.table_name || '-' }}
                  </div>
                </div>
              </div>
              <div v-if="selected.order.platform_name" class="display-flex space-between">
                <div style="width: 75px">
                  <div class="fonts fonts-9">Platform</div>
                </div>
                <div style="width: calc(100% - 75px)">
                  <div class="fonts fonts-9">
                    : {{ selected.order.platform_name || '-' }}
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selected && selected.details" class="width width-100 border-bottom"></div>
            <div v-if="selected && selected.details" class="margin margin-top-7px margin-bottom-7px">
              <div class="display-flex space-between">
                <div style="width: calc(100% - 110px)">
                  <span class="fonts fonts-9 black semibold">Produk</span>
                </div>
                <div style="width: 30px">
                  <span class="fonts fonts-9 black semibold">Qty</span>
                </div>
              </div>

              <div
                v-for="(dt, index) in selected.details"
                :key="index"
                class="width width-100"
              >
                <div :class="`display-flex space-between`">
                  <div style="width: calc(100% - 30px)">
                    <div class="fonts fonts-9 black">
                      {{ dt.product_name }}
                      {{ dt.product_detail ? `- ${dt.product_detail}` : '' }}
                    </div>
                  </div>
                  <div style="width: 30px">
                    <span class="fonts fonts-9 black">{{ dt.quantity }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selected && selected.order" class="width width-100 border-bottom"></div>
            <div v-if="selected && selected.order" class="margin margin-top-7px margin-bottom-7px">
              <div class="display-flex flex-end">
                <div style="width: calc(100% - 30px)">
                  <div class="fonts fonts-9 black">Total</div>
                </div>
                <div style="width: 30px">
                  <div class="fonts fonts-9 black">
                    {{ selected.order.total_item }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="width width-100 content-center" id="tasklist-to-place"></div>

      <div slot="footer">
        <div class="right-form-footer">
          <button
            class="btn btn-main btn-full"
            :disabled="loadingReceipt"
            @click="onDownloadCanvas('tasklist-to-place')"
          >
            Save As Image
          </button>
          <button
            v-if="isBluetoothSupported"
            class="btn btn-sekunder btn-full margin margin-top-15px"
            @click="onPrintToThermal"
          >
            Print Nota
          </button>
        </div>
      </div>
    </AppSideForm>
  </div>
</template>
<script>
import m from 'moment'
import ViewPdf from 'vue-pdf'
import { mapState } from 'vuex'
import html2canvas from 'html2canvas'
import AppSideForm from '../../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'
import AppCardPriceSuggestion from '../../../../../modules/AppCardPriceSuggestion'
import AppLoader from '../../../../../modules/AppLoader'
import AppEmpty from '../../../../../modules/AppEmpty'
import PrintReceipt from './PrintReceipt'
import CMD from './thermalPrinterCommands'
import { replaceString } from '@/services/utils'

const thermalSizing = [
  {
    id: 1,
    sizeThermal: { x: '80', y: '200' },
    sizeReceipt: { x: '302.36px', y: '755.90px' },
  },
  {
    id: 2,
    sizeThermal: { x: '72', y: '200' },
    sizeReceipt: { x: '272.13px', y: '755.90px' },
  },
  {
    id: 3,
    sizeThermal: { x: '51', y: '200' },
    sizeReceipt: { x: '192.755px', y: '755.90px' },
  },
]

export default {
  name: 'App',
  data() {
    return {
      title: 'Nota Produksi',
      visiblePrintReceipt: false,
      selectedIndex: 1,
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
  components: {
    AppSideForm,
    AppCardCapsule,
    AppCardPriceSuggestion,
    AppLoader,
    AppEmpty,
    ViewPdf,
    PrintReceipt,
  },
  methods: {
    // CLOSE
    onClose() {
      console.log('close')
      this.$emit('onClose')
    },

    // THERMAL PRINT
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
        const data = this.selected
        const encoder = new TextEncoder('utf-8')

        // Styling
        const fontNormal = CMD.TEXT_FORMAT.TXT_FONT_A
        const fontSmall = CMD.TEXT_FORMAT.TXT_FONT_B
        const fontBold = CMD.TEXT_FORMAT.TXT_BOLD_ON
        const fontBoldOff = CMD.TEXT_FORMAT.TXT_BOLD_OFF
        const alignLeft = CMD.TEXT_FORMAT.TXT_ALIGN_LT
        const alignCenter = CMD.TEXT_FORMAT.TXT_ALIGN_CT
        const alignRight = CMD.TEXT_FORMAT.TXT_ALIGN_RT
        // const tabSpacing = CMD.FEED_CONTROL_SEQUENCES.CTL_HT

        // Header
        if (data.shop) {
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
        }
        await this.sendPrintLine(printer)

        // order
        await printer.writeValue(
          encoder.encode(alignLeft + 'ID Transaksi : ' + data.order.order_id + CMD.EOL)
        )
        await printer.writeValue(
          encoder.encode(
            'Tanggal    : ' + m(data.order.created_at).format('DD/MM/YYYY') + CMD.EOL
          )
        )
        if (data.order.customer_name) {
          await printer.writeValue(
            encoder.encode(
              'Pelanggan  : ' + replaceString(data.order.customer_name) + CMD.EOL
            )
          )
        }
        if (data.order.cashier_name) {
          await printer.writeValue(
            encoder.encode(
              'Kasir      : ' + replaceString(data.order.cashier_name) + CMD.EOL
            )
          )
        }
        if (data.order.table_name) {
          await printer.writeValue(
            encoder.encode(
              'Meja       : ' + replaceString(data.order.table_name) + CMD.EOL
            )
          )
        }
        if (data.order.platform_name) {
          await printer.writeValue(
            encoder.encode(
              'Platform   : ' + replaceString(data.order.platform_name) + CMD.EOL
            )
          )
        }
        await this.sendPrintLine(printer)

        // Products
        if (data.details && data.details.length > 0) {
          for (let i = 0; i < data.details.length; i++) {
            const element = data.details[i]
            let productName = element.product_name
            if (element.product_detail) {
              productName += `, ${element.product_detail}`
            }
            await printer.writeValue(
              encoder.encode(alignLeft + productName + CMD.EOL)
            )
            await printer.writeValue(
              encoder.encode(
                alignRight +
                  element.quantity +
                  ' x ' +
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
              data.order.total_item +
              CMD.EOL
          )
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

      await printer.writeValue(line)
    },

    async sendNewLine(printer) {
      let encoder = new TextEncoder('utf-8')
      let line = encoder.encode(CMD.LINE_SPACING.LS_DEFAULT + CMD.EOL)

      await printer.writeValue(line)
      await printer.writeValue(line)
    },

    // CANVAS
    onSetCanvas() {
      this.loadingReceipt = true
      this.onClearCanvas('#tasklist-to-place')
      this.$nextTick(() => {
        this.onOpenCanvas('#tasklist-to-print', '#tasklist-to-place')
      })
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
      const fileName = `order-receipt-${this.selected.order.order_id}.png`
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

    // TABS THERMAL
    onChangeSize(value) {
      this.selectedIndex = value.id
      this.selectedData = value
      this.onSetCanvas()
    },
  },
  computed: {
    ...mapState({
      selected: (state) => state.storeTaskLists.selected,
      errorMessage: (state) => state.storeTaskLists.errorMessage,
      isBluetoothSupported: (state) => state.application.isBluetoothSupported,
    }),
    loadingReceipt: {
      set(value) {
        this.$store.state.storeTaskLists.loadingReceipt = value
      },
      get() {
        return this.$store.state.storeTaskLists.loadingReceipt
      },
    },
    orderId() {
      return this.selected && this.selected.order ? this.selected.order.order_id : null
    },
  },
  watch: {
    orderId() {
      this.onSetCanvas()
    },
  },
  mounted() {
    this.onSetCanvas()
  },
}
</script>
