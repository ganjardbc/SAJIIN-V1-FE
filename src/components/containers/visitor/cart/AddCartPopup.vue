<template>
  <AppCardPopup title="Tambah Ke Keranjang" @onClose="onClose">
    <div class="w-full flex flex-col gap-4">
      <div class="field-group">
        <div class="w-full flex justify-between gap-4">
          <div class="flex-1 flex flex-col">
            <div class="text-sm text-black font-semibold">
              {{ data.name }}
            </div>
            <div class="text-sm text-gray-500">
              {{
                detailSelected
                  ? format(varianPrice(detailSelected))
                  : data.price
                    ? format(data.price)
                    : ''
              }}
            </div>
          </div>
          <AppCardAvatar
            :src="`${productImageThumbnailUrl}${data.image}`"
            shape="square"
            size="medium"
            fit="contain"
            custom-class="shadow-none border border-gray-200"
          />
        </div>
      </div>

      <div
        v-if="data.details && data.details.length > 0 ? true : false"
        class="field-group"
        style="padding-bottom: 0"
      >
        <div class="field-label">Varian</div>
        <div class="flex flex-wrap gap-4">
          <div
            v-for="(dt, index) in data.details"
            :key="index"
            class="flex justify-center gap-2 py-2 px-3 rounded-lg border border-gray-200 cursor-pointer"
            :class="{
              'bg-vermillion-100 border-vermillion-500': detailSelected === dt.id,
              'bg-gray-100 border-gray-200 cursor-not-allowed': dt.status === 'active' && !dt.is_available
            }"
            @click="onChangeDetail(dt.id)"
          >
            <div
              class="rounded-full bg-vermillion-100 flex items-center justify-center"
              style="width: 30px; height: 30px"
            >
              <i class="text-sm text-vermillion-500 fa fa-1x fa-box" />
            </div>
            <div class="flex-1 flex flex-col gap-1">
              <div class="text-md text-black">{{ dt.name }}</div>
              <div class="flex items-center gap-1">
                <span class="text-md text-vermillion-500 font-semibold">{{ format(dt.price) }}</span>
                <span v-if="dt.is_discount" class="text-sm text-gray-500 line-through">{{ format(dt.second_price) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- <ul class="menu-capsule">
          <li
            v-for="(dt, index) in data.details"
            :key="index"
            :class="
              data.status === 'active'
                ? dt.is_available
                  ? detailSelected === dt.id
                    ? 'enable'
                    : ''
                  : 'disable'
                : 'disable'
            "
            @click="onChangeDetail(dt.id)"
          >
            <div class="row">
              <div style="width: 25px">
                <i class="icn fa fa-1x fa-utensils" />
              </div>
              <div>
                <div class="ttl">{{ dt.name }}</div>
                <div class="val">
                  <span class="fonts fonts-10 black semibold">{{
                    format(dt.price)
                  }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul> -->
      </div>

      <div class="field-group">
        <div class="field-label">Jumlah</div>
        <el-input-number
          v-model="form.quantity"
          :min="0"
          :max="100"
          style="width: 100%"
          :disabled="data.status === 'inactive' || !form.price"
        ></el-input-number>
      </div>

      <div class="field-group">
        <div class="flex items-center justify-between">
          <div class="text-sm text-black font-semibold">
            Total ({{ orderQuantity }} produk)
          </div>
          <div class="text-sm text-vermillion-500 font-semibold">
            {{ format(orderPrice) }}
          </div>
        </div>
        <el-button
          class="w-full"
          type="primary"
          :disabled="enableButtonAddProduct || !form.price"
          @click="onAddProduct"
        >
          Tambah Ke Keranjang
        </el-button>
      </div>
    </div>
  </AppCardPopup>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppCardPopup from '../../../modules/AppCardPopup'
import AppCardAvatar from '../../../modules/AppCardAvatar'

export default {
  name: 'App',
  data() {
    return {
      detailSelected: null,
    }
  },
  mounted() {
    this.onChangeDetail(null)
  },
  components: {
    AppCardPopup,
    AppCardAvatar,
  },
  props: {
    data: null,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeVisitorOrder.formProduct,
      dataShop: (state) => state.storeVisitorShop.data,
    }),
    selectedShop() {
      return this.dataShop.shop
    },
    enableButtonAddProduct() {
      let status = false
      if (this.data.status === 'inactive') {
        status = true
      }
      if (this.form.quantity === 0) {
        status = true
      }
      if (!this.form.price) {
        status = true
      }
      return status
    },
    orderQuantity() {
      return this.form.quantity
    },
    orderPrice() {
      this.form.subtotal = this.form.quantity * this.form.price
      return this.form.subtotal
    },
  },
  methods: {
    ...mapActions({
      addProduct: 'storeVisitorOrder/addProduct',
      resetProduct: 'storeVisitorOrder/resetProduct',
    }),
    varianPrice(data) {
      const varian = this.data.details.find((item) => item.id === data)
      return varian ? varian.price : 0
    },
    restQuantity() {
      this.form.quantity = 0
    },
    onChangeDetail(index) {
      if (this.detailSelected === index) {
        const product = this.data

        this.detailSelected = null
        this.form.proddetail_id = null
        this.form.product_detail = null

        if (product.price) {
          this.form.price = product.price
        } else {
          this.form.price = null
        }
      } else {
        const detail = this.data.details.find((item) => item.id === index)
        const detailId = detail ? detail.id : null
        const detailName = detail ? detail.name : null
        const detailPrice = detail ? detail.price : null

        this.detailSelected = index
        this.form.proddetail_id = detailId
        this.form.product_detail = detailName

        if (index) {
          this.form.price = detailPrice
        } else {
          this.form.price = product.price
        }
      }

      const product = this.data

      this.form.product_id = product && product.id
      this.form.product_image = product && product.image
      this.form.product_name = product && product.name

      this.restQuantity()
    },
    onClose() {
      this.$emit('onClose')
    },
    onAddProduct() {
      const detail = this.data.details.find(
        (item) => item.id === this.detailSelected
      )
      const payload = {
        product_id: this.form.product_id,
        product_image: this.form.product_image,
        product_name: this.form.product_name,
        proddetail_id: this.form.proddetail_id,
        product_detail: this.form.product_detail,
        price: this.form.price,
        second_price: 0,
        value_discount: 0,
        is_discount: false,
        // second_price: detail.second_price,
        // value_discount: detail.value_discount,
        // is_discount: detail.is_discount,
        quantity: this.form.quantity,
        shop_id: this.selectedShop.id,
        varian: detail,
      }
      this.addProduct(payload)
      this.$message(`${this.form.product_name} ditambahkan ke keranjang.`)
      this.resetProduct()
      this.restQuantity()
      this.onClose()
    },
  },
}
</script>
