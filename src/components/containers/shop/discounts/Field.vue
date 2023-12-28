<template>
    <div id="AppFieldDiscounts">
        <div v-loading="loading" :class="`card no-padding bg-white border-full ${smallField && 'border-small-radius'}`">
            <div 
                class="display-flex space-between align-center" 
                :style="`padding: ${smallField ? '4px' : '10px 15px'};`">
                <div v-if="selectedData" class="display-flex align-center" style="width: calc(100% - 40px);">
                    <div :style="`width: ${smallField ? '35px' : '45px'} ; margin-right: 15px`">
                        <div class="image image-padding border-full">
                            <img 
                                v-if="selectedData.discount_image" 
                                :src="selectedData ? (discountImageThumbnailUrl + selectedData.discount_image) : ''" 
                                alt="" 
                                class="post-center">
                            <i v-else class="post-middle-absolute icn fa fa-lg fa-percentage"></i>
                        </div>
                    </div>
                    <div :style="`width: ${smallField ? 'calc(100% - 50px)' : 'calc(100% - 60px)'};`">
                        <div class="width width-100">
                            <div v-if="selectedData" :class="`fonts ${smallField ? 'fonts-9' : 'fonts-10'} semibold black`">
                                {{ selectedData.discount_name }}
                            </div>
                            <div v-if="selectedData" :class="`fonts ${smallField ? 'fonts-9' : 'fonts-10'} grey`">
                                Diskon {{ selectedData.discount_value_type === 'percentage' 
                                    ? `${selectedData.discount_value}%` 
                                    : `${format(selectedData.discount_value)}` }} 
                                {{ selectedData.discount_type === 'transaction' 
                                    ? 'Per Transaksi' 
                                    : 'Per Produk' }} 
                            </div>
                            <div v-if="!disabledSelection" :class="`fonts ${smallField ? 'fonts-9' : 'fonts-10'} grey`">
                                1 Diskon dipilih
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else :class="`fonts ${smallField ? 'fonts-9' : 'fonts-10'} semibold black`" :style="`padding-left: ${smallField ? '11px' : ''};`">
                    {{ label ? label : 'Pilih Diskon' }} <span v-if="!disabledOpsional" :class="`fonts ${smallField ? 'fonts-9' : 'fonts-10'} normal grey`">(opsional)</span>
                </div>
                <div class="display-flex">
                    <button v-if="selectedData" :class="`btn btn-white ${smallField ? 'btn-small-icon' : 'btn-icon'}`" @click="onClear">
                        <i :class="`fa ${smallField ? 'fa-lw' : 'fa-lg'} fa-times`"></i>
                    </button>
                    <button v-else :class="`btn btn-white ${smallField ? 'btn-small-icon' : 'btn-icon'}`" @click="onOpen">
                        <i :class="`fa ${smallField ? 'fa-lw' : 'fa-lg'} fa-chevron-right`"></i>
                    </button>
                </div>
            </div>
        </div>

        <AppCardPopup 
            v-if="visiblePopup" 
            title="Pilih Diskon" 
            @onClose="onClose">
            <div class="width width-100">
                <div class="width width-100 display-flex space-between">
                    <div style="width: calc(100% - 50px);">
                        <SearchField 
                            :placeholder="'Cari diskon ..'" 
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
                    <div v-for="(dt, i) in data" :key="i" class="margin margin-top-15px margin-bottom-15px">
                        <div class="card no-padding border-full">
                            <div class="padding padding-15px display-flex space-between align-center">
                                <div class="width width-60px">
                                    <div class="image image-45px border-full">
                                        <img v-if="dt.discount_image" :src="discountImageThumbnailUrl + dt.discount_image" alt="" class="post-center">
                                        <i v-else class="post-middle-absolute icn fa fa-lg fa-percentage"></i>
                                    </div>
                                </div>
                                <div style="width: calc(100% - 100px);">
                                    <div class="fonts fonts-10 semibold">{{ dt.discount_name }}</div>
                                    <div class="fonts fonts-9 grey">
                                        Diskon 
                                        {{ dt.discount_value_type === 'percentage' 
                                            ? `${dt.discount_value}%` 
                                            : `${format(dt.discount_value)}` }} 
                                        {{ dt.discount_type === 'transaction' 
                                            ? 'Per Transaksi' 
                                            : 'Per Produk' }} 
                                    </div>
                                </div>
                                <div class="width width-40px">
                                    <button 
                                        :class="`btn btn-icon ${selectedID === dt.id ? 'btn-main' : 'btn-sekunder'}`" 
                                        @click="onChange(dt)">
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
import AppEmpty from '../../../modules/AppEmpty'
import AppCardPopup from '../../../modules/AppCardPopup'

export default {
    name: 'AppFieldDiscounts',
    data () {
        return {
            visiblePopup: false,
            currentPage: 1,
            selectedID: null,
        }
    },
    mounted () {
        this.selectedID = this.value
        this.getDataField()
    },
    components: {
        SearchField,
        AppEmpty,
        AppCardPopup
    },
    props: {
        value: null,
        label: null,
        smallField: false,
        disabledOpsional: false,
        disabledSelection: false,
        discountType: null,
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.getDataField()
            }
        },
        value(props) {
            this.selectedID = props 
        }
    },
    computed: {
        ...mapState({
            data: (state) => state.storeDiscount.field.data,
            totalRecord: (state) => state.storeDiscount.field.totalRecord,
            limit: (state) => state.storeDiscount.field.limit,
            filter: (state) => state.storeDiscount.field.filter,
            loading: (state) => state.storeDiscount.field.loading,
        }),
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
        selectedData () {
            return this.data.find((item) => item.id === this.selectedID)
        }
    },
    methods: {
        ...mapActions({
            getFieldData: 'storeDiscount/getFieldData',
            resetFilter: 'storeDiscount/resetFieldFilter',
            setPagination: 'storeDiscount/setFieldPagination',
        }),
        onClose () {
            this.visiblePopup = false 
        },
        onOpen () {
            this.visiblePopup = true 
            this.resetFilter()
            this.getDataField()
        },
        onChange (data) {
            this.visiblePopup = false 
            this.$emit('onChange', data)
        },
        onClear () {
            this.$emit('onClear')
        },
        onRefresh () {
            this.getDataField()
        },
        onSearch (data) {
            this.filter.search = data 
            this.resetFilter()
            this.getDataField()
        },
        handleCurrentChange (value) {
            this.setPagination(value)
            this.getDataField()
        },

        // LIST DATA
        getDataField () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            const discount_type = this.discountType ? this.discountType : ''
            this.getFieldData({ token, shop_id, discount_type })
        },
    }
}
</script>