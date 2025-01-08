import Layout from '@/components/containers/shop/Layout'
import Home from '@/components/containers/shop/Index'
import Profile from '@/components/containers/shop/profile/Index'
import Settings from '@/components/containers/shop/settings/Index'
import Dashboard from '@/components/containers/shop/dashboard/Index'
import Cashier from '@/components/containers/shop/cashier/Index'
import CashBook from '@/components/containers/shop/cashBook/Index'
import OrderHome from '@/components/containers/shop/order/Index'
import Orders from '@/components/containers/shop/order/orders/Index'
import TaskLists from '@/components/containers/shop/order/taskLists/Index'
import ExpenseHome from '@/components/containers/shop/expense/Index'
import ExpenseType from '@/components/containers/shop/expense/expenseType/Index'
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
import LogActivities from '@/components/containers/shop/logActivities/Index'
import More from '@/components/containers/shop/more/Index'

const routes = {
  path: '/shop/:shopId',
  component: Layout,
  children: [
    {
      name: 'shop-profile',
      path: 'profile',
      component: Profile,
    },
    {
      name: 'shop-settings',
      path: 'settings',
      component: Settings,
    },
    {
      name: 'shop-home',
      path: 'home',
      component: Home,
    },
    {
      name: 'shop-dashboard',
      path: 'dashboard',
      component: Dashboard,
    },
    {
      name: 'shop-cashier',
      path: 'cashier',
      component: Cashier,
    },
    {
      name: 'shop-cash-book',
      path: 'cash-book',
      component: CashBook,
    },
    {
      name: 'shop-order',
      path: 'order',
      component: OrderHome,
    },
    {
      name: 'shop-orders',
      path: 'orders',
      component: Orders,
    },
    {
      name: 'shop-task-lists',
      path: 'task-lists',
      component: TaskLists,
    },
    {
      name: 'shop-expense',
      path: 'expense',
      component: ExpenseHome,
    },
    {
      name: 'shop-expense-type',
      path: 'expense-type',
      component: ExpenseType,
    },
    {
      name: 'shop-expense-list',
      path: 'expense-list',
      component: ExpenseList,
    },
    {
      name: 'shop-product',
      path: 'product',
      component: ProductHome,
    },
    {
      name: 'shop-products',
      path: 'products',
      component: Products,
    },
    {
      name: 'shop-categories',
      path: 'categories',
      component: Categories,
    },
    {
      name: 'shop-tables',
      path: 'tables',
      component: Tables,
    },
    {
      name: 'shop-employee',
      path: 'employee',
      component: EmployeeHome,
    },
    {
      name: 'shop-employees',
      path: 'employees',
      component: Employees,
    },
    {
      name: 'shop-shifts',
      path: 'shifts',
      component: Shifts,
    },
    {
      name: 'shop-notifications',
      path: 'notifications',
      component: Notifications,
    },
    {
      name: 'shop-reports',
      path: 'reports',
      component: Reports,
    },
    {
      name: 'shop-platforms',
      path: 'platforms',
      component: Platforms,
    },
    {
      name: 'shop-discounts',
      path: 'discounts',
      component: Discounts,
    },
    {
      name: 'shop-log-activities',
      path: 'log-activities',
      component: LogActivities,
    },
    {
      name: 'shop-more',
      path: 'more',
      component: More,
    },
  ],
}

export default routes
