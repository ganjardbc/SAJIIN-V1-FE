<template>
    <div id="App">
        <AppHeaderMobile title="Profil" />

        <div class="card-dashboard-container">
            <div class="padding padding-bottom-15px">
                <h1 class="fonts big black bold">Profil</h1>
            </div>

            <AppTabs
                :isFull="true" 
                :selectedIndex.sync="selectedIndex" 
                :data="tabs" 
                :onChange="(data) => onChangeTabs(data)"
                class="width width-400px width-mobile margin margin-bottom-20px" />

            <div v-loading="loading">
                <div v-if="selectedIndex === 0" class="display-flex display-mobile space-between padding padding-top-10px padding-bottom-10px">
                    <div class="width width-30 width-mobile" style="margin-bottom: 30px;">
                        <div class="card no-padding-mobile box-shadow bg-white">
                            <div class="content-center margin margin-bottom-20px">
                                <div class="image image-150px border-full" style="margin: auto; text-align: center;">
                                    <i 
                                        v-if="!getImage" 
                                        class="post-middle-absolute fonts grey fa fa-2x fa-user-circle" />
                                    <img v-else :src="getImage" alt="">
                                </div>
                            </div>
                            <button 
                                class="btn btn-sekunder btn-full margin margin-top-20px" 
                                @click="onButtonUpload('employee')">
                                Ubah Cover Karyawan
                            </button>
                        </div>
                    </div>
                    <div class="width width-70 width-mobile">
                        <div class="padding padding-left-30px no-margin-padding">
                            <div 
                                v-if="form.shop && form.role && form.shift" 
                                class="card no-padding-mobile box-shadow bg-white margin margin-bottom-20px">
                                <div class="width width-100">
                                    <div class="fonts fonts-13 black semibold">Toko</div>
                                    <div class="display-flex space-between padding padding-top-10px">
                                        <div class="fonts micro black semibold" style="width: 140px;">Toko</div>
                                        <div class="fonts micro black" style="width: calc(100% - 140px);">
                                            {{ form.shop && form.shop.name }}
                                        </div>
                                    </div>
                                    <div class="display-flex space-between">
                                        <div class="fonts micro black semibold" style="width: 140px;">Role & Posisi</div>
                                        <div class="fonts micro black" style="width: calc(100% - 140px);">
                                            {{ form.role && form.role.description }}
                                        </div>
                                    </div>
                                    <div class="display-flex space-between">
                                        <div class="fonts micro black semibold" style="width: 140px;">Shift</div>
                                        <div style="width: calc(100% - 140px);">
                                            <div class="fonts micro black">
                                                {{ form.shift && form.shift.title }}
                                            </div>
                                            <div class="fonts micro black">
                                                {{ form.shift && form.shift.start_time }} - {{ form.shift && form.shift.end_time }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card no-padding-mobile box-shadow bg-white margin margin-bottom-20px">
                                <div class="fonts fonts-13 black semibold">Karyawan</div>
                                <div class="field-group">
                                    <div class="field-label">ID Karyawan</div>
                                    <el-input 
                                        placeholder=""
                                        type="text"
                                        v-model="form.employee_id"
                                        :disabled="true"></el-input>
                                    <div 
                                        v-if="errorMessage.employee_id" 
                                        class="field-error">
                                        {{ errorMessage.employee_id && errorMessage.employee_id[0] }}
                                    </div>
                                </div>
                                <div class="field-group">
                                    <div class="field-label">Nama</div>
                                    <el-input 
                                        placeholder=""
                                        type="text"
                                        v-model="form.name"
                                        :disabled="false"></el-input>
                                    <div 
                                        v-if="errorMessage.name" 
                                        class="field-error">
                                        {{ errorMessage.name && errorMessage.name[0] }}
                                    </div>
                                </div>
                                <div class="field-group">
                                    <div class="field-label">Email</div>
                                    <el-input 
                                        placeholder=""
                                        type="text"
                                        v-model="form.email"
                                        :disabled="false"
                                        @input="onChangeEmail"></el-input>
                                    <div 
                                        v-if="errorMessage.email" 
                                        class="field-error">
                                        {{ errorMessage.email && errorMessage.email[0] }}
                                    </div>
                                </div>
                                <div class="field-group">
                                    <div class="field-label">Telepon</div>
                                    <el-input 
                                        placeholder=""
                                        type="text"
                                        v-model="form.phone"
                                        :disabled="false"></el-input>
                                    <div 
                                        v-if="errorMessage.phone" 
                                        class="field-error">
                                        {{ errorMessage.phone && errorMessage.phone[0] }}
                                    </div>
                                </div>
                                <div class="field-group">
                                    <div class="field-label">Alamat</div>
                                    <el-input 
                                        placeholder=""
                                        type="textarea"
                                        v-model="form.address"
                                        :disabled="false"
                                        :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                                    <div 
                                        v-if="errorMessage.address" 
                                        class="field-error">
                                        {{ errorMessage.address && errorMessage.address[0] }}
                                    </div>
                                </div>
                                <div class="field-group">
                                    <div class="field-label">Keterangan (opsional)</div>
                                    <el-input 
                                        placeholder=""
                                        type="textarea"
                                        v-model="form.about"
                                        :disabled="false"
                                        :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                                    <div 
                                        v-if="errorMessage.about" 
                                        class="field-error">
                                        {{ errorMessage.about && errorMessage.about[0] }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="selectedIndex === 1" class="display-flex display-mobile space-between padding padding-top-10px padding-bottom-10px">
                    <div class="width width-30 width-mobile" style="margin-bottom: 30px;">
                        <div class="card no-padding-mobile box-shadow bg-white">
                            <div class="content-center margin margin-bottom-20px">
                                <div class="image image-150px image-circle border-full" style="margin: auto; text-align: center;">
                                    <i 
                                        v-if="!getUserImage" 
                                        class="post-middle-absolute fonts grey fa fa-2x fa-user-circle" />
                                    <img v-else :src="getUserImage" alt="">
                                </div>
                            </div>
                            <button 
                                class="btn btn-sekunder btn-full margin margin-top-20px" 
                                @click="onButtonUpload('user')">
                                Ubah Cover Pengguna
                            </button>
                        </div>
                    </div>
                    <div class="width width-70 width-mobile">
                        <div class="padding padding-left-30px no-margin-padding">
                            <div class="card no-padding-mobile box-shadow bg-white margin margin-bottom-20px">
                                <div class="margin margin-bottom-20px">
                                    <div class="fonts fonts-13 black semibold">Pengguna</div>
                                    <div class="field-group">
                                        <div class="field-label">Username</div>
                                        <div class="field-caption">Tambahkan username baru atau ubah username sekarang.</div>
                                        <div v-if="form.user_username_old" class="field-caption">Username sekarang adalah "{{ form.user_username_old }}".</div>
                                        <el-input 
                                            placeholder=""
                                            type="text"
                                            v-model="form.username"
                                            :disabled="false"
                                            @input="onChageUsername"></el-input>
                                        <div 
                                            v-if="errorMessage.username" 
                                            class="field-error">
                                            {{ errorMessage.username && errorMessage.username[0] }}
                                        </div>
                                    </div>
                                    <div class="field-group">
                                        <div class="field-label">Password</div>
                                        <div class="field-caption">Tambahkan password baru atau ubah password sekarang.</div>
                                        <el-input 
                                            placeholder=""
                                            type="password"
                                            v-model="form.password"
                                            :disabled="false"
                                            show-password></el-input>
                                        <div 
                                            v-if="errorMessage.password" 
                                            class="field-error">
                                            {{ errorMessage.password && errorMessage.password[0] }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="selectedIndex === 2" class="width width-100 padding padding-top-10px padding-bottom-10px">
                    <div class="card no-padding-mobile box-shadow bg-white margin margin-bottom-20px">
                        <div class="fonts fonts-13 black semibold">Konfigurasi</div>
                        <div class="field-group">
                            <div class="display-flex space-between">
                                <div class="field-label">Status</div>
                                <el-switch 
                                    v-model="form.status"
                                    :disabled="false"
                                    active-text="Aktif"
                                    inactive-text="Non-Aktif"
                                    :active-value="'active'"
                                    :inactive-value="'inactive'"></el-switch>
                            </div>
                            <div 
                                v-if="errorMessage.status" 
                                class="field-error">
                                {{ errorMessage.status && errorMessage.status[0] }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="display-flex flex-end">
                    <button class="btn btn-main btn-full" @click="onSaveSubmit">
                        Update Data
                    </button>
                </div>
            </div>
        </div>

        <AppFileUpload 
            v-if="visibleUpdateCover"
            @onClose="onCloseCover"
            @onUpload="onUpdateCover"
        />

        <AppPopupConfirmed 
            v-if="visibleConfirmedUpdate"
            :title="'Update data profil ?'"
            @onClickNo="onClickNoUpdate"
            @onClickYes="onClickYesUpdate"
        />
        
        <AppPopupConfirmed 
            v-if="visibleConfirmedLogout"
            :title="'Logout dari akun Kamu ?'"
            @onClickNo="onClickNoLogout"
            @onClickYes="onClickYesLogout"
        />

        <AppPopupAlert 
            v-if="visibleAlert"
            :title="titleAlert"
            :icon="iconAlert"
            @onClickOk="onClickOk"
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
import AppFileUpload from '../../../modules/AppFileUpload'
import AppTabs from '../../../modules/AppTabs'
import AppHeaderMobile from '../../../modules/AppHeaderMobile'

const tabs = [
    {id: 1, label: 'Karyawan', status: 'active'},
    {id: 2, label: 'Pengguna', status: ''},
    {id: 3, label: 'Konfigurasi', status: ''},
]

export default {
    name: 'App',
    metaInfo: {
        title: 'Employee',
        titleTemplate: '%s | Profile',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            tabs: tabs,
            selectedIndex: 0,
            visibleUpdateCover: false,
            visibleConfirmedLogout: false, 
            visibleConfirmedUpdate: false,
            visibleAlert: false,
            titleAlert: 'Gagal memproses data',
            iconAlert: 'fa fa-4x fa-info-circle',
            coverType: 'employee'
        }
    },
    mounted () {
        this.getAllData()
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.getAllData()
            }
        }
    },
    components: {
        AppTabs,
        AppFileUpload,
        AppPopupConfirmed,
        AppPopupLoader,
        AppPopupAlert,
        AppHeaderMobile,
    },
    computed: {
        ...mapState({
            form: (state) => state.storeEmployee.form,
            errorMessage: (state) => state.storeEmployee.errorMessage,
            loading: (state) => state.storeEmployee.loading,
        }),
        loadingForm: {
            set(value) {
                this.$store.state.storeProfile.loadingForm = value 
            },
            get() {
                return this.$store.state.storeProfile.loadingForm
            }
        },
        getImage () {
            return this.form.image ? this.employeeImageThumbnailUrl + this.form.image : ''
        },
        getUserImage () {
            return this.form.user_image ? this.adminImageThumbnailUrl + this.form.user_image : ''
        },
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
    },
    methods: {
        ...mapActions({
            getById: 'storeEmployee/getById',
            updateData: 'storeEmployee/updateData',
            uploadCover: 'storeEmployee/uploadCover',
            uploadUserCover: 'storeEmployee/uploadUserCover',
            logout: 'storeEmployee/logout',
            setDataAuth: 'storeAuth/setData',
        }),
        onChageUsername (value) {
            this.form.user_username = value.replace(/[ ]/g,'_')
        },
        onChangeEmail (data) {
            this.form.user_email = data 
        },
        onChangeTabs (data) {
            this.selectedIndex = data 
        },

        // LIST DATA
        getAllData () {
            this.getData()
        },
        getData () {
            const token = this.$cookies.get('tokenBearer')
            const employee = this.$cookies.get('employee')
            const employee_id = employee.employee_id;
            this.getById({ token, employee_id: employee_id })
                .then((res) => {
                    const data = {
                        ...res.data.data,
                        user: {
                            ...res.data.data.user,
                            main_role_id: res.data.data.role.role_id,
                            role_name: res.data.data.role.role_name 
                        }
                    }
                    this.setDataAuth(data)
                    this.$cookies.set('user', data.user)
                    this.$cookies.set('role', data.role)
                    this.$cookies.set('employee', data.employee)
                })
        },

        // ALERT
        onClickOk () {
            this.visibleAlert = false
        },

        // UPDATE 
        onSaveSubmit () {
            this.visibleConfirmedUpdate = true 
        },
        onClickNoUpdate () {
            this.visibleConfirmedUpdate = false 
        },
        onClickYesUpdate () {
            this.visibleConfirmedUpdate = false 
            const token = this.$cookies.get('tokenBearer')
            this.updateData({
                ...this.form,
                token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.getData()
                    this.$message('Profil berhasil diubah')
                } else {
                    this.$message({
                        message: 'Gagal merubah profil',
                        type: 'error'
                    })
                }
            })
        },

        // LOGOUT
        onLogout () {
            this.visibleConfirmedLogout = true
        },
        onClickNoLogout () {
            this.visibleConfirmedLogout = false
        },
        onClickYesLogout () {
            this.loadingForm = true
            this.visibleConfirmedLogout = false
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

        // IMAGE
        onButtonUpload (value = 'employee') {
            this.visibleUpdateCover = true
            this.coverType = value 
        },
        onCloseCover () {
            this.visibleUpdateCover = false 
        },
        onUpdateCover (data) {
            this.visibleUpdateCover = false 
            const token = this.$cookies.get('tokenBearer')
            if (this.coverType === 'employee') {
                this.uploadCover({
                    ...this.form,
                    image: data,
                    token: token
                }).then((res) => {
                    const status = res.data.status 
                    if (status === 'ok') {
                        this.getData()
                    } else {
                        this.visibleAlert = true 
                        this.titleAlert = 'Gagal upload cover karyawan'
                    }
                })
            } else {
                this.uploadUserCover({
                    ...this.form,
                    image: data,
                    token: token
                }).then((res) => {
                    const status = res.data.status 
                    if (status === 'ok') {
                        this.getData()
                    } else {
                        this.visibleAlert = true 
                        this.titleAlert = 'Gagal upload cover pengguna'
                    }
                })
            }
        },
    }
}
</script>