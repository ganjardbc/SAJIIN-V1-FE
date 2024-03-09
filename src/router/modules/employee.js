import Layout from '@/components/containers/employee/Layout'
import Home from '@/components/containers/employee/Index'
import Profile from '@/components/containers/employee/profile/Index'
import Dashboard from '@/components/containers/employee/dashboard/Index'
import More from '@/components/containers/employee/more/Index'
import Cashier from '@/components/containers/shop/cashier/Index'
import CashBook from '@/components/containers/shop/cashBook/Index'
import Reports from '@/components/containers/shop/reports/Index'
import Orders from '@/components/containers/shop/order/Index'
import TaskLists from '@/components/containers/shop/order/taskLists/Index'
import Expenses from '@/components/containers/shop/expense/Index'
import Products from '@/components/containers/shop/product/products/Index'
import Tables from '@/components/containers/shop/tables/Index'
import Shifts from '@/components/containers/shop/employee/shifts/Index'
import Employees from '@/components/containers/shop/employee/Index'
import Notifications from '@/components/containers/shop/notifications/Index'

const routes = {
  path: '/employee',
  component: Layout,
  children: [
    {
      name: 'employee-home',
      path: 'home',
      component: Home,
    },
    {
      name: 'employee-dashboard',
      path: 'dashboard',
      component: Dashboard,
    },
    {
      name: 'employee-profile',
      path: 'profile',
      component: Profile,
    },
    {
      name: 'employee-task-lists',
      path: 'task-lists',
      component: TaskLists,
    },
    {
      name: 'employee-cashier',
      path: 'cashier',
      component: Cashier,
    },
    {
      name: 'employee-cash-book',
      path: 'cash-book',
      component: CashBook,
    },
    {
      name: 'employee-reports',
      path: 'reports',
      component: Reports,
    },
    {
      name: 'employee-orders',
      path: 'orders',
      component: Orders,
    },
    {
      name: 'employee-expense',
      path: 'expense',
      component: Expenses,
    },
    {
      name: 'employee-products',
      path: 'products',
      component: Products,
    },
    {
      name: 'employee-tables',
      path: 'tables',
      component: Tables,
    },
    {
      name: 'employee-shifts',
      path: 'shifts',
      component: Shifts,
    },
    {
      name: 'employee-notifications',
      path: 'notifications',
      component: Notifications,
    },
    {
      name: 'employee-employees',
      path: 'employees',
      component: Employees,
    },
    {
      name: 'employee-more',
      path: 'more',
      component: More,
    },
  ],
}

export default routes
