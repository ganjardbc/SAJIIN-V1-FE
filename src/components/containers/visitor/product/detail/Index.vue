<template>
  <div id="App" class="flex flex-col gap-4 pt-4 px-4">
    <AppLoader v-if="loading" />

    <div v-else class="w-full">
      <div v-if="cashBook" class="w-full">
        <AppEmpty v-if="data && data.length === 0" />

        <div v-if="data && data.product" class="w-full flex flex-col gap-4">
          <div class="flex flex-col lg:flex-row justify-between gap-4 border-b border-gray-200 pb-4">
            <AppCardAvatar
              :src="`${productImageCoverUrl}${data.product.image}`"
              shape="square"
              size="large"
              fit="contain"
              custom-class="shadow-none border border-gray-200"
            />
            <div class="flex-1 flex flex-col gap-2">
              <div class="flex flex-row gap-2 justify-between">
                <div class="text-lg text-black font-semibold">
                  {{ data.product.name }}
                </div>
                <AppCardCapsule
                  :data="data.product.status"
                  :label="
                    data.product.status === 'active'
                      ? 'Tersedia'
                      : 'Stok Kosong'
                  "
                />
              </div>
              <div class="text-sm text-gray-500">
                {{ data.product.description }}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2 border-b border-gray-200 pb-4">
            <div class="text-sm font-semibold text-black">Pesanan</div>
            <div
              v-if="
                data.product.status === 'active' &&
                detailProduct &&
                detailProduct.length > 0 
                  ? true 
                  : false
              "
              class="field-group"
              style="padding-bottom: 0"
            >
              <div class="field-label">Varian</div>
              <div class="flex flex-wrap gap-4">
                <div
                  v-for="(dt, index) in detailProduct"
                  :key="index"
                  class="flex justify-center gap-2 py-2 px-3 rounded-lg border border-gray-200 cursor-pointer"
                  :class="{
                    'bg-vermillion-100 border-vermillion-500': detailSelected === dt.id,
                    'bg-gray-100 border-gray-200 cursor-not-allowed': data.product.status === 'active' && !dt.is_available
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
            </div>

            <div class="field-group">
              <div class="field-label">Jumlah</div>
              <el-input-number
                v-model="form.quantity"
                :min="0"
                :max="100"
                style="width: 100%"
                :disabled="!isQuantityEnabled(data.product)"
              ></el-input-number>
            </div>
          </div>
        </div>

        <div class="sticky bottom-0 bg-white z-10 py-4 flex flex-col gap-2">
            <div class="flex flex-row items-center justify-between gap-2">
              <div class="text-sm text-gray-600">
                Total ({{ orderQuantity }} produk)
              </div>
              <div class="text-sm text-vermillion-500 font-semibold">
                {{ format(orderPrice) }}
              </div>
            </div>

            <div class="flex flex-row items-center justify-between gap-2">
              <el-button
                size="medium"
                type="primary"
                class="w-full"
                :disabled="enableButtonAddProduct || !form.price"
                @click="onAddProduct"
              >
                Tambah Ke Keranjang
              </el-button>

              <el-button
                v-if="isDigitalOrderActive"
                size="large"
                class="relative p-0"
                style="width: 40px; height: 40px;"
                circle
                @click="onViewCart"
              >
                <el-badge
                  :hidden="cartQuantity === 0"
                  is-dot
                >
                  <i class="fa fa-lw fa-shopping-cart"></i>
                </el-badge>
              </el-button>
            </div>
          </div>
      </div>

      <AppEmpty
        v-else
        title="This Shop Still Closed, Please Wait To Make The Orders."
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppLoader from '../../../../modules/AppLoader'
import AppEmpty from '../../../../modules/AppEmpty'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardAvatar from '../../../../modules/AppCardAvatar'

export default {
  name: 'App',
  metaInfo: {
    title: 'Visitor',
    titleTemplate: '%s | Detail Product',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      detailSelected: null,
    }
  },
  components: {
    AppLoader,
    AppEmpty,
    AppCardCapsule,
    AppCardAvatar,
  },
  mounted() {
    this.resetProduct()
    this.getProductData()
  },
  computed: {
    ...mapState({
      form: (state) => state.storeVisitorOrder.formProduct,
      dataCart: (state) => state.storeVisitorOrder.form.details,
      data: (state) => state.storeVisitorProduct.data,
      loading: (state) => state.storeVisitorProduct.loading,
      dataShop: (state) => state.storeVisitorShop.data,
    }),
    cashBook() {
      return this.dataShop && this.dataShop.cashbook
    },
    selectedShop() {
      return this.dataShop && this.dataShop.shop
    },
    detailProduct() {
      return this.data.details.map((item) => {
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
    },
    isDigitalOrderActive() {
      return this.selectedShop && this.selectedShop.is_digital_order_active
    },
    enableButtonAddProduct() {
      let status = false
      if (
        this.data &&
        this.data.product &&
        this.data.product.status === 'inactive'
      ) {
        status = true
      }
      if (this.form.quantity === 0) {
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
    cartQuantity() {
      let quantity = 0
      this.dataCart &&
        this.dataCart.map((item) => {
          quantity += item.quantity
        })
      return quantity
    },
  },
  methods: {
    ...mapActions({
      getProduct: 'storeVisitorProduct/getData',
      addProduct: 'storeVisitorOrder/addProduct',
      resetProduct: 'storeVisitorOrder/resetProduct',
    }),
    isQuantityEnabled(data) {
      let status = true
      if (this.isDigitalOrderActive) {
        if (data.status === 'active') {
          if (this.form.price) {
            status = true
          } else {
            status = false
          }
        } else {
          status = false
        }
      } else {
        status = false
      }
      return status
    },
    varianPrice(data) {
      const varian = this.detailProduct.find((item) => item.id === data)
      return varian ? varian.price : 0
    },
    getProductData() {
      const product_id = this.$route.params.productId
      this.getProduct(product_id).then((res) => {
        this.onChangeDetail(null)
      })
    },
    restQuantity() {
      this.form.quantity = 0
    },
    onChangeDetail(index) {
      if (this.detailSelected === index) {
        const product = this.data.product

        this.detailSelected = null
        this.form.proddetail_id = null
        this.form.product_detail = null

        if (product.price) {
          this.form.price = product.price
        } else {
          this.form.price = null
        }
      } else {
        const product = this.data.product
        const detail = this.detailProduct.find((item) => item.id === index)
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

      const product = this.data.product

      this.form.product_id = product && product.id
      this.form.product_image = product && product.image
      this.form.product_name = product && product.name

      this.restQuantity()
    },
    onAddProduct() {
      const detail = this.detailProduct.find(
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
        shop_id: this.form.shop_id,
        shop_id: this.selectedShop.id,
        varian: detail,
      }
      this.addProduct(payload)
      this.$message(`${this.form.product_name} ditambahkan ke keranjang.`)
      this.restQuantity()
    },
    onViewCart() {
      this.$router.push({ name: 'visitor-carts' })
    },
  },
}
</script>
