<template>
    <div id="CloseCashbook">
        <AppCardPopup 
            title="Tutup Buku Kas" 
            @onClose="onClose">
            <div>
                <div class="margin margin-bottom-15px">
                    <div class="fonts fonts-11 normal black">
                        Buku Kas ini akan diubah menjadi "Tutup" dan kamu bisa download laporan untuk Buku Kas ini.
                    </div>
                </div>
                <div class="margin margin-bottom-15px">
                    <div class="fonts fonts-11 semibold black">
                        {{ form.cash_date | moment("DD MMMM YYYY") }}
                    </div>
                    <div class="field-group">
                        <OrderStatus :data="form" />
                        <el-alert
                            v-if="form.order_total !== form.order_done"
                            title="Masih ada pesanan yang diproses !"
                            description='Untuk menutup buku kas semua pesanan harus sudah "Selesai".'
                            type="error"
                            :closable="false"
                            show-icon 
                            class="width width-100 margin margin-top-15px">
                        </el-alert>
                    </div>
                    <div class="field-group">
                        <div class="field-label">Kas Summary</div>
                        <div class="fonts medium semibold main-color overflow-ellipsis">
                            {{ format(form && form.cash_summary || 0) }}
                        </div>
                    </div>
                    <div class="field-group">
                        <div class="field-label">Kas Aktual</div>
                        <div class="field-caption">
                            Kas aktual adalah kas/uang yang ada di kasir saat ini.
                        </div>
                        <div class="field-caption">
                            Atur kas aktual untuk buku kas ini agar dapat dibandingkan dengan kas yang ada di sistem.
                        </div>
                        <input-number
                            class="width width-100"
                            v-model="form.cash_actual"
                            thousand-separated
                            :min="0"
                            placeholder="0"
                            :disabled="!isOrderDone"
                            >
                            <template>Rp</template>
                        </input-number>
                        <div 
                            v-if="errorMessage.cash_actual" 
                            class="field-error">
                            {{ errorMessage.cash_actual && errorMessage.cash_actual[0] }}
                        </div>
                    </div>
                    <div v-if="form.cash_actual" class="width width-100 margin margin-bottom-15px">
                        <el-alert
                            v-if="form.cash_summary > form.cash_actual"
                            title="Kas Aktual Tidak Sama dengan Kas Summary !"
                            description="Sepertinya Kas Summary dan kas aktual tidak sama, mohon cek kembali kas yang ada."
                            type="error"
                            :closable="false"
                            show-icon >
                        </el-alert>
                    </div>
                    <div class="field-group">
                        <div class="field-label">Tanggal Tutup</div>
                        <el-date-picker 
                            placeholder="Pilih tanggal"
                            type="date"
                            format="dd MMMM yyyy"
                            v-model="form.cash_end_date"
                            :picker-options="pickerOptions"
                            :disabled="!isOrderDone"
                            style="width: 100% !important;"></el-date-picker>
                        <div 
                            v-if="errorMessage.cash_end_date" 
                            class="field-error">
                            {{ errorMessage.cash_end_date && errorMessage.cash_end_date[0] }}
                        </div>
                    </div>
                </div>
                <div class="width width-100">
                    <div class="field-group display-flex space-between">
                        <div style="width: calc(50% - 7.5px);">
                            <button 
                                class="btn btn-grey btn-full" 
                                @click="onClose">
                                Kembali
                            </button>
                        </div>
                        <div style="width: calc(50% - 7.5px);">
                            <button 
                                :disabled="isCanSave"
                                class="btn btn-main btn-full"
                                @click="onSave">
                                Tutup Buku Kas
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppCardPopup>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import AppCardPopup from '../../../modules/AppCardPopup'
import InputNumber from '../../../modules/InputNumber'
import OrderStatus from './OrderStatus'

export default {
    name: 'CloseCashbook',
    data () {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                },
            }
        }
    },
    mounted () {
        this.resetForm()
    },
    components: {
        AppCardPopup,
        InputNumber,
        OrderStatus,
    },
    computed: {
        ...mapState({
            form: (state) => state.storeCashBook.form,
            errorMessage: (state) => state.storeCashBook.errorMessage,
            typeForm: (state) => state.storeCashBook.typeForm,
            loadingForm: (state) => state.storeCashBook.loadingForm,
        }),
        isCanSave () {
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
        isOrderDone () {
            let status = true 
            if (this.form.order_total !== this.form.order_done) {
                status = false 
            }
            return status 
        }
    },
    methods: {
        resetForm () {
            this.form.cash_actual = 0
            this.form.cash_end_date = Date.now()
        },
        onClose () {
            this.$emit('onClose')
            this.resetForm()
        },
        onSave () {
            const payload = {
                ...this.form, 
                cash_status: 'closed'
            }
            this.$emit('onSave', payload)
        }
    }
}
</script>