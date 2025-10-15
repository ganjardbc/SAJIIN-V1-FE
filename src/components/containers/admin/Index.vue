<template>
  <div id="App" class="h-full w-full flex items-center justify-center bg-gray-100">
    <AppEmpty
      icon="fa fa-3x fa-shapes"
      title="WELCOME TO SAJI-IN ADMIN PANEL"
    />
  </div>
</template>
<script>
import AppEmpty from '../../modules/AppEmpty.vue'

export default {
  name: 'App',
  metaInfo: {
    title: 'Admin',
    titleTemplate: '%s | Home',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  components: {
    AppEmpty,
  },
}
</script>
