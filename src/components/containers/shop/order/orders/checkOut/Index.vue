<template>
  <AppSideForm
    :value="openForm"
    title="Detail Transaksi"
    :subtitle="form.order_id"
    :enableCustomFooter="true"
    @close="onClose"
  >
    <div class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-2 pb-4 border-b border-dashed border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex-1 text-sm text-black font-semibold">Pembayaran</div>
          <AppCardCapsule :data="form.payment_status ? 'paid' : 'unpaid'" />
        </div>
        <FieldPayment
          :value="form.payment_id"
          :smallField="true"
          @onChange="onChangePayment"
          @onClear="onClearPayment"
        />
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm text-black">
            Total ({{ form.total_item }} produk)
          </div>
          <div class="text-sm text-vermillion-500 font-semibold text-right">
            {{ format(form.total_price) }}
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-2 pb-4 border-b border-gray-200">
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm text-black">Diskon</div>
          <div class="text-sm text-vermillion-500 font-semibold text-right">
            {{ format(totalDiscount) }}
          </div>
        </div>
        <FieldDiscount
          :value="form.discount_id"
          :smallField="true"
          :disabledSelection="true"
          label="Tambah Diskon Transaksi"
          discountType="transaction"
          @onChange="onChangeDiscount"
          @onClear="onClearDiscount"
        />
      </div>

      <div class="w-full flex flex-col gap-2 pb-4 border-b border-dashed border-gray-200">
        <div class="flex-1 text-sm text-black font-semibold">Tagihan</div>
        <div class="field-group">
          <div class="field-label">Bayar</div>
          <input-number
            class="width width-100"
            v-model="form.bills_price"
            thousand-separated
            :min="0"
            placeholder="0"
            @input="onChangeBills"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.bills_price" class="field-error">
            {{ errorMessage.bills_price && errorMessage.bills_price[0] }}
          </div>
        </div>
        <AppCardPriceSuggestion
          @onChange="onChangeBiilsSuggestion"
        />
      </div>

      <div class="w-full flex flex-col gap-2">
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm text-black">Kembali</div>
          <div class="text-sm text-vermillion-500 font-semibold text-right">
            {{ format(form.change_price) }}
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="w-full flex flex-col gap-4">
        <div class="field-group">
          <div class="field-label">Status Transaksi</div>
          <div class="flex justify-between items-center gap-2">
            <div class="field-caption">
              Apakah transaksi ini sudah "Selesai" ?
            </div>
            <el-switch
              v-model="form.status"
              :disabled="isButtonEnable"
              :active-value="'done'"
              :inactive-value="isNonFnB ? 'new-order' : 'on-progress'"
            ></el-switch>
          </div>
        </div>

        <el-button
          class="w-full"
          type="primary"
          :disabled="isButtonEnable"
          @click="onCreateOrder"
        >
          Simpan Transaksi
        </el-button>
      </div>
    </template>
  </AppSideForm>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppSideForm from '../../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'
import AppCardPriceSuggestion from '../../../../../modules/AppCardPriceSuggestion'
import InputNumber from '../../../../../modules/InputNumber'
import FieldPayment from '../../../payments/Field'
import FieldDiscount from '../../../discounts/Field'

export default {
  name: 'App',
  data() {
    return {
      title: 'Pembayaran',
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
    AppSideForm,
    AppCardCapsule,
    AppCardPriceSuggestion,
    InputNumber,
    FieldPayment,
    FieldDiscount,
  },
  methods: {
    ...mapActions({
      setOrderBills: 'storeOrders/setOrderBills',
      changeDiscountOrder: 'storeOrders/changeDiscountOrder',
    }),
    onClose() {
      this.$emit('onClose')
    },
    onCreateOrder() {
      this.$emit('onCreateOrder')
    },
    onChangeBiilsSuggestion(data) {
      this.form.bills_price = data
      this.setOrderBills(data)
    },
    onChangeBills(data) {
      this.form.bills_price = data
      this.setOrderBills(data)
    },

    // PAYMENT
    onChangePayment(data) {
      this.form.payment_id = data.id
      this.form.payment_name = data.name
      this.form.payment = data
    },
    onClearPayment() {
      this.form.payment_id = ''
      this.form.payment_name = ''
      this.form.payment = null
    },

    // DISCOUNT
    onChangeDiscount(data) {
      this.form.discount_id = data.id
      this.form.discount_name = data.discount_name
      this.form.discount_description = data.discount_description
      this.form.discount_value = data.discount_value
      this.form.discount_type = data.discount_type
      this.form.discount_value_type = data.discount_value_type
      this.form.discount_image = data.discount_image
      this.form.is_discount = true
      this.formDiscount = data
      const payload = {
        current_calculation: 'discount',
        current_status: 'create',
        current_type: this.form.discount_type,
        current_value: this.form.discount_value,
        discount_value: this.form.discount_value,
        discount_type: this.form.discount_type,
        discount_value_type: this.form.discount_value_type,
      }
      this.changeDiscountOrder(payload)
    },
    onClearDiscount() {
      const currentType = this.form.discount_type
      const currentValue = this.form.discount_value
      this.form.discount_id = ''
      this.form.discount_name = ''
      this.form.discount_description = ''
      this.form.discount_value = ''
      this.form.discount_type = ''
      this.form.discount_value_type = ''
      this.form.discount_image = ''
      this.form.is_discount = false
      this.formDiscount = null
      const payload = {
        current_calculation: 'discount',
        current_status: 'clear',
        current_type: currentType,
        current_value: currentValue,
        discount_value: this.form.discount_value,
        discount_type: this.form.discount_type,
        discount_value_type: this.form.discount_value_type,
      }
      this.changeDiscountOrder(payload)
    },
  },
  computed: {
    ...mapState({
      form: (state) => state.storeOrders.form,
      errorMessage: (state) => state.storeOrders.errorMessage,
      details: (state) => state.storeOrders.form.details,
      dataShop: (state) => state.storeSelectedShop.form,
    }),
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
    orderQuantity() {
      let quantity = 0
      this.details &&
        this.details.map((item) => {
          quantity += item.quantity
        })
      return quantity
    },
    orderPrice() {
      let price = 0
      this.details &&
        this.details.map((item) => {
          let quantity = item.quantity
          price += quantity * item.price
        })
      return price
    },
    totalDiscountProduct() {
      let price = 0
      this.details &&
        this.details.map((item) => {
          let quantity = item.quantity
          if (item.is_discount) {
            price += quantity * item.discount_price
          }
        })
      return price
    },
    isThereDiscountProduct() {
      let status = false
      this.details &&
        this.details.map((item) => {
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
    isButtonEnable() {
      let status = false
      if (!this.form.payment_id) {
        status = true
      }
      if (!this.form.bills_price) {
        status = true
      }
      if (this.form.change_price < 0) {
        status = true
      }
      return status
    },
  },
}
</script>
