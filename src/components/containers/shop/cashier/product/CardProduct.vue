<template>
  <div id="App" class="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="(item, i) in data"
      :key="i"
      class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
    >
      <div
        class="w-full rounded-lg border border-gray-200"
        :style="{
          paddingBottom: '100%',
          backgroundImage: `url(${productImageThumbnailUrl}${item.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      />

      <div class="w-full flex flex-col gap-1">
        <div class="text-sm text-black font-semibold">
          {{ item.name }}
        </div>
        <div class="w-full flex justify-between items-center">
          <div
            v-if="item.price"
            class="text-xs text-gray-500"
          >
            {{ format(item.price) }}
          </div>
          <div
            v-if="item.details && item.details.length > 0"
            class="text-xs text-gray-500 text-right"
          >
            {{ item.details.length }} Varian
          </div>
        </div>
      </div>

      <el-button
        class="w-full"
        :disabled="isButtonEnable(item)"
        @click="openPopupCart(item)"
      >
        <i class="mr-2 fa fa-plus"></i>
        Keranjang
      </el-button>
    </div>

    <AddCartPopup
      v-if="visiblePopup"
      :data.sync="selectedData"
      @onClose="closePopupCart"
      @onAddProduct="onAddProduct"
    />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import AddCartPopup from '../cart/AddCartPopup'
import AppCardCollapse from '../../../../modules/AppCardCollapse'

export default {
  name: 'App',
  data() {
    return {
      visiblePopup: false,
      selectedData: null,
    }
  },
  components: {
    AddCartPopup,
    AppCardCollapse,
  },
  props: {
    data: null,
  },
  computed: {
    detailProduct() {
      return this.selectedData.details.map((item) => {
        let firstPrice = item.price
        let secondPrice = 0
        return {
          ...item,
          price: firstPrice,
          second_price: secondPrice,
        }
      })
    },
  },
  methods: {
    ...mapActions({
      addProduct: 'storeCashier/addProduct',
    }),
    isButtonEnable(data) {
      let status = false
      if (data.status === 'inactive') {
        status = true
      } else {
        status = false
      }
      return status
    },
    openPopupCart(value) {
      this.selectedData = value
      this.visiblePopup = true
    },
    closePopupCart() {
      this.selectedData = null
      this.visiblePopup = false
    },
    onAddProduct(value) {
      let payload = {
        ...value,
        second_price: value.price,
      }
      const varian = this.detailProduct.find(
        (item) => item.id === value.proddetail_id
      )
      if (varian !== undefined) {
        payload = {
          ...value,
          varian: {
            ...varian,
            second_price: varian.price,
          },
        }
      }
      this.addProduct(payload)
      this.closePopupCart()
      this.$message(`${value.name} berhasil ditambahkan.`)
    },
  },
}
</script>
