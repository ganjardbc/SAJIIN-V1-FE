import axios from 'axios'
import { getDiscountProduct, getDiscountOrder } from '../../../services/utils'

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
        cashier_name: '',
        customer_name: '',
        shop_name: '',
        table_name: '',
        payment_name: '',
        shipment_name: '',
        platform_name: '',
        platform_fee: '',
        platform_price: '',
        platform_total_price: '',
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
        discount_id: ''
    }
}

const defaultOrder = () => {
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
        status: 'new-order',
        type: 'dine-in',
        note: '',
        cashier_name: '',
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
        discount_id: ''
    }
}

const defaultProduct = () => {
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
        status: ''
    }
}

const defaultForm = () => {
    return {
        order: defaultOrder(),
        details: [],
        customer: null,
        table: null,
        address: null,
        shipment: null,
        payment: null,
        shop: null,
        config: null,
        platform: null,
        discount: null,
    }
}

export default {
    namespaced: true,

    state: {
        form: defaultForm(),
        formProduct: defaultProduct(),
        errorMessage: defaultMessage(),
        data: null,
        loading: false,
    },

    getters: {},

    mutations: {
        SET_LOADING (state, data) {
            state.loading = data 
        },
        SET_MESSAGE_DATA (state, data) {
            state.errorMessage = data 
        },
        SET_DATA (state, data) {
            state.data = data
        },
        RESET_ORDER (state) {
            state.form = defaultForm()
        },
        ADD_PRODUCT (state, data) {
            let currentProduct = undefined 
            if (data.varian) {
                currentProduct = state
                    .form
                    .details
                    .find((item) => (
                        item.product_id === data.id && 
                        item.proddetail_id === data.varian.id 
                    ))
            } else {
                currentProduct = state
                    .form
                    .details
                    .find((item) => (
                        item.product_id === data.id && 
                        item.proddetail_id === null
                    ))
            }
            if (currentProduct === undefined) {
                let quantity = data.quantity ? data.quantity : 1
                let price = data.varian ? data.varian.price : data.price
                let secondPrice = data.varian ? data.varian.second_price : data.second_price
                let productDetail = data.varian ? data.varian.name : null 
                let productDetailId = data.varian ? data.varian.id : null
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
                    status: "to-do"
                }
                const platform = {
                    current_calculation: 'platform',
                    current_status: state.form.order.platform_id ? 'create' : 'remove',
                    current_value: state.form.order.platform_fee,
                    current_type: state.form.order.platform_currency_type,
                    platform_id: state.form.order.platform_id,
                    platform_name: state.form.order.platform_name,
                    platform_fee: state.form.order.platform_fee,
                    platform_type: state.form.order.platform_type,
                    platform_currency_type: state.form.order.platform_currency_type,
                    platform_image: state.form.order.platform_image,
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
                const payload = state
                    .form
                    .details
                    .map((item) => {
                        const currentQuantity = data.quantity ? data.quantity : 1
                        let quantity = item.quantity
                        let price = item.price 
                        let subtotal = quantity * price 
                        if (data.varian) {
                            if (
                                item.product_id === data.id && 
                                item.proddetail_id === data.varian.id
                            ) {
                                quantity = item.quantity + currentQuantity
                                price = item.price
                                subtotal = quantity * price
                            }
                        } else {
                            if (
                                item.product_id === data.id && 
                                item.proddetail_id === null
                            ) {
                                quantity = item.quantity + currentQuantity
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
        CHANGE_QUANTITY_PRODUCT (state, data) {
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
        CHANGE_PLATFORM_PRODUCT (state, data) {
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
            state.form.order.platform_price = totalPlatformPrice
        },
        CHANGE_DISCOUNT_PRODUCT (state, data) {
            const payload = state.form.details.map((item) => {
                let discount_id = item.discount_id;
                let discount_image = item.discount_image;
                let discount_name = item.discount_name;
                let discount_description = item.discount_description;
                let discount_value = item.discount_value;
                let discount_type = item.discount_type;
                let discount_value_type = item.discount_value_type;

                // editable 
                let isDiscount = item.is_discount
                let discountPrice = item.discount_price
                let discountFee = item.discount_fee
                let quantity = item.quantity
                let price = item.price
                let secondPrice = item.second_price
                let subtotal = item.subtotal
                let isPlatform = item.is_platform
                let platformPrice = item.platform_price
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
        CHANGE_DISCOUNT_ORDER (state, data) {
            let order = state.form.order 
            const getDiscount = getDiscountOrder(order, data)
            order.discount_fee = getDiscount.discountFee
            order.discount_price = getDiscount.discountPrice 
            order.total_price = getDiscount.totalPrice 
            order.is_discount = getDiscount.isDiscount
        },
        DELETE_PRODUCT (state, data) {
            let payload = []
            state.form.details.map((item, index) => {
                if (index !== data) {
                    payload.push({ ...item })
                }
            })
            state.form.details = payload
            if (payload.length === 0) {
                state.form.order = defaultOrder()
            }
        },
        DELETE_ALL_PRODUCT (state, data) {
            state.form.details = []
            state.form.order = defaultOrder()
        },
        SET_ORDER (state, data) {
            const time = new Date().getTime()
            let totalPrice = data.total_price
            if (state.form.order.discount_id) {
                totalPrice = totalPrice - state.form.order.discount_price
            }
            const payload = {
                ...state.form,
                order: {
                    ...state.form.order,
                    order_id: `ODR-${time}`,
                    shop_id: data.shop.id,
                    shop_name: data.shop.name,
                    cashier_name: data.user.name,
                    total_item: data.total_item,
                    total_price: totalPrice,
                    status: 'on-progress'
                },
                shop: {
                    ...data.shop
                }
            }
            state.form = payload
        },
        SET_ORDER_BILLS (state, data) {
            const bills_price = data ? parseInt(data) : 0
            const total_price = parseInt(state.form.order.total_price)
            const total = bills_price - total_price
            const payload = {
                ...state.form,
                order: {
                    ...state.form.order,
                    bills_price: bills_price,
                    change_price: total,
                    payment_status: total >= 0 ? 1 : 0
                }
            }
            state.form = payload 
        }
    },

    actions: {
        // PRODUCT
        addProduct ({ commit, state }, data) {
            commit('ADD_PRODUCT', data)
        },
        changeQuantityProduct ({ commit, state }, data) {
            commit('CHANGE_QUANTITY_PRODUCT', data)
        },
        changePlatformProduct ({ commit, state }, data) {
            commit('CHANGE_PLATFORM_PRODUCT', data)
        },
        changeDiscountProduct ({ commit, state }, data) {
            commit('CHANGE_DISCOUNT_PRODUCT', data)
        },
        changeDiscountOrder ({ commit, state }, data) {
            commit('CHANGE_DISCOUNT_ORDER', data)
        },
        deleteProduct ({ commit, state }, data) {
            commit('DELETE_PRODUCT', data)
        },
        deleteAllProduct ({ commit, state }) {
            commit('DELETE_ALL_PRODUCT')
        },

        // ORDER
        resetOrder ({ commit, state }) {
            commit('RESET_ORDER')
        },
        setOrder ({ commit, state }, data) {
            commit('SET_ORDER', data)
        },
        setOrderBills ({ commit, state }, data) {
            commit('SET_ORDER_BILLS', data)
        },
        createOrder ({ commit, state }, data) {
            commit('SET_LOADING', true)
            
            const params = {
                ...data
            }

            return axios.post('/api/order/postAdmin', params, { 
                    headers: { Authorization: data.token } 
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
                    commit('SET_LOADING', false)
                })
        },
        getById ({ commit, state }, data) {
            commit('SET_LOADING', true)

            const params = {
                order_id: data.order_id
            }

            return axios.post('/api/order/getByID', params, { 
                    headers: { Authorization: data.token } 
                })
                .then((res) => {
                    if (res.data.status === 'ok') {
                        const payload = res.data.data 
                        commit('SET_DATA', payload)
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
    }
}