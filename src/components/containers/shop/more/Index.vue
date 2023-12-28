<template>
    <div id="App" class="main-content-small">
        <div class="padding padding-bottom-15px">
            <h1 class="fonts big black bold">Lainnya</h1>
        </div>

        <div class="display-flex space-between align-center">
            <div class="image image-50px image-circle border-full">
                <i 
                    v-if="!getImage" 
                    class="post-middle-absolute fonts grey fa fa-2x fa-user-circle" />
                <img v-else :src="getImage" alt="">
            </div>
            <div style="width: calc(100% - 120px)">
                <div class="fonts fonts-12 semibold black">{{ form.name }}</div>
                <div class="fonts fonts-10 normal grey uppercase">{{ form.role_name }}</div>
            </div>
            <button class="btn btn-icon btn-white" @click="toProfile">
                <i class="fa fa-lg fa-edit"></i>
            </button>
        </div>

        <div class="padding padding-top-15px margin margin-top-15px border-top">
            <AppListButton :data="moreMenu" />
        </div>

        <div class="padding padding-top-15px margin margin-top-15px border-top">
            <button 
                class="btn btn-sekunder btn-full" 
                @click="onLogout">
                Logout
            </button>
        </div>
        
        <AppPopupConfirmed 
            v-if="visibleAlert"
            :title="'Logout dari akun Kamu ?'"
            @onClickNo="onClickNoLogout"
            @onClickYes="onClickYesLogout"
        />

        <AppPopupLoader 
            v-if="loadingForm"
        />

    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppPopupConfirmed from '../../../modules/AppPopupConfirmed'
import AppPopupLoader from '../../../modules/AppPopupLoader'
import AppPopupAlert from '../../../modules/AppPopupAlert'
import AppTabs from '../../../modules/AppTabs'
import AppListButton from '../../../modules/AppListButton'

export default {
    name: 'App',
    metaInfo: {
        title: 'Shop',
        titleTemplate: '%s | More',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            selectedIndex: 0,
            visibleAlert: false,
            visibleAlert: false,
            titleAlert: 'Gagal memproses data',
            iconAlert: 'fa fa-4x fa-info-circle',
        }
    },
    mounted () {
        this.getData()
    },
    components: {
        AppTabs,
        AppPopupConfirmed,
        AppPopupLoader,
        AppPopupAlert,
        AppListButton,
    },
    computed: {
        ...mapState({
            form: (state) => state.storeProfile.form,
            errorMessage: (state) => state.storeProfile.errorMessage,
            loading: (state) => state.storeProfile.loading,
        }),
        loadingForm: {
            get () {
                return this.$store.state.storeProfile.loadingForm
            },
            set (value) {
                this.$store.state.storeProfile.loadingForm = value
            }
        },
        getImage () {
            return this.form.image ? this.adminImageThumbnailUrl + this.form.image : ''
        },
        moreMenu () {
            return [
                {icon: 'fa fa-lg fa-list-ol', label: 'Pengeluaran', value: 0, link: 'shop-expense', permission: 'expense-list'},
                {icon: 'fa fa-lg fa-users', label: 'Karyawan', value: 0, link: 'shop-employee', permission: 'employees'},
                {icon: 'fa fa-lg fa-flag', label: 'Platform', value: 0, link: 'shop-platforms', permission: 'settings'},
                {icon: 'fa fa-lg fa-percent', label: 'Diskon', value: 0, link: 'shop-discounts', permission: 'settings'},
                {icon: 'fa fa-lg fa-th-large', label: 'Daftar Meja', value: 0, link: 'shop-tables', permission: 'tables'},
                {icon: 'fa fa-lg fa-calendar-alt', label: 'Laporan', value: 0, link: 'shop-reports', permission: 'reports'},
                {icon: 'fa fa-lg fa-cogs', label: 'Pengaturan', value: 0, link: 'shop-settings', permission: 'settings'},
            ]
        }
    },
    methods: {
        ...mapActions({
            getUser: 'storeProfile/getData',
            logout: 'storeProfile/logout',
            setDataAuth: 'storeAuth/setData',
        }),
        toProfile () {
            this.$router.push({name: 'shop-profile'})
        },
        getData () {
            const token = this.$cookies.get('tokenBearer')
            this.getUser(token)
                .then((res) => {
                    const data = res.data.data
                    this.setDataAuth(data)
                    this.$cookies.set('user', data.user)
                })
        },

        // LOGOUT
        onLogout () {
            this.visibleAlert = true
        },
        onClickNoLogout () {
            this.visibleAlert = false
        },
        onClickYesLogout () {
            this.loadingForm = true
            this.visibleAlert = false
            const token = this.$cookies.get('tokenBearer')
            this.logout(token)
                .then((res) => {
                    if (res.data.status === 'ok') {
                        this.$cookies.remove('token')
                        this.$cookies.remove('tokenBearer')
                        this.$cookies.remove('user')
                        this.$cookies.remove('role')
                        this.$cookies.remove('shop')
                        this.$cookies.remove('employee')
                        this.$cookies.remove('permissions')

                        this.$router.push({ name: 'login' })
                    }
                })
                .finally(() => {
                    this.loadingForm = false 
                })
        },
    }
}
</script>