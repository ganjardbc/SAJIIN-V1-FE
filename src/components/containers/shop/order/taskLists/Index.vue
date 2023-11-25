<template>
    <div id="App">
        <div class="width width-100">
            <div class="display-flex space-between display-mobile margin margin-bottom-15px">
                <div class="width width-60 width-mobile display-flex space-between">
                    <h1 class="fonts big black bold">Task Lists</h1>
                    <div class="display-flex">
                        <button 
                            class="btn btn-icon btn-white" 
                            @click="onRefresh">
                            <i class="fa fa-lw fa-retweet"></i>
                        </button>
                    </div>
                </div>
                <div class="width width-22 width-mobile display-flex space-between">
                    <SearchField 
                        :placeholder="'Cari pesanan ..'" 
                        :enableResponsive="true" 
                        :onChange="(data) => onSearch(data)"
                        class="width width-100 margin margin-mobile-bottom-15px"
                     />
                </div>
                <div class="width width-18 width-mobile display-flex space-between">
                    <cashbook-field 
                        :value.sync="filter.cashbook_id"
                        @onChange="handleFilterCashbook"
                        class="width width-100 margin margin-left-10px margin-mobile-left-none"></cashbook-field>
                </div>
            </div>
            
            <div class="width width-100">
                <div v-loading="loading">
                    <AppEmpty v-if="data.length === 0" />
                    <Card 
                        :data.sync="data"
                        @onViewProduct="onViewProduct"
                        @onChangeOrderStatus="onChangeOrderStatus" />
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

        <div :class="`content-form ${!visibleFormTaskList && 'hide'}`">
            <div class="right">
                <Form 
                    @onClose="onCloseProduct"
                    @onChangeStatus="onChangeStatus"
                    @onChangeOrderStatus="onChangeOrderStatus"></Form>
            </div>
        </div>

        <AppPopupConfirmed 
            v-if="visibleConfirmedStatus"
            :title="titleConfirmedStatus"
            @onClickNo="onClickNoStatus"
            @onClickYes="onClickYesStatus"
        />

        <AppPopupLoader 
            v-if="loadingForm"
        />
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
import Form from './Form'

export default {
    name: 'App',
    metaInfo: {
        title: 'Shop',
        titleTemplate: '%s | Task Lists',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            selectedOrderData: null,
            currentPage: 0,
            visibleFormTaskList: false,
            visibleConfirmedStatus: false,
            titleConfirmedStatus: 'Update status pesanan ?',
        }
    },
    mounted () {
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
        Form
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
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
        paramShopId () {
            const shop = this.$cookies.get('shop')
            return shop.shop_id
        },
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.getData()
            }
        }
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
        onChangeTabs (data) {
            this.selectedIndex = data 
        },
        onSearch (data) {
            this.filter.search = data 
            this.resetFilter()
            this.getData()
        },
        onRefresh () {
            this.getData()
        },

        // LIST DATA 
        getData () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            if (shop_id) {
                this.getTaskList({ token, shop_id })
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

        // VIEW PRODUCT 
        onViewProduct (data) {
            this.setSelected(data)
            this.visibleFormTaskList = true 
        },
        onCloseProduct () {
            this.visibleFormTaskList = false 
        },

        // STATUS 
        onChangeStatus (data) {
            const token = this.$cookies.get('tokenBearer')
            const payload = { ...data }
            this.updateData({ payload, token })
                .then((res) => {
                    const resData = res.data 
                    if (resData.status === 'ok') {
                        const newPayload = {
                            ...this.selected, 
                            details: resData.data 
                        }
                        this.setSelected(newPayload)
                        this.onRefresh()
                        this.$message(`Success changed status for product ${data.product_name}.`)
                    } else {
                        this.$message(`Failed to chang status for product ${data.product_name}.`)
                    }
                })
        },

        // ORDER STATUS
        onClickNoStatus () {
            this.visibleConfirmedStatus = false 
        },
        onClickYesStatus () {
            this.visibleFormOrder = false
            this.visibleConfirmedStatus = false 

            const token = this.$cookies.get('tokenBearer')
            this.updateOrderData({
                ...this.selectedOrderData,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.onRefresh()
                    this.onCloseProduct()
                    this.onSendNotification(this.selectedOrderData)
                    this.$message(`Berhasil merubah status pesanan ${this.selectedOrderData.order_id}.`)
                } else {
                    this.$message(`Gagal merubah status pesanan ${this.selectedOrderData.order_id}.`)
                }
            })
        },
        onChangeOrderStatus (data) {
            this.titleConfirmedStatus = 'Pesanan siap diantarkan ?'
            this.visibleConfirmedStatus = true 
            this.selectedOrderData = data 
        },

        // SEND NOTIFICATION
        onSendNotification (data) {
            const payload = {
                shopId: this.paramShopId,
                orderId: data.order_id,
                shopName: data.shop_name,
                tableName: data.table_name,
                customerName: data.customer_name,
                type: "order-status",
                message: `
                    Status pesanan 
                    ${data.customer_name ? ' atas nama ' + data.customer_name : ''} 
                    berhasil diubah
                `,
            }
            this.$socket.emit('notification', payload)
        },
    }
}
</script>