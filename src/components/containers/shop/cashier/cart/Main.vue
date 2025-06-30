<template>
  <div id="App" class="w-full flex flex-col">
    <div class="w-full flex flex-col gap-4 p-4">
      <div class="w-full flex flex-col gap-4">
        <AppEmpty v-if="!isThereDetails" title="KERANJANG KOSONG" />
        <CardProduct v-else :data.sync="details" />
      </div>

      <div
        v-if="isThereDetails"
        class="w-full flex flex-col gap-2 p-4 rounded-lg border border-gray-200 bg-white"
      >
        <div class="field-group">
          <div class="field-label">Pelanggan</div>
          <el-input
            :placeholder="`Nama Pelanggan ${isNonFnB ? '(opsional)' : ''}`"
            type="text"
            :disabled="!isThereDetails"
            v-model="form.customer_name"
            clearable
          ></el-input>
        </div>

        <FieldTable
          v-if="!isNonFnB"
          class="margin margin-bottom-15px"
          :value="form.table_id"
          :smallField="true"
          @onChange="onChangeTable"
          @onClear="onClearTable"
        />

        <FieldPlatform
          :value="form.platform_id"
          :smallField="true"
          @onChange="onChangePlatform"
          @onClear="onClearPlatform"
        />
      </div>
    </div>

    <div class="w-full p-4 bg-white sticky bottom-0 flex flex-col gap-4 z-10 border-t border-dashed-200">
      <div class="w-full flex flex-col gap-1">
        <div class="w-full flex justify-between items-center">
          <div class="text-sm text-black font-semibold">
            Total ({{ orderQuantity }} produk)
          </div>
          <div class="text-sm text-vermillion-500 font-semibold text-right">
            {{ format(orderPrice) }}
          </div>
        </div>
        <div class="w-full flex justify-between items-center">
          <div class="text-xs text-gray-500">Diskon</div>
          <div class="text-xs text-gray-500 text-right">
            {{ format(totalDiscount) }}
          </div>
        </div>
        <div class="w-full flex justify-between items-center">
          <div class="text-xs text-gray-500">Platform</div>
          <div class="text-xs text-gray-500 text-right">
            {{ format(totalPlatform) }}
          </div>
        </div>
      </div>

      <div class="w-full flex gap-1">
        <el-button
          class="w-full"
          :disabled="isButtonEnable"
          @click="onCreateOrder"
        >
          Buat Pesanan
        </el-button>
        <el-button
          class="w-full"
          type="primary"
          :disabled="isButtonEnable"
          @click="onCheckOut"
        >
          Pembayaran
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppEmpty from '../../../../modules/AppEmpty'
import AppCardCollapse from '../../../../modules/AppCardCollapse'
import FieldPlatform from '../../platforms/Field'
import FieldTable from '../../tables/Field'
import CardProduct from './CardProduct'

export default {
  name: 'App',
  components: {
    AppEmpty,
    AppCardCollapse,
    FieldPlatform,
    FieldTable,
    CardProduct,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeCashier.form.order,
      errorMessage: (state) => state.storeCashier.errorMessage,
      details: (state) => state.storeCashier.form.details,
      dataCurrent: (state) => state.storeCashBook.dataCurrent,
      dataShop: (state) => state.storeSelectedShop.form,
    }),
    formTable: {
      set(value) {
        this.$store.state.storeCashier.form.table = value
      },
      get() {
        return this.$store.state.storeCashier.form.table
      },
    },
    formPlatform: {
      set(value) {
        this.$store.state.storeCashier.form.platform = value
      },
      get() {
        return this.$store.state.storeCashier.form.platform
      },
    },
    formDiscount: {
      set(value) {
        this.$store.state.storeCashier.form.discount = value
      },
      get() {
        return this.$store.state.storeCashier.form.discount
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
    totalDiscount() {
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
    isThereDiscount() {
      let status = false
      this.details &&
        this.details.map((item) => {
          if (item.is_discount) {
            status = true
          }
        })
      return status
    },
    totalPlatform() {
      let platform = 0
      this.details &&
        this.details.map((item) => {
          let quantity = item.quantity
          if (item.is_platform) {
            platform += quantity * item.platform
          }
        })
      return platform
    },
    isTherePlatform() {
      let status = false
      this.details &&
        this.details.map((item) => {
          if (item.is_platform) {
            status = true
          }
        })
      return status
    },
    isThereDetails() {
      return this.details.length > 0
    },
    isButtonEnable() {
      let status = false
      if (this.details.length === 0) {
        status = true
      }
      if (!this.form.customer_name && !this.isNonFnB) {
        status = true
      }
      return status
    },
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
    getShopData() {
      return this.dataCurrent && this.dataCurrent.shop
    },
    getUserData() {
      return this.$cookies.get('user')
    },
  },
  methods: {
    ...mapActions({
      setOrder: 'storeCashier/setOrder',
      changePlatformProduct: 'storeCashier/changePlatformProduct',
    }),
    onCreateOrder() {
      const payload = {
        user: this.getUserData,
        shop: this.getShopData,
        total_item: this.orderQuantity,
        total_price: this.orderPrice,
        status: this.isNonFnB ? 'new-order' : 'on-progress',
      }
      this.setOrder(payload)
      this.$emit('onCreateOrder')
    },
    onCheckOut() {
      const payload = {
        user: this.getUserData,
        shop: this.getShopData,
        total_item: this.orderQuantity,
        total_price: this.orderPrice,
      }
      this.setOrder(payload)
      this.$emit('onCheckOut')
    },

    // TABLE
    onChangeTable(data) {
      this.form.table_id = data.id
      this.form.table_name = data.name
      this.formTable = data
    },
    onClearTable() {
      this.form.table_id = ''
      this.form.table_name = ''
      this.formTable = null
    },

    // PLATFORM
    onChangePlatform(data) {
      this.form.platform_id = data.id
      this.form.platform_name = data.name
      this.form.platform_fee = data.order_fee
      this.form.platform_type = data.order_type
      this.form.platform_currency_type = data.currency_type
      this.form.platform_image = data.image
      this.form.is_platform = true
      this.formPlatform = data
      const payload = {
        current_calculation: 'platform',
        current_status: 'create',
        current_value: this.form.platform_fee,
        current_type: this.form.platform_currency_type,
        platform_id: this.form.platform_id,
        platform_name: this.form.platform_name,
        platform_fee: this.form.platform_fee,
        platform_type: this.form.platform_type,
        platform_currency_type: this.form.platform_currency_type,
        platform_image: this.form.platform_image,
      }
      this.changePlatformProduct(payload)
    },
    onClearPlatform() {
      const currentValue = this.form.platform_fee
      this.form.platform_id = ''
      this.form.platform_name = ''
      this.form.platform_fee = ''
      this.form.platform_type = ''
      this.form.platform_currency_type = ''
      this.form.platform_image = ''
      this.form.is_platform = false
      this.formPlatform = null
      const payload = {
        current_calculation: 'platform',
        current_status: 'clear',
        current_value: currentValue,
        current_type: this.form.platform_currency_type,
        platform_id: this.form.platform_id,
        platform_name: this.form.platform_name,
        platform_fee: this.form.platform_fee,
        platform_type: this.form.platform_type,
        platform_currency_type: this.form.platform_currency_type,
        platform_image: this.form.platform_image,
      }
      this.changePlatformProduct(payload)
    },
  },
}
</script>
