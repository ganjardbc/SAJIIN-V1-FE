<template>
    <div id="App">
        <AppSideForm 
            :title="'Edit Pesanan'" 
            :subtitle="form.order_id"
            :enableCustomFooter="true"
            :onClose="onClose">
            <div class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px">
                <div class="fonts fonts-10 semibold black">Pesanan</div>
                <div class="field-group">
                    <div class="field-label">Kasir</div>
                    <el-input 
                        placeholder="Nama Kasir"
                        type="text"
                        v-model="form.cashier_name"></el-input>
                </div>
                <div class="field-group">
                    <div class="field-label">Buku Kas</div>
                    <el-select 
                        v-model="form.cashbook_id" 
                        :loading="loadingCashbook"
                        clearable
                        placeholder="Pilih Buku Kas"
                        no-data-text="Data Kosong">
                        <el-option
                            v-for="(item, i) in stateCashbookList"
                            :key="i"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px">
                <div class="fonts fonts-10 semibold black">Pelanggan</div>
                <div class="field-group">
                    <div class="field-label">Nama</div>
                    <el-input 
                        placeholder="Nama Pelanggan"
                        type="text"
                        v-model="form.customer_name"></el-input>
                </div>
                <div class="field-group">
                    <div class="field-label">Meja</div>
                    <FieldTable 
                        class="margin margin-top-15px"
                        :value="form.table_id"
                        @onChange="onChangeTable"
                        @onClear="onClearTable" />
                </div>
            </div>
 
            <div slot="footer">
                <button 
                    class="btn btn-main btn-full"
                    @click="onSave">
                    Simpan Pesanan
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
import FieldTable from '../../../tables/Field'

export default {
    name: 'App',
    data () {
        return {
            visibleAddProduct: false 
        }
    },
    mounted () {
        this.selectedIndex = 0
    },
    watch: {
        formId () {
            this.selectedIndex = 0
        }
    },
    computed: {
        ...mapState({
            form: (state) => state.storeOrders.form,
            errorMessage: (state) => state.storeOrders.errorMessage,
            typeForm: (state) => state.storeOrders.typeForm,
            category: (state) => state.storeCategory.data,
            loadingCashbook: (state) => state.storeCashBook.loading,
            dataCurrent: (state) => state.storeCashBook.dataCurrent,
        }),
        stateCashbookList () {
            const data = this.dataCurrent && this.dataCurrent.all_cashbook
            const filtered = this.cashBookList(data)
            return filtered.filter((item) => item.value !== '')
        },
        formId: {
            get () {
                return this.$store.state.storeOrders.form.id
            },
            set (value) {
                this.$store.state.storeOrders.form.id = value
            }
        },
    },
    components: {
        AppCardCapsule,
        AppSideForm,
        AppEmpty,
        FieldTable,
    },
    methods: {
        isActiveOrder (data) {
            let status = false
            if (data.status === 'new-order') status = true 
            if (data.status === 'on-progress') status = true 
            return status
        },
        onSave () {
            this.$emit('onSave')
        },
        onClose () {
            this.$emit('onClose')
        },

        // TABLE 
        onChangeTable (data) {
            this.form.table_id = data.id 
            this.form.table_name = data.name 
            this.form.table = data 
        },
        onClearTable () {
            this.form.table_id = ''
            this.form.table_name = ''
            this.form.table = null
        },
    },
}
</script>