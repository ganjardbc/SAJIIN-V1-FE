<template>
  <div id="App">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="card box-shadow margin margin-top-15px margin-bottom-15px"
    >
      <div
        class="display-flex space-between align-center padding padding-bottom-15px margin margin-bottom-15px border-bottom"
      >
        <div
          style="width: calc(100% - 150px)"
          class="display-flex align-center"
        >
          <div class="width width-30px">
            <i class="fa fa-1x fa-list-ul fonts main-color"></i>
          </div>
          <div style="width: calc(100% - 30px)">
            <div class="fonts fonts-10 semibold overflow-ellipsis">
              {{ dt.order.order_id }}
            </div>
            <div class="fonts fonts-10 grey overflow-ellipsis">
              {{ dt.order.created_at | moment('DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div style="width: 150px" class="display-flex flex-end align-center">
          <AppCardCapsule
            :data="dt.order.status"
            class="margin margin-left-10px"
          />
          <el-popover placement="bottom-end" width="180" trigger="click">
            <div class="width width-100">
              <button
                v-if="dt.order.status !== 'canceled'"
                class="btn btn-white btn-full btn-align-left"
                @click="onChangeStatus(dt.order, 'canceled')"
              >
                <i class="icn icn-left fa fa-lw fa-times"></i> Cancel
              </button>
              <button
                v-if="
                  dt.order.status === 'done' || dt.order.status === 'canceled'
                "
                class="btn btn-white btn-full btn-align-left"
                @click="onChangeStatus(dt.order, 'new-order')"
              >
                <i class="icn icn-left fa fa-lw fa-history"></i> Re-Open
              </button>
            </div>
            <button slot="reference" class="btn btn-icon btn-circle btn-white">
              <i class="fa fa-lw fa-ellipsis-v"></i>
            </button>
          </el-popover>
        </div>
      </div>

      <el-alert
        v-if="!dt.cashbook"
        title="Non Buku Kas !"
        description="Transaksi ini tidak terdaftar di Buku Kas."
        type="warning"
        :closable="false"
        show-icon
        style="margin-bottom: 15px"
      >
      </el-alert>

      <div
        class="display-flex display-mobile padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"
      >
        <div
          v-if="dt.order.customer_name"
          class="width width-100 display-flex column space-between display-row-mobile margin margin-top-5px margin-bottom-5px"
        >
          <div class="fonts fonts-9 normal grey margin margin-bottom-5px">
            Pelanggan
          </div>
          <div class="fonts fonts-10 semibold black overflow-ellipsis">
            {{ dt.order.customer_name || '-' }}
          </div>
        </div>
        <div
          v-if="dt.order.table_name"
          class="width width-100 display-flex column space-between display-row-mobile margin margin-top-5px margin-bottom-5px"
        >
          <div class="fonts fonts-9 normal grey margin margin-bottom-5px">
            Meja
          </div>
          <div class="fonts fonts-10 semibold black overflow-ellipsis">
            {{ dt.order.table_name || '-' }}
          </div>
        </div>
        <div
          class="width width-100 display-flex column space-between display-row-mobile margin margin-top-5px margin-bottom-5px"
        >
          <div class="fonts fonts-9 normal grey margin margin-bottom-5px">
            Kasir
          </div>
          <div class="fonts fonts-10 semibold black overflow-ellipsis">
            {{ dt.order.cashier_name || '-' }}
          </div>
        </div>
      </div>

      <div class="width width-100 margin margin-top-5px margin-bottom-10px">
        <div
          class="display-flex row space-between display-row-mobile margin margin-bottom-5px"
        >
          <div class="fonts fonts-10 semibold black">Total Harga</div>
          <div class="display-flex align-center">
            <div class="fonts fonts-10 semibold margin margin-right-10px">
              ({{ dt.order.payment_status ? 'Dibayar' : 'Belum Bayar' }})
            </div>
            <div class="fonts fonts-10 semibold overflow-ellipsis">
              {{ format(dt.order.total_price) }}
            </div>
          </div>
        </div>
        <div
          v-if="dt.order.is_discount"
          class="display-flex align-center margin margin-top-5px margin-bottom-5px"
        >
          <div class="image image-20px border-full">
            <img
              v-if="dt.order.discount_image"
              :src="discountImageThumbnailUrl + dt.order.discount_image"
              alt=""
              class="post-center"
            />
            <i
              v-else
              class="post-middle-absolute fonts fonts-6 icn fa fa-lw fa-percentage"
            ></i>
          </div>
          <div
            style="width: calc(100% - 25px)"
            class="display-flex space-between margin margin-left-5px"
          >
            <div class="fonts fonts-9 normal grey">
              {{ dt.order.discount_name }}
            </div>
            <div class="fonts fonts-9 normal grey align-right">
              -{{
                dt.order.discount_value_type === 'percentage'
                  ? `${dt.order.discount_fee}%`
                  : format(dt.order.discount_price)
              }}
            </div>
          </div>
        </div>
      </div>

      <AppCardCollapse
        v-if="dt.details.length > 0"
        :title="`Detail Produk`"
        :customTitle="true"
        class="margin margin-bottom-15px"
      >
        <div slot="title" class="display-flex align-center">
          <div class="fonts fonts-10 semibold black margin margin-right-5px">
            Produk
          </div>
          <AppCardProgressProduct :data="dt.details" />
        </div>
        <div
          class="width width-100"
          style="overflow-y: auto; max-height: 400px"
        >
          <div
            v-for="(detail, j) in dt.details"
            :key="j"
            style="margin: 15px 4px"
          >
            <div class="card bg-white border border-full">
              <div class="display-flex space-between">
                <div class="width width-45px margin margin-right-15px">
                  <div class="image image-padding border-full">
                    <img
                      v-if="detail.product_image"
                      :src="productImageThumbnailUrl + detail.product_image"
                      alt=""
                      class="post-center"
                    />
                    <i
                      v-else
                      class="post-middle-absolute icn fa fa-lg fa-image"
                    ></i>
                  </div>
                </div>
                <div style="width: calc(100% - 160px)">
                  <div class="fonts fonts-11 semibold">
                    {{ detail.product_name }}
                  </div>
                  <div
                    v-if="detail.product_detail"
                    class="fonts fonts-9 black display-flex align-center padding padding-left-5px"
                  >
                    <i
                      class="fonts fonts-2 fa fa-lw fa-circle margin margin-right-5px"
                    ></i>
                    {{ detail.product_detail }}
                  </div>
                </div>
                <div class="width width-100px display-flex flex-end">
                  <AppCardCapsule :data="detail.status" />
                </div>
              </div>
              <div class="width width-100 padding padding-top-10px">
                <div v-if="detail.note" class="display-flex space-between">
                  <div class="fonts fonts-10 normal black">Catatan</div>
                  <div class="fonts fonts-10 normal black">
                    {{ detail.note }}
                  </div>
                </div>
                <div class="display-flex space-between">
                  <div class="fonts fonts-10 normal black">Harga</div>
                  <div class="display-flex">
                    <span
                      v-if="detail.is_discount"
                      class="fonts fonts-9 grey text-line margin margin-right-5px"
                      >{{ format(detail.second_price) }}</span
                    >
                    <span
                      class="fonts fonts-10 normal black semibold align-right"
                      >{{ format(detail.price) }}</span
                    >
                  </div>
                </div>
                <div
                  v-if="detail.is_discount"
                  class="display-flex align-center margin margin-top-5px margin-bottom-5px"
                >
                  <div class="image image-20px border-full">
                    <img
                      v-if="detail.discount_image"
                      :src="discountImageThumbnailUrl + detail.discount_image"
                      alt=""
                      class="post-center"
                    />
                    <i
                      v-else
                      class="post-middle-absolute fonts fonts-6 icn fa fa-lw fa-percentage"
                    ></i>
                  </div>
                  <div
                    style="width: calc(100% - 25px)"
                    class="display-flex space-between margin margin-left-5px"
                  >
                    <div class="fonts fonts-9 normal grey">
                      {{ detail.discount_name }}
                    </div>
                    <div class="fonts fonts-9 normal grey align-right">
                      -{{
                        detail.discount_value_type === 'percentage'
                          ? `${detail.discount_fee}%`
                          : format(detail.discount_price)
                      }}
                    </div>
                  </div>
                </div>
                <div
                  v-if="detail.is_platform"
                  class="display-flex align-center margin margin-top-5px margin-bottom-5px"
                >
                  <div class="image image-20px border-full">
                    <img
                      v-if="detail.platform_image"
                      :src="platformImageThumbnailUrl + detail.platform_image"
                      alt=""
                      class="post-center"
                    />
                    <i
                      v-else
                      class="post-middle-absolute fonts fonts-6 icn fa fa-lw fa-flag"
                    ></i>
                  </div>
                  <div
                    style="width: calc(100% - 25px)"
                    class="display-flex space-between margin margin-left-5px"
                  >
                    <div class="fonts fonts-9 normal grey">
                      {{ detail.platform_name }}
                    </div>
                    <div class="fonts fonts-9 normal grey align-right">
                      +{{
                        detail.platform_currency_type === 'percentage'
                          ? `${detail.platform_fee}%`
                          : format(detail.platform_price)
                      }}
                    </div>
                  </div>
                </div>
                <div class="display-flex space-between margin margin-top-5px">
                  <div class="fonts fonts-10 normal black">Jumlah</div>
                  <div class="fonts fonts-10 normal black semibold align-right">
                    {{ detail.quantity }} x
                  </div>
                </div>
                <div
                  class="padding padding-bottom-10px margin margin-bottom-10px border-bottom border-dashed"
                ></div>
                <div class="display-flex space-between">
                  <div class="fonts fonts-10 semibold black">Total</div>
                  <div class="fonts fonts-10 semibold main-color">
                    {{ format(detail.subtotal) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppCardCollapse>

      <div class="display-flex flex-end align-center">
        <div v-if="dt.order.status !== 'canceled' && dt.order.payment_status">
          <button
            class="btn btn-main-reverse with-hover margin margin-left-5px"
            @click="onReceipt(dt)"
          >
            <i class="fa fa-lw fa-print"></i>
          </button>
        </div>
        <div v-if="dt.order.status !== 'canceled' && !dt.order.payment_status">
          <button
            class="btn btn-main-reverse with-hover margin margin-left-5px"
            @click="onCheckout(dt)"
          >
            <i class="fa fa-lw fa-calculator"></i>
          </button>
        </div>
        <div v-if="!isNonFnB" class="display-flex flex-end align-center">
          <div v-if="dt.order.status === 'new-order'">
            <button
              class="btn btn-sekunder margin margin-left-5px"
              @click="onChangeStatus(dt.order, 'on-progress')"
            >
              Terima Transaksi
            </button>
          </div>
          <div v-if="dt.order.status === 'on-progress'">
            <button
              :disabled="isButtonOnProgressDisabled(dt)"
              class="btn btn-sekunder margin margin-left-5px"
              @click="onChangeStatus(dt.order, 'ready')"
            >
              Siap Diantarkan
            </button>
          </div>
          <div v-if="dt.order.status === 'ready'">
            <button
              class="btn btn-sekunder margin margin-left-5px"
              @click="onChangeStatus(dt.order, 'delivered')"
            >
              Diterima Pelanggan
            </button>
          </div>
          <div v-if="dt.order.status === 'delivered'">
            <button
              :disabled="!isButtonDoneDisabled(dt)"
              class="btn btn-green margin margin-left-5px"
              @click="onChangeStatus(dt.order, 'done')"
            >
              Transaksi Selesai
            </button>
          </div>
        </div>
        <div v-else class="display-flex flex-end align-center">
          <div v-if="dt.order.status === 'new-order'">
            <button
              :disabled="!isButtonDoneDisabledNonFnB(dt)"
              class="btn btn-green margin margin-left-5px"
              @click="onChangeStatus(dt.order, 'done')"
            >
              Transaksi Selesai
            </button>
          </div>
        </div>
        <button
          class="btn btn-sekunder margin margin-left-5px"
          @click="onDetail(dt)"
        >
          Detail
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardCollapse from '../../../../modules/AppCardCollapse'
import AppCardCaption from '../../../../modules/AppCardCaption'
import AppCardProgressProduct from '../../../../modules/AppCardProgressProduct'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardCapsule,
    AppCardCollapse,
    AppCardCaption,
    AppCardProgressProduct,
  },
  computed: {
    ...mapState({
      dataShop: (state) => state.storeSelectedShop.form,
    }),
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
  },
  methods: {
    ...mapActions({
      download: 'storeOrders/download',
    }),

    // OTHERS
    isButtonOnProgressDisabled(data) {
      return data.order.status !== 'on-progress'
    },
    isButtonDoneDisabled(data) {
      return data.order.payment_status && data.order.status === 'delivered'
    },
    isButtonDoneDisabledNonFnB(data) {
      return data.order.payment_status && data.order.status === 'new-order'
    },

    // COVER
    onChangeCover(data) {
      this.$emit('onChangeCover', data)
    },

    // DETAIL
    onDetail(data) {
      const payload = {
        ...data.order,
        shop_image: data.shop.image,
        details: data.details,
        shop: data.shop,
        payment: data.payment,
        table: data.table,
        cashier: data.cashier,
        cashbook: data.cashbook,
        platform: data.platform,
      }
      this.$emit('onDetail', payload)
    },

    // EDIT
    onEdit(data) {
      const payload = {
        ...data.order,
        shop_image: data.shop.image,
        details: data.details,
        shop: data.shop,
        payment: data.payment,
        table: data.table,
        cashier: data.cashier,
        cashbook: data.cashbook,
        platform: data.platform,
      }
      this.$emit('onEdit', payload)
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', data)
    },

    // STATUS
    onChangeStatus(data, status) {
      const payload = {
        ...data,
        status: status,
      }
      this.$emit('onChangeStatus', payload)
    },

    // CHECKOUT
    onCheckout(data) {
      const payload = {
        ...data.order,
        shop_image: data.shop.image,
        details: data.details,
        shop: data.shop,
        payment: data.payment,
        table: data.table,
        cashier: data.cashier,
        cashbook: data.cashbook,
        platform: data.platform,
      }
      this.$emit('onCheckout', payload)
    },

    // RECEIPT
    onReceipt(data) {
      const payload = {
        ...data.order,
        shop_image: data.shop.image,
        details: data.details,
        shop: data.shop,
        payment: data.payment,
        table: data.table,
        cashier: data.cashier,
        cashbook: data.cashbook,
        platform: data.platform,
      }
      this.$emit('onReceipt', payload)
    },

    onDownloadReceipt(data) {
      console.log('onDownloadReceipt', data)
      const token = this.$cookies.get('tokenBearer')
      const order_id = data.order.order_id
      const size_x = 51
      const size_y = 200
      this.download({ token, order_id, size_x, size_y }).then((res) => {
        if (res.status === 200) {
          this.$message('Downloaded order receipt')
        } else {
          this.$message({
            message: 'Failed to download order receipt',
            type: 'error',
          })
        }
      })
    },
  },
}
</script>
