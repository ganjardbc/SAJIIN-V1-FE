<template>
  <div id="App">
    <AppHeaderMobile title="Edit Profil" />
    <Profile />
  </div>
</template>
<script>
import Profile from '../../user/profile/Index'
import AppHeaderMobile from '../../../modules/AppHeaderMobile'

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
    AppHeaderMobile,
    Profile,
  },
}
</script>
