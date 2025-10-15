<template>
  <div id="App" class="w-full flex flex-col gap-4">
    <div
      v-for="(dt, index) in data"
      :key="index"
      class="w-full p-4 bg-white border border-gray-200 rounded-lg"
    >
      <div class="w-full flex flex-col gap-4">
        <div class="w-full flex flex-col md:flex-row justify-between gap-4">
          <AppCardAvatar
            :src="productImageThumbnailUrl + dt.product_image"
            size="small"
          />
          <div class="flex-1 flex justify-between gap-4">
            <div class="flex-1 flex flex-col">
              <div class="text-sm text-black font-semibold flex items-center gap-2">
                {{ dt.product_name }}
                <AppCardCapsule :data="dt.status" />
              </div>
              <div
                v-if="dt.product_detail"
                class="text-xs text-gray-500"
              >
                {{ dt.product_detail }}
              </div>
            </div>
            <el-button
              size="small"
              circle
              style="width: 32px; height: 32px"
              @click="onDelete(index)"
            >
              <i class="far fa-lw fa-trash-alt"></i>
            </el-button>
          </div>
        </div>

        <div class="flex-1 flex flex-col gap-1">
          <div class="flex justify-between items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="text-sm text-black font-semibold">
                {{ format(dt.price) }}
              </div>
              <div
                v-if="dt.is_discount || dt.is_platform"
                class="text-xs text-gray-500 line-through"
              >
                {{ format(dt.second_price) }}
              </div>
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
        </div>

        <div class="w-full flex flex-col gap-2">
          <el-input
            v-model="dt.note"
            placeholder="Tulis catatan"
            type="text"
            class="w-full"
          />

          <el-input-number
            v-model="dt.quantity"
            :min="1"
            :max="100"
            class="w-full"
            @change="(data) => onTotal(data, index)"
          />

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
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import AppCardAvatar from '../../../../../modules/AppCardAvatar'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'
import AppCardFillSigner from '../../../../../modules/AppCardFillSigner'
import FieldDiscount from '../../../discounts/Field'

export default {
  name: 'App',
  props: {
    data: null,
    form: null,
  },
  components: {
    AppCardAvatar,
    AppCardCapsule,
    AppCardFillSigner,
    FieldDiscount,
  },
  methods: {
    ...mapActions({
      deleteProduct: 'storeOrders/deleteProduct',
      changeQuantityProduct: 'storeOrders/changeQuantityProduct',
      changeDiscountProduct: 'storeOrders/changeDiscountProduct',
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
