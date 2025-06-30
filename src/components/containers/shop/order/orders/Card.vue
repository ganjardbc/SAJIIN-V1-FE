<template>
  <div id="App" class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between gap-4"
      :class="{
        'border-2 border-orange-300': isOnProgress(dt),
        'border-2 border-blue-300': isNewOrder(dt),
      }"
    >
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center pb-4 border-b border-gray-200">
          <div class="flex-1 flex flex-col">
            <div class="text text-xs text-black font-semibold">
              {{ dt.order.order_id }}
            </div>
            <div class="text text-xs text-gray-500">
              {{ dt.order.created_at | moment('DD MMMM YYYY') }}
            </div>
          </div>
          <div class="flex flex-end items-center gap-2">
            <AppCardCapsule :data="dt.order.status" />
            <el-popover placement="bottom-end" class="flex-1" trigger="click">
              <div class="default-menu">
                <button
                  v-if="dt.order.status !== 'canceled'"
                  class="menu-item small"
                  @click="onDetail(dt)"
                >
                  <i class="icon fa fa-lw fa-align-right"></i>
                  <span class="label text-left">Detail</span>
                </button>
                <button
                  v-if="dt.order.status !== 'canceled'"
                  class="menu-item small"
                  @click="onChangeStatus(dt.order, 'canceled')"
                >
                  <i class="icon fa fa-lw fa-times"></i>
                  <span class="label text-left">Cancel</span>
                </button>
                <button
                  v-if="
                    dt.order.status === 'done' || dt.order.status === 'canceled'
                  "
                  class="menu-item small"
                  @click="onChangeStatus(dt.order, 'new-order')"
                >
                  <i class="icon fa fa-lw fa-history"></i>
                  <span class="label text-left">Re-Open</span>
                </button>
              </div>
              <el-button
                slot="reference"
                size="small"
                circle
                style="width: 32px; height: 32px;"
              >
                <i class="fa fa-lw fa-ellipsis-v"></i>
              </el-button>
            </el-popover>
          </div>
        </div>

        <el-alert
          v-if="!dt.cashbook"
          title="Non Buku Kas !"
          description="Transaksi ini tidak terdaftar di Buku Kas."
          type="warning"
          :closable="false"
          show-icon
        />

        <div class="flex flex-col gap-1">
          <div class="w-full flex justify-between items-center">
            <div class="text-sm text-black">
              Pelanggan
            </div>
            <div class="text-sm text-black font-semibold truncate text-right">
              {{ dt.order.customer_name || '-' }}
            </div>
          </div>
          <div class="w-full flex justify-between items-center">
            <div class="text-sm text-black">
              Meja
            </div>
            <div class="text-sm text-black font-semibold truncate text-right">
              {{ dt.order.table_name || '-' }}
            </div>
          </div>
          <div class="w-full flex justify-between items-center">
            <div class="text-sm text-black">
              Kasir
            </div>
            <div class="text-sm text-black font-semibold truncate text-right">
              {{ dt.order.cashier_name || '-' }}
            </div>
          </div>
        </div>

        <div class="flex flex-col py-4 gap-4 border-t border-b border-gray-200">
          <div class="w-full flex justify-between items-center">
            <div class="text-sm text-black font-semibold">
              Produk
            </div>
            <AppCardProgressProduct :data="dt.details" />
          </div>

          <CardDetail
            v-if="dt.details.length > 0"
            class="w-full"
            :data="dt.details"
            :max="1"
          />

          <el-button
            class="mx-auto rounded-full border-none"
            size="small"
            type="info"
            plain
            @click="onDetail(dt)"
          >
            <span v-if="dt.details.length > 1">
              +{{ dt.details.length - 1 }} Produk Lainnya
            </span>
            <span v-else>
              Lihat Produk
            </span>
          </el-button>
        </div>

        <div class="flex flex-col gap-2 border-b border-dashed border-gray-200 pb-4">
          <div class="w-full flex justify-between items-center">
            <div class="text-sm text-black">Total Harga</div>
            <div class="flex items-center gap-2 text-sm text-black font-semibold truncate text-right">
              <span class="text-xs text-gray-500 font-normal">
                ({{ dt.order.payment_status ? 'Dibayar' : 'Belum Bayar' }})
              </span>
              {{ format(dt.order.total_price) }}
            </div>
          </div>
          <div
            v-if="dt.order.is_discount"
            class="flex items-center justify-between gap-2"
          >
            <AppCardAvatar 
              v-if="dt.order.discount_image"
              :src="discountImageThumbnailUrl + dt.order.discount_image"
              :is-upload="false"
              size="xxsmall"
              shape="circle"
            />
            <AppCardIcon
              v-else
              size="xxsmall"
              icon="fa-percentage"
              color="text-red-500"
              shape="circle"
            />
            <div
              class="flex-1 flex items-center justify-between gap-2"
            >
              <div class="text-xs text-black">
                {{ dt.order.discount_name }}
              </div>
              <div class="text-xs text-gray-500 text-right font-semibold">
                -{{
                  dt.order.discount_value_type === 'percentage'
                    ? `${dt.order.discount_fee}%`
                    : format(dt.order.discount_price)
                }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end items-center">
        <!-- DEFAULT -->
        <el-button
          v-if="dt.order.status !== 'canceled' && dt.order.payment_status"
          size="medium"
          circle
          style="width: 36px; height: 36px;"
          @click="onReceipt(dt)"
        >
          <i class="fa fa-print"></i>
        </el-button>
        <el-button
          v-else
          size="medium"
          circle
          style="width: 36px; height: 36px;"
          @click="onCheckout(dt)"
        >
          <i class="fa fa-calculator"></i>
        </el-button>

        <el-button
          v-if="dt.order.status === 'done' || dt.order.status === 'canceled'"
          size="medium"
          class="flex-1 w-full"
          @click="onChangeStatus(dt.order, 'new-order')"
        >
          Re-Open
        </el-button>

        <!-- NON FNB -->
        <el-button
          v-if="!isNonFnB && dt.order.status === 'new-order'"
          size="medium"
          class="flex-1 w-full"
          @click="onChangeStatus(dt.order, 'on-progress')"
        >
          Terima Transaksi
        </el-button>
        <el-button
          v-if="!isNonFnB && dt.order.status === 'on-progress'"
          size="medium"
          class="flex-1 w-full"
          :disabled="isButtonOnProgressDisabled(dt)"
          @click="onChangeStatus(dt.order, 'ready')"
        >
          Siap Diantarkan
        </el-button>
        <el-button
          v-if="!isNonFnB && dt.order.status === 'ready'"
          size="medium"
          class="flex-1 w-full"
          @click="onChangeStatus(dt.order, 'delivered')"
        >
          Diterima Pelanggan
        </el-button>
        <el-button
          v-if="!isNonFnB && dt.order.status === 'delivered'"
          size="medium"
          class="flex-1 w-full"
          :disabled="!isButtonDoneDisabled(dt)"
          @click="onChangeStatus(dt.order, 'done')"
        >
          Transaksi Selesai
        </el-button>

        <!-- FNB -->
        <el-button
          v-if="isNonFnB && dt.order.status === 'new-order'"
          size="medium"
          class="flex-1 w-full"
          :disabled="!isButtonDoneDisabledNonFnB(dt)"
          @click="onChangeStatus(dt.order, 'done')"
        >
          Transaksi Selesai
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardCaption from '../../../../modules/AppCardCaption'
import AppCardProgressProduct from '../../../../modules/AppCardProgressProduct'
import AppCardAvatar from '../../../../modules/AppCardAvatar'
import AppCardIcon from '../../../../modules/AppCardIcon'
import CardDetail from './CardDetail'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardCapsule,
    AppCardCaption,
    AppCardProgressProduct,
    AppCardAvatar,
    AppCardIcon,
    CardDetail,
  },
  computed: {
    ...mapState({
      dataShop: (state) => state.storeSelectedShop.form,
    }),
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
  },
  methods: {
    ...mapActions({
      download: 'storeOrders/download',
    }),

    // OTHERS
    isButtonOnProgressDisabled(data) {
      return data.order.status !== 'on-progress'
    },
    isButtonDoneDisabled(data) {
      return data.order.payment_status && data.order.status === 'delivered'
    },
    isButtonDoneDisabledNonFnB(data) {
      return data.order.payment_status && data.order.status === 'new-order'
    },
    isNewOrder(data) {
      return data.order.status === 'new-order'
    },
    isOnProgress(data) {
      return data.order.status === 'on-progress' ||
        data.order.status === 'ready' ||
        data.order.status === 'ready' ||
        data.order.status === 'delivered'
    },

    // COVER
    onChangeCover(data) {
      this.$emit('onChangeCover', data)
    },

    // DETAIL
    onDetail(data) {
      const payload = {
        ...data.order,
        shop_image: data.shop.image,
        details: data.details,
        shop: data.shop,
        payment: data.payment,
        table: data.table,
        cashier: data.cashier,
        cashbook: data.cashbook,
        platform: data.platform,
      }
      this.$emit('onDetail', payload)
    },

    // EDIT
    onEdit(data) {
      const payload = {
        ...data.order,
        shop_image: data.shop.image,
        details: data.details,
        shop: data.shop,
        payment: data.payment,
        table: data.table,
        cashier: data.cashier,
        cashbook: data.cashbook,
        platform: data.platform,
      }
      this.$emit('onEdit', payload)
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', data)
    },

    // STATUS
    onChangeStatus(data, status) {
      const payload = {
        ...data,
        status: status,
      }
      this.$emit('onChangeStatus', payload)
    },

    // CHECKOUT
    onCheckout(data) {
      const payload = {
        ...data.order,
        shop_image: data.shop.image,
        details: data.details,
        shop: data.shop,
        payment: data.payment,
        table: data.table,
        cashier: data.cashier,
        cashbook: data.cashbook,
        platform: data.platform,
      }
      this.$emit('onCheckout', payload)
    },

    // RECEIPT
    onReceipt(data) {
      const payload = {
        ...data.order,
        shop_image: data.shop.image,
        details: data.details,
        shop: data.shop,
        payment: data.payment,
        table: data.table,
        cashier: data.cashier,
        cashbook: data.cashbook,
        platform: data.platform,
      }
      this.$emit('onReceipt', payload)
    },

    onDownloadReceipt(data) {
      console.log('onDownloadReceipt', data)
      const token = this.$cookies.get('tokenBearer')
      const order_id = data.order.order_id
      const size_x = 51
      const size_y = 200
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
  },
}
</script>
