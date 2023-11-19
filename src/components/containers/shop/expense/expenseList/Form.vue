<template>
    <div id="App">
        <AppSideForm 
            :title="title" 
            :enableSaveButton="!isDetailForm"
            :onSave="onSave"
            :onClose="onClose">
            <div class="margin margin-bottom-20px">
                <div class="fonts fonts-13 black semibold">Informasi</div>
                <div class="field-group">
                    <div class="field-label">Cover</div>
                    <div class="width width-80px">
                        <div class="image image-padding border border-full">
                            <img 
                                v-if="form.image" 
                                :src="getCover" 
                                alt="" 
                                class="post-center">
                            <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                        </div>
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">ID Pengeluaran</div>
                    <el-input 
                        placeholder=""
                        type="text"
                        v-model="form.expense_list_id"
                        :disabled="true"></el-input>
                    <div 
                        v-if="errorMessage.expense_list_id" 
                        class="field-error">
                        {{ errorMessage.expense_list_id && errorMessage.expense_list_id[0] }}
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">Tipe Pengeluaran</div>
                    <el-select 
                        v-model="form.expense_type_id" 
                        :loading="loadingExpenseType"
                        clearable
                        placeholder="Pilih tipe pengeluaran"
                        no-data-text="Data Tidak Ditemukan"
                        :disabled="isDetailForm"
                        style="width: 100%;">
                        <el-option
                            v-for="(item, i) in expenseType"
                            :key="i"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div 
                        v-if="errorMessage.expense_type_id" 
                        class="field-error">
                        {{ errorMessage.expense_type_id && errorMessage.expense_type_id[0] }}
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">Buku Kas</div>
                    <cashbook-field 
                        :value.sync="form.cashbook_id"
                        :disabledAllLabel="true"
                        placeholder="Pilih buku kas"
                        @onChange="handleFilterCashbook"></cashbook-field>
                    <div 
                        v-if="errorMessage.cashbook_id" 
                        class="field-error">
                        {{ errorMessage.cashbook_id && errorMessage.cashbook_id[0] }}
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">Pembayaran</div>
                    <el-select 
                        v-model="form.payment_id" 
                        :loading="loadingPayment"
                        clearable
                        placeholder="Pilih pembayaran"
                        no-data-text="Data Tidak Ditemukan"
                        :disabled="isDetailForm"
                        style="width: 100%;">
                        <el-option
                            v-for="(item, i) in dataPayment"
                            :key="i"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div 
                        v-if="errorMessage.payment_id" 
                        class="field-error">
                        {{ errorMessage.payment_id && errorMessage.payment_id[0] }}
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">Tanggal</div>
                    <el-date-picker 
                        placeholder="Pilih tanggal"
                        type="date"
                        format="dd MMMM yyyy"
                        v-model="form.expense_date"
                        :disabled="isDetailForm"
                        :picker-options="pickerOptions"
                        style="width: 100% !important;"></el-date-picker>
                    <div 
                        v-if="errorMessage.expense_date" 
                        class="field-error">
                        {{ errorMessage.expense_date && errorMessage.expense_date[0] }}
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">Biaya</div>
                    <input-number
                        class="width width-100"
                        v-model="form.expense_price"
                        thousand-separated
                        :min="0"
                        placeholder="0"
                        :disabled="isDetailForm"
                        >
                        <template>Rp</template>
                    </input-number>
                    <div 
                        v-if="errorMessage.expense_price" 
                        class="field-error">
                        {{ errorMessage.expense_price && errorMessage.expense_price[0] }}
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">Keterangan (opsional)</div>
                    <el-input 
                        placeholder=""
                        type="textarea"
                        v-model="form.description"
                        :disabled="isDetailForm"
                        :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                    <div 
                        v-if="errorMessage.description" 
                        class="field-error">
                        {{ errorMessage.description && errorMessage.description[0] }}
                    </div>
                </div>
            </div>

            <div class="margin margin-bottom-0px">
                <div class="fonts fonts-13 black semibold">Konfigurasi</div>
                <div class="field-group">
                    <div class="display-flex space-between">
                        <div class="field-label">Status</div>
                        <el-switch 
                            v-model="form.status"
                            :disabled="isDetailForm"
                            :active-value="'active'"
                            :inactive-value="'inactive'"
                            active-text="Aktif"
                            inactive-text="Non-aktif"></el-switch>
                    </div>
                    <div 
                        v-if="errorMessage.status" 
                        class="field-error">
                        {{ errorMessage.status && errorMessage.status[0] }}
                    </div>
                </div>
            </div>
        </AppSideForm>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AppSideForm from '../../../../modules/AppSideForm'
import AppImage from '../../../../modules/AppImage'
import InputNumber from '../../../../modules/InputNumber'
import CashbookField from '../../cashBook/Field'

export default {
    name: 'App',
    data () {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            }
        }
    },
    mounted () {},
    computed: {
        ...mapState({
            form: (state) => state.storeExpenseList.form,
            errorMessage: (state) => state.storeExpenseList.errorMessage,
            dayLists: (state) => state.storeExpenseList.dayLists,
            typeForm: (state) => state.storeExpenseList.typeForm,
            dataExpenseType: (state) => state.storeExpenseList.expenseType.data,
            loadingExpenseType: (state) => state.storeExpenseList.expenseType.loading,
            dataPayment: (state) => state.storeExpenseList.payment.data,
            loadingPayment: (state) => state.storeExpenseList.payment.loading,
        }),
        isDetailForm () {
            let status = false 
            if (this.typeForm === 'detail') {
                status = true 
            }
            return status
        },
        getCover () {
            return this.form.image ? this.expenseListImageThumbnailUrl + this.form.image : ''
        },
        title () {
            let currentTitle = ''
            switch (this.typeForm) {
                case 'create':
                    currentTitle = 'Tambah Pengeluaran'
                    break
                case 'detail':
                    currentTitle = 'Detail Pengeluaran'
                    break
                case 'edit':
                    currentTitle = 'Edit Pengeluaran'
                    break
            }
            return currentTitle
        },
        expenseType () {
            return this.dataExpenseType.filter((item) => item.value !== '')
        }
    },
    components: {
        AppSideForm,
        AppImage,
        InputNumber,
        CashbookField,
    },
    methods: {
        handleFilterCashbook (value) {
            this.form.cashbook_id = value
        },
        uploadImage (data) {
            this.$emit('uploadImage', data)
        },
        removeImage (data) {
            this.$emit('removeImage', data)
        },
        onSave () {
            this.$emit('onSave')
        },
        onClose () {
            this.$emit('onClose')
        },
    },
}
</script>