<template>
    <div id="App">
        <AppHeaderMobile title="Profil" />
        <Profile />
    </div>
</template>
<script>
import AppHeaderMobile from '../../../modules/AppHeaderMobile'
import Profile from '../../user/profile/Index'

export default {
    name: 'App',
    metaInfo: {
        title: 'Shop',
        titleTemplate: '%s | Profile',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    components: {
        AppHeaderMobile,
        Profile,
    },
}
</script>