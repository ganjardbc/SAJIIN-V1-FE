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

export {
    formatCurrency,
    fieldCurrency,
    getCashbookList,
    replaceString,
    replaceToMoreValue
}