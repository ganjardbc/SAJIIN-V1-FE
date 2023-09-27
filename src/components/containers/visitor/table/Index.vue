<template>
    <div id="App">
        <div class="card no-padding bg-white border-full">
            <div class="display-flex space-between align-center" style="padding: 10px 15px;">
                <div v-if="selectedData" class="display-flex align-center" style="width: calc(100% - 40px);">
                    <div style="width: 45px; margin-right: 15px">
                        <div class="image image-padding border-full">
                            <img v-if="selectedData.image" :src="selectedData ? (tableImageThumbnailUrl + selectedData.image) : ''" alt="" class="post-center">
                            <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                        </div>
                    </div>
                    <div style="width: calc(100% - 60px);">
                        <div style="width: 100%;">
                            <div class="fonts fonts-10 semibold black">
                                {{ selectedData && selectedData.name }} ({{ selectedData && selectedData.code }})
                            </div>
                            <div class="fonts fonts-10 grey">
                                1 Meja dipilih
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="fonts fonts-10 semibold black">
                    Pilih Meja <span class="fonts fonts-10 normal grey">(opsional)</span>
                </div>
                <div class="display-flex">
                    <button v-if="selectedData" class="btn btn-white btn-icon" @click="onRemove">
                        <i class="fa fa-lg fa-times"></i>
                    </button>
                    <button v-else class="btn btn-white btn-icon" @click="onOpen">
                        <i class="fa fa-lg fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>

        <AppCardPopup 
            v-if="visiblePopup" 
            title="Pilih Meja" 
            @onClose="onClose">
            <div class="width width-100">
                <div class="width width-100 display-flex space-between">
                    <div style="width: calc(100% - 50px);">
                        <SearchField 
                            :placeholder="'Cari meja ..'" 
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
                                    <div class="image image-45px">
                                        <img v-if="dt.image" :src="tableImageThumbnailUrl + dt.image" alt="" class="post-center">
                                        <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                                    </div>
                                </div>
                                <div style="width: calc(100% - 100px);">
                                    <div class="fonts fonts-10 semibold">{{ dt.name }} ({{ dt.code }})</div>
                                    <div class="fonts fonts-9 grey">{{ dt.description }}</div>
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
    name: 'App',
    data () {
        return {
            visiblePopup: false,
            currentPage: 1,
            selectedID: null,
        }
    },
    props: {
        value: null
    },
    mounted () {
        this.getDataTable()
    },
    components: {
        SearchField,
        AppEmpty,
        AppCardPopup
    },
    computed: {
        ...mapState({
            data: (state) => state.storeVisitorTable.data,
            totalRecord: (state) => state.storeVisitorTable.totalRecord,
            limit: (state) => state.storeVisitorTable.limit,
            filter: (state) => state.storeVisitorTable.filter,
            loading: (state) => state.storeVisitorTable.loading,
            dataShop: (state) => state.storeVisitorShop.data,
        }),
        selectedShop () {
            return this.dataShop.shop
        },
        selectedData () {
            return this.data.find((item) => item.id === this.selectedID)
        }
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.getDataTable()
            }
        },
        value(props) {
            this.selectedID = props 
        }
    },
    methods: {
        ...mapActions({
            getData: 'storeVisitorTable/getData',
            resetFilter: 'storeVisitorTable/resetFilter',
            setPagination: 'storeVisitorTable/setPagination',
        }),
        onClose () {
            this.visiblePopup = false 
        },
        onOpen () {
            this.visiblePopup = true 
            this.resetFilter()
            this.getDataTable()
        },
        onChange (data) {
            this.visiblePopup = false 
            this.$emit('onChange', data)
        },
        onRemove () {
            this.$emit('onClear')
        },
        onRefresh () {
            this.getDataTable()
        },
        onSearch (data) {
            this.filter.search = data 
            this.resetFilter()
            this.getDataTable()
        },
        handleCurrentChange (value) {
            this.setPagination(value)
            this.getDataTable()
        },

        // LIST DATA
        getDataTable () {
            const shop_id = this.selectedShop.id 
            this.getData({ shop_id })
        },
    }
}
</script>