<template>
  <AppSideForm
    :value="openForm"
    title="Pembayaran"
    :enableCustomFooter="true"
    @close="onClose"
  >
    <div class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-2 p-4 bg-white rounded-lg border border-gray-200">
        <div class="w-full flex justify-between items-center">
          <div class="text-md text-black font-semibold">Pembayaran</div>
          <AppCardCapsule :data="form.payment_status ? 'paid' : 'unpaid'" />
        </div>

        <FieldPayment
          :value="form.payment_id"
          :smallField="true"
          @onChange="onChangePayment"
          @onClear="onClearPayment"
        />

        <div class="w-full flex gap-2 justify-between border-b border-dashed border-gray-200 pb-2">
          <div class="text-sm text-black font-semibold">Total</div>
          <div class="text-sm text-vermillion-500 font-semibold text-right">
            {{ format(form.total_price) }}
          </div>
        </div>

        <div class="w-full flex gap-2 justify-between">
          <div class="text-sm text-black">Diskon</div>
          <div class="text-sm text-black text-right">
            {{
              totalDiscount > 0
                ? `-${format(totalDiscount)}`
                : `${format(totalDiscount)}`
            }}
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

      <div class="w-full flex flex-col gap-2 p-4 bg-white rounded-lg border border-gray-200">
        <div class="text-md text-black font-semibold">Tagihan</div>

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

        <div class="w-full border-b border-dashed border-gray-200 pb-2">
          <AppCardPriceSuggestion @onChange="onChangeBiilsSuggestion" />
        </div>

        <div class="w-full flex gap-2 justify-between">
          <div class="text-sm text-black font-semibold">Kembali</div>
          <div class="text-sm text-vermillion-500 font-semibold text-right">
            {{ format(form.change_price) }}
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-2 p-4 bg-white rounded-lg border border-gray-200">
        <div class="text-md text-black font-semibold">Status</div>

        <div class="field-group">
          <div class="flex justify-between items-center">
            <div class="field-label">Selesaikan pesanan ini ?</div>
            <el-switch
              v-model="form.status"
              :active-value="'done'"
              :inactive-value="'new-order'"
              active-text="Selesai"
              inactive-text="Baru Masuk"
            ></el-switch>
          </div>
          <div v-if="errorMessage.status" class="field-error">
            {{ errorMessage.status && errorMessage.status[0] }}
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <el-button
        class="w-full"
        type="primary"
        :disabled="isButtonEnable"
        @click="onCreateOrder"
      >
        Buat Pesanan
      </el-button>
    </template>
  </AppSideForm>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppEmpty from '../../../../modules/AppEmpty'
import AppSideForm from '../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardPriceSuggestion from '../../../../modules/AppCardPriceSuggestion'
import InputNumber from '../../../../modules/InputNumber'
import FieldPayment from '../../payments/Field'
import FieldDiscount from '../../discounts/Field'

export default {
  name: 'App',
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  components: {
    AppEmpty,
    AppSideForm,
    AppCardCapsule,
    AppCardPriceSuggestion,
    InputNumber,
    FieldPayment,
    FieldDiscount,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeCashier.form.order,
      details: (state) => state.storeCashier.form.details,
      errorMessage: (state) => state.storeCashier.errorMessage,
      dataShop: (state) => state.storeSelectedShop.form,
    }),
    formPayment: {
      set(value) {
        this.$store.state.storeCashier.form.payment = value
      },
      get() {
        return this.$store.state.storeCashier.form.payment
      },
    },
    formDiscount: {
      // this computed was missing — without it, `this.formDiscount = data` in
      // onChangeDiscount/onClearDiscount was writing to an undeclared variable (no-op).
      set(value) {
        this.$store.state.storeCashier.form.discount = value
      },
      get() {
        return this.$store.state.storeCashier.form.discount
      },
    },
    orderQuantity() {
      return (this.details || []).reduce((sum, item) => sum + item.quantity, 0)
    },
    orderPrice() {
      return (this.details || []).reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      )
    },
    totalDiscountProduct() {
      return (this.details || []).reduce((sum, item) => {
        return item.is_discount ? sum + item.quantity * item.discount : sum
      }, 0)
    },
    isThereDiscountProduct() {
      return (this.details || []).some((item) => item.is_discount)
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
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
  },
  methods: {
    ...mapActions({
      setOrder: 'storeCashier/setOrder',
      setOrderBills: 'storeCashier/setOrderBills',
      changeDiscountOrder: 'storeCashier/changeDiscountOrder',
    }),
    onCreateOrder() {
      this.$emit('onCreateOrder')
    },
    onClose() {
      this.$emit('onClose')
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
      this.formPayment = data
    },
    onClearPayment() {
      this.form.payment_id = ''
      this.form.payment_name = ''
      this.formPayment = null
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
}
</script>
