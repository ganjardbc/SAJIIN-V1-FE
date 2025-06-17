<template>
  <div id="Auth" class="w-full h-screen bg-gray-100 flex column justify-center items-center">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>
<script>
export default {
  beforeMount: function () {
    if (this.$cookies.get('token')) {
      if (this.$cookies.get('role').role_name === 'admin') {
        this.$router.replace({ name: 'admin-home' })
      } else {
        this.$router.replace({ name: 'select-shop' })
      }
    }
  },
}
</script>
