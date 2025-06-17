<template>
  <div id="App" class="w-full flex flex-col gap-4 border-b border-gray-200 pb-4">
    <div
      v-for="(dt, index) in data"
      :key="index"
      class="w-full flex flex-col gap-4 p-4 rounded-lg border border-gray-200 bg-white"
    >
      <div class="w-full flex gap-4">
        <AppCardAvatar
          :src="`${productImageThumbnailUrl}${dt.product_image}`"
          size="small"
        />
        <div class="flex-1">
          <div class="text-sm text-black font-semibold">
            {{ dt.product_name }}
          </div>
          <div
            v-if="dt.product_detail"
            class="text-xs text-gray-500"
          >
            {{ dt.product_detail }}
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-2">
        <div class="w-full flex justify-between items-center">
          <div class="flex gap-1 items-center">
            <span class="text-sm text-black">
              {{
                format(dt.price)
              }}
            </span>
            <span
              v-if="dt.is_discount || dt.is_platform"
              class="text-xs text-gray-500 line-through"
              >{{ format(dt.second_price) }}</span
            >
          </div>
          <div class="text-sm text-vermillion-500 font-semibold text-right">
            {{ format(dt.subtotal) }}
          </div>
        </div>

        <div
          v-if="dt.is_discount || dt.is_platform"
          class="flex gap-2"
        >
          <AppCardFillSigner
            v-if="dt.is_discount"
            :label="`
              -${
                dt.discount_value_type === 'percentage'
                  ? `${dt.discount_fee}%`
                  : format(dt.discount_price)
              }
            `"
            background="bg-orange-100"
            color="text-orange-500"
          />
          <AppCardFillSigner
            v-if="dt.is_platform"
            :label="`
              +${
                dt.platform_currency_type === 'percentage'
                  ? `${dt.platform_fee}%`
                  : format(dt.platform_price)
              }
            `"
            background="bg-green-100"
            color="text-green-500"
          />
        </div>

        <div class="w-full flex gap-2">
          <el-button
            size="small"
            circle
            style="width: 32px; height: 32px"
            @click="onDelete(index)"
          >
            <i class="far fa-lw fa-trash-alt"></i>
          </el-button>

          <el-input
            v-model="dt.note"
            placeholder="Tulis catatan"
            type="text"
            size="small"
            class="flex-1"
          />

          <el-input-number
            v-model="dt.quantity"
            :min="1"
            :max="100"
            size="small"
            style="width: 110px;"
            @change="(data) => onTotal(data, index)"
          />
        </div>

        <FieldDiscount
          :value="dt.discount_id"
          :smallField="true"
          :disabledSelection="true"
          label="Diskon Produk"
          discountType="product"
          @onChange="(data) => onChangeDiscount(data, dt)"
          @onClear="onClearDiscount(dt)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppCardAvatar from '../../../../modules/AppCardAvatar'
import AddQtyField from '../../../../modules/AddQtyField'
import AppCardFillSigner from '../../../../modules/AppCardFillSigner'
import FieldDiscount from '../../discounts/Field'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardAvatar,
    AddQtyField,
    AppCardFillSigner,
    FieldDiscount,
  },
  computed: {
    ...mapState({
      formOrder: (state) => state.storeCashier.form.order,
      formPlatform: (state) => state.storeCashier.form.platform,
    }),
  },
  methods: {
    ...mapActions({
      deleteProduct: 'storeCashier/deleteProduct',
      changeQuantityProduct: 'storeCashier/changeQuantityProduct',
      changeDiscountProduct: 'storeCashier/changeDiscountProduct',
    }),
    onTotal(value, index) {
      const payload = {
        quantity: value,
        index: index,
      }
      if (value !== 0) {
        this.changeQuantityProduct(payload)
      } else {
        this.deleteProduct(index)
      }
    },
    onDelete(index) {
      this.deleteProduct(index)
    },
    onChangeDiscount(discount, product) {
      const payload = {
        current_calculation: 'discount',
        current_status: 'create',
        current_type: discount.discount_type,
        current_value: discount.discount_value,
        discount_id: discount.id,
        discount_image: discount.discount_image,
        discount_name: discount.discount_name,
        discount_description: discount.discount_description,
        discount_value: discount.discount_value,
        discount_type: discount.discount_type,
        discount_value_type: discount.discount_value_type,
        product_id: product.product_id,
        proddetail_id: product.proddetail_id,
      }
      this.changeDiscountProduct(payload)
    },
    onClearDiscount(product) {
      const payload = {
        current_calculation: 'discount',
        current_status: 'clear',
        current_type: product.discount_type,
        current_value: product.discount_value,
        discount_id: '',
        discount_image: '',
        discount_name: '',
        discount_description: '',
        discount_value: '',
        discount_type: '',
        discount_value_type: '',
        product_id: product.product_id,
        proddetail_id: product.proddetail_id,
      }
      this.changeDiscountProduct(payload)
    },
  },
}
</script>
