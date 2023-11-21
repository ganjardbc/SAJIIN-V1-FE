<template>
    <div id="App">
        <AppCardPopup 
            :title="title" 
            height="250px"
            @onClose="onClose">
            <div 
                v-if="isEditForm"
                slot="toolbar" 
                class="margin margin-right-10px">
                <button 
                    class="btn btn-sekunder btn-full" 
                    @click="onDelete(form)">
                    Hapus
                </button>
            </div>
            <div class="margin margin-bottom-20px">
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
                            <button 
                                v-if="isEditForm"
                                class="btn btn-sekunder btn-small-icon btn-circle" 
                                style="position: absolute; bottom: 5px; right: 5px;" 
                                @click="uploadImage(form)">
                                <i class="post-middle-absolute fonts fonts-11 grey fa fa-lg fa-camera" />
                            </button>
                        </div>
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">ID Kategori</div>
                    <el-input 
                        placeholder=""
                        type="text"
                        v-model="form.category_id"
                        :disabled="true"></el-input>
                    <div 
                        v-if="errorMessage.category_id" 
                        class="field-error">
                        {{ errorMessage.category_id && errorMessage.category_id[0] }}
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
            </div>
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
            <div slot="footer" class="padding padding-15px">
                <button 
                    class="btn btn-main btn-full"
                    :disabled="isDetailForm"
                    @click="onSave">
                    Simpan Data
                </button>
            </div>
        </AppCardPopup>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AppCardPopup from '../../../../modules/AppCardPopup'
import AppImage from '../../../../modules/AppImage'

export default {
    name: 'App',
    data () {
        return {}
    },
    mounted () {},
    computed: {
        ...mapState({
            form: (state) => state.storeCategory.form,
            errorMessage: (state) => state.storeCategory.errorMessage,
            typeForm: (state) => state.storeCategory.typeForm,
        }),
        title () {
            let currentTitle = ''
            switch (this.typeForm) {
                case 'create':
                    currentTitle = 'Tambah Kategori'
                    break
                case 'detail':
                    currentTitle = 'Detail Kategori'
                    break
                case 'edit':
                    currentTitle = 'Edit Kategori'
                    break
            }
            return currentTitle
        },
        isEditForm () {
            let status = false 
            if (this.typeForm === 'edit') {
                status = true 
            }
            return status
        },
        isDetailForm () {
            let status = false 
            if (this.typeForm === 'detail') {
                status = true 
            }
            return status
        },
        getCover () {
            return this.form.image ? this.categoryImageThumbnailUrl + this.form.image : ''
        }
    },
    components: {
        AppCardPopup,
        AppImage,
    },
    methods: {
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
        onDelete (data) {
            this.$emit('onDelete', data)
        },
    },
}
</script>