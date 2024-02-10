import axios from 'axios'

const defaultOrderStatus = () => {
    return [
        {value: 'all', label: 'Semua'},
        {value: 'new-order', label: 'Baru Masuk'},
        {value: 'on-progress', label: 'Disiapkan'},
        {value: 'ready', label: 'Diantarkan'},
        {value: 'delivered', label: 'Diterima'},
        {value: 'done', label: 'Selesai'},
        {value: 'canceled', label: 'Dibatalkan'},
    ]
}

const defaultOrderType = () => {
    return [
        {value: 'dine-in', label: 'Dine In'},
        {value: 'dine-out', label: 'Dine Out'}
    ]
}

const defaultOrderPaymentStatus = () => {
    return [
        {value: 'all', label: 'Semua'},
        {value: '1', label: 'Bayar'},
        {value: '0', label: 'Belum Bayar'},
    ]
}

const downloadList = () => {
    return [
        {value: 'daily', label: 'Harian'},
        {value: 'this-week', label: 'Mingguan'},
        {value: 'this-month', label: 'Bulanan'},
        {value: 'this-year', label: 'Tahunan'},
        {value: 'custom', label: 'Custom'},
    ]
}

export default {
    namespaced: true,

    state: {
        orderStatus: defaultOrderStatus(),
        orderType: defaultOrderType(),
        orderPaymentStatus: defaultOrderPaymentStatus(),
        downloadList: downloadList(),
        limit: 10,
        offset: 0,
        totalRecord: 0,
        grandItem: 0,
        grandTotal: 0,
        grandBills: 0,
        grandChange: 0,
        cashIn: 0,
        cashOut: 0,
        cashModal: 0,
        cashSummary: 0,
        cashProfit: 0,
        cashActual: 0,
        loading: false,
        loadingDownload: false,
        loadingDownloadOnly: false,
        loadMore: false,
        typeForm: 'create',
        rangeDate: [],
        cashBookList: [],
        data: [],
        filter: {
            search: '',
            report_type: '',
            order_date: [],
            order_status: '',
            payment_status: '',
        },
        expense: {
            data: [],
            totalRecord: 0,
            grandItem: 0,
            grandTotal: 0,
        }
    },

    getters: {},

    mutations: {
        SET_LOADING (state, value) {
            state.loading = value
        },
        SET_LOADING_DOWNLOAD (state, value) {
            state.loadingDownload = value 
        },
        SET_LOADING_DOWNLOAD_ONLY (state, value) {
            state.loadingDownloadOnly = value 
        },
        SET_LOAD_MORE (state, value) {
            state.loadMore = value
        },
        SET_OFFSET (state, value) {
            state.offset += value
        },
        SET_RANGE_DATE (state, value) {
            state.rangeDate = value 
        },
        SET_CASH_BOOK (state, value) {
            state.cashBookList = value 
        },
        SET_DATA (state, value) {
            state.data = value
        },
        SET_GRAND_ITEM (state, value) {
            state.grandItem = value
        },
        SET_GRAND_TOTAL (state, value) {
            state.grandTotal = value
        },
        SET_GRAND_BILLS (state, value) {
            state.grandBills = value
        },
        SET_GRAND_CHANGE (state, value) {
            state.grandChange = value
        },
        SET_CASH_IN (state, value) {
            state.cashIn = value
        },
        SET_CASH_OUT (state, value) {
            state.cashOut = value
        },
        SET_CASH_MODAL (state, value) {
            state.cashModal = value
        },
        SET_CASH_SUMMARY (state, value) {
            state.cashSummary = value
        },
        SET_CASH_PROFIT (state, value) {
            state.cashProfit = value
        },
        SET_CASH_ACTUAL (state, value) {
            state.cashActual = value 
        },
        SET_TOTAL_RECORD (state, value) {
            state.totalRecord = value
        },
        SET_EXPENSE_DATA (state, value) {
            state.expense.data = value
        },
        SET_EXPENSE_GRAND_ITEM (state, value) {
            state.expense.grandItem = value
        },
        SET_EXPENSE_GRAND_TOTAL (state, value) {
            state.expense.grandTotal = value
        },
    },

    actions: {
        setPagination ({ commit, state }, data) {
            state.offset = (data - 1) * state.limit
        },
        resetFilter ({ commit, state }) {
            state.limit = 10
            state.offset = 0
            state.cashBookList = []
            state.rangeDate = []
            state.data = []
            state.totalRecord = 0
            state.grandTotal = 0
            state.grandItem = 0
            state.grandChange = 0
            state.grandBills = 0
            state.cashIn = 0
            state.cashOut = 0
            state.cashModal = 0
            state.cashSummary = 0
            state.cashActual = 0
            state.cashProfit = 0
            state.expense.data = []
            state.expense.grandItem = 0
            state.expense.grandTotal = 0
            state.filter = {
                search: '',
                report_type: '',
                order_date: [],
                order_status: '',
                payment_status: '',
            }
        },
        getData ({ commit, state }, data) {
            commit('SET_LOADING', true)

            let dataPrev = []
            const params = {
                limit: state.limit,
                offset: state.offset,
                search: data.search,
                status: data.status,
                payment_status: data.payment_status,
                start_date: data.start_date,
                end_date: data.end_date,
                shop_id: data.shop_id,
                cashbook_id: data.cashbook_id,
            }

            if (data.disable_limit) {
                delete params.limit
                delete params.offset
            }

            return axios.post('/api/order/getReport', params, { 
                    headers: { Authorization: data.token } 
                })
                .then((res) => {
                    commit('SET_RANGE_DATE', res.data.range_date)
                    commit('SET_CASH_BOOK', res.data.cashBook)
                    commit('SET_DATA', res.data.order_list)
                    commit('SET_GRAND_ITEM', res.data.grand_item)
                    commit('SET_GRAND_TOTAL', res.data.grand_total)
                    commit('SET_GRAND_BILLS', res.data.grand_bills)
                    commit('SET_GRAND_CHANGE', res.data.grand_change)
                    commit('SET_CASH_IN', res.data.cash_in)
                    commit('SET_CASH_OUT', res.data.cash_out)
                    commit('SET_CASH_MODAL', res.data.cash_modal)
                    commit('SET_CASH_SUMMARY', res.data.cash_summary)
                    commit('SET_CASH_PROFIT', res.data.cash_profit)
                    commit('SET_CASH_ACTUAL', res.data.cash_actual)
                    commit('SET_TOTAL_RECORD', res.data.total_record)
                    commit('SET_EXPENSE_DATA', res.data.expense_list)
                    commit('SET_EXPENSE_GRAND_ITEM', res.data.expense_list_item)
                    commit('SET_EXPENSE_GRAND_TOTAL', res.data.expense_list_total)

                    return res
                })
                .catch((e) => {
                    console.log('error', e)
                })
                .finally(() => {
                    commit('SET_LOADING', false)
                })
        },
        download ({ commit, state }, data) {
            commit('SET_LOADING_DOWNLOAD', true)

            const params = {
                search: data.search,
                status: data.status,
                payment_status: data.payment_status,
                start_date: data.start_date,
                end_date: data.end_date,
                shop_id: data.shop_id,
                cashbook_id: data.cashbook_id,
            }

            return axios.post('/api/order/downloadReport', params, { 
                    headers: { Authorization: data.token },
                    responseType: 'blob'
                })
                .then((res) => {
                    var file = new Blob([res.data], {
                        type: 'application/pdf'
                    })

                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(file)
                    } else {
                        var fileURL = URL.createObjectURL(file)
                        window.open(fileURL, '_blank')
                    }

                    return res 
                })
                .finally(() => {
                    commit('SET_LOADING_DOWNLOAD', false)
                })

        },
        downloadOnly ({ commit, state }, data) {
            commit('SET_LOADING_DOWNLOAD_ONLY', true)

            const params = {
                search: data.search,
                status: data.status,
                payment_status: data.payment_status,
                start_date: data.start_date,
                end_date: data.end_date,
                shop_id: data.shop_id,
                cashbook_id: data.cashbook_id,
            }

            return axios.post('/api/order/downloadReport', params, { 
                    headers: { Authorization: data.token },
                    responseType: 'blob'
                })
                .then((res) => {
                    return res 
                })
                .finally(() => {
                    commit('SET_LOADING_DOWNLOAD_ONLY', false)
                })

        }
    }
}