<template>
  <div class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4">
    <div class="flex flex-col md:flex-row justify-between gap-4">
      <AppCardAvatar
        :src="`${productImageThumbnailUrl}${data.image}`"
        size="small"
      />
      <div class="flex-1 flex flex-col gap-2">
        <div class="w-full flex flex-col gap-1">
          <div class="text-sm text-black font-semibold">
            {{ data.name }}
          </div>
          <AppCardCaption
            v-if="data.description"
            icon="fa fa-lg fa-info-circle"
            :caption="data.description"
          />
          <AppCardCaption
            v-if="data.price"
            icon="fa fa-lg fa-calculator"
            :caption="format(data.price)"
          />
        </div>
      </div>
    </div>

    <div class="w-full flex flex-col gap-4">
      <div class="field-group">
        <div class="flex justify-between items-center">
          <div class="field-label">Varian</div>
          <div class="field-label font-semibold">
            {{ detailProduct.length }} Item
          </div>
        </div>
        <el-select
          v-model="indexDetail"
          placeholder="Pilih satu varian"
          no-data-text="Data Tidak Ditemukan"
          :disabled="data.status === 'inactive'"
          clearable
        >
          <el-option
            v-for="item in detailProduct"
            :key="item.id"
            :label="`${item.name} : ${format(item.price)}`"
            :value="item.id"
            class="flex flex-col px-4 py-2"
            style="height: auto;"
          >
            <div class="text-sm text-gray-500" style="line-height: 1.5">
              {{ item.name }}
            </div>
            <div class="text-sm text-black font-semibold" style="line-height: 1.5">
              {{ format(item.price) }}
            </div>
          </el-option>
        </el-select>
      </div>

      <el-button
        class="w-full"
        :disabled="isButtonEnable(data)"
        @click="addToCart(data)"
      >
        <i class="mr-2 fa fa-cart-plus"></i>
        Tambah Produk
      </el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppCardCapsule from '../../../../../../modules/AppCardCapsule'
import AppCardAvatar from '../../../../../../modules/AppCardAvatar'
import AppCardCaption from '../../../../../../modules/AppCardCaption'

export default {
  data() {
    return {
      indexDetail: null,
    }
  },
  components: {
    AppCardCapsule,
    AppCardAvatar,
    AppCardCaption,
  },
  props: {
    data: null,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeOrders.form,
    }),
    detailProduct() {
      return this.data.details.map((item) => {
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
      addProduct: 'storeOrders/addProduct',
    }),
    isButtonEnable(data) {
      let status = false
      if (data.status === 'inactive') {
        status = true
      } else {
        if (data.price) {
          status = false
        } else {
          if (this.indexDetail) {
            status = false
          } else {
            status = true
          }
        }
      }
      return status
    },
    varianPrice(data) {
      const varian = this.detailProduct.find((item) => item.id === data)
      return varian ? varian.price : 0
    },
    addToCart(value) {
      const varian = this.detailProduct.find(
        (item) => item.id === this.indexDetail
      )
      const payload = {
        ...value,
        varian: varian,
      }
      this.indexDetail = null
      this.addProduct(payload)
      this.$message(`Adding ${value.name} to cart.`)
      this.$emit('addToCart', value)
    },
  },
}
</script>
