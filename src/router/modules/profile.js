import EmptyLayout from '@/components/containers/shop/EmptyLayout.vue'
import ChangeProfile from '@/components/containers/shop/profile/ChangeProfile.vue'
import ChangePassword from '@/components/containers/shop/profile/ChangePassword.vue'
import Settings from '@/components/containers/shop/settings/Index'
import ShopOperational from '@/components/containers/shop/settings/Operational.vue'
import ShopContact from '@/components/containers/shop/settings/Contact.vue'
import ShopConfiguration from '@/components/containers/shop/settings/Configuration.vue'
import ShopDetail from '@/components/containers/shop/settings/Detail.vue'

const routes = {
  path: '/shop/:shopId/profile',
  component: EmptyLayout,
  children: [
    {
      name: 'shop-change-profile',
      path: 'change-profile',
      meta: {
        title: 'Ubah Profil',
      },
      component: ChangeProfile,
    },
    {
      name: 'shop-change-password',
      path: 'change-password',
      meta: {
        title: 'Ganti Password',
      },
      component: ChangePassword,
    },
    {
      name: 'shop-settings',
      path: 'shop-settings',
      meta: {
        title: 'Pengaturan Toko',
      },
      component: Settings,
    },
    {
      name: 'shop-operational',
      path: 'shop-operational',
      meta: {
        title: 'Jam Operasional Toko',
      },
      component: ShopOperational,
    },
    {
      name: 'shop-contact',
      path: 'shop-contact',
      meta: {
        title: 'Kontak Toko',
      },
      component: ShopContact,
    },
    {
      name: 'shop-configuration',
      path: 'shop-configuration',
      meta: {
        title: 'Konfigurasi Toko',
      },
      component: ShopConfiguration,
    },
    {
      name: 'shop-detail',
      path: 'detail',
      meta: {
        title: 'Detail Toko',
      },
      component: ShopDetail,
    },
  ],
}

export default routes
