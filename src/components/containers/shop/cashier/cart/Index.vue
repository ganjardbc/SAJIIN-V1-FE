<template>
  <div id="App">
    <AppSideForm
      :title="'Keranjang'"
      :enableCustomFooter="false"
      :onClose="onClose"
    >
      <div slot="toolbar">
        <button
          class="btn btn-main-reverse with-border with-hover margin margin-right-10px"
          :disabled="!isThereDetails"
          @click="deleteAllProduct"
        >
          Hapus Semua
        </button>
      </div>
      <CashierMain
        @onCreateOrder="onCreateOrder"
        @onCheckOut="onCheckOut"
      ></CashierMain>
    </AppSideForm>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppSideForm from '../../../../modules/AppSideForm'
import CashierMain from './Main'

export default {
  name: 'App',
  components: {
    AppSideForm,
    CashierMain,
  },
  computed: {
    ...mapState({
      details: (state) => state.storeCashier.form.details,
    }),
    isThereDetails() {
      return this.details.length > 0
    },
  },
  methods: {
    ...mapActions({
      deleteAllProduct: 'storeCashier/deleteAllProduct',
    }),
    onClose() {
      this.$emit('onClose')
    },
    onCreateOrder() {
      this.$emit('onCreateOrder')
    },
    onCheckOut() {
      this.$emit('onCheckOut')
    },
  },
}
</script>
