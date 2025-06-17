import Layout from '@/components/containers/auth/Layout'
import Login from '@/components/containers/auth/Login'
import SelectShop from '@/components/containers/auth/SelectShop'

const routes = {
  path: '/',
  component: Layout,
  children: [
    {
      name: 'login',
      path: '/',
      component: Login,
    },
    {
      name: 'select-shop',
      path: '/select-shop',
      component: SelectShop,
      meta: {
        requiresAuth: true,
      },
    },
  ],
}

export default routes
