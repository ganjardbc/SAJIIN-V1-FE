<template>
    <div id="App">
        <AppButtonCapsuleSlider
            v-loading="loading"
            :index.sync="selectedIndex"
            customAllLabel="Semua Produk" 
            customIcon="fa fa-lw fa-box"
            :enableCreateButton="isRoleOwner"
            :enableEditButton="isRoleOwner"
            :data="filteredCateogry"
            @onChange="onChange"
            @onCreate="onCreate"
            @onEdit="onEdit" />
        
        <Form 
            v-if="formClass"
            @uploadImage="uploadImage"
            @removeImage="removeImage"
            @onSave="onOpenVisibleConfirmed"
            @onDelete="onDelete"
            @onClose="onClose">
        </Form>

        <AppFileUpload 
            v-if="visibleUpdateCover"
            @onClose="onCloseCover"
            @onUpload="onUpdateCover"
        />

        <AppPopupConfirmed 
            v-if="visibleConfirmed"
            :title="titleConfirmed"
            @onClickNo="onClickNo"
            @onClickYes="onClickYes"
        />

        <AppPopupConfirmed 
            v-if="visibleConfirmedDelete"
            :title="'Hapus kategori ?'"
            @onClickNo="onClickNoDelete"
            @onClickYes="onClickYesDelete"
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
import AppEmpty from '../../../../modules/AppEmpty'
import AppPopupLoader from '../../../../modules/AppPopupLoader'
import AppPopupConfirmed from '../../../../modules/AppPopupConfirmed'
import AppPopupAlert from '../../../../modules/AppPopupAlert'
import AppFileUpload from '../../../../modules/AppFileUpload'
import AppButtonCapsuleSlider from '../../../../modules/AppButtonCapsuleSlider'
import AppTabs from '../../../../modules/AppTabs'
import SearchField from '../../../../modules/SearchField'
import Form from './FormPopup'
import Card from './Card'

const tabs = [
    {id: 1, label: 'Aktif', status: 'active'},
    {id: 2, label: 'Non-Aktif', status: ''},
]

export default {
    name: 'App',
    data () {
        return {
            tabs: tabs,
            formClass: false,
            visibleUpdateCover: false,
            visibleAlert: false,
            titleAlert: 'Gagal memproses data',
            iconAlert: 'fa fa-4x fa-info-circle',
            visibleConfirmed: false,
            visibleConfirmedDelete: false,
            titleConfirmed: 'Simpan data ?',
            currentPage: 0,
        }
    },
    mounted () {
        this.handleFilterSearch()
    },
    components: {
        AppTabs,
        AppEmpty,
        AppPopupLoader,
        AppPopupConfirmed,
        AppPopupAlert,
        AppFileUpload,
        AppButtonCapsuleSlider,
        SearchField,
        Form,
        Card,
    },
    computed: {
        ...mapState({
            filter: (state) => state.storeCategory.filter,
            form: (state) => state.storeCategory.form,
            data: (state) => state.storeCategory.data,
            totalRecord: (state) => state.storeCategory.totalRecord,
            limit: (state) => state.storeCategory.limit,
            loading: (state) => state.storeCategory.loading,
            loadingForm: (state) => state.storeCategory.loadingForm,
            typeForm: (state) => state.storeCategory.typeForm,
            filterProduct: (state) => state.storeProduct.filter,
        }),
        typeForm: {
            get () {
                return this.$store.state.storeCategory.typeForm
            },
            set (value) {
                this.$store.state.storeCategory.typeForm = value
            }
        },
        selectedIndex: {
            get () {
                return this.$store.state.storeCategory.selectedIndex
            },
            set (value) {
                this.$store.state.storeCategory.selectedIndex = value
            }
        },
        shopId () {
            return this.$store.state.storeSelectedShop.selectedData
        },
        paramShopId () {
            return this.$route.params.shopId
        },
        isRoleOwner () {
            let status = false 
            const user = this.$cookies.get('user')
            if (user.role_name === 'owner') {
                status = true
            }
            return status
        },
        filteredCateogry () {
            const allData = this.data.map((item) => {
                return {
                    id: item.id,
                    label: item.name,
                    image: item.image ? this.categoryImageThumbnailUrl + item.image : '',
                    status: item.status,
                    icon: 'fa fa-lw fa-box',
                }
            })
            const activeData = allData.filter((item) => item.status === 'active')
            const inactiveData = allData.filter((item) => item.status === 'inactive')
            let data = [...activeData, ...inactiveData]
            return data 
        }
    },
    watch: {
        shopId (prevProps, nextProps) {
            if (prevProps !== nextProps) {
                this.getData()
            }
        }
    },
    methods: {
        ...mapActions({
            getCategory: 'storeCategory/getData',
            setPagination: 'storeCategory/setPagination',
            resetFormData: 'storeCategory/resetFormData',
            resetFilter: 'storeCategory/resetFilter',
            setFormData: 'storeCategory/setFormData',
            createData: 'storeCategory/createData',
            updateData: 'storeCategory/updateData',
            deleteData: 'storeCategory/deleteData',
            uploadCover: 'storeCategory/uploadCover',
        }),
        onChange (data) {
            if (data === 'all') {
                this.filterProduct.category = ''
            } else {
                this.filterProduct.category = data 
            }
            if (data !== this.selectedIndex) {
                this.selectedIndex = data
            }
            this.$emit('onChange', data)
        },
        onSearch (data) {
            this.filter.search = data 
            this.resetFilter()
            this.getData()
        },
        onClose () {
            this.formClass = false
        },
        onRefresh () {
            this.getData()
        },

        // LIST DATA
        getData () {
            const token = this.$cookies.get('tokenBearer')
            const shop_id = this.shopId
            if (shop_id) {
                this.filter.status = ''
                this.getCategory({ token, shop_id })
            }
        },
        handleCurrentChange (value) {
            this.setPagination(value)
            this.getData()
        },
        handleFilterSearch () {
            this.currentPage = 1
            this.handleCurrentChange(1)
        },

        // ALERT
        onClickOk () {
            this.visibleAlert = false
        },

        // CONFIRMED
        onClickNo () {
            this.visibleConfirmed = false 
        },
        onClickYes () {
            this.visibleConfirmed = false 
            const token = this.$cookies.get('tokenBearer')
            switch (this.typeForm) {
                case 'create':
                    this.createData({
                        ...this.form,
                        token: token
                    }).then((res) => {
                        const status = res.data.status 
                        if (status === 'ok') {
                            this.formClass = false 
                            this.getData()
                        } else {
                            this.$message({
                                message: 'Gagal menyimpan kategori',
                                type: 'error'
                            })
                        }
                    })
                    break
                case 'edit':
                    this.updateData({
                        ...this.form,
                        token: token
                    }).then((res) => {
                        const status = res.data.status 
                        if (status === 'ok') {
                            this.formClass = false 
                            this.getData()
                        } else {
                            this.$message({
                                message: 'Gagal merubah kategori',
                                type: 'error'
                            })
                        }
                    })
                    break
            }
        },

        // SAVE
        onOpenVisibleConfirmed () {
            this.visibleConfirmed = true
            switch (this.typeForm) {
                case 'create':
                    this.titleConfirmed = 'Simpan data ?'
                    break
                case 'edit':
                    this.titleConfirmed = 'Simpan perubahan ?'
                    break
            }
        },

        // CREATE
        onCreate () {
            this.formClass = true
            this.typeForm = 'create'
            this.resetFormData()
            this.form.shop_id = this.shopId
        },

        // DETAIL
        onDetail (data) {
            this.formClass = true
            this.typeForm = 'detail'
            this.resetFormData()
            this.setFormData(data)
        },

        // EDIT
        onEdit (data) {
            const find = this.data.find((item) => item.id === data.id)
            if (find !== undefined) {
                this.formClass = true
                this.typeForm = 'edit'
                this.resetFormData()
                this.setFormData(find)
            }
        },

        // DELETE
        onDelete (data) {
            this.visibleConfirmedDelete = true 
            this.setFormData(data)
        },
        onClickNoDelete () {
            this.visibleConfirmedDelete = false 
        },
        onClickYesDelete () {
            this.visibleConfirmedDelete = false 
            const token = this.$cookies.get('tokenBearer')
            this.deleteData({
                ...this.form,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.formClass = false 
                    this.getData()
                } else {
                    this.formClass = false 
                    this.visibleAlert = true 
                    this.titleAlert = 'Gagal menghapus kategori'
                }
            })
        },

        // IMAGE
        uploadImage (data) {
            this.visibleUpdateCover = true
            this.setFormData(data)
        },
        removeImage () {
            console.log('removeImage')
        },
        onCloseCover () {
            this.visibleUpdateCover = false 
        },
        onUpdateCover (data) {
            this.visibleUpdateCover = false 
            const token = this.$cookies.get('tokenBearer')
            this.uploadCover({
                ...this.form,
                image: data,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.formClass = false 
                    this.getData()
                } else {
                    this.formClass = false 
                    this.visibleAlert = true 
                    this.titleAlert = 'Gagal upload cover'
                }
            })
        },

        // STATUS
        onChangeStatus (data) {
            this.setFormData(data)
            const token = this.$cookies.get('tokenBearer')
            this.updateData({
                ...this.form,
                token: token
            }).then((res) => {
                const status = res.data.status 
                if (status === 'ok') {
                    this.$message(`Berhasil merubah status kategori ${data.name}.`)
                } else {
                    this.$message({
                        message: `Gagal merubah status kategori ${data.name}.`,
                        type: 'error'
                    })
                }
            })
        },
    }
}
</script>