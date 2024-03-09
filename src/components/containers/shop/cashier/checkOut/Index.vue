<template>
  <div id="App">
    <AppSideForm
      :title="'Pembayaran'"
      :enableCustomFooter="true"
      :onClose="onClose"
    >
      <div class="right-form-body">
        <div
          class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px"
        >
          <div
            class="display-flex space-between align-center padding padding-bottom-10px"
          >
            <div class="fonts fonts-11 semibold black">Pembayaran</div>
            <AppCardCapsule :data="form.payment_status ? 'paid' : 'unpaid'" />
          </div>
          <div class="margin margin-bottom-15px">
            <FieldPayment
              :value="form.payment_id"
              :smallField="true"
              @onChange="onChangePayment"
              @onClear="onClearPayment"
            />
          </div>
          <div class="display-flex space-between">
            <div class="fonts fonts-10 semibold black">Total</div>
            <div class="fonts fonts-10 semibold main-color">
              {{ format(form.total_price) }}
            </div>
          </div>
          <div
            class="padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"
          ></div>
          <div class="display-flex space-between margin margin-bottom-15px">
            <div class="fonts fonts-10 normal grey">Diskon</div>
            <div class="fonts fonts-10 normal black">
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
        <div
          class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px"
        >
          <div class="fonts fonts-11 semibold black">Tagihan</div>
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
          <div class="padding padding-bottom-5px">
            <AppCardPriceSuggestion @onChange="onChangeBiilsSuggestion" />
          </div>
          <div
            class="padding padding-bottom-7px margin margin-bottom-15px border-bottom border-dashed"
          ></div>
          <div class="display-flex space-between">
            <div class="fonts fonts-10 semibold black">Kembali</div>
            <div class="fonts fonts-10 semibold main-color">
              {{ format(form.change_price) }}
            </div>
          </div>
        </div>
        <div
          v-if="isNonFnB"
          class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px"
        >
          <div class="fonts fonts-11 semibold black">Status</div>
          <div class="field-group">
            <div class="display-flex space-between">
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
      <div slot="footer">
        <div class="right-form-footer">
          <button
            class="btn btn-main btn-full"
            :disabled="isButtonEnable"
            @click="onCreateOrder"
          >
            Buat Pesanan
          </button>
        </div>
      </div>
    </AppSideForm>
  </div>
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
      let discount = 0
      this.details &&
        this.details.map((item) => {
          let quantity = item.quantity
          if (item.is_discount) {
            discount += quantity * item.discount
          }
        })
      return discount
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
