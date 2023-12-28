import moment from 'moment'

const formatCurrency = (value) => {
    let currency = 'Rp 0'
    if (value > 0) {
        currency = `Rp ${(value + '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
    }
    if (value < 0) {
        currency = `- Rp ${(value + '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
    }
    return currency
}

const fieldCurrency = (value) => {
    let currency = '0'
    if (value > 0) {
        currency = `${(value + '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
    }
    if (value < 0) {
        currency = `- ${(value + '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
    }
    return currency
}

const getCashbookList = (cashBook) => {
    let data = [
        {value: '', label: 'Semua Buku Kas'},
    ]
    cashBook && cashBook.map((item) => {
        data.push({ 
            value: item.id, 
            label: moment(item.cash_date ).format('DD MMMM YYYY')
        })
    })
    return data 
}

const replaceString = (value) => {
    if (value == null || value == '') {
        return '-'
    } else {
        return value 
    }
}

const replaceToMoreValue = (value) => {
    let text = ''
    if (parseInt(value) > 0) {
        text = value
    }
    if (parseInt(value) > 99) {
        text =  '99+'
    }
    return text
}

const getDiscountOrder = (order, calculation) => {
    const payload = {
        discountFee: 0,
        discountPrice: 0,
        totalPrice: 0,
        isDiscount: false,
    }
    let discountPrice = parseInt(order.discount_price)
    let discountFee = parseInt(order.discount_fee)
    let totalPrice = parseInt(order.total_price)
    let isDiscount = order.is_discount 

    if (calculation.current_status === 'create') {
        let discountPriceCalculation = calculation.discount_value_type === 'percentage'
            ? parseInt(order.total_price * (calculation.discount_value / 100))
            : calculation.discount_value
        let totalPriceCalculation = order.total_price - discountPriceCalculation 
        discountFee = calculation.discount_value
        discountPrice = discountPriceCalculation 
        totalPrice = totalPriceCalculation 
        isDiscount = true 
    } else {
        let totalPriceCalculation = order.total_price + order.discount_price 
        discountFee = 0
        discountPrice = 0
        totalPrice = totalPriceCalculation
        isDiscount = false 
    }

    payload.discountFee = discountFee
    payload.discountPrice = discountPrice 
    payload.totalPrice = totalPrice
    payload.isDiscount = isDiscount

    return payload
}

const getDiscountProduct = (product, calculation) => {
    const payload = {
        // default 
        price: 0,
        secondPrice: 0,
        totalPrice: 0,
        quantity: 0,

        // discount 
        discountFee: 0,
        discountPrice: 0,
        isDiscount: false,

        // platform
        platformFee: 0,
        platformPrice: 0,
        isPlatform: false,
    }
    let price = parseInt(product.price)
    let secondPrice = parseInt(product.second_price)
    let quantity = parseInt(product.quantity)
    let totalPrice = price * quantity

    // discount
    let discountPrice = parseInt(product.discount_price)
    let discountFee = parseInt(product.discount_fee)
    let isDiscount = product.is_discount

    // platform
    let platformPrice = parseInt(product.platform_price)
    let platformFee = parseInt(product.platform_fee)
    let isPlatform = product.is_platform

    if (calculation.current_calculation === 'discount') {
        if (calculation.current_status === 'create') {
            discountFee = calculation.current_value
            discountPrice = calculation.discount_value_type === 'percentage'
                ? parseInt(price * (discountFee / 100))
                : discountFee
            price = price - discountPrice
            totalPrice = price * quantity
            isDiscount = true 
        } else {
            if (isPlatform) {
                platformPrice = product.platform_currency_type === 'percentage'
                    ? parseInt(secondPrice * (platformFee / 100))
                    : platformFee 
                price = secondPrice + platformPrice
            } else {
                let discountPreviousValue = parseInt(product.discount_price)
                price = price + discountPreviousValue
            }
            totalPrice = price * quantity 
            discountPrice = 0
            discountFee = 0
            isDiscount = false 
        }
    }

    if (calculation.current_calculation === 'platform') {
        if (calculation.current_status === 'create') {
            platformFee = calculation.current_value
            platformPrice = calculation.platform_currency_type === 'percentage'
                ? parseInt(price * (platformFee / 100))
                : platformFee 
            price = price + platformPrice
            totalPrice = quantity * price
            platformFee = platformFee
            isPlatform = true 
        } else {
            if (isDiscount) {
                discountPrice = product.discount_value_type === 'percentage'
                    ? parseInt(secondPrice * (discountFee / 100))
                    : discountFee
                price = secondPrice - discountPrice
            } else {
                let platformPreviousValue = parseInt(product.platform)
                price = price - platformPreviousValue
            }
            totalPrice = quantity * price
            platformFee = 0
            platformPrice = 0
            isPlatform = false 
        }
    }

    payload.price = price 
    payload.secondPrice = secondPrice 
    payload.totalPrice = totalPrice 
    payload.quantity = quantity 
    payload.discountFee = discountFee 
    payload.discountPrice = discountPrice 
    payload.isDiscount = isDiscount 
    payload.platformPrice = platformPrice 
    payload.platformFee = platformFee 
    payload.isPlatform = isPlatform 

    return payload
}

export {
    formatCurrency,
    fieldCurrency,
    getCashbookList,
    replaceString,
    replaceToMoreValue,
    getDiscountOrder,
    getDiscountProduct
}