import Layout from '@/components/containers/visitor/Layout'
import Home from '@/components/containers/visitor/home/Index'
import ProductDetail from '@/components/containers/visitor/product/detail/Index'
import Carts from '@/components/containers/visitor/cart/Index'
import CheckOut from '@/components/containers/visitor/checkOut/Index'
import Order from '@/components/containers/visitor/order/Index'

const routes = {
  path: '/visitor/:shopId',
  component: Layout,
  children: [
    {
      name: 'visitor-home',
      path: '/',
      component: Home,
      meta: {
        title: 'Home',
      },
    },
    {
      name: 'visitor-product-detail',
      path: 'product/:productId',
      components: {
        visitorLayoutReload: ProductDetail,
      },
      meta: {
        title: 'Detail Produk',
      },
    },
    {
      name: 'visitor-order',
      path: 'order/:orderId',
      components: {
        visitorLayoutReload: Order,
      },
      meta: {
        title: 'Detail Pesanan',
      },
    },
    {
      name: 'visitor-carts',
      path: 'carts',
      components: {
        visitorLayoutReload: Carts,
      },
      meta: {
        title: 'Keranjang',
      },
    },
    {
      name: 'visitor-checkout',
      path: 'checkout',
      components: {
        visitorLayoutReload: CheckOut,
      },
      meta: {
        title: 'Checkout',
      },
    },
  ],
}

export default routes
