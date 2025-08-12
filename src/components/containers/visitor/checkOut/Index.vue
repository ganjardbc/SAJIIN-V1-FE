<template>
  <div class="w-full flex flex-col gap-4 pt-4">
    <AppEmpty v-if="dataCart.length === 0" />

    <div
      v-if="dataCart.length > 0"
      class="flex flex-col gap-4 px-4 lg:px-0"
    >
      <div class="text-lg text-black font-semibold">
        Pelanggan
      </div>

      <div class="relative p-4 rounded-lg border border-gray-300 bg-white flex flex-col gap-2">
        <div class="flex flex-col gap-4">
          <el-input
            placeholder="Nama"
            type="text"
            v-model="formOrder.customer_name"
          />

          <FieldTable
            :value="formOrder.table_id"
            @onChange="onChangeTable"
            @onClear="onClearTable"
          />
        </div>
      </div>

      <div class="text-lg text-black font-semibold">
        Produk
      </div>

      <div class="relative p-4 rounded-lg border border-gray-300 bg-white flex flex-col gap-2">
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
            v-for="(dt, index) in dataCart"
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

          <div class="grid grid-cols-3 pt-4 border-t border-gray-300">
            <div class="col-span-2">
              <div class="text-sm text-black font-semibold">
                Total ({{ orderQuantity }} produk)
              </div>
            </div>
            <div class="col-span-1">
              <div class="text-sm text-black font-semibold">
                {{ format(orderSubtotal) }}
              </div>
            </div>
            <div class="col-span-2">
              <div class="text-sm text-gray-500">Diskon</div>
            </div>
            <div class="col-span-1">
              <div class="text-sm text-gray-500">{{ format(0) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 bg-white z-10 w-full border-t border-gray-300 py-4 px-4 lg:px-0">
      <el-button
        type="primary"
        class="w-full"
        :disabled="!enableButtonCreateOrder"
        @click="onCreateOrder"
      >
        Buat Pesanan
      </el-button>
    </div>

    <AppPopupConfirmed
      v-if="visibleConfirmed"
      :title="titleConfirmed"
      @onClickNo="onClickNo"
      @onClickYes="onClickYes"
    />

    <AppPopupAlert
      v-if="visibleAlert"
      :title="titleAlert"
      :icon="iconAlert"
      @onClickOk="onClickOk"
    />

    <AppPopupLoader v-if="loading" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import AppLoader from '../../../modules/AppLoader'
import AppEmpty from '../../../modules/AppEmpty'
import AppCardAvatar from '../../../modules/AppCardAvatar'
import FieldTable from '../table/Index'

export default {
  name: 'App',
  metaInfo: {
    title: 'Visitor',
    titleTemplate: '%s | Check Out',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      visibleAlert: false,
      titleAlert: 'Gagal memproses data',
      iconAlert: 'fa fa-4x fa-info-circle',
      visibleConfirmed: false,
      visibleConfirmedDelete: false,
      titleConfirmed: 'Buat pesanan ?',
    }
  },
  components: {
    AppPopupLoader,
    AppPopupConfirmed,
    AppPopupAlert,
    AppLoader,
    AppEmpty,
    AppCardAvatar,
    FieldTable,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeVisitorOrder.form,
      formOrder: (state) => state.storeVisitorOrder.form.order,
      loading: (state) => state.storeVisitorOrder.loading,
      dataCart: (state) => state.storeVisitorOrder.form.details,
      dataShop: (state) => state.storeVisitorShop.data,
    }),
    selectedShop() {
      return this.dataShop.shop
    },
    enableButtonCreateOrder() {
      let status = false
      // this.formOrder.shop_id &&
      if (
        this.dataCart &&
        this.dataCart.length > 0 &&
        this.formOrder.customer_name
        // && this.formOrder.table_id
      ) {
        status = true
      }
      return status
    },
    orderQuantity() {
      let quantity = 0
      this.dataCart &&
        this.dataCart.map((item) => {
          quantity += item.quantity
        })
      return quantity
    },
    orderSubtotal() {
      let subtotal = 0
      this.dataCart &&
        this.dataCart.map((item) => {
          subtotal += item.subtotal
        })
      return subtotal
    },
    orderPriceBeforeDiscount() {
      let price = 0
      this.dataCart &&
        this.dataCart.map((item) => {
          let quantity = item.quantity
          price += quantity * item.price
          // HIDDEN TEMPORARY
          // if (item.is_discount) {
          //     price += quantity * item.second_price
          // } else {
          //     price += quantity * item.price
          // }
        })
      return price
    },
    totalDiscount() {
      return this.orderPriceBeforeDiscount - this.orderSubtotal
    },
    isThereDiscount() {
      let status = false
      // HIDDEN TEMPORARY
      // this.dataCart && this.dataCart.map((item) => {
      //     if (item.is_discount) {
      //         status = true
      //     }
      // })
      return status
    },
  },
  methods: {
    ...mapActions({
      setOrder: 'storeVisitorOrder/setOrder',
      resetOrder: 'storeVisitorOrder/resetOrder',
      createOrder: 'storeVisitorOrder/createOrder',
    }),

    // ORDER
    onCreateOrder() {
      const payload = {
        total_item: this.orderQuantity,
        total_price: this.orderSubtotal,
        shop: this.selectedShop,
      }
      this.setOrder(payload)
      this.visibleConfirmed = true
    },

    // ALERT
    onClickOk() {
      this.visibleAlert = false
    },

    // CONFIRMED
    onClickNo() {
      this.visibleConfirmed = false
    },
    onClickYes() {
      this.visibleConfirmed = false
      this.createOrder(this.form).then((res) => {
        const status = res.data.status
        const data = res.data.data
        // const order = res.data.data.order
        if (status === 'ok') {
          this.resetOrder()
          this.$message(`Pesanan berhasil disimpan.`)
          this.onSendNotification(data.order)
          this.$router.replace({
            name: 'visitor-order',
            params: { orderId: data.order.order_id },
          })
        } else {
          this.visibleAlert = true
          this.titleAlert = 'Gagal membuat pesanan.'
        }
      })
    },

    // SOCKET
    onSendNotification(data) {
      const shop = this.selectedShop
      const payload = {
        shopId: shop.shop_id,
        orderId: data.order_id,
        shopName: data.shop_name,
        tableName: data.table_name,
        customerName: data.customer_name,
        type: 'order',
        message: `
                    Pesanan baru 
                    ${data.customer_name ? ' atas nama ' + data.customer_name : ''} 
                    ${data.table_name ? ' di ' + data.table_name : ''}
                `,
      }
      this.$socket.emit('notification', payload)
    },

    // TABLE
    onChangeTable(data) {
      this.formOrder.table_id = data.id
      this.formOrder.table_name = data.name
      this.form.table = data
    },
    onClearTable() {
      this.formOrder.table_id = ''
      this.formOrder.table_name = ''
      this.form.table = null
    },
  },
}
</script>
