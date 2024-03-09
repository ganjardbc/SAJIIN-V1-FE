import moment from 'moment'
import axios from 'axios'
import { getDiscountProduct, getDiscountOrder } from '../../services/utils'

const defaultOrderStatus = () => {
  return [
    { value: 'new-order', label: 'New Order' },
    { value: 'on-progress', label: 'On Progress' },
    { value: 'done', label: 'Done' },
    { value: 'canceled', label: 'Canceled' },
  ]
}

const defaultOrderType = () => {
  return [
    { value: 'dine-in', label: 'Dine In' },
    { value: 'dine-out', label: 'Dine Out' },
  ]
}

const defaultOrderPaymentStatus = () => {
  return [
    { value: '', label: 'Semua Pembayaran' },
    { value: '1', label: 'Dibayar' },
    { value: '0', label: 'Belum Bayar' },
  ]
}

const defaultOrder = () => {
  return {
    id: 0,
    price: 0,
    second_price: 0,
    platform_id: 0,
    platform: 0,
    platform_fee: 0,
    platform_price: 0,
    platform_name: '',
    platform_image: '',
    platform_currency_type: '',
    platform_type: '',
    is_platform: false,
    quantity: 0,
    subtotal: 0,
    note: '',
    product_id: 0,
    proddetail_id: 0,
    product_image: '',
    product_name: '',
    product_detail: '',
    product_toping: '',
    discount_id: 0,
    discount: 0,
    discount_fee: 0,
    discount_price: 0,
    discount_name: '',
    discount_description: '',
    discount_value: '',
    discount_type: '',
    discount_value_type: '',
    discount_image: '',
    is_discount: false,
    promo_code: '',
    order_id: 0,
    toping_id: 0,
    shop_id: 0,
    assigned_id: 0,
    status: '',
  }
}

const defaultMessage = () => {
  return {
    id: '',
    order_id: '',
    delivery_fee: '',
    total_price: '',
    total_item: '',
    bills_price: '',
    change_price: '',
    payment_status: '',
    proof_of_payment: '',
    status: '',
    type: '',
    note: '',
    customer_name: '',
    shop_name: '',
    table_name: '',
    payment_name: '',
    shipment_name: '',
    platform_name: '',
    platform_fee: '',
    platform_price: '',
    platform_type: '',
    platform_currency_type: '',
    platform_image: '',
    is_platform: '',
    discount_name: '',
    discount_description: '',
    discount_value: '',
    discount_type: '',
    discount_value_type: '',
    discount_image: '',
    discount_price: '',
    discount_fee: '',
    is_discount: '',
    config_id: '',
    shop_id: '',
    customer_id: '',
    table_id: '',
    address_id: '',
    shipment_id: '',
    payment_id: '',
    cashbook_id: '',
    platform_id: '',
    discount_id: '',
  }
}

const defaultForm = () => {
  return {
    id: '',
    order_id: '',
    delivery_fee: 0,
    total_price: 0,
    total_item: 0,
    bills_price: 0,
    change_price: 0,
    payment_status: 0,
    proof_of_payment: '',
    status: 'unconfirmed',
    type: 'dine-in',
    note: '',
    customer_name: '',
    shop_name: '',
    table_name: '',
    payment_name: '',
    shipment_name: '',
    platform_name: '',
    platform_fee: 0,
    platform_price: 0,
    platform_type: '',
    platform_currency_type: '',
    platform_image: '',
    is_platform: false,
    discount_name: '',
    discount_description: '',
    discount_value: 0,
    discount_type: '',
    discount_value_type: '',
    discount_image: '',
    discount_price: 0,
    discount_fee: 0,
    is_discount: false,
    config_id: null,
    shop_id: '',
    customer_id: '',
    table_id: '',
    address_id: '',
    shipment_id: '',
    payment_id: '',
    cashbook_id: '',
    platform_id: '',
    discount_id: '',
  }
}

export default {
  namespaced: true,

  state: {
    form: defaultForm(),
    formProduct: defaultOrder(),
    errorMessage: defaultMessage(),
    orderStatus: defaultOrderStatus(),
    orderType: defaultOrderType(),
    orderPaymentStatus: defaultOrderPaymentStatus(),
    limit: 10,
    offset: 0,
    totalRecord: 0,
    loading: false,
    loadMore: false,
    loadingForm: false,
    loadingReceipt: false,
    typeForm: 'create',
    selectedIndex: 0,
    data: [],
    selectedData: null,
    filter: {
      search: '',
      status: '',
      payment_status: '',
      cashbook_id: '',
    },
    product: {
      limit: 5,
      offset: 0,
      totalRecord: 0,
      loading: false,
      data: [],
      filter: {
        search: '',
        status: 'active',
      },
    },
    category: {
      limit: 50,
      offset: 0,
      totalRecord: 0,
      loading: false,
      data: [],
      filter: {
        search: '',
        status: 'active',
      },
    },
    cashbook: {
      loading: false,
      data: [],
    },
  },

  getters: {},

  mutations: {
    // ORDER
    RESET_ERROR_MESSAGE(state) {
      state.errorMessage = defaultMessage()
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_LOAD_MORE(state, value) {
      state.loadMore = value
    },
    SET_LOADING_FORM(state, value) {
      state.loadingForm = value
    },
    SET_LOADING_RECEIPT(state, value) {
      state.loadingReceipt = value
    },
    SET_OFFSET(state, value) {
      state.offset += value
    },
    SET_DATA(state, value) {
      state.data = value
    },
    SET_SELECTED_DATA(state, value) {
      state.selectedData = value
    },
    SET_MESSAGE_DATA(state, value) {
      if (value) {
        state.errorMessage = value
      } else {
        state.errorMessage = defaultMessage()
      }
    },
    SET_FORM_DATA(state, value) {
      if (value) {
        state.form = value
      } else {
        const time = new Date().getTime()
        state.form = {
          ...defaultForm(),
          order_id: `INV-${time}`,
          status: 'confirmed',
          is_available: 1,
        }
      }
    },
    SET_TOTAL_RECORD(state, value) {
      state.totalRecord = value
    },
    SET_ORDER_BILLS(state, data) {
      const bills_price = data ? parseInt(data) : 0
      const total_price = parseInt(state.form.total_price)
      const total = bills_price - total_price
      const payload = {
        ...state.form,
        bills_price: bills_price,
        change_price: total,
        payment_status: total >= 0 ? 1 : 0,
      }
      state.form = payload
    },

    // PRODUCT
    ADD_PRODUCT(state, data) {
      let currentProduct = undefined
      if (data.varian) {
        currentProduct = state.form.details.find(
          (item) =>
            item.product_id === data.id && item.proddetail_id === data.varian.id
        )
      } else {
        currentProduct = state.form.details.find(
          (item) => item.product_id === data.id && item.proddetail_id === null
        )
      }
      if (currentProduct === undefined) {
        let quantity = 1
        let price = data.varian ? data.varian.price : data.price
        let secondPrice = data.varian ? data.varian.price : data.price
        let productDetail = data.varian ? data.varian.name : ''
        let productDetailId = data.varian ? data.varian.id : ''
        let subtotal = quantity * price
        const payload = {
          ...state.formProduct,
          price: price,
          second_price: secondPrice,
          quantity: quantity,
          subtotal: subtotal,
          product_image: data.image,
          product_name: data.name,
          product_detail: productDetail,
          product_id: data.id,
          proddetail_id: productDetailId,
          shop_id: data.shop_id,
          status: 'to-do',
        }
        const platform = {
          current_calculation: 'platform',
          current_status: state.form.platform_id ? 'create' : 'remove',
          current_value: state.form.platform_fee,
          current_type: state.form.platform_currency_type,
          platform_id: state.form.platform_id,
          platform_name: state.form.platform_name,
          platform_fee: state.form.platform_fee,
          platform_type: state.form.platform_type,
          platform_currency_type: state.form.platform_currency_type,
          platform_image: state.form.platform_image,
        }
        if (platform.platform_id) {
          const getPlatform = getDiscountProduct(payload, platform)
          const platformPrice = getPlatform.platformPrice
          const platformFee = getPlatform.platformFee
          const isPlatform = getPlatform.isPlatform
          quantity = getPlatform.quantity
          price = getPlatform.price
          secondPrice = getPlatform.secondPrice
          subtotal = getPlatform.totalPrice
          const newPayload = {
            ...payload,
            quantity: quantity,
            price: price,
            second_price: secondPrice,
            subtotal: subtotal,
            platform: platformPrice,
            platform_fee: platformFee,
            platform_price: platformPrice,
            platform_name: platform.platform_name,
            platform_type: platform.platform_type,
            platform_currency_type: platform.platform_currency_type,
            platform_image: platform.platform_image,
            platform_id: platform.platform_id,
            is_platform: isPlatform,
          }
          state.form.details.push(newPayload)
        } else {
          state.form.details.push(payload)
        }
      } else {
        const payload = state.form.details.map((item) => {
          let quantity = item.quantity
          let price = item.price
          let subtotal = quantity * price
          if (data.varian) {
            if (
              item.product_id === data.id &&
              item.proddetail_id === data.varian.id
            ) {
              quantity = item.quantity + 1
              price = item.price
              subtotal = quantity * price
            }
          } else {
            if (item.product_id === data.id && item.proddetail_id === null) {
              quantity = item.quantity + 1
              price = item.price
              subtotal = quantity * price
            }
          }
          return {
            ...item,
            price: price,
            quantity: quantity,
            subtotal: subtotal,
          }
        })
        state.form.details = payload
      }
    },
    CHANGE_QUANTITY_PRODUCT(state, data) {
      const payload = state.form.details.map((item, index) => {
        let quantity = item.quantity
        let price = item.price
        let subtotal = quantity * price
        if (index === data.index) {
          quantity = data.quantity
          price = item.price
          subtotal = quantity * price
        }
        return {
          ...item,
          price: price,
          quantity: quantity,
          subtotal: subtotal,
        }
      })
      state.form.details = payload
    },
    CHANGE_QUANTITY_ORDER(state) {
      let quantity = 0
      state.form.details.map((item, index) => {
        quantity += item.quantity
      })
      state.form = {
        ...state.form,
        total_item: quantity,
      }
    },
    CHANGE_PRICE_ORDER(state) {
      let price = 0
      state.form.details.map((item, index) => {
        let quantity = item.quantity
        price += quantity * item.price
      })
      state.form = {
        ...state.form,
        total_price: price,
      }
    },
    CHANGE_PLATFORM_PRODUCT(state, data) {
      let totalPlatformPrice = 0
      const payload = state.form.details.map((item) => {
        const getPlatform = getDiscountProduct(item, data)

        // editable
        let platformPrice = getPlatform.platformPrice
        let platformFee = getPlatform.platformFee
        let isPlatform = getPlatform.isPlatform
        let discountPrice = getPlatform.discountPrice
        let discountFee = getPlatform.discountFee
        let isDiscount = getPlatform.isDiscount
        let quantity = getPlatform.quantity
        let price = getPlatform.price
        let secondPrice = getPlatform.secondPrice
        let subtotal = getPlatform.totalPrice

        // summary
        totalPlatformPrice += platformPrice

        return {
          ...item,
          price: price,
          quantity: quantity,
          subtotal: subtotal,
          second_price: secondPrice,
          discount: discountPrice,
          discount_fee: discountFee,
          discount_price: discountPrice,
          is_discount: isDiscount,
          platform: platformPrice,
          platform_fee: platformFee,
          platform_price: platformPrice,
          platform_name: data.platform_name,
          platform_type: data.platform_type,
          platform_currency_type: data.platform_currency_type,
          platform_image: data.platform_image,
          platform_id: data.platform_id,
          is_platform: isPlatform,
        }
      })
      state.form.details = payload
      state.form.platform_price = totalPlatformPrice
    },
    CHANGE_DISCOUNT_PRODUCT(state, data) {
      const payload = state.form.details.map((item) => {
        let discount_id = item.discount_id
        let discount_image = item.discount_image
        let discount_name = item.discount_name
        let discount_description = item.discount_description
        let discount_value = item.discount_value
        let discount_type = item.discount_type
        let discount_value_type = item.discount_value_type

        // editable
        let isDiscount = item.is_discount
        let discountPrice = item.discount
        let discountFee = item.discount_fee
        let quantity = item.quantity
        let price = item.price
        let secondPrice = item.second_price
        let subtotal = item.subtotal
        let isPlatform = item.is_platform
        let platformPrice = item.platform
        let platformFee = item.platform_fee

        // product n varian validations
        let isProduct = item.product_id === data.product_id ? true : false
        if (item.proddetail_id === data.proddetail_id) {
          isProduct = true
        } else {
          isProduct = false
        }
        if (isProduct) {
          const getDiscount = getDiscountProduct(item, data)

          isDiscount = getDiscount.isDiscount
          discountPrice = getDiscount.discountPrice
          discountFee = getDiscount.discountFee
          quantity = getDiscount.quantity
          price = getDiscount.price
          secondPrice = getDiscount.secondPrice
          subtotal = getDiscount.totalPrice
          isPlatform = getDiscount.isPlatform
          platformPrice = getDiscount.platformPrice
          platformFee = getDiscount.platformFee

          discount_id = data.discount_id
          discount_image = data.discount_image
          discount_name = data.discount_name
          discount_description = data.discount_description
          discount_value = data.discount_value
          discount_type = data.discount_type
          discount_value_type = data.discount_value_type
        }
        return {
          ...item,
          discount_id,
          discount_image,
          discount_name,
          discount_description,
          discount_value,
          discount_type,
          discount_value_type,
          discount_fee: discountFee,
          discount_price: discountPrice,
          discount: discountPrice,
          is_discount: isDiscount,
          platform: platformPrice,
          platform_price: platformPrice,
          platform_fee: platformFee,
          is_platform: isPlatform,
          price: price,
          quantity: quantity,
          subtotal: subtotal,
          second_price: secondPrice,
        }
      })
      state.form.details = payload
    },
    CHANGE_DISCOUNT_ORDER(state, data) {
      let order = state.form
      const getDiscount = getDiscountOrder(order, data)
      order.discount_fee = getDiscount.discountFee
      order.discount_price = getDiscount.discountPrice
      order.total_price = getDiscount.totalPrice
      order.is_discount = getDiscount.isDiscount
    },
    DELETE_PRODUCT(state, data) {
      let payload = []
      state.form.details &&
        state.form.details.map((item, index) => {
          if (index !== data) {
            payload.push({ ...item })
          }
        })
      state.form.details = payload
    },
    DELETE_ALL_PRODUCT(state, data) {
      state.form.details = []
    },
    SET_LOADING_PRODUCT(state, value) {
      state.product.loading = value
    },
    SET_OFFSET_PRODUCT(state, value) {
      state.product.offset += value
    },
    SET_DATA_PRODUCT(state, value) {
      state.product.data = value
    },
    SET_TOTAL_RECORD_PRODUCT(state, value) {
      state.product.totalRecord = value
    },

    // CATEGORY
    SET_LOADING_CATEGORY(state, value) {
      state.category.loading = value
    },
    SET_OFFSET_CATEGORY(state, value) {
      state.category.offset += value
    },
    SET_DATA_CATEGORY(state, value) {
      state.category.data = value
    },
    SET_TOTAL_RECORD_CATEGORY(state, value) {
      state.category.totalRecord = value
    },

    // CASH BOOK
    SET_LOADING_CASHBOOK(state, value) {
      state.cashbook.loading = value
    },
    SET_DATA_CASHBOOK(state, value) {
      let data = [{ value: '', label: 'All Cash Book' }]
      let cashBook = value.all_cashbook

      cashBook &&
        cashBook.map((item) => {
          data.push({
            value: item.id,
            label: moment(item.cash_date).format('DD MMMM YYYY'),
          })
        })

      state.cashbook.data = data
    },
  },

  actions: {
    // PRODUCT
    addProduct({ commit, state }, data) {
      commit('ADD_PRODUCT', data)
      commit('CHANGE_QUANTITY_ORDER')
      commit('CHANGE_PRICE_ORDER')
    },
    changeQuantityProduct({ commit, state }, data) {
      commit('CHANGE_QUANTITY_PRODUCT', data)
      commit('CHANGE_QUANTITY_ORDER')
      commit('CHANGE_PRICE_ORDER')
    },
    changePlatformProduct({ commit, state }, data) {
      commit('CHANGE_PLATFORM_PRODUCT', data)
      commit('CHANGE_QUANTITY_ORDER')
      commit('CHANGE_PRICE_ORDER')
    },
    changeDiscountOrder({ commit, state }, data) {
      commit('CHANGE_DISCOUNT_ORDER', data)
    },
    changeDiscountProduct({ commit, state }, data) {
      commit('CHANGE_DISCOUNT_PRODUCT', data)
    },
    deleteProduct({ commit, state }, data) {
      commit('DELETE_PRODUCT', data)
      commit('CHANGE_QUANTITY_ORDER')
      commit('CHANGE_PRICE_ORDER')
    },
    deleteAllProduct({ commit, state }) {
      commit('DELETE_ALL_PRODUCT')
      commit('CHANGE_QUANTITY_ORDER')
      commit('CHANGE_PRICE_ORDER')
    },
    setPaginationProduct({ commit, state }, data) {
      state.product.offset = (data - 1) * state.product.limit
    },
    resetFilterProduct({ commit, state }) {
      state.product.limit = 5
      state.product.offset = 0
    },
    getDataProduct({ commit, state }, data) {
      commit('SET_LOADING_PRODUCT', true)

      let dataPrev = []

      const params = {
        limit: state.product.limit,
        offset: state.product.offset,
        search: state.product.filter.search,
        category: state.product.filter.category,
        status: state.product.filter.status,
        shop_id: data.shop_id,
      }

      return axios
        .post('/api/product/getAll', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const payload = res.data.data

          payload &&
            payload.map((dt) => {
              dataPrev.push({ ...dt.product, details: dt.details })
            })

          commit('SET_DATA_PRODUCT', dataPrev)
          commit('SET_TOTAL_RECORD_PRODUCT', res.data.total_record)

          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING_PRODUCT', false)
        })
    },

    // CATEGORY
    setPaginationCategory({ commit, state }, data) {
      state.category.offset = (data - 1) * state.category.limit
    },
    resetFilterCategory({ commit, state }) {
      state.category.limit = 50
      state.category.offset = 0
    },
    getDataCategory({ commit, state }, data) {
      commit('SET_LOADING_CATEGORY', true)

      let dataPrev = []

      const params = {
        limit: state.category.limit,
        offset: state.category.offset,
        search: state.category.filter.search,
        status: state.category.filter.status,
        shop_id: data.shop_id,
      }

      return axios
        .post('/api/category/getAll', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const payload = res.data.data

          payload &&
            payload.map((dt) => {
              dataPrev.push({ ...dt })
            })

          commit('SET_DATA_CATEGORY', dataPrev)
          commit('SET_TOTAL_RECORD_CATEGORY', res.data.total_record)

          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING_CATEGORY', false)
        })
    },

    // CASH BOOK
    getCashBook({ commit, state }, data) {
      commit('SET_LOADING_CASHBOOK', true)

      const params = {
        shop_id: data.shop_id,
        date: moment(data.date).format('YYYY-MM-DD'),
      }

      return axios
        .post('/api/cashbook/getCurrent', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const data = res.data.data

          commit('SET_DATA_CASHBOOK', data)

          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING_CASHBOOK', false)
        })
    },

    // ORDER
    setPagination({ commit, state }, data) {
      state.offset = (data - 1) * state.limit
    },
    setFormData({ commit, state }, data) {
      commit('SET_FORM_DATA', data)
    },
    setLoadingForm({ commit, state }, data) {
      commit('SET_LOADING_FORM', data)
    },
    setOrderBills({ commit, state }, data) {
      commit('SET_ORDER_BILLS', data)
    },
    resetFormData({ commit, state }) {
      commit('SET_FORM_DATA', null)
      commit('SET_MESSAGE_DATA', null)
    },
    resetFilter({ commit, state }) {
      state.limit = 10
      state.offset = 0
    },
    getData({ commit, state }, data) {
      commit('SET_LOADING', true)
      commit('SET_LOAD_MORE', false)

      let dataPrev = []

      const params = {
        limit: state.limit,
        offset: state.offset,
        search: state.filter.search,
        status: state.filter.status,
        payment_status: state.filter.payment_status,
        cashbook_id: state.filter.cashbook_id,
        shop_id: data.shop_id,
      }

      return axios
        .post('/api/order/getAll', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const payload = res.data.data

          payload &&
            payload.map((dt) => {
              dataPrev.push({ ...dt })
            })

          commit('SET_DATA', dataPrev)
          commit('SET_TOTAL_RECORD', res.data.total_record)

          if (payload.length < state.limit) {
            commit('SET_LOAD_MORE', false)
          } else {
            commit('SET_LOAD_MORE', true)
          }

          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    },
    getById({ commit, state }, data) {
      commit('SET_LOADING', true)

      const params = {
        order_id: data.order_id,
      }

      return axios
        .post('/api/order/getByID', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          if (res.data.status === 'ok') {
            const payload = res.data.data
            commit('SET_SELECTED_DATA', payload)
          }
          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING', false)
        })
    },
    updateData({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      const params = {
        ...data,
      }

      return axios
        .post('/api/order/update', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const data = res.data
          if (data.status === 'ok') {
            commit('SET_MESSAGE_DATA', data.message)
          } else {
            commit('SET_MESSAGE_DATA', data.message)
          }
          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING_FORM', false)
        })
    },
    updateDataProduct({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      const params = {
        ...data,
      }

      return axios
        .post('/api/order/updateAdmin', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          const data = res.data
          if (data.status === 'ok') {
            commit('SET_MESSAGE_DATA', data.message)
          } else {
            commit('SET_MESSAGE_DATA', data.message)
          }
          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING_FORM', false)
        })
    },
    deleteData({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      const params = {
        ...data,
      }

      return axios
        .post('/api/order/delete', params, {
          headers: { Authorization: data.token },
        })
        .then((res) => {
          return res
        })
        .catch((e) => {
          console.log('error', e)
        })
        .finally(() => {
          commit('SET_LOADING_FORM', false)
        })
    },
    download({ commit, state }, data) {
      commit('SET_LOADING_FORM', true)

      const params = {
        order_id: data.order_id,
        size_x: data.size_x,
        size_y: data.size_y,
      }

      return axios
        .post('/api/order/downloadReceipt', params, {
          headers: { Authorization: data.token },
          responseType: 'blob',
        })
        .then((res) => {
          var file = new Blob([res.data], {
            type: 'application/pdf',
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
          commit('SET_LOADING_FORM', false)
        })
    },
    downloadOnly({ commit, state }, data) {
      commit('SET_LOADING_RECEIPT', true)

      const params = {
        order_id: data.order_id,
        size_x: data.size_x,
        size_y: data.size_y,
      }

      return axios
        .post('/api/order/downloadReceipt', params, {
          responseType: 'blob',
        })
        .then((res) => {
          return res
        })
        .finally(() => {
          commit('SET_LOADING_RECEIPT', false)
        })
    },
  },
}
