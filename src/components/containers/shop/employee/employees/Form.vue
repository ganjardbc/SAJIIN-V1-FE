<template>
    <div id="App">
        <AppSideForm 
            :title="title" 
            :enableSaveButton="!isDetailForm"
            :onSave="onSave"
            :onClose="onClose">
            <AppTabs 
                :selectedIndex.sync="selectedIndex" 
                :data="tabs" 
                :isFull="true"
                :onChange="(data) => onChangeTabs(data)"
                class="margin margin-bottom-20px" />
            <div v-if="selectedIndex === 0">
                <div class="margin margin-bottom-0">
                    <div class="fonts fonts-13 black semibold">Informasi</div>
                    <div class="field-group">
                        <div class="field-label">Cover</div>
                        <div class="width width-80px">
                            <div class="image image-padding border border-full">
                                <img 
                                    v-if="form.image" 
                                    :src="getCover" 
                                    alt="" 
                                    class="post-center">
                                <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                            </div>
                        </div>
                    </div>
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
                            :disabled="isDetailForm"></el-input>
                        <div 
                            v-if="errorMessage.name" 
                            class="field-error">
                            {{ errorMessage.name && errorMessage.name[0] }}
                        </div>
                    </div>
                    <div class="field-group">
                        <div class="field-label">Email</div>
                        <div class="field-caption">Tambahkan email baru atau ganti email sekarang.</div>
                        <div v-if="form.email_old" class="field-caption">Email sekarang adalah "{{ form.email_old }}".</div>
                        <el-input 
                            placeholder=""
                            type="text"
                            v-model="form.email"
                            :disabled="isDetailForm"
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
                            :disabled="isDetailForm"></el-input>
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
                            :disabled="isDetailForm"
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
                            :disabled="isDetailForm"
                            :autosize="{ minRows: 2, maxRows: 2}"></el-input>
                        <div 
                            v-if="errorMessage.about" 
                            class="field-error">
                            {{ errorMessage.about && errorMessage.about[0] }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="selectedIndex === 1">
                <div class="margin margin-bottom-20px">
                    <div class="fonts fonts-13 black semibold">Posisi</div>
                    <div class="field-group">
                        <div class="field-label">Pilih Role & Posisi</div>
                        <el-select 
                            v-model="form.role_id" 
                            placeholder="Pilih"
                            no-data-text="Data Tidak Ditemukan"
                            :disabled="isDetailForm"
                            @change="onChangePosition"
                            clearable>
                            <el-option
                                v-for="(item, i) in roleData"
                                :key="i"
                                :label="item.description"
                                :value="item.id"
                                style="text-transform: capitalize;">
                            </el-option>
                        </el-select>
                        <div 
                            v-if="errorMessage.role_id" 
                            class="field-error">
                            {{ errorMessage.role_id && errorMessage.role_id[0] }}
                        </div>
                    </div>
                </div>
                <div class="margin margin-bottom-0">
                    <div class="fonts fonts-13 black semibold">Shift</div>
                    <div v-if="isRoleOwner" class="field-group">
                        <div class="field-label">Pilih Toko</div>
                        <el-select 
                            v-model="form.shop_id" 
                            placeholder="Pilih"
                            no-data-text="Data Tidak Ditemukan"
                            :disabled="isDetailForm"
                            @change="onChangeShop"
                            clearable>
                            <el-option
                                v-for="(item, i) in shopData"
                                :key="i"
                                :label="item.shop.name"
                                :value="item.shop.id">
                            </el-option>
                        </el-select>
                        <div 
                            v-if="errorMessage.shop_id" 
                            class="field-error">
                            {{ errorMessage.shop_id && errorMessage.shop_id[0] }}
                        </div>
                    </div>
                    <div class="field-group">
                        <div class="field-label">Pilih Shift</div>
                        <el-select 
                            v-model="form.shift_id" 
                            placeholder="Pilih"
                            no-data-text="Data Tidak Ditemukan"
                            :disabled="isDetailForm"
                            clearable>
                            <el-option
                                v-for="(item, i) in shiftData"
                                :key="i"
                                :label="`${item.title} (${item.start_time} - ${item.end_time})`"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <div 
                            v-if="errorMessage.shift_id" 
                            class="field-error">
                            {{ errorMessage.shift_id && errorMessage.shift_id[0] }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="selectedIndex === 2">
                <div class="margin margin-bottom-0">
                    <div class="fonts fonts-13 black semibold">Pengguna</div>
                    <div class="field-group">
                        <div class="field-label">Cover</div>
                        <div class="width width-80px">
                            <div class="image image-padding image-circle border border-full">
                                <img 
                                    v-if="form.user_image" 
                                    :src="getUserCover" 
                                    alt="" 
                                    class="post-center">
                                <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                            </div>
                        </div>
                    </div>
                    <div class="field-group">
                        <div class="field-label">Username</div>
                        <div class="field-caption">Tambahkan username baru atau ganti username sekarang.</div>
                        <div v-if="form.username_old" class="field-caption">Username sekarang adalah "{{ form.username_old }}".</div>
                        <el-input 
                            placeholder=""
                            type="text"
                            v-model="form.username"
                            :disabled="isDetailForm"
                            @input="onChangeUsername"></el-input>
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
                            :disabled="isDetailForm"
                            show-password></el-input>
                        <div 
                            v-if="errorMessage.password" 
                            class="field-error">
                            {{ errorMessage.password && errorMessage.password[0] }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="selectedIndex === 3">
                <div class="margin margin-bottom-0">
                    <div class="fonts fonts-13 black semibold">Konfigurasi</div>
                    <div class="field-group">
                        <div class="display-flex space-between">
                            <div class="field-label">Status</div>
                            <el-switch 
                                v-model="form.status"
                                :disabled="isDetailForm"
                                :active-value="'active'"
                                :inactive-value="'inactive'"
                                active-text="Aktif"
                                inactive-text="Non-Aktif"></el-switch>
                        </div>
                        <div 
                            v-if="errorMessage.status" 
                            class="field-error">
                            {{ errorMessage.status && errorMessage.status[0] }}
                        </div>
                    </div>
                </div>
            </div>
        </AppSideForm>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppSideForm from '../../../../modules/AppSideForm'
import AppImage from '../../../../modules/AppImage'
import AppTabs from '../../../../modules/AppTabs'

const tabs = [
    {id: 1, label: 'Karyawan', status: 'active'},
    {id: 2, label: 'Posisi', status: ''},
    {id: 3, label: 'Pengguna', status: ''},
    {id: 4, label: 'Konfigurasi', status: ''},
]

export default {
    name: 'App',
    data () {
        return {
            selectedIndex: 0,
            tabs: tabs,
        }
    },
    mounted () {
        this.selectedIndex = 0
    },
    computed: {
        ...mapState({
            form: (state) => state.storeEmployee.form,
            errorMessage: (state) => state.storeEmployee.errorMessage,
            typeForm: (state) => state.storeEmployee.typeForm,
            positionData: (state) => state.storeEmployee.position.data,
            shiftData: (state) => state.storeEmployee.shift.data,
            roleData: (state) => state.storeEmployee.role.data,
            shopData: (state) => state.storeEmployee.shop.data,
        }),
        title () {
            let currentTitle = ''
            switch (this.typeForm) {
                case 'create':
                    currentTitle = 'Tambah Karyawan'
                    break
                case 'detail':
                    currentTitle = 'Detail Karyawan'
                    break
                case 'edit':
                    currentTitle = 'Edit Karyawan'
                    break
            }
            return currentTitle
        },
        isDetailForm () {
            let status = false 
            if (this.typeForm === 'detail') {
                status = true 
            }
            return status
        },
        isCreateForm () {
            let status = false 
            if (this.typeForm === 'create') {
                status = true 
            }
            return status
        },
        isRoleOwner () {
            let status = false 
            const user = this.$cookies.get('user')
            if (user.role_name === 'owner') {
                status = true
            }
            return status
        },
        getCover () {
            return this.form.image ? this.employeeImageThumbnailUrl + this.form.image : ''
        },
        getUserCover () {
            return this.form.user_image ? this.adminImageThumbnailUrl + this.form.user_image : ''
        }
    },
    components: {
        AppSideForm,
        AppImage,
        AppTabs,
    },
    methods: {
        ...mapActions({
            getDataShift: 'storeEmployee/getDataShift',
        }),
        onChangeUsername (value) {
            this.form.username = value.replace(/[ ]/g,'_')
        },
        onChangeEmail (data) {
            this.form.user_email = data 
        },
        onChangePosition (data) {
            const position = this.positionData.find((item) => item.id === data)
            if (position) {
                const role = this.roleData.find((item) => item.role_name.toLowerCase() === position.title.toLowerCase())
                this.form.user_role_id = role.id 
            } else {
                this.form.user_role_id = ''
            }
        },
        onChangeShop (value) {
            this.form.shift_id = ''
            this.form.shop_id = value
            const token = this.$cookies.get('tokenBearer')
            const shop_id = value
            this.getDataShift({ token, shop_id: shop_id })
        },
        onChangeTabs (data) {
            this.selectedIndex = data
        },
        uploadImage (data) {
            this.$emit('uploadImage', data)
        },
        removeImage (data) {
            this.$emit('removeImage', data)
        },
        onSave () {
            this.$emit('onSave')
        },
        onClose () {
            this.$emit('onClose')
        },
    },
}
</script>