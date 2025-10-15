<template>
  <AppSideForm
    :value="openForm"
    title="Edit Transaksi"
    :subtitle="form.order_id"
    :enableCustomFooter="true"
    @close="onClose"
  >
    <div class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-2 pb-4 border-b border-gray-200">
        <div class="flex-1 text-sm text-black font-semibold">Transaksi</div>
        <div class="flex flex-col gap-4">
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
      </div>

      <div class="w-full flex flex-col gap-2">
        <div class="flex-1 text-sm text-black font-semibold">Pelanggan</div>
        <div class="flex flex-col gap-4">
          <div class="field-group">
            <el-input
              :placeholder="`Nama Pelanggan ${isNonFnB ? '(opsional)' : ''}`"
              type="text"
              v-model="form.customer_name"
            ></el-input>
          </div>

          <table-field
            v-if="!isNonFnB"
            :value="form.table_id"
            :smallField="true"
            @onChange="onChangeTable"
            @onClear="onClearTable"
          ></table-field>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button
        type="primary"
        class="w-full"
        @click="onSave"
      >
        Simpan Transaksi
      </el-button>
    </template>
  </AppSideForm>
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
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
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
