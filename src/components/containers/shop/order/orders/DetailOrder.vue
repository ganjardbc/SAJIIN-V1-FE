<template>
  <AppSideForm
    :value="openForm"
    title="Detail Transaksi"
    :subtitle="form.order_id"
    :enableCustomFooter="true"
    @close="onClose"
  >
    <template v-if="isActiveOrder(form)" #toolbar>
      <el-button
        size="small"
        @click="onChangeStatus(form, 'canceled')"
      >
        Cancel
      </el-button>
    </template>

    <div class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-4 pb-4 border-b border-gray-200">
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 text-sm text-black font-semibold">
              {{ form.shop_name ? form.shop_name : '-' }}
            </div>
            <AppCardAvatar
              :src="`${shopImageThumbnailUrl}${form.shop_image}`"
              size="small"
              fit="contain"
            />
          </div>
          <div class="w-full flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">ID Transaksi</div>
              <div class="text-sm text-black font-semibold text-right">
                {{ form.order_id }}
              </div>
            </div>
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">Status Transaksi</div>
              <AppCardCapsule :data="form.status" />
            </div>
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">Tgl Transaksi</div>
              <div class="text-sm text-black font-semibold text-right">
                {{ form.created_at | moment('dddd, DD MMM YYYY') }}
              </div>
            </div>
            <div v-if="form.cashbook" class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">Buku Kas</div>
              <div class="text-sm text-black font-semibold text-right">
                {{
                  form.cashbook &&
                  form.cashbook.cash_date | moment('dddd, DD MMM YYYY')
                }}
              </div>
            </div>
            <div v-if="form.cashier_name" class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">Kasir</div>
              <div class="text-sm text-black font-semibold text-right">
                {{ form.cashier_name || '-' }}
              </div>
            </div>
            <div v-if="form.customer_name" class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">Pelanggan</div>
              <div class="text-sm text-black font-semibold text-right">
                {{ form.customer_name || '-' }}
              </div>
            </div>
            <div v-if="form.table_name" class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">Meja</div>
              <div class="text-sm text-black font-semibold text-right">
                {{ form.table_name || '-' }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2 pt-4 border-t border-dashed border-gray-200">
          <div class="text-xs text-gray-500">
            Kamu masih bisa merubah data transaksi selama status transaksi belum
            "Selesai".
          </div>
          <el-button
            class="w-full"
            :disabled="!isButtonCustomerDisabled(form)"
            @click="onCustomer(form)"
          >
            Edit Transaksi
          </el-button>
        </div>
      </div>

      <div class="w-full flex flex-col gap-4 pb-4 border-b border-gray-200">
        <div class="flex items-center justify-between gap-2">
          <div class="flex-1 text-sm text-black font-semibold">Produk</div>
          <AppCardProgressProduct :data="form.details" />
        </div>

        <CardDetail
          class="w-full pb-4 border-b border-dashed border-gray-200"
          :data="form.details"
        />

        <div class="flex flex-col gap-2">
          <div class="text-xs text-gray-500">
            Kamu masih bisa merubah data produk selama status transaksi belum
            "Selesai" dan status pembayaran adalah "Belum Bayar".
          </div>
          <el-button
            class="w-full"
            :disabled="!isButtonEditDisabled(form)"
            @click="onProduct(form)"
          >
            Edit Produk
          </el-button>
        </div>
      </div>

      <div class="w-full flex flex-col gap-4">
        <div class="w-full flex flex-col gap-4 pb-4 border-b border-dashed border-gray-200">
          <div class="flex flex-col gap-2">
            <div class="flex-1 text-sm text-black font-semibold">Pembayaran</div>
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">Status</div>
              <AppCardCapsule :data="form.payment_status ? 'paid' : 'unpaid'" />
            </div>
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">Metode</div>
              <div v-if="form.payment && form.payment_id" class="flex items-center gap-2">
                <AppCardAvatar
                  v-if="form.payment.image"
                  :src="`${paymentImageThumbnailUrl}${form.payment.image}`"
                  size="xxsmall"
                  shape="circle"
                />
                <AppCardIcon 
                  v-else
                  size="xxsmall"
                  icon="fa-credit-card"
                  color="text-vermillion-500"
                  shape="circle"
                />
                <div class="text-sm text-black font-semibold text-right">
                  {{ form.payment_name }}
                </div>
              </div>
              <div v-else class="text-sm text-black font-semibold text-right">-</div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex-1 text-sm text-black font-semibold">Tagihan</div>
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm text-black">
                Total ({{ form.total_item }} produk)
              </div>
              <div class="text-sm text-black font-semibold text-right">
                {{ format(form.total_price) }}
              </div>
            </div>
            <div
              v-if="form.is_discount"
              class="flex items-center justify-between gap-2"
            >
              <AppCardAvatar 
                v-if="form.discount_image"
                :src="discountImageThumbnailUrl + form.discount_image"
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
                  {{ form.discount_name }}
                </div>
                <div class="text-xs text-gray-500 text-right font-semibold">
                  -{{
                    form.discount_value_type === 'percentage'
                      ? `${form.discount_fee}%`
                      : format(form.discount_price)
                  }}
                </div>
              </div>
            </div>
            <div
              v-if="isThereDiscountProduct || isThereDiscountTransaction"
              class="flex items-center justify-between gap-2"
            >
              <div class="text-sm text-black">Total Diskon</div>
              <div class="text-sm text-black font-semibold text-right">
                -{{ format(totalDiscount) }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="pb-4 border-b border-dashed border-gray-200">
          <div class="flex items-center justify-between gap-2">
            <div class="text-sm text-black">Bayar</div>
            <div class="text-sm text-black font-semibold text-right">
              {{ format(form.bills_price) }}
            </div>
          </div>
          <div class="flex items-center justify-between gap-2">
            <div class="text-sm text-black">Kembali</div>
            <div class="text-sm text-black font-semibold text-right">
              {{ format(form.change_price) }}
            </div>
          </div>
        </div>

        <div
          v-if="form.status !== 'canceled' && !form.payment_status"
          class="flex flex-col gap-2"
        >
          <div class="text-xs text-gray-500">
            Kamu bisa melakukan pembayaran untuk transaksi ini.
          </div>
          <el-button class="w-full" @click="onCheckout(form)">
            Lakukan Pembayaran
          </el-button>
        </div>

        <div
          v-if="form.status !== 'canceled' && form.payment_status"
          class="flex flex-col gap-2"
        >
          <div class="text-xs text-gray-500">
            Kamu bisa download/print nota untuk transaksi ini.
          </div>
          <el-button class="w-full" @click="onReceipt(form)">
            Nota Transaksi
          </el-button>
        </div>
      </div>
    </div>

    <template #footer>
      <div v-if="!isNonFnB" class="w-full">
        <el-button
          v-if="form.status === 'new-order'"
          class="w-full"
          @click="onChangeStatus(form, 'on-progress')"
        >
          Terima Transaksi
        </el-button>
        <el-button
          v-if="form.status === 'on-progress'"
          :disabled="isButtonOnProgressDisabled(form)"
          class="w-full"
          @click="onChangeStatus(form, 'ready')"
        >
          Siap Diantarkan
        </el-button>
        <el-button
          v-if="form.status === 'ready'"
          class="w-full"
          @click="onChangeStatus(form, 'delivered')"
        >
          Transaksi Diterima
        </el-button>
        <el-button
          v-if="form.status === 'delivered'"
          :disabled="!isButtonDoneDisabled(form)"
          class="w-full"
          type="success"
          @click="onChangeStatus(form, 'done')"
        >
          Transaksi Selesai
        </el-button>
      </div>
      <el-button
        v-if="form.status === 'done' || form.status === 'canceled'"
        class="w-full"
        @click="onChangeStatus(form, 'new-order')"
      >
        Re-open Transaksi
      </el-button>
      <el-button
        v-if="isNonFnB && form.status === 'new-order'"
        :disabled="!isButtonDoneDisabledNonFnB(form)"
        class="w-full"
        type="success"
        @click="onChangeStatus(form, 'done')"
      >
        Transaksi Selesai
      </el-button>
    </template>
  </AppSideForm>
</template>

<script>
import { mapState } from 'vuex'
import AppSideForm from '../../../../modules/AppSideForm'
import AppCardAvatar from '../../../../modules/AppCardAvatar'
import AppCardIcon from '../../../../modules/AppCardIcon'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppImage from '../../../../modules/AppImage'
import AppTabs from '../../../../modules/AppTabs'
import AppCardProgressProduct from '../../../../modules/AppCardProgressProduct'
import CardDetail from './CardDetail'

export default {
  name: 'App',
  data() {
    return {}
  },
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  mounted() {
    this.selectedIndex = 0
  },
  watch: {
    formId() {
      this.selectedIndex = 0
    },
  },
  computed: {
    ...mapState({
      form: (state) => state.storeOrders.form,
      errorMessage: (state) => state.storeOrders.errorMessage,
      typeForm: (state) => state.storeOrders.typeForm,
      category: (state) => state.storeCategory.data,
      dataShop: (state) => state.storeSelectedShop.form,
    }),
    formId: {
      get() {
        return this.$store.state.storeOrders.form.id
      },
      set(value) {
        this.$store.state.storeOrders.form.id = value
      },
    },
    getCover() {
      return this.form.image
        ? this.productImageThumbnailUrl + this.form.image
        : ''
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
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
  },
  components: {
    AppCardCapsule,
    AppCardAvatar,
    AppCardIcon,
    AppSideForm,
    AppImage,
    AppTabs,
    AppCardProgressProduct,
    CardDetail,
  },
  methods: {
    isOrderStatusCanceled(data) {
      return data.status === 'canceled'
    },
    isButtonEditDisabled(data) {
      return (
        !data.payment_status &&
        (data.status === 'new-order' || data.status === 'on-progress')
      )
    },
    isButtonCustomerDisabled(data) {
      return data.status === 'new-order' || data.status === 'on-progress'
    },
    isButtonOnProgressDisabled(data) {
      return data.status !== 'on-progress'
    },
    isButtonDoneDisabled(data) {
      return data.payment_status && data.status === 'delivered'
    },
    isButtonDoneDisabledNonFnB(data) {
      return data.payment_status && data.status === 'new-order'
    },
    isOrderStatusDC(data) {
      return data.status === 'done' || data.status === 'canceled'
    },
    isActiveOrder(data) {
      let status = false
      if (data.status === 'new-order') status = true
      if (data.status === 'on-progress') status = true
      return status
    },
    onChangeTabs(data) {
      this.selectedIndex = data
    },
    uploadImage(data) {
      this.$emit('uploadImage', data)
    },
    removeImage(data) {
      this.$emit('removeImage', data)
    },
    onSave() {
      this.$emit('onSave')
    },
    onClose() {
      this.$emit('onClose')
    },
    onChangeStatus(data, status) {
      const payload = {
        ...data,
        status: status,
      }
      this.$emit('onChangeStatus', payload)
    },
    onCheckout(data) {
      this.$emit('onCheckout', data)
    },
    onReceipt(data) {
      this.$emit('onReceipt', data)
    },
    onProduct(data) {
      this.$emit('onProduct', data)
    },
    onCustomer(data) {
      this.$emit('onCustomer', data)
    },
  },
}
</script>
