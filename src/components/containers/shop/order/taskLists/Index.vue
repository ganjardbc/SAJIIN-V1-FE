<template>
  <div id="App" class="w-full flex flex-col gap-4 p-4">
    <div class="w-full flex items-center justify-between">
      <h1 class="text-3xl text-black font-semibold">
        Produksi
      </h1>
    </div>

    <SearchField
      :placeholder="'Cari transaksi ..'"
      :enableResponsive="true"
      :onChange="(data) => onSearch(data)"
    />

    <div class="w-full flex flex-col gap-4">
      <div v-loading="loading" class="w-full">
        <AppEmpty v-if="data.length === 0" />
        <Card
          :data.sync="data"
          @onChangeStatus="onChangeStatus"
          @onChangeOrderStatus="onChangeOrderStatus"
        />
      </div>
      <div class="w-full flex justify-between items-center gap-2">
        <div class="text-md text-black">
          Total {{ totalRecord }}
        </div>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="limit"
          :pager-count="5"
          layout="prev, pager, next"
          :total="totalRecord"
        >
        </el-pagination>
      </div>
    </div>

    <AppPopupConfirmed
      v-if="visibleConfirmedStatus"
      :title="titleConfirmedStatus"
      @onClickNo="onClickNoStatus"
      @onClickYes="onClickYesStatus"
    />

    <AppPopupLoader v-if="loadingForm" />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import SearchField from '../../../../modules/SearchField'
import AppTabs from '../../../../modules/AppTabs'
import AppEmpty from '../../../../modules/AppEmpty'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppPopupLoader from '../../../../modules/AppPopupLoader'
import CashbookField from '../../cashBook/Field'
import Card from './Card'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Produksi',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      selectedOrderData: null,
      currentPage: 0,
      visibleConfirmedStatus: false,
      titleConfirmedStatus: 'Update status transaksi ?',
    }
  },
  mounted() {
    this.getData()
  },
  components: {
    SearchField,
    AppTabs,
    AppEmpty,
    AppPopupConfirmed,
    AppPopupLoader,
    CashbookField,
    Card,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeTaskLists.data,
      selected: (state) => state.storeTaskLists.selected,
      totalRecord: (state) => state.storeTaskLists.totalRecord,
      limit: (state) => state.storeTaskLists.limit,
      loading: (state) => state.storeTaskLists.loading,
      loadingForm: (state) => state.storeTaskLists.loadingForm,
      filter: (state) => state.storeTaskLists.filter,
    }),
    shopId() {
      return this.$store.state.storeShop.form.id
    },
    paramShopId() {
      const shop = this.$store.state.storeShop.form
      return shop.shop_id
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
      getTaskList: 'storeTaskLists/getData',
      setPagination: 'storeTaskLists/setPagination',
      setSelected: 'storeTaskLists/setSelected',
      updateData: 'storeTaskLists/updateData',
      resetFilter: 'storeTaskLists/resetFilter',
      updateOrderData: 'storeOrders/updateData',
    }),
    onChangeTabs(data) {
      this.selectedIndex = data
    },
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getData()
    },
    onRefresh() {
      this.getData()
    },

    // LIST DATA
    getData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getTaskList({ token, shop_id })
      }
    },
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getData()
    },
    handleFilterSearch() {
      this.currentPage = 1
      this.handleCurrentChange(1)
    },
    handleFilterCashbook(value) {
      this.filter.cashbook_id = value
      this.getData()
    },

    // STATUS
    onChangeStatus(data) {
      const token = this.$cookies.get('tokenBearer')
      const payload = { ...data }
      this.updateData({ payload, token }).then((res) => {
        const resData = res.data
        if (resData.status === 'ok') {
          const newPayload = {
            ...this.selected,
            details: resData.data,
          }
          this.setSelected(newPayload)
          this.onRefresh()
          this.$message(
            `Success changed status for product ${data.product_name}.`
          )
        } else {
          this.$message(
            `Failed to chang status for product ${data.product_name}.`
          )
        }
      })
    },

    // ORDER STATUS
    onClickNoStatus() {
      this.visibleConfirmedStatus = false
    },
    onClickYesStatus() {
      this.visibleFormOrder = false
      this.visibleConfirmedStatus = false

      const token = this.$cookies.get('tokenBearer')
      this.updateOrderData({
        ...this.selectedOrderData,
        token: token,
      }).then((res) => {
        const status = res.data.status
        if (status === 'ok') {
          this.onRefresh()
          this.onCloseProduct()
          this.onSendNotification(this.selectedOrderData)
          this.$message(
            `Berhasil merubah status transaksi ${this.selectedOrderData.order_id}.`
          )
        } else {
          this.$message(
            `Gagal merubah status transaksi ${this.selectedOrderData.order_id}.`
          )
        }
      })
    },
    onChangeOrderStatus(data) {
      this.titleConfirmedStatus = 'Produk siap diantarkan ?'
      this.visibleConfirmedStatus = true
      this.selectedOrderData = data
    },

    // SEND NOTIFICATION
    onSendNotification(data) {
      const payload = {
        shopId: this.paramShopId,
        orderId: data.order_id,
        shopName: data.shop_name,
        tableName: data.table_name,
        customerName: data.customer_name,
        type: 'order-status',
        message: `
                    Status transaksi 
                    ${data.customer_name ? ' atas nama ' + data.customer_name : ''} 
                    berhasil diubah
                `,
      }
      this.$socket.emit('notification', payload)
    },
  },
}
</script>
