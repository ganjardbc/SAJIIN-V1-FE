<template>
  <div id="App">
    <AppSideForm
      :title="'Edit Transaksi'"
      :subtitle="form.order_id"
      :enableCustomFooter="true"
      :onClose="onClose"
    >
      <div
        class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px"
      >
        <div class="fonts fonts-10 semibold black">Transaksi</div>
        <div class="field-group">
          <div class="field-label">Kasir</div>
          <el-input
            placeholder="Nama Kasir"
            type="text"
            v-model="form.cashier_name"
          ></el-input>
        </div>
        <div class="field-group">
          <div class="field-label">Buku Kas</div>
          <cashbook-field
            :value.sync="form.cashbook_id"
            :disabledAllLabel="true"
            placeholder="Pilih buku kas"
            @onChange="handleFilterCashbook"
          ></cashbook-field>
        </div>
      </div>

      <div
        class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px"
      >
        <div class="fonts fonts-10 semibold black">Pelanggan</div>
        <div class="field-group">
          <el-input
            :placeholder="`Nama Pelanggan ${isNonFnB ? '(opsional)' : ''}`"
            type="text"
            v-model="form.customer_name"
          ></el-input>
          <table-field
            v-if="!isNonFnB"
            class="margin margin-top-15px"
            :value="form.table_id"
            :smallField="true"
            @onChange="onChangeTable"
            @onClear="onClearTable"
          ></table-field>
        </div>
      </div>

      <div slot="footer">
        <button class="btn btn-main btn-full" @click="onSave">
          Simpan Transaksi
        </button>
      </div>
    </AppSideForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppSideForm from '../../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'
import AppEmpty from '../../../../../modules/AppEmpty'
import TableField from '../../../tables/Field'
import CashbookField from '../../../cashBook/Field'

export default {
  name: 'App',
  data() {
    return {
      visibleAddProduct: false,
    }
  },
  mounted() {
    this.selectedIndex = 0
  },
  watch: {
    formId() {
      this.selectedIndex = 0
    },
  },
  computed: {
    ...mapState({
      form: (state) => state.storeOrders.form,
      errorMessage: (state) => state.storeOrders.errorMessage,
      typeForm: (state) => state.storeOrders.typeForm,
      category: (state) => state.storeCategory.data,
      dataShop: (state) => state.storeSelectedShop.form,
    }),
    isNonFnB() {
      return this.dataShop && this.dataShop.is_non_fnb
    },
    formId: {
      get() {
        return this.$store.state.storeOrders.form.id
      },
      set(value) {
        this.$store.state.storeOrders.form.id = value
      },
    },
  },
  components: {
    AppCardCapsule,
    AppSideForm,
    AppEmpty,
    TableField,
    CashbookField,
  },
  methods: {
    isActiveOrder(data) {
      let status = false
      if (data.status === 'new-order') status = true
      if (data.status === 'on-progress') status = true
      return status
    },
    onSave() {
      this.$emit('onSave')
    },
    onClose() {
      this.$emit('onClose')
    },
    handleFilterCashbook(value) {
      this.form.cashbook_id = value
    },

    // TABLE
    onChangeTable(data) {
      this.form.table_id = data.id
      this.form.table_name = data.name
      this.form.table = data
    },
    onClearTable() {
      this.form.table_id = ''
      this.form.table_name = ''
      this.form.table = null
    },
  },
}
</script>
