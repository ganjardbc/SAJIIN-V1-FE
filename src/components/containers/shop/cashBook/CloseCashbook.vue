<template>
  <AppCardPopup
    title="Tutup Buku Kas"
    size="sm"
    @onClose="onClose"
  >
    <div class="w-full flex flex-col gap-4">
      <div class="margin margin-bottom-15px">
        <el-alert
          class="text-xs text-black font-semibold"
          :closable="false"
          show-icon
        >
          Buku Kas ini akan diubah menjadi "Tutup" dan kamu bisa download
          laporan untuk Buku Kas ini.
        </el-alert>
      </div>

      <div class="text-sm text-black font-semibold">
        {{ form.cash_date | moment('DD MMMM YYYY') }}
      </div>

      <div class="flex flex-col gap-2">
        <OrderStatus :data="form" />
        <el-alert
          v-if="form.order_total !== form.order_done"
          title="Masih ada pesanan yang diproses !"
          description='Untuk menutup buku kas semua pesanan harus sudah "Selesai".'
          type="error"
          :closable="false"
          show-icon
        >
        </el-alert>
      </div>

      <CashSummary
        :cash-summary="form.cash_summary"
        :cash-modal="form.cash_modal"
        :cash-actual="form.cash_actual"
        :cash-profit="form.cash_profit"
        :cash-in="form.cash_in"
        :cash-out="form.cash_out"
        :cash-detail="form.cash_detail"
        :enable-cash-warning="form.cash_status === 'closed'"
      />

      <div class="field-group">
        <div class="field-label">Kas Aktual</div>
        <div class="field-caption">
          Kas aktual adalah kas/uang yang ada di kasir saat ini.
        </div>
        <div class="field-caption">
          Atur kas aktual untuk buku kas ini agar dapat dibandingkan dengan
          kas yang ada di sistem.
        </div>
        <input-number
          class="w-full"
          v-model="form.cash_actual"
          thousand-separated
          :min="0"
          placeholder="0"
          :disabled="!isOrderDone"
        >
          <template>Rp</template>
        </input-number>
        <div v-if="errorMessage.cash_actual" class="field-error">
          {{ errorMessage.cash_actual && errorMessage.cash_actual[0] }}
        </div>
      </div>

      <el-alert
        v-if="form.cash_actual && form.cash_summary > form.cash_actual"
        title="Kas Aktual Tidak Sama dengan Kas Summary !"
        description="Sepertinya Kas Summary dan kas aktual tidak sama, mohon cek kembali kas yang ada."
        type="error"
        :closable="false"
        show-icon
      >
      </el-alert>

      <div class="field-group">
        <div class="field-label">Tanggal Tutup</div>
        <el-date-picker
          placeholder="Pilih tanggal"
          type="date"
          format="dd MMMM yyyy"
          v-model="form.cash_end_date"
          :picker-options="pickerOptions"
          :disabled="!isOrderDone"
          style="width: 100% !important"
        ></el-date-picker>
        <div v-if="errorMessage.cash_end_date" class="field-error">
          {{ errorMessage.cash_end_date && errorMessage.cash_end_date[0] }}
        </div>
      </div>
    </div>

    <template #footer>
      <el-button
        type="primary"
        :disabled="isCanSave"
        class="w-full"
        @click="onSave"
      >
        Tutup Buku Kas
      </el-button>
    </template>
  </AppCardPopup>
</template>
<script>
import { mapState } from 'vuex'
import AppCardPopup from '../../../modules/AppCardPopup'
import InputNumber from '../../../modules/InputNumber'
import OrderStatus from './OrderStatus'
import CashSummary from './CashSummary'

export default {
  name: 'CloseCashbook',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
    }
  },
  mounted() {
    this.resetForm()
  },
  components: {
    AppCardPopup,
    InputNumber,
    OrderStatus,
    CashSummary,
  },
  computed: {
    ...mapState({
      form: (state) => state.storeCashBook.form,
      errorMessage: (state) => state.storeCashBook.errorMessage,
      typeForm: (state) => state.storeCashBook.typeForm,
      loadingForm: (state) => state.storeCashBook.loadingForm,
    }),
    isCanSave() {
      let status = true
      if (!this.isOrderDone) {
        status = true
      } else if (this.form.cash_end_date && this.form.cash_actual >= 0) {
        status = false
      } else {
        status = true
      }
      return status
    },
    isOrderDone() {
      let status = true
      if (this.form.order_total !== this.form.order_done) {
        status = false
      }
      return status
    },
  },
  methods: {
    resetForm() {
      this.form.cash_actual = 0
      this.form.cash_end_date = Date.now()
    },
    onClose() {
      this.$emit('onClose')
      this.resetForm()
    },
    onSave() {
      const payload = {
        ...this.form,
        cash_status: 'closed',
      }
      this.$emit('onSave', payload)
    },
  },
}
</script>
