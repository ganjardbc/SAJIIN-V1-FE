<template>
  <AppSideForm
    :value="openForm"
    title="Edit Produk"
    :subtitle="form.order_id"
    :enableCustomFooter="true"
    @close="onClose"
  >
    <template #toolbar>
      <el-button
        size="small"
        @click="onOpenVisibleAddProduct"
      >
        Tambah
      </el-button>
    </template>

    <div class="w-full flex flex-col gap-4">
      <div class="w-full flex flex-col pb-4 border-b border-dashed border-gray-200">
        <AppEmpty v-if="form.details && form.details.length === 0" />
        <Card v-if="form.details" :data.sync="form.details" :form.sync="form" />
      </div>

      <div class="w-full p-4 bg-white border border-gray-200 rounded-lg">
        <div class="field-group">
          <div class="field-label">Platform</div>
          <FieldPlatform
            :value="form.platform_id"
            :smallField="true"
            @onChange="onChangePlatform"
            @onClear="onClearPlatform"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="w-full flex flex-col gap-4">
        <div class="p-4 bg-white border border-gray-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="text-sm text-black font-semibold">
              Total ({{ form.total_item }} produk)
            </div>
            <div class="text-sm text-black font-semibold text-right">
              {{ format(form.total_price) }}
            </div>
          </div>
          <div
            v-if="isThereDiscount"
            class="flex items-center justify-between"
          >
            <div class="text-xs text-black">Diskon</div>
            <div class="text-xs text-gray-500 font-semibold text-right">
              -{{ format(totalDiscount) }}
            </div>
          </div>
          <div
            v-if="isTherePlatform"
            class="flex items-center justify-between"
          >
            <div class="text-xs text-black">Platform</div>
            <div class="text-xs text-gray-500 font-semibold text-right">
              +{{ format(totalPlatform) }}
            </div>
          </div>
        </div>

        <el-button
          class="w-full"
          :disabled="form.details && form.details.length === 0"
          @click="onSave"
        >
          Simpan Produk
        </el-button>
      </div>
    </template>
    
    <AddProduct v-if="visibleAddProduct" @onClose="onCloseVisibleAddProduct" />
  </AppSideForm>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppSideForm from '../../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'
import AppEmpty from '../../../../../modules/AppEmpty'
import FieldPlatform from '../../../platforms/Field'
import AddProduct from './addProduct/Index'
import Card from './Card'

export default {
  name: 'App',
  data() {
    return {
      visibleAddProduct: false,
    }
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
      details: (state) => state.storeOrders.form.details,
      typeForm: (state) => state.storeOrders.typeForm,
      category: (state) => state.storeCategory.data,
    }),
    formId: {
      get() {
        return this.$store.state.storeOrders.form.id
      },
      set(value) {
        this.$store.state.storeOrders.form.id = value
      },
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
  },
  components: {
    AppCardCapsule,
    AppSideForm,
    AppEmpty,
    Card,
    AddProduct,
    FieldPlatform,
  },
  methods: {
    ...mapActions({
      changePlatformProduct: 'storeOrders/changePlatformProduct',
    }),
    isOrderStatusCanceled(data) {
      return data.status === 'canceled'
    },
    isButtonEditProductDisabled(data) {
      return data.status === 'new-order' || data.status === 'on-progress'
    },
    isButtonDoneDisabled(data) {
      return data.payment_status && data.status !== 'on-progress'
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
    onSave() {
      this.$emit('onSave')
    },
    onClose() {
      this.$emit('onClose')
    },
    onOpenVisibleAddProduct() {
      this.visibleAddProduct = true
    },
    onCloseVisibleAddProduct() {
      this.visibleAddProduct = false
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
