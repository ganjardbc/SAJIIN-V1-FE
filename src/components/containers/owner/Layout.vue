<template>
    <div id="admin" class="mobile-admin">
        <div class="sidebar mobile-sidebar">
            <div class="header mobile-hidden">
                <div class="header-content display-flex center align-center">
                    <div class="fonts medium bold black">Owner</div>
                </div>
            </div>
            <div class="content with-header">
                <AppListMenu 
                    :data.sync="sidebar"
                    :isSidebarSmall="false"
                    :enableResponsive="true"
                    @onClick="onCloseSidebar" />
            </div>
        </div>
        <div class="main mobile-main">
            <div class="header">
                <div class="header-content-fixed">
                    <div class="header-content-main">
                        <div class="width width-auto">
                            <router-link :to="{name: 'owner-home'}" class="width width-90px display-flex align-center">
                                <img :src="logo" alt="" style="width: 100%;">
                            </router-link>
                        </div>
                        <div class="header-content-main-right">
                            <AppCardProfile 
                                :data.sync="dataUser" 
                                class="margin margin-left-10px" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-content">
                <div class="main-content-smalls">
                    <router-view />
                </div>
                <div class="display-flex center padding padding-20px">
                    <div class="fonts fonts-10 grey align-center">{{ appVersion  }}</div>
                </div>
            </div>
        </div>

        <AppToast />

        <AppToastMessage />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueLoadImage from 'vue-load-image'
import logo from '@/assets/img/logo.png'
import icon from '@/assets/img/icon.png'
import AppToast from '../../modules/AppToast'
import AppToastMessage from '../../modules/AppToastMessage'
import AppCardProfile from '../../modules/AppCardProfile'
import AppListMenu from '../../modules/AppListMenu'

const defaultSidebar = [
    {
        icon: 'fa fa-lg fa-database', 
        label: 'OWNER', 
        value: 0, 
        disableMenu: true, 
        menu: [
            {icon: 'fa fa-lg fa-store', label: 'TOKO', value: 0, link: 'owner-home', permission: 'shops'},
            {icon: 'fa fa-lg fa-user', label: 'PROFIL', value: 0, link: 'owner-profile', permission: 'profile'},
        ]
    },
]

export default {
    name: 'app',
    data () {
        return {
            logo: logo,
            icon: icon,
            visibleSidebar: false,
            sidebar: defaultSidebar,
            countNotif: 0,
        }
    },
    beforeMount (){
        if (!this.$cookies.get('token')) {
            this.$router.push({ name: 'login' })
        }
        if (this.$cookies.get('token')) {
            this.userData()
        }
    },
    mounted () {
        this.getShopData()
    },
    components: {
        VueLoadImage,
        AppToastMessage,
        AppToast,
        AppCardProfile,
        AppListMenu,
    },
    methods: {
        ...mapActions({
            // new store
            getUserData: 'storeAuth/getUserData',
            getShop: 'storeSelectedShop/getData',

            // old store
            setToast: 'toast/setToast',
            setMultipleToast: 'toastmessage/setMultipleToast',
        }),
        onOpenSidebar () {
            this.visibleSidebar = true 
        },
        onCloseSidebar () {
            this.visibleSidebar = false 
        },
        onChangeMenu (data) {
            this.selectedLabel = this.menuShops[data].label
        },
        makeToast (title, subtitle) {
            const time = new Date().getTime()
            const payload = {
                visible: true,
                title: title,
                subtitle: subtitle
            }
            this.setToast(payload)
        },
        makeMultipleToast (title, subtitle) {
            const time = new Date().getTime()
            const payload = {
                id: time,
                visible: true,
                title: title,
                subtitle: subtitle
            }
            this.setMultipleToast(payload)
        },
        userData () {
            const token = this.$cookies.get('tokenBearer')
            this.getUserData(token).then((res) => {
                const data = res.data.data 

                this.$cookies.set('user', data.user)
                this.$cookies.set('role', data.role)
                this.$cookies.set('shop', data.shop)
                this.$cookies.set('employee', data.employee)
                this.$cookies.set('permissions', JSON.stringify(data.permissions))
            }).catch(() => {
                this.$cookies.remove('token')
                this.$cookies.remove('tokenBearer')
                this.$cookies.remove('user')
                this.$cookies.remove('role')
                this.$cookies.remove('shop')
                this.$cookies.remove('employee')
                this.$cookies.remove('permissions')
                this.$cookies.remove('thermalStatus')
                this.$cookies.remove('thermalUrl')

                this.$router.replace({ name: 'login' })
            })
        },
        getShopData () {
            const token = this.$cookies.get('tokenBearer')
            this.getShop({ token })
        }
    },
    computed: {
        ...mapState({
            data: (state) => state.storeAuth.data,
        }),
        dataUser () {
            return this.data && this.data.user
        }
    },
    sockets: {
        orderList: function (data) {
            const lth = data.length
            const payload = data && data[lth - 1]
            this.makeMultipleToast(payload.title, payload.subtitle)
        }
    }
}
</script>