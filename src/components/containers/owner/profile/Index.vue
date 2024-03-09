<template>
  <div id="App">
    <Profile />
  </div>
</template>
<script>
import Profile from '../../user/profile/Index'

export default {
  name: 'App',
  metaInfo: {
    title: 'Owner',
    titleTemplate: '%s | Profile',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  components: {
    Profile,
  },
}
</script>
