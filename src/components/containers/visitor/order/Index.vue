<template>
  <div id="App" class="w-full py-4 px-4 lg:px-0">
    <div class="w-full flex flex-col gap-4">
      <AppLoader v-if="loading" />

      <div v-else>
        <div v-if="!data">
          <AppEmpty title="Pesanan Tidak Ditemukan" />
          <div class="flex justify-center">
            <el-button @click="onClickExit">
              Buat Pesanan Baru ?
            </el-button>
          </div>
        </div>

        <div v-else class="w-full flex flex-col gap-4">
          <div v-if="data.order.status === 'canceled'">
            <AppEmpty
              title="Pesanan ini dibatalkan oleh Toko."
              icon="fa fa-3x fa-times-circle"
            />
            <div class="flex justify-center">
              <el-button @click="onClickExit">
                Buat Pesanan Baru ?
              </el-button>
            </div>
          </div>

          <div v-if="data.order.status !== 'canceled'" class="flex flex-col gap-4">
            
            <!-- ORDER DETAILS -->
            <div class="flex flex-col gap-1 border-b border-gray-300 pb-4">
              <el-alert
                v-if="!data.order.payment_status"
                title="Pesanan Belum Dibayar !"
                description="Untuk melakukan pembayaran bisa langsung menuju Kasir."
                type="info"
                :closable="true"
                :show-icon="true"
                style="margin-bottom: 15px"
              >
              </el-alert>

              <div class="flex items-center justify-between">
                <div class="text-lg text-black font-semibold">Detail Pesanan</div>
                <el-button
                  circle
                  @click="getData"
                >
                  <i class="fa fa-lw fa-retweet"></i>
                </el-button>
              </div>

              <div class="text-md text-black font-semibold">Pesanan</div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-black">ID Pesanan</div>
                <div class="text-sm text-black font-semibold text-right">
                  {{ data.order.order_id }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-black">Tanggal</div>
                <div class="text-sm text-black font-semibold text-right">
                  {{ data.order.created_at | moment('dddd, DD MMM YYYY') }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-black">Pelanggan</div>
                <div class="text-sm text-black font-semibold text-right">
                  {{
                    data.order.customer_name ? data.order.customer_name : '-'
                  }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-black">Meja</div>
                <div class="text-sm text-black font-semibold text-right">
                  {{ data.order.table_name ? data.order.table_name : '-' }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-black">Platform</div>
                <div class="text-sm text-black font-semibold text-right">
                  {{
                    data.order.platform_name ? data.order.platform_name : '-'
                  }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="text-sm text-black">Toko</div>
                <div class="text-sm text-black font-semibold text-right">
                  {{ (data.shop && data.shop.name) || '-' }}
                </div>
              </div>
            </div>

            <!-- ORDER STATUS -->
            <div class="flex flex-col gap-1 border-b border-gray-300 pb-4">
              <div class="w-full flex items-center justify-between">
                <div class="text-lg text-black font-semibold">Status</div>
                <AppCardCapsule
                  v-if="!isCanViewStatus(data.order)"
                  :data="data.order.status"
                />
              </div>

              <div
                v-if="isCanViewStatus(data.order)"
                class="w-full flex flex-col gap-2"
              >
                <div
                  v-for="(dt, i) in orderStatus"
                  :key="i"
                  class="flex items-center gap-4"
                >
                  <div class="flex justify-center" style="width: 64px;">
                    <AppCardIcon
                      :icon="dt.icon"
                      shape="circle"
                      :iconSize="dt.isActive ? '22px' : '16px'"
                      :iconColor="dt.isActive ? dt.iconColor : '#999'"
                      :bgColor="dt.isActive ? dt.color : '#fff'"
                      :size="dt.isActive ? 'small' : 'xsmall'"
                    />
                  </div>

                  <div
                    class="flex-1 flex flex-col py-4"
                    :class="{
                      'border-b border-gray-300': i < orderStatus.length - 1
                    }"
                  >
                    <div
                      class="text-md text-black font-semibold"
                      :class="{
                        'text-gray-500': !dt.isActive
                      }"
                    >
                      {{ dt.title }}
                    </div>
                    <div
                      v-if="dt.isActive"
                      class="text-sm text-gray-500"
                    >
                      {{ dt.subtitle }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- LIST PRODUCT -->
            <div class="flex flex-col gap-1 border-b border-gray-300 pb-4">
              <div class="text-lg text-black font-semibold">
                Produk
              </div>

              <div class="flex flex-col gap-4">
                <div class="grid grid-cols-3">
                  <div class="col-span-2">
                    <div class="text-sm text-black font-semibold">
                      Produk
                    </div>
                  </div>
                  <div class="col-span-1">
                    <div class="text-sm text-black font-semibold">
                      Harga
                    </div>
                  </div>
                </div>

                <div
                  v-for="(dt, index) in data.details"
                  :key="index"
                  class="grid grid-cols-3"
                >
                  <div class="col-span-2 flex gap-4">
                    <AppCardAvatar
                      :src="`${productImageThumbnailUrl}${dt.product_image}`"
                      shape="square"
                      size="small"
                      fit="contain"
                      custom-class="shadow-none border border-gray-200"
                    />

                    <div class="flex-1 flex flex-col gap-2">
                      <div class="flex flex-col">
                        <span class="text-sm text-black font-semibold">
                          {{ dt.product_name }}
                        </span>
                        <span
                          v-if="dt.product_detail"
                          class="text-sm text-gray-500 ml-2"
                        >
                          - {{ dt.product_detail }}</span
                        >
                      </div>

                      <div class="text-sm text-gray-500">
                        {{ dt.quantity }} x {{ format(dt.price) }}
                      </div>

                      <div v-if="dt.product_toping" class="text-sm text-gray-500">
                        {{ dt.quantity }} {{ dt.product_toping }} x
                        {{ format(dt.toping_price) }}
                      </div>

                      <div v-if="dt.note" class="text-sm text-gray-500">
                        {{ dt.note }}
                      </div>
                    </div>
                  </div>
                  <div class="col-span-1">
                    <div class="text-sm text-black font-semibold">
                      {{ format(dt.subtotal) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-3 pt-4 border-t border-gray-300">
                <div class="col-span-2">
                  <div class="text-sm text-black font-semibold">
                    Total ({{ data.order.total_item }} produk)
                  </div>
                </div>
                <div class="col-span-1">
                  <div class="text-sm text-black font-semibold">
                    {{ format(data.order.total_price) }}
                  </div>
                </div>
                <div v-if="data.order.is_discount" class="col-span-2">
                  <div class="text-sm text-gray-500">Diskon</div>
                </div>
                <div v-if="data.order.is_discount" class="col-span-1">
                  <div class="text-sm text-gray-500">
                    {{ format(data.order.total_discount) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- PAYMENT -->
            <div class="flex flex-col gap-1 border-b border-gray-300 pb-4">
              <div class="text-lg text-black font-semibold">
                Pembayaran
              </div>

              <div class="grid grid-cols-3">
                <div class="col-span-2 text-sm text-black">Status</div>
                <div class="col-span-1 text-sm text-black font-semibold">
                  {{ data.order.payment_status ? 'Dibayar' : 'Belum Bayar' }}
                </div>
              </div>

              <div class="grid grid-cols-3 mb-4">
                <div class="col-span-2 text-sm text-black">Metode</div>
                <div class="col-span-1 text-sm text-black font-semibold">
                  {{
                    data.order.payment_name ? data.order.payment_name : '-'
                  }}
                </div>
              </div>

              <!-- CHANGES -->
               <div class="text-lg text-black font-semibold">
                Tagihan
              </div>

              <div class="grid grid-cols-3">
                <div class="col-span-2 text-sm text-black">Bayar</div>
                <div class="col-span-1 text-sm text-black font-semibold">
                  {{ format(data.order.bills_price) }}
                </div>
              </div>

              <div class="grid grid-cols-3">
                <div class="col-span-2 text-sm text-black">Kembali</div>
                <div class="col-span-1 text-sm text-black font-semibold">
                  {{ format(data.order.change_price) }}
                </div>
              </div>
            </div>

            <div class="w-full">
              <el-button
                type="primary"
                class="w-full"
                :disabled="!isCanDownloadNota(data.order)"
                @click="onDownloadReceipt"
              >
                <el-popover
                  v-if="!isCanDownloadNota(data.order)"
                  placement="left"
                  width="210"
                  trigger="hover"
                  style="word-break: break-word"
                >
                  <i
                    slot="reference"
                    class="icn icn-left fa fa-lg fa-info-circle"
                  ></i>
                  <div class="fonts fonts-10 normal red">
                    Kamu bisa download nota setelah melakukan pembayaran.
                  </div>
                </el-popover>
                Download Nota
              </el-button>
            </div>

            <div class="w-full">
              <el-button
                class="w-full"
                @click="onClickExit"
              >
               Kembali ke Toko
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppPopupLoader v-if="loadingForm" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import logo from '@/assets/img/logo.png'
import AppMobileLayout from '../../../modules/AppMobileLayout'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import AppLoader from '../../../modules/AppLoader'
import AppEmpty from '../../../modules/AppEmpty'
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppCardIcon from '../../../modules/AppCardIcon'
import AppCardAvatar from '../../../modules/AppCardAvatar'

const defaultPayloadOrderStatus = [
  {
    title: 'Antrian',
    subtitle: 'Pesananmu sudah masuk dalam antrian.',
    icon: 'fa fa-lg fa-info',
    color: '#38c172',
    iconColor: '#fff',
    isActive: false,
  },
  {
    title: 'Disiapkan',
    subtitle: 'Tunggu ya, pesananmu sedang disiapkan.',
    icon: 'fa fa-lg fa-fire',
    color: '#f6993f',
    iconColor: '#fff',
    isActive: false,
  },
  {
    title: 'Diantarkan',
    subtitle: 'Yee! Pesananmu sedang diantarkan.',
    icon: 'fa fa-lg fa-truck',
    color: '#e3342f',
    iconColor: '#fff',
    isActive: true,
  },
]

export default {
  name: 'App',
  metaInfo: {
    title: 'Visitor',
    titleTemplate: '%s | Order Tracking',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      logo: logo,
      orderIndex: 1,
      orderStatus: [],
      visibleAlert: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
      visibleConfirmed: false,
      titleConfirmed: 'Keluar dari Toko ?',
    }
  },
  mounted() {
    this.setOrderStatus()
    this.getData()
  },
  components: {
    AppMobileLayout,
    AppLoader,
    AppPopupConfirmed,
    AppPopupAlert,
    AppEmpty,
    AppCardCapsule,
    AppPopupLoader,
    AppCardIcon,
    AppCardAvatar,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeVisitorOrder.data,
      loading: (state) => state.storeVisitorOrder.loading,
      loadingForm: (state) => state.storeVisitorOrder.loadingForm,
      dataShop: (state) => state.storeVisitorShop.data,
    }),
    selectedShop() {
      return this.dataShop.shop
    },
  },
  methods: {
    ...mapActions({
      getById: 'storeVisitorOrder/getById',
      download: 'storeVisitorOrder/download',
    }),
    isCanViewStatus(value) {
      let status = false
      if (
        value.status === 'new-order' ||
        value.status === 'on-progress' ||
        value.status === 'ready'
      ) {
        status = true
      }
      return status
    },
    isCanDownloadNota(value) {
      let status = false
      if (value.payment_status && value.status === 'done') {
        status = true
      }
      return status
    },
    getData() {
      const order_id = this.$route.params.orderId
      this.getById({ order_id }).then((res) => {
        this.setOrderStatus()
      })
    },
    setOrderStatus() {
      const status = this.data && this.data.order && this.data.order.status
      this.orderIndex = status
        ? status === 'new-order'
          ? 0
          : status === 'on-progress'
            ? 1
            : status === 'ready'
              ? 2
              : null
        : null
      let newPayload =
        defaultPayloadOrderStatus &&
        defaultPayloadOrderStatus.map((dt, i) => {
          const status = i <= this.orderIndex ? true : false
          return {
            ...dt,
            isActive: status,
          }
        })
      this.orderStatus = newPayload
    },
    onClickExit() {
      this.$router.push({ name: 'visitor-home' })
    },
    onDownloadReceipt() {
      const order_id = this.$route.params.orderId
      const size_x = 80
      const size_y = 200
      this.download({ order_id, size_x, size_y }).then((res) => {
        if (res.status === 200) {
          this.$message('Order receipt downloaded')
        } else {
          this.$message({
            message: 'Failed to download order receipt',
            type: 'error',
          })
        }
      })
    },
  },
}
</script>
