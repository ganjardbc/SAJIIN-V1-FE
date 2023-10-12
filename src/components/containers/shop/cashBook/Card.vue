<template>
    <div id="App">
        <div v-for="(dt, i) in data" :key="i" class="card box-shadow margin margin-top-15px margin-bottom-15px">
            <div class="display-flex space-between align-center padding padding-bottom-15px margin margin-bottom-20px border-bottom">
                <div class="display-flex align-center">
                    <div class="width width-30px">
                        <i class="fa fa-1x fa-book-open fonts main-color"></i>
                    </div>
                    <div>
                        <div class="fonts fonts-10 semibold">{{ dt.cashbook.cashbook_id }}</div>
                        <div class="fonts fonts-10 grey">{{ dt.cashbook.created_at | moment("DD MMMM YYYY") }}</div>
                    </div>
                </div>
                <div class="display-flex flex-end align-center">
                    <AppCardCapsule :data="dt.cashbook.status" class="margin margin-left-10px" />
                    <!-- <el-popover
                        placement="bottom-end"
                        width="180"
                        trigger="click">
                        <div class="width width-100">
                            <button 
                                v-if="dt.cashbook.cash_status === 'closed'"
                                class="btn btn-white btn-full btn-align-left"
                                @click="onReOpen(dt.cashbook)">
                                <i class="icn icn-left fa fa-lw fa-cog"></i> Re-Open
                            </button>
                            <button 
                                class="btn btn-white btn-full btn-align-left"
                                style="border: 0;"
                                @click="onDelete(dt.cashbook)">
                                <i class="icn icn-left fa fa-lw fa-trash-alt"></i> Hapus
                            </button>
                        </div>
                        <button 
                            slot="reference"
                            class="btn btn-icon btn-circle btn-white">
                            <i class="fa fa-lw fa-ellipsis-v"></i>
                        </button>
                    </el-popover> -->
                </div>
            </div>

            <div class="width width-100">
                <div class="width width-100">
                    <div class="display-flex space-between align-center margin margin-bottom-15px">
                        <div>
                            <div class="fonts fonts-9 normal grey">Periode</div>
                            <div class="margin margin-right-5px">
                                <span v-if="dt.cashbook.cash_date !== dt.cashbook.cash_end_date" class="fonts fonts-10 semibold">
                                    {{ dt.cashbook.cash_date | moment("DD MMMM YYYY") }} - {{ dt.cashbook.cash_end_date | moment("DD MMMM YYYY") }}
                                </span>
                                <span v-else class="fonts fonts-10 semibold">
                                    {{ dt.cashbook.cash_date | moment("DD MMMM YYYY") }}
                                </span>
                            </div>
                        </div>
                        <div class="display-flex">
                            <div class="fonts fonts-9 normal grey">Toko</div>
                            <AppCardCapsule :data="dt.cashbook.cash_status" class="margin margin-left-5px" />
                        </div>
                    </div>
                    <div class="width width-100 display-flex align-center margin margin-bottom-15px">
                        <div style="width: calc(50% - 20px);">
                            <div class="fonts fonts-9 normal grey">Kas Summary</div>
                            <div class="fonts fonts-11 semibold main-color overflow-ellipsis">{{ format(dt.cashbook.cash_summary) }}</div>
                        </div>
                        <div class="image image-40px image-circle bg-white">
                            <i class="post-middle-absolute fonts fonts-10 fa fa-lg fa-equals"></i>
                        </div>
                        <div style="width: calc(50% - 20px);">
                            <div class="fonts fonts-9 normal grey align-right">Kas Aktual</div>
                            <div class="fonts fonts-11 semibold black overflow-ellipsis align-right">{{ format(dt.cashbook.cash_actual) }}</div>
                        </div>
                    </div>
                    <div v-if="dt.cashbook.cash_status === 'closed'" class="width width-100 margin margin-bottom-15px">
                        <el-alert
                            v-if="dt.cashbook.cash_summary > dt.cashbook.cash_actual"
                            title="Kas Aktual Tidak Sama dengan Kas Summary !"
                            description="Sepertinya Kas Summary dan kas aktual tidak sama, mohon cek kembali kas yang ada."
                            type="error"
                            :closable="true"
                            show-icon >
                        </el-alert>
                    </div>
                    <div class="width width-100 margin margin-bottom-15px">
                        <div class="card bg-white-grey no-padding display-flex space-between align-center wrap">
                            <div class="width width-row-4 width-mobile-row-2 padding padding-top-10px padding-bottom-10px">
                                <div class="padding padding-5px content-center">
                                    <div class="display-flex center align-center">
                                        <i class="fonts fonts-8 main-color fa fa-lg fa-info-circle margin margin-right-5px"></i>
                                        <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Modal</span>
                                    </div>
                                    <div class="fonts fonts-10 semibold black overflow-ellipsis align-center">{{ format(dt.cashbook.cash_modal) }}</div>
                                </div>
                            </div>
                            <div class="width width-row-4 width-mobile-row-2 padding padding-top-10px padding-bottom-10px">
                                <div class="padding padding-5px border-left content-center">
                                    <div class="display-flex center align-center">
                                        <i class="fonts fonts-8 main-color fa fa-lg fa-check-circle margin margin-right-5px"></i>
                                        <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Keuntungan</span>
                                    </div>
                                    <div class="fonts fonts-10 semibold black overflow-ellipsis align-center">{{ format(dt.cashbook.cash_profit) }}</div>
                                </div>
                            </div>
                            <div class="width width-row-4 width-mobile-row-2 padding padding-top-10px padding-bottom-10px">
                                <div class="padding padding-5px border-left border-mobile-none content-center">
                                    <div class="display-flex center align-center">
                                        <i class="fonts fonts-8 green fa fa-lg fa-arrow-up margin margin-right-5px"></i>
                                        <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Kas Masuk</span>
                                    </div>
                                    <div class="fonts fonts-10 semibold black overflow-ellipsis align-center">{{ format(dt.cashbook.cash_in) }}</div>
                                </div>
                            </div>
                            <div class="width width-row-4 width-mobile-row-2 padding padding-top-10px padding-bottom-10px">
                                <div class="padding padding-5px border-left content-center">
                                    <div class="display-flex center align-center">
                                        <i class="fonts fonts-8 orange fa fa-lg fa-arrow-down margin margin-right-5px"></i>
                                        <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Kas Keluar</span>
                                    </div>
                                    <div class="fonts fonts-10 semibold black overflow-ellipsis align-center">{{ format(dt.cashbook.cash_out) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <OrderStatus 
                        :data="dt.cashbook" 
                        class="margin margin-bottom-15px"
                        :enableButton="false"
                        @onClick="onOpenDetail(dt.cashbook)" />
                </div>
                <div class="display-flex space-between align-center">
                    <el-switch 
                        v-model="dt.cashbook.status"
                        active-text="Aktif"
                        inactive-text="Non-Aktif"
                        :active-value="'active'"
                        :inactive-value="'inactive'"
                        :disabled="dt.cashbook.cash_status === 'open'"
                        @change="onChangeStatus(dt.cashbook)"></el-switch>
                    <div class="display-flex flex-end align-center">
                        <button 
                            v-if="dt.cashbook.cash_status === 'open'" 
                            class="btn btn-sekunder margin margin-left-5px"
                            :disabled="isCanClosing(dt.cashbook)"
                            @click="onOpenCashBook(dt.cashbook)">
                            <el-popover 
                                v-if="isCanClosing(dt.cashbook)"
                                placement="left"
                                width="210"
                                trigger="hover"
                                style="word-break: break-word;">
                                <i slot="reference" class="icn icn-left fa fa-lg fa-info-circle"></i>
                                <div class="fonts fonts-10 normal red">Untuk menutup buku kas, semua pesanan harus diselesaikan terlebih dahulu.</div>
                            </el-popover>
                            Tutup
                        </button>
                        <button 
                            v-else 
                            class="btn btn-main margin margin-left-5px" 
                            :disabled="isStatusInactive(dt.cashbook)"
                            @click="onDownload(dt.cashbook)">
                            Laporan
                        </button>
                        <button 
                            class="btn btn-sekunder margin margin-left-5px"
                            @click="onOpenDetail(dt.cashbook)">
                            Detail 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppCardCaption from '../../../modules/AppCardCaption'
import OrderStatus from './OrderStatus'

export default {
    name: 'App',
    props: {
        data: null,
    },
    components: {
        AppCardCapsule,
        AppCardCaption,
        OrderStatus,
    },
    methods: {
        // OTHER 
        isCanClosing (data) {
            let status = true 
            if (data.status === 'active') {
                if (data.order_done < data.order_total) {
                    status = true 
                } else {
                    status = false 
                }
            }
            return status 
        },
        isCanDelete (data) {
            let status = true 
            if (data.status === 'active') {
                if (data.order_total > 0) {
                    status = true 
                } else {
                    status = false 
                }
            }
            return status 
        },
        isStatusInactive (data) {
            let status = true 
            if (data.status === 'active') {
                status = false 
            }
            return status 
        },
        isFullPeriode (data) {
            let status = false
            if (data && data.cash_date && data.cash_end_date) {
                status = true 
            }
            return status
        },

        // COVER
        onChangeCover (data) {
            this.$emit('onChangeCover', data)
        },

        // DETAIL
        onDetail (data) {
            this.$emit('onDetail', data)
        },

        // RE OPEN
        onReOpen (data) {
            const payload = {
                ...data,
                cash_status: 'open'
            }
            this.$emit('onReOpen', payload)
        },

        // DELETE
        onDelete (data) {
            this.$emit('onDelete', data)
        },

        // STATUS
        onChangeStatus (data) {
            this.$emit('onChangeStatus', data)
        },

        // DOWNLOAD 
        onDownload (data) {
            this.$emit('onDownload', data)
        },

        // CASH BOOK
        onOpenCashBook (data) {
            this.$emit('onOpenCashBook', data)
        },

        // ORDER LIST 
        onOpenOrderList (data) {
            this.$emit('onOpenOrderList', data)
        },

        // DETAIL 
        onOpenDetail (data) {
            this.$emit('onOpenDetail', data)
        }
    }
}
</script>