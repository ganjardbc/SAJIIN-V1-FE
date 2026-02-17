<template>
  <div class="w-full flex flex-col gap-4">
    <div
      v-for="(dt, index) in data"
      :key="index"
      class="relative bg-white p-4 border border-gray-200 rounded-lg flex flex-col gap-4"
    >
      <div class="flex flex-row justify-between gap-4">
        <AppCardAvatar
          :src="`${productImageThumbnailUrl}${dt.product_image}`"
          shape="square"
          size="medium"
          fit="contain"
          custom-class="shadow-none border border-gray-200"
        />

        <div class="flex-1 flex-col gap-1">
          <div class="text-sm text-black font-semibold">{{ dt.product_name }}</div>
          <div class="text-sm text-gray-500" style="margin-bottom: 3px">
            {{ dt.product_detail }}
          </div>
          <div class="flex items-center justify-between">
            <div class="text-sm text-black font-semibold">
              {{ format(dt.price) }}
            </div>
            <div class="text-sm text-vermillion-500 font-semibold text-right">
              {{ format(dt.subtotal) }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div class="w-full lg:w-1/3 flex items-center gap-4">
          <el-input
            placeholder="Tulis catatan"
            type="text"
            v-model="dt.note"
          />
        </div>
        <div class="w-full lg:w-1/3 flex items-center gap-4">
          <el-button
            class="px-4"
            square
            @click="onDelete(index)"
          >
            <i class="far fa-lw fa-trash-alt"></i>
          </el-button>
          <el-input-number
            v-model="dt.quantity"
            @change="(data) => onTotal(data, index)"
            :min="0"
            :max="100"
            style="width: 100%"
          ></el-input-number>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import AppCardAvatar from '../../../modules/AppCardAvatar'

export default {
  name: 'App',
  components: {
    AppCardAvatar,
  },
  props: {
    data: null,
  },
  methods: {
    ...mapActions({
      deleteProduct: 'storeVisitorOrder/deleteProduct',
      changeQuantityProduct: 'storeVisitorOrder/changeQuantityProduct',
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
      this.$message(`Product removed from cart.`)
    },
  },
}
</script>
