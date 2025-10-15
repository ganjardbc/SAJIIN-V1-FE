<template>
  <div id="CashierCashBook" class="w-full">
    <div v-loading="loading" class="w-full flex flex-col gap-4">
      <el-alert
        v-if="showWarning"
        title="Mohon Buka Kasir !"
        description="Kamu tidak bisa membuat pesanan baru karena Buku Kas untuk Toko ini masih kosong."
        type="warning"
        :closable="true"
        show-icon
      />

      <div class="w-full flex justify-between items-center">
        <div class="flex-1 flex gap-2 items-center">
          <h1 class="text-3xl text-black font-semibold">
            Kasir
          </h1>
          <AppCardCapsule
            v-if="currentCashBook"
            :data="currentCashBook.cash_status"
          />
        </div>

        <div class="flex-1 flex justify-end">
          <div v-if="currentCashBook" class="flex flex-col justify-end items-end">
            <div class="text-xs text-gray-500 text-right">
              {{ currentCashBook.cash_date | moment('DD MMMM YYYY') }}
            </div>

            <div class="flex justify-end items-center gap-2">
              <el-popover
                v-if="currentCashBook"
                placement="bottom"
                width="180"
                trigger="click"
              >
                <div class="w-full flex flex-col gap-2">
                  <div class="w-full text-sm text-black font-semibold">
                    Kas Masuk
                  </div>
                  <div
                    v-for="(item, i) in currentCashBook.cash_detail"
                    :key="i"
                    class="flex gap-2"
                  >
                    <div
                      class="border border-gray-200 rounded-md overflow-hidden"
                      style="width: 22px; height: 22px"
                    >
                      <img
                        :src="
                          item.image
                            ? paymentImageThumbnailUrl + item.image
                            : ''
                        "
                        alt=""
                        class="w-full h-full"
                      />
                    </div>
                    <div class="flex-1 flex flex-col">
                      <div class="text-xs text-gray-500">
                        {{ item.name }}
                      </div>
                      <div class="text-sm text-black font-semibold">
                        {{ format(item.cash_in) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  slot="reference"
                  class="flex gap-2 items-center cursor-pointer"
                >
                  <i class="fa fa-lg fa-arrow-up text-sm text-green-500" />
                  <span class="text-sm text-black font-semibold truncate">
                    {{
                      format(
                        (currentCashBook && currentCashBook.cash_in) || 0
                      )
                    }}
                  </span>
                </div>
              </el-popover>

              <el-popover
                v-if="currentCashBook"
                placement="bottom"
                width="180"
                trigger="click"
              >
                <div class="w-full flex flex-col gap-2">
                  <div class="w-full text-sm text-black font-semibold">Kas Keluar</div>
                  <div
                    v-for="(item, i) in currentCashBook.cash_detail"
                    :key="i"
                    class="flex gap-2"
                  >
                    <div
                      class="border border-gray-200 rounded-md overflow-hidden"
                      style="width: 22px; height: 22px"
                    >
                      <img
                        :src="
                          item.image
                            ? paymentImageThumbnailUrl + item.image
                            : ''
                        "
                        alt=""
                        class="w-full h-full"
                      />
                    </div>
                    <div class="flex-1 flex flex-col">
                      <div class="text-xs text-gray-500">
                        {{ item.name }}
                      </div>
                      <div class="text-sm text-black font-semibold">
                        {{ format(item.cash_out) }}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  slot="reference"
                  class="flex gap-2 items-center cursor-pointer"
                >
                  <i class="fa fa-lg fa-arrow-down text-sm text-orange-500" />
                  <span class="text-sm text-black font-semibold truncate">
                    {{
                      format(
                        (currentCashBook && currentCashBook.cash_out) || 0
                      )
                    }}
                  </span>
                </div>
              </el-popover>

              <el-button
                size="mini"
                circle
                @click="onOpenOrderList"
              >
                <span
                  v-if="
                    currentCashBook &&
                    currentCashBook.cash_detail &&
                    currentCashBook.cash_detail.length > 0
                  "
                  class="sign"
                ></span>
                <i class="fa fa-book-open"></i>
              </el-button>
            </div>
          </div>

          <el-button
            v-else 
            type="primary"
            @click="createCashBook">
            <i class="mr-2 fa fa-plus"></i>
            Buka Kasir
          </el-button>
        </div>
      </div>

      <div
        v-if="!isThereOpenedCashbook"
        class="w-full flex flex-col"
      >
        <AppEmpty
          v-if="!isThereOpenedCashbook"
          title="Mohon Buka Kasir untuk Membuat Pesanan Baru"
        />
        <div class="w-full flex justify-center">
          <el-button type="primary" @click="createCashBook">
            <i class="icn icn-left fa fa-lg fa-plus"></i> Buka Kasir
          </el-button>
        </div>
      </div>
    </div>

    <Form v-if="visibleForm" @onSave="saveCashBook" @onClose="closeCashBook" />

    <AppPopupConfirmed
      v-if="visibleConfirmed"
      :title="'Simpan Data ?'"
      @onClickNo="onClickNo"
      @onClickYes="onClickYes"
    />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppEmpty from '../../../../modules/AppEmpty'
import Form from './Form'

export default {
  name: 'CashierCashBook',
  data() {
    return {
      showWarning: false,
      visibleForm: false,
      visibleConfirmed: false,
    }
  },
  mounted() {
    this.getData()
  },
  components: {
    AppCardCapsule,
    AppPopupConfirmed,
    AppEmpty,
    Form,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeCashBook.form,
      dataCurrent: (state) => state.storeCashBook.dataCurrent,
      loading: (state) => state.storeCashBook.loading,
    }),
    currentCashBook() {
      return this.dataCurrent && this.dataCurrent.current_cashbook
    },
    openedCashBook() {
      return this.dataCurrent && this.dataCurrent.opened_cashbook
    },
    shopCashBook() {
      return this.dataCurrent && this.dataCurrent.shop
    },
    isThereOpenedCashbook() {
      return this.currentCashBook && this.currentCashBook.cash_status === 'open'
    },
    shopId() {
      return this.$store.state.storeShop.form.id
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.getData()
      }
    },
  },
  methods: {
    ...mapActions({
      setFormData: 'storeCashBook/setFormData',
      getCurrent: 'storeCashBook/getCurrent',
      createData: 'storeCashBook/createData',
    }),
    getData() {
      const token = this.$cookies.get('tokenBearer')
      const today = new Date()
      const shop_id = this.shopId
      if (shop_id) {
        this.getCurrent({ token, today: today, shop_id: shop_id }).then(
          (res) => {
            const data = res.data.data.current_cashbook
            if (!data) {
              this.showWarning = true
            }
          }
        )
      }
    },
    onClickNo() {
      this.visibleConfirmed = false
    },
    onClickYes() {
      this.visibleConfirmed = false
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      this.createData({
        ...this.form,
        shop_id: shop_id,
        token: token,
      }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.closeCashBook()
          this.getData()
        } else {
          this.$message({
            message: 'Gagal menyimpan Buku Kas !',
            type: 'error',
          })
        }
      })
    },
    saveCashBook() {
      this.visibleConfirmed = true
    },
    createCashBook() {
      this.visibleForm = true
      this.setFormData(null)
    },
    closeCashBook() {
      this.visibleForm = false
    },
    onOpenOrderList() {
      this.$emit('onOpenOrderList', this.currentCashBook)
    },
  },
}
</script>
