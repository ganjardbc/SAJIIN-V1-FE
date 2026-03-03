<template>
  <div id="AddCartPopup">
    <AppCardPopup
      title="Tambah ke Keranjang"
      @onClose="onClose"
    >
      <div class="w-full flex flex-col gap-4">
        <div class="w-full flex gap-2 justify-between border-b border-gray-200 pb-4">
          <div class="flex-1">
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
            :src="productImageThumbnailUrl + data.image"
            size="small"
          />
        </div>

        <div
          v-if="data.details && data.details.length > 0 ? true : false"
          class="w-full flex flex-col gap-2"
        >
          <div class="w-full flex gap-2 justify-between">
            <div class="text-sm text-gray-700">Varian</div>
            <div class="text-sm text-black text-right">
              {{ data.details.length }} Item
            </div>
          </div>

          <div class="flex gap-2 flex-wrap">
            <div
              v-for="(dt, index) in data.details"
              :key="index"
              class="flex gap-2 py-2 px-3 rounded-lg bg-white border border-gray-200 cursor-pointer"
              :class="
                data.status === 'active'
                  ? dt.is_available
                    ? detailSelected === dt.id
                      ? 'bg-green-100 border-green-500'
                      : ''
                    : 'bg-gray-100'
                  : 'bg-gray-100'
              "
              @click="onChangeDetail(dt.id)"
            >
              <div style="width: 18px">
                <i class="fa fa-box text-gray-700" />
              </div>
              <div class="flex-1">
                <div class="text-xs text-gray-700">
                  {{ dt.name }}
                </div>
                <div class="text-sm text-black font-semibold">
                  {{ format(dt.price) }}
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
            :disabled="data.status === 'inactive' || !form.price"
          ></el-input-number>
        </div>
      </div>

      <template #footer>
        <div class="w-full flex flex-col gap-2">
          <div class="w-full flex gap-2 justify-between">
            <div class="text-sm font-semibold text-black">
              Total ({{ orderQuantity }} produk)
            </div>
            <div class="text-sm font-semibold text-vermillion-500">
              {{ format(orderPrice) }}
            </div>
          </div>

          <el-button
            class="w-full"
            type="primary"
            :disabled="enableButtonAddProduct || !form.price"
            @click="onAddProduct"
          >
            Tambah ke Keranjang
          </el-button>
        </div>
      </template>
    </AppCardPopup>
  </div>
</template>
<script>
import AppCardPopup from '../../../../modules/AppCardPopup'
import AppCardAvatar from '../../../../modules/AppCardAvatar'

export default {
  name: 'AddCartPopup',
  data() {
    return {
      detailSelected: null,
      form: {
        quantity: 0,
        price: 0,
        subtotal: 0,
        proddetail_id: '',
        product_id: '',
        product_image: '',
        product_name: '',
        product_detail: '',
      },
    }
  },
  mounted() {
    this.onChangeDetail(null)
  },
  props: {
    data: null,
  },
  components: {
    AppCardPopup,
    AppCardAvatar,
  },
  computed: {
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
      // pure computed — no side effects
      return this.form.quantity * (this.form.price || 0)
    },
  },
  methods: {
    varianPrice(data) {
      const varian = this.data.details.find((item) => item.id === data)
      return varian ? varian.price : 0
    },
    onChangeDetail(index) {
      const product = this.data

      if (this.detailSelected === index) {
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

      this.form.product_id = product && product.id
      this.form.product_image = product && product.image
      this.form.product_name = product && product.name
      this.form.quantity = 0
    },
    onClose() {
      this.$emit('onClose')
    },
    onAddProduct() {
      const subtotal = this.form.quantity * (this.form.price || 0)
      const payload = {
        ...this.data,
        quantity: this.form.quantity,
        price: this.form.price,
        subtotal: subtotal,
        proddetail_id: this.form.proddetail_id,
        product_id: this.form.product_id,
        product_image: this.form.product_image,
        product_name: this.form.product_name,
        product_detail: this.form.product_detail,
      }
      this.$emit('onAddProduct', payload)
    },
  },
}
</script>
