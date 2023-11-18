<template>
    <div id="CashbookFilter" class="width width-100">
        <el-select 
            v-model="selectedLabel" 
            :placeholder="placeholder"
            popper-class="cashbook-custom-filter"
            :clearable="true"
            @clear="onClear"
            @focus="onOpenPopup">
        </el-select>
        
        <AppCardPopup 
            v-if="visiblePopup" 
            title="Pilih Buku Kas" 
            @onClose="onClosePopup">
            <div class="width width-100">
                <div class="width width-100 display-flex space-between">
                    <div style="width: calc(100% - 50px);">
                        <SearchField 
                            :placeholder="'Cari buku kas ..'" 
                            :enableResponsive="true" 
                            :onChange="(data) => onSearch(data)" />
                    </div>
                    <button 
                        class="btn btn-icon btn-white" 
                        @click="onRefresh">
                        <i class="fa fa-lw fa-retweet"></i>
                    </button>
                </div>
                <div v-loading="loading" class="width width-100">
                    <AppEmpty v-if="data.length === 0" />
                    <div v-for="(item, i) in data" :key="i" class="margin margin-top-15px margin-bottom-15px">
                        <div class="card no-padding border-full">
                            <div class="padding padding-15px display-flex space-between align-center">
                                <div class="width width-60px">
                                    <div class="image image-45px bg-white-grey">
                                        <i class="post-middle-absolute icn fa fa-lw fa-book-open"></i>
                                    </div>
                                </div>
                                <div style="width: calc(100% - 100px);">
                                    <div v-if="item.cash_date !== item.cash_end_date">
                                        <span class="fonts fonts-10 semibold">
                                            {{ item.cash_date | moment("DD MMMM YYYY") }}
                                        </span>
                                        <span v-if="item.cash_end_date" class="fonts fonts-10 semibold">
                                            - {{ item.cash_end_date | moment("DD MMMM YYYY") }}
                                        </span>
                                    </div>
                                    <div v-else class="fonts fonts-10 semibold">
                                        {{ item.cash_date | moment("DD MMMM YYYY") }}
                                    </div>
                                </div>
                                <div class="width width-40px">
                                    <button 
                                        :class="`btn btn-icon ${selectedID === item.id ? 'btn-main' : 'btn-sekunder'}`" 
                                        @click="onChange(item.id)">
                                        <i class="fa fa-lw fa-check"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="width width-100 display-flex flex-end align-center">
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
        </AppCardPopup>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import SearchField from '../../../modules/SearchField'
import AppCardPopup from '../../../modules/AppCardPopup'
import AppEmpty from '../../../modules/AppEmpty'
import moment from 'moment'

export default {
    name: 'CashbookFilter',
    data () {
        return {
            visiblePopup: false,
            currentPage: 1,
            selectedID: '',
            selectedLabel: !this.disabledAllLabel ? 'Semua Buku Kas' : '',
        }
    },
    mounted () {
        this.selectedID = this.findCurrentID(this.value)
        this.selectedLabel = this.findCurrentData(this.value)
    },
    components: {
        SearchField,
        AppCardPopup,
        AppEmpty,
    },
    computed: {
        ...mapState({
            data: (state) => state.storeCashBook.customFilter.data,
            totalRecord: (state) => state.storeCashBook.customFilter.totalRecord,
            limit: (state) => state.storeCashBook.customFilter.limit,
            filter: (state) => state.storeCashBook.customFilter.filter,
            loading: (state) => state.storeCashBook.customFilter.loading,
        }),
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
    },
    props: {
        value: {
            default: null,
            required: true,
        },
        placeholder: {
            default: 'Pilih Buku Kas',
            required: false,
        },
        disabledAllLabel: {
            default: false,
            required: false,
        },
    },
    watch: {
        shopId (props, prevProps) {
            if (props !== prevProps) {
                this.getData()
            }
        },
        value (props) {
            this.selectedID = this.findCurrentID(props)
            this.selectedLabel = this.findCurrentData(props)
        }
    },
    methods: {
        ...mapActions({
            getDataCustomFilter: 'storeCashBook/getDataCustomFilter',
            resetFilter: 'storeCashBook/resetCustomFilterFilter',
            setPagination: 'storeCashBook/setCustomFilterPagination',
        }),
        onOpenPopup () {
            this.visiblePopup = true 
            this.resetFilter()
            this.getData()
        },
        onClosePopup () {
            this.visiblePopup = false 
        },
        onChange (value) {
            this.visiblePopup = false 
            this.$emit('onChange', value)
        },
        onClear () {
            this.selectedID = ''
            this.$emit('onChange', '')
        },
        onSearch (value) {
            this.filter.search = value  
            this.resetFilter()
            this.getData()
        },
        handleCurrentChange (value) {
            this.setPagination(value)
            this.getData()
        },
        onRefresh () {
            this.getData()
        },
        findCurrentID (value) {
            return value ? value : ''
        },
        findCurrentData (value) {
            let label = !this.disabledAllLabel ? 'Semua Buku Kas' : ''
            let find = this.data && this.data.find((item) => item.id === value)
            if (find !== undefined) {
                if (find.cash_date !== find.cash_end_date) {
                    label = moment(find.cash_date).format("DD MMMM YYYY")
                    if (find.cash_end_date) {
                        label = `${moment(find.cash_date).format("DD MMMM YYYY")} - ${moment(find.cash_end_date).format("DD MMMM YYYY")}`
                    }
                } else {
                    label = moment(find.cash_date).format("DD MMMM YYYY")
                }
            }
            return label
        },
        getData () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            if (shop_id) {
                this.getDataCustomFilter({ token, shop_id })
            }
        }
    }
}
</script>