import Layout from '@/components/containers/shop/Layout'
import Home from '@/components/containers/shop/Index'
import Profile from '@/components/containers/shop/profile/Index'
import Dashboard from '@/components/containers/shop/dashboard/Index'
import Cashier from '@/components/containers/shop/cashier/Index'
import CashBook from '@/components/containers/shop/cashBook/Index'
import OrderHome from '@/components/containers/shop/order/Index'
import Orders from '@/components/containers/shop/order/orders/Index'
import TaskLists from '@/components/containers/shop/order/taskLists/Index'
import ExpenseList from '@/components/containers/shop/expense/expenseList/Index'
import ProductHome from '@/components/containers/shop/product/Index'
import Products from '@/components/containers/shop/product/products/Index'
import Categories from '@/components/containers/shop/product/categories/Index'
import EmployeeHome from '@/components/containers/shop/employee/Index'
import Employees from '@/components/containers/shop/employee/employees/Index'
import Shifts from '@/components/containers/shop/employee/shifts/Index'
import Notifications from '@/components/containers/shop/notifications/Index'
import Tables from '@/components/containers/shop/tables/Index'
import Reports from '@/components/containers/shop/reports/Index'
import Platforms from '@/components/containers/shop/platforms/Index'
import Discounts from '@/components/containers/shop/discounts/Index'
import More from '@/components/containers/shop/more/Index'

const routes = {
  path: '/shop/:shopId',
  component: Layout,
  children: [
    {
      name: 'shop-profile',
      path: 'profile',
      component: Profile,
      meta: {
        title: 'Profil',
      },
    },
    {
      name: 'shop-home',
      path: 'home',
      component: Home,
      meta: {
        title: 'Home',
      },
    },
    {
      name: 'shop-dashboard',
      path: 'dashboard',
      component: Dashboard,
      meta: {
        title: 'Dashboard',
      },
    },
    {
      name: 'shop-cashier',
      path: 'cashier',
      component: Cashier,
      meta: {
        title: 'Kasir',
      },
    },
    {
      name: 'shop-cash-book',
      path: 'cash-book',
      component: CashBook,
      meta: {
        title: 'Buku Kas',
      },
    },
    {
      name: 'shop-order',
      path: 'order',
      component: OrderHome,
      meta: {
        title: 'Penjualan',
      },
    },
    {
      name: 'shop-orders',
      path: 'orders',
      component: Orders,
      meta: {
        title: 'Penjualan',
      },
    },
    {
      name: 'shop-task-lists',
      path: 'task-lists',
      component: TaskLists,
      meta: {
        title: 'Daftar Tugas',
      },
    },
    {
      name: 'shop-expense',
      path: 'expense',
      component: ExpenseList,
      meta: {
        title: 'Pembelian',
      },
    },
    {
      name: 'shop-product',
      path: 'product',
      component: ProductHome,
      meta: {
        title: 'Produk',
      },
    },
    {
      name: 'shop-products',
      path: 'products',
      component: Products,
      meta: {
        title: 'Produk',
      },
    },
    {
      name: 'shop-categories',
      path: 'categories',
      component: Categories,
      meta: {
        title: 'Kategori',
      },
    },
    {
      name: 'shop-tables',
      path: 'tables',
      component: Tables,
      meta: {
        title: 'Meja',
      },
    },
    {
      name: 'shop-employee',
      path: 'employee',
      component: EmployeeHome,
      meta: {
        title: 'Daftar Karyawan',
      },
    },
    {
      name: 'shop-employees',
      path: 'employees',
      component: Employees,
      meta: {
        title: 'Daftar Karyawan',
      },
    },
    {
      name: 'shop-shifts',
      path: 'shifts',
      component: Shifts,
      meta: {
        title: 'Shift Karyawan',
      },
    },
    {
      name: 'shop-notifications',
      path: 'notifications',
      component: Notifications,
      meta: {
        title: 'Notifikasi',
      },
    },
    {
      name: 'shop-reports',
      path: 'reports',
      component: Reports,
      meta: {
        title: 'Laporan',
      },
    },
    {
      name: 'shop-platforms',
      path: 'platforms',
      component: Platforms,
      meta: {
        title: 'Platform',
      },
    },
    {
      name: 'shop-discounts',
      path: 'discounts',
      component: Discounts,
      meta: {
        title: 'Diskon',
      },
    },
    {
      name: 'shop-more',
      path: 'more',
      component: More,
      meta: {
        title: 'Lainnya',
      },
    },
  ],
}

export default routes
