window.Vue = require('vue')

import App from './components/App.vue'
import VueRouter from 'vue-router'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import Vuex from 'vuex'
import axios from 'axios'
import { routes } from './router'
import store from './store'
import {
  formatCurrency,
  fieldCurrency,
  getCashbookList,
} from './services/utils'
import SmartTable from 'vuejs-smart-table'
import jquery from 'jquery'
import VueSocketIO from 'vue-socket.io'
import SocketIo from 'socket.io-client'
import VueQrcodeReader from 'vue-qrcode-reader'
import VueApexCharts from 'vue-apexcharts'
import VueCarousel from 'vue-carousel'
import VueSession from 'vue-session'
import VueHtml2pdf from 'vue-html2pdf'
import VueGtag from 'vue-gtag'
import Print from 'vue-print-nb'
import VueMeta from 'vue-meta'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/sass/app.css'
import './assets/icons/fontawesome/css/all.min.css'
import Vue from 'vue'
import wb from './registerServiceWorker'
import VueCurrencyInput from 'vue-currency-input'

const initUrl = process.env.BASE_URL
const socket = process.env.SOCKET_URL
const printer = process.env.PRINTER_URL
const api = process.env.API_URL
const pluginOptions = {
  globalOptions: {
    currency: 'IDR',
    locale: 'id',
  },
}

axios.defaults.withCredentials = true
axios.defaults.baseURL = api

const moment = require('moment')
require('moment/locale/id')

window.$ = jquery

Vue.use(VueCurrencyInput, pluginOptions)
Vue.use(Print)
Vue.use(ElementUI, { locale })
Vue.use(VueSession)
Vue.use(VueHtml2pdf)
Vue.use(VueGtag, {
  config: { id: 'G-DNMW2CDZWP' },
})
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
})
Vue.use(VueCarousel)
Vue.use(VueApexCharts)
Vue.use(require('vue-moment'), { moment })
Vue.use(VueQrcodeReader)
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(SmartTable)
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIo(socket),
  })
)

Vue.component('apexchart', VueApexCharts)

Vue.$cookies.config('2d')
Vue.prototype.$workbox = wb
Vue.prototype.format = (data) => {
  return formatCurrency(data)
}
Vue.prototype.currency = (data) => {
  return fieldCurrency(data)
}
Vue.prototype.cashBookList = (data) => {
  return getCashbookList(data)
}
Vue.prototype.appVersion = 'App Version 1.0.0'
Vue.prototype.apiUrl = api
Vue.prototype.initUrl = initUrl
Vue.prototype.socketUrl = socket
Vue.prototype.printerUrl = printer
Vue.prototype.adminImageThumbnailUrl = api + '/contents/users/thumbnails/'
Vue.prototype.adminImageCoverUrl = api + '/contents/users/covers/'
Vue.prototype.benefitImageThumbnailUrl = api + '/contents/benefits/thumbnails/'
Vue.prototype.benefitImageCoverUrl = api + '/contents/benefits/covers/'
Vue.prototype.productImageThumbnailUrl = api + '/contents/products/thumbnails/'
Vue.prototype.productImageCoverUrl = api + '/contents/products/covers/'
Vue.prototype.articleImageThumbnailUrl = api + '/contents/articles/thumbnails/'
Vue.prototype.articleImageCoverUrl = api + '/contents/articles/covers/'
Vue.prototype.categoryImageThumbnailUrl =
  api + '/contents/categories/thumbnails/'
Vue.prototype.categoryImageCoverUrl = api + '/contents/categories/covers/'
Vue.prototype.topingImageThumbnailUrl = api + '/contents/topings/thumbnails/'
Vue.prototype.topingImageCoverUrl = api + '/contents/topings/covers/'
Vue.prototype.paymentImageThumbnailUrl = api + '/contents/payments/thumbnails/'
Vue.prototype.paymentImageCoverlUrl = api + '/contents/payments/covers/'
Vue.prototype.shipmentImageThumbnaiUrl = api + '/contents/shipments/thumbnails/'
Vue.prototype.shipmentImageCoverUrl = api + '/contents/shipments/covers/'
Vue.prototype.customerImageThumbnailUrl =
  api + '/contents/customers/thumbnails/'
Vue.prototype.customerImageCoverUrl = api + '/contents/customers/covers/'
Vue.prototype.tableImageThumbnailUrl = api + '/contents/tables/thumbnails/'
Vue.prototype.tableImageCoverUrl = api + '/contents/tables/covers/'
Vue.prototype.feedbackImageThumbnailUrl =
  api + '/contents/feedbacks/thumbnails/'
Vue.prototype.feedbackImageCoverUrl = api + '/contents/feedbacks/covers/'
Vue.prototype.shopImageThumbnailUrl = api + '/contents/shops/thumbnails/'
Vue.prototype.shopImageCoverUrl = api + '/contents/shops/covers/'
Vue.prototype.employeeImageThumbnailUrl =
  api + '/contents/employees/thumbnails/'
Vue.prototype.employeeImageCoverUrl = api + '/contents/employees/covers/'
Vue.prototype.shiftImageThumbnailUrl = api + '/contents/shifts/thumbnails/'
Vue.prototype.shiftImageCoverUrl = api + '/contents/shifts/covers/'
Vue.prototype.expenseTypeImageThumbnailUrl =
  api + '/contents/expense_types/thumbnails/'
Vue.prototype.expenseTypeImageCoverlUrl =
  api + '/contents/expense_types/covers/'
Vue.prototype.expenseListImageThumbnailUrl =
  api + '/contents/expense_lists/thumbnails/'
Vue.prototype.expenseListImageCoverlUrl =
  api + '/contents/expense_lists/covers/'
Vue.prototype.platformImageThumbnailUrl =
  api + '/contents/platforms/thumbnails/'
Vue.prototype.platformImageCoverUrl = api + '/contents/platforms/covers/'
Vue.prototype.discountImageThumbnailUrl =
  api + '/contents/discounts/thumbnails/'
Vue.prototype.discountImageCoverUrl = api + '/contents/discounts/covers/'

const router = new VueRouter({
  mode: 'history',
  routes: routes,
  base: '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: (h) => h(App),
})
