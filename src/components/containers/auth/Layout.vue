<template>
  <div id="Auth" class="display-popup-normal bg-white" style="z-index: 1000">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
export default {
  beforeMount: function () {
    if (this.$cookies.get('token')) {
      const user = this.$cookies.get('user')
      const shop = this.$cookies.get('shop')

      if (user.role_name === 'admin') {
        this.$router.replace({ name: 'admin-home' })
      } else if (user.role_name === 'owner') {
        this.$router.replace({ name: 'owner-home' })
      } else {
        this.$store.state.storeSelectedShop.selectedData = shop.id
        this.$router.replace({ name: 'shop-home', params: { shopId: shop.shop_id } })
      }
    }
  },
}
</script>
