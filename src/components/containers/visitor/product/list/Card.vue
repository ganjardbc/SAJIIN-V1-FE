<template>
  <div id="App" class="flex flex-col gap-4">
    <div
      v-for="(dt, i) in dataProduct"
      :key="i"
      class="w-full bg-white border border-gray-200 rounded-lg overflow-hidden p-4 flex flex-col gap-4"
      :class="{
        'border-gray-400': dt.status !== 'active',
        'bg-gray-100': dt.status !== 'active',
      }"
    >
      <router-link
        :to="{
          name: 'visitor-product-detail',
          params: { productId: dt.product_id },
        }"
      >
        <div class="flex gap-4 justify-between">
          <div class="flex-1 flex flex-col gap-1 overflow-hidden">
            <div class="text-sm text-black font-semibold">{{ dt.name }}</div>
            <div class="text-xs text-gray-500 truncate">
              {{ dt.description }}
            </div>
          </div>
          <AppCardAvatar
            :src="`${productImageThumbnailUrl}${dt.image}`"
            shape="square"
            size="medium"
            fit="contain"
            custom-class="shadow-none border border-gray-200"
          />
        </div>
      </router-link>

      <div class="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex-1 flex items-center justify-between gap-2">
          <AppCardCaption
            icon="fa fa-lg fa-calculator"
            :caption="
              dt.price
                ? format(dt.price)
                : dt.details.length > 0
                  ? format(dt.details[0].price)
                  : 0
            "
          />
          <div
            v-if="dt.details.length > 0"
            class="text-xs text-gray-600"
          >
            {{ dt.details.length }} Varian
          </div>
        </div>

        <el-button
          size="medium"
          :disabled="!isButtonEnable(dt)"
          @click="addToCart(dt)"
        >
          <i
            v-if="dt.status === 'active'"
            class="fa fa-lw fa-plus mr-2"
          ></i>
          {{ dt.status === 'active' ? 'Keranjang' : 'Stok Kosong' }}
        </el-button>
      </div>
    </div>

    <AddCartPopup
      v-if="visibleAddToCart"
      :data.sync="selectedData"
      @onClose="onCloseCart"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AppCardCaption from '../../../../modules/AppCardCaption'
import AppCardAvatar from '../../../../modules/AppCardAvatar'
import AddCartPopup from '../../cart/AddCartPopup'

export default {
  name: 'App',
  data() {
    return {
      selectedData: null,
      visibleAddToCart: false,
    }
  },
  components: {
    AppCardCaption,
    AppCardAvatar,
    AddCartPopup,
  },
  props: {
    data: null,
    status: null,
  },
  computed: {
    ...mapState({
      dataShop: (state) => state.storeVisitorShop.data,
    }),
    selectedShop() {
      return this.dataShop.shop
    },
    dataProduct() {
      return this.data.map((product) => {
        const details = product.details.map((item) => {
          let firstPrice = item.price
          let secondPrice = 0
          // HIDDEN TEMPORARY
          // if (item.is_discount) {
          //     secondPrice = item.price
          //     firstPrice = item.price - (item.price * (item.value_discount / 100))
          // }
          return {
            ...item,
            price: firstPrice,
            second_price: secondPrice,
          }
        })
        return {
          ...product,
          details: details,
        }
      })
    },
  },
  methods: {
    isButtonEnable(data) {
      let status = true
      if (this.selectedShop.is_digital_order_active) {
        if (data.status === 'active') {
          status = true
        } else {
          status = false
        }
      } else {
        status = false
      }
      return status
    },
    addToCart(data) {
      this.selectedData = data
      this.visibleAddToCart = true
    },
    onCloseCart() {
      this.visibleAddToCart = false
    },
  },
}
</script>
