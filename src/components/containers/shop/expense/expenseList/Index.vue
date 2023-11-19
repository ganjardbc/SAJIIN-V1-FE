<template>
    <div 
        id="App" 
        :class="formClass ? 'content-form' : 'content-form hide'">
        <div class="left">
            <div class="display-flex space-between display-mobile margin margin-bottom-15px">
                <div class="width width-75 width-mobile display-flex space-between">
                    <h1 class="fonts big black bold">Pengeluaran</h1>
                    <div class="display-flex">
                        <button 
                            class="btn btn-icon btn-white" 
                            @click="onRefresh">
                            <i class="fa fa-lw fa-retweet"></i>
                        </button>
                        <button 
                            class="btn btn-icon btn-white" 
                            @click="onCreate">
                            <i class="fa fa-lw fa-plus" />
                        </button>
                    </div>
                </div>
                <div class="width width-25 width-mobile">
                    <SearchField 
                        :placeholder="'Cari pengeluaran ..'" 
                        :enableResponsive="true" 
                        :onChange="(data) => onSearch(data)" />
                </div>
            </div>

            <div class="display-flex row-reverse space-between align-center display-mobile">
                <div 
                    class="width width-350px width-mobile display-flex space-between" 
                    style="padding-bottom: 15px;">
                    <el-select 
                        v-model="filter.expense_type_id" 
                        @change="handleFilterSearch"
                        :loading="loadingExpenseType"
                        clearable
                        placeholder="Select expense type"
                        no-data-text="Data Tidak Ditemukan"
                        style="width: calc(50% - 7.5px);">
                        <el-option
                            v-for="(item, i) in dataExpenseType"
                            :key="i"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <cashbook-field 
                        :value.sync="filter.cashbook_id"
                        @onChange="handleFilterCashbook"
                        style="width: calc(50% - 7.5px);"></cashbook-field>
                </div>
                <div 
                    class="width width-300px width-mobile" 
                    style="padding-bottom: 15px;">
                    <AppTabs 
                        :selectedIndex.sync="selectedIndex" 
                        :isFull="true"
                        :isScrollable="false"
                        :data="tabs" 
                        :onChange="(data) => onChangeTabs(data)"
                    />
                </div>
            </div>

            <div class="width width-100">
                <div v-loading="loading">
                    <AppEmpty v-if="data.length === 0" />
                    <Card 
                        :data.sync="data"
                        @onChangeCover="uploadImage"
                        @onDetail="onDetail"
                        @onEdit="onEdit"
                        @onDelete="onDelete"
                        @onChangeStatus="onChangeStatus"
                        @onQrCode="onOpenQrCode" />
                </div>
                <div class="width width-100 display-flex flex-end align-center padding padding-top-15px">
                    <div class="fonts fonts-10 normal black">Total {{ totalRecord }}</div>
                    <el-pagination
                        background
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="limit"
                        :pager-count="5"
                        layout="prev, pager, next"
                        :total="totalRecord">
                    </el-pagination>
                </div>
            </div>

        </div>

        <div class="right">
            <Form 
                @uploadImage="uploadImage"
                @removeImage="removeImage"
                @onSave="onOpenVisibleConfirmed"
                @onClose="onClose">
            </Form>

            <AppFileUpload 
                v-if="visibleUpdateCover"
                @onClose="onCloseCover"
                @onUpload="onUpdateCover"
            />

            <AppPopupConfirmed 
                v-if="visibleConfirmed"
                :title="titleConfirmed"
                @onClickNo="onClickNo"
                @onClickYes="onClickYes"
            />

            <AppPopupConfirmed 
                v-if="visibleConfirmedDelete"
                :title="'Hapus pengeluaran ?'"
                @onClickNo="onClickNoDelete"
                @onClickYes="onClickYesDelete"
            />

            <AppPopupAlert 
                v-if="visibleAlert"
                :title="titleAlert"
                :icon="iconAlert"
                @onClickOk="onClickOk"
            />

            <AppPopupQrCode 
                v-if="visibleQrCode"
                :code="`${initUrl}visitor/${paramShopId}/${form.table_id}`"
                @onClose="onCloseQrCode"
            />

            <AppPopupLoader 
                v-if="loadingForm"
            />
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AppEmpty from '../../../../modules/AppEmpty'
import AppPopupLoader from '../../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../../modules/AppPopupAlert'
import AppFileUpload from '../../../../modules/AppFileUpload'
import AppPopupQrCode from '../../../../modules/AppPopupQrCode'
import AppTabs from '../../../../modules/AppTabs'
import SearchField from '../../../../modules/SearchField'
import CashbookField from '../../cashBook/Field'
import Form from './Form'
import Card from './Card'

const tabs = [
    {id: 1, label: 'Aktif', status: 'active'},
    {id: 2, label: 'Non-Aktif', status: ''},
]

export default {
    name: 'App',
    metaInfo: {
        title: 'Shop',
        titleTemplate: '%s | Expense List',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            tabs: tabs,
            formClass: false,
            visibleUpdateCover: false,
            visibleAlert: false,
            visibleQrCode: false,
            titleAlert: 'Gagal memproses data',
            iconAlert: 'fa fa-4x fa-info-circle',
            visibleConfirmed: false,
            visibleConfirmedDelete: false,
            titleConfirmed: 'Simpan data ?',
            currentPage: 0,
            selectedIndex: 0,
        }
    },
    mounted () {
        this.getPaymentData()
        this.getExpenseTypeData()
        this.onChangeTabs(0)
    },
    components: {
        AppEmpty,
        AppPopupLoader,
        AppPopupConfirmed,
        AppPopupAlert,
        AppFileUpload,
        AppPopupQrCode,
        AppTabs,
        SearchField,
        CashbookField,
        Form,
        Card,
    },
    computed: {
        ...mapState({
            filter: (state) => state.storeExpenseList.filter,
            form: (state) => state.storeExpenseList.form,
            data: (state) => state.storeExpenseList.data,
            totalRecord: (state) => state.storeExpenseList.totalRecord,
            limit: (state) => state.storeExpenseList.limit,
            loading: (state) => state.storeExpenseList.loading,
            loadingForm: (state) => state.storeExpenseList.loadingForm,
            typeForm: (state) => state.storeExpenseList.typeForm,
            dataExpenseType: (state) => state.storeExpenseList.expenseType.data,
            loadingExpenseType: (state) => state.storeExpenseList.expenseType.loading,
        }),
        typeForm: {
            get () {
                return this.$store.state.storeExpenseList.typeForm
            },
            set (value) {
                this.$store.state.storeExpenseList.typeForm = value
            }
        },
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
        paramShopId () {
            return this.$route.params.shopId
        },
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.getPaymentData()
                this.getExpenseTypeData()
                this.getData()
            }
        }
    },
    methods: {
        ...mapActions({
            getDataExpenseList: 'storeExpenseList/getData',
            getDataExpenseType: 'storeExpenseList/getDataExpenseType',
            getDataPayment: 'storeExpenseList/getDataPayment',
            setPagination: 'storeExpenseList/setPagination',
            resetFormData: 'storeExpenseList/resetFormData',
            resetFilter: 'storeExpenseList/resetFilter',
            setFormData: 'storeExpenseList/setFormData',
            createData: 'storeExpenseList/createData',
            updateData: 'storeExpenseList/updateData',
            deleteData: 'storeExpenseList/deleteData',
            uploadCover: 'storeExpenseList/uploadCover',
        }),
        onSearch (data) {
            this.filter.search = data 
            this.resetFilter()
            this.getData()
        },
        onClose () {
            this.formClass = false
        },
        onRefresh () {
            this.getData()
        },
        onChangeTabs (data) {
            this.selectedIndex = data
            switch (this.selectedIndex) {
                case 0:
                    this.filter.status = 'active'
                    break
                case 1:
                    this.filter.status = 'inactive'
                    break
            }
            this.handleFilterSearch()
        },

        // LIST DATA 
        getPaymentData () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId 
            if (shop_id) {
                this.getDataPayment({
                    token, 
                    shop_id: shop_id
                })
            }
        },
        getExpenseTypeData () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId 
            if (shop_id) {
                this.getDataExpenseType({ 
                    token, 
                    shop_id: shop_id
                })
            }
        },
        getCashBookData () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId 
            if (shop_id) {
                this.getDataCashBook({ 
                    token, 
                    shop_id: shop_id
                })
            }
        },
        getData () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            if (shop_id) {
                this.getDataExpenseList({ token, shop_id })
            }
        },
        handleCurrentChange (value) {
            this.setPagination(value)
            this.getData()
        },
        handleFilterSearch () {
            this.currentPage = 1
            this.handleCurrentChange(1)
        },
        handleFilterCashbook (value) {
            this.filter.cashbook_id = value 
            this.getData()
        },

        // ALERT
        onClickOk () {
            this.visibleAlert = false
        },

        // CONFIRMED
        onClickNo () {
            this.visibleConfirmed = false 
        },
        onClickYes () {
            this.visibleConfirmed = false 
            const token = this.$cookies.get('tokenBearer')
            switch (this.typeForm) {
                case 'create':
                    this.createData({
                        ...this.form,
                        token: token
                    }).then((res) => {
                        const status = res.data.status 
                        if (status === 'ok') {
                            this.formClass = false 
                            this.getData()
                        } else {
                            this.$message({
                                message: 'Gagal menyimpan pengeluaran',
                                type: 'error'
                            })
                        }
                    })
                    break
                case 'edit':
                    this.updateData({
                        ...this.form,
                        token: token
                    }).then((res) => {
                        const status = res.data.status 
                        if (status === 'ok') {
                            this.formClass = false 
                            this.getData()
                        } else {
                            this.$message({
                                message: 'Gagal merubah pengeluaran',
                                type: 'error'
                            })
                        }
                    })
                    break
            }
        },

        // SAVE
        onOpenVisibleConfirmed () {
            this.visibleConfirmed = true
            switch (this.typeForm) {
                case 'create':
                    this.titleConfirmed = 'Simpan data ?'
                    break
                case 'edit':
                    this.titleConfirmed = 'Simpan perubahan ?'
                    break
            }
        },

        // CREATE
        onCreate () {
            this.formClass = true
            this.typeForm = 'create'
            this.resetFormData()
            this.form.shop_id = this.shopId
        },

        // DETAIL
        onDetail (data) {
            this.formClass = true
            this.typeForm = 'detail'
            this.resetFormData()
            this.setFormData(data)
        },

        // EDIT
        onEdit (data) {
            this.formClass = true
            this.typeForm = 'edit'
            this.resetFormData()
            this.setFormData(data)
        },

        // DELETE
        onDelete (data) {
            this.visibleConfirmedDelete = true 
            this.setFormData(data)
        },
        onClickNoDelete () {
            this.visibleConfirmedDelete = false 
        },
        onClickYesDelete () {
            this.visibleConfirmedDelete = false 
            const token = this.$cookies.get('tokenBearer')
            this.deleteData({
                ...this.form,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.getData()
                } else {
                    this.visibleAlert = true 
                    this.titleAlert = 'Gagal menghapus pengeluaran'
                }
            })
        },

        // IMAGE
        uploadImage (data) {
            this.visibleUpdateCover = true
            this.setFormData(data)
        },
        removeImage () {
            console.log('removeImage')
        },
        onCloseCover () {
            this.visibleUpdateCover = false 
        },
        onUpdateCover (data) {
            this.visibleUpdateCover = false 
            const token = this.$cookies.get('tokenBearer')
            this.uploadCover({
                ...this.form,
                image: data,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.getData()
                } else {
                    this.visibleAlert = true 
                    this.titleAlert = 'Gagal upload cover'
                }
            })
        },

        // STATUS
        onChangeStatus (data) {
            this.setFormData(data)
            const token = this.$cookies.get('tokenBearer')
            this.updateData({
                ...this.form,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.$message(`Berhasil merubah status pengeluaran ${data.expense_list_id}.`);
                } else {
                    this.$message(`Gagal merubah status pengeluaran ${data.expense_list_id}.`);
                }
            })
        },

        // QR CODE
        onOpenQrCode (data) {
            this.visibleQrCode = true 
            this.setFormData(data)
        },
        onCloseQrCode () {
            this.visibleQrCode = false 
        }
    }
}
</script>