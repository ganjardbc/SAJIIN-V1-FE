<template>
  <div id="App">
    <div class="card no-padding border-full">
      <div class="padding padding-15px">
        <div class="display-flex">
          <div class="width width-65px">
            <div class="image image-50px border-full">
              <img
                v-if="data.image"
                :src="productImageThumbnailUrl + data.image"
                alt=""
                class="post-center"
              />
              <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
            </div>
          </div>
          <div style="width: calc(100% - 65px)">
            <div class="fonts fonts-11 semibold">{{ data.name }}</div>
            <div class="fonts fonts-9 grey">
              {{
                indexDetail
                  ? format(varianPrice(indexDetail))
                  : data.price
                    ? format(data.price)
                    : ''
              }}
            </div>
          </div>
        </div>
        <div class="width width-100">
          <div class="field-group">
            <div class="display-flex space-between align-center">
              <div class="field-label">Varian</div>
              <div class="fonts fonts-10 normal">
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
                style="height: auto; padding: 7px 20px"
              >
                <div
                  class="display-flex space-between margin margin-bottom-7px"
                >
                  <div class="fonts fonts-10 grey">{{ item.name }}</div>
                  <!-- <div v-if="item.is_discount" class="fonts fonts-10 red semibold">-{{ item.value_discount }}%</div> -->
                </div>
                <div class="display-flex flex-start">
                  <div class="fonts fonts-10 black semibold">
                    {{ format(item.price) }}
                  </div>
                  <!-- <div v-if="item.is_discount" class="fonts fonts-10 grey text-line margin margin-left-5px">{{ format(item.second_price) }}</div> -->
                </div>
              </el-option>
            </el-select>
          </div>
          <div class="width width-100 padding padding-top-5px">
            <button
              class="btn btn-main-reverse with-border btn-full"
              :disabled="isButtonEnable(data)"
              @click="addToCart(data)"
            >
              <i class="icn icn-left fa fa-lw fa-cart-plus"></i> Tambah Produk
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppCardCapsule from '../../../../../../modules/AppCardCapsule'

export default {
  data() {
    return {
      indexDetail: null,
    }
  },
  components: {
    AppCardCapsule,
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
