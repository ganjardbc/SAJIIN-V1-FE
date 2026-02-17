<template>
  <AppSideForm
    :value="openForm"
    :title="title"
    :enableSaveButton="!isDetailForm"
    @save="onSave"
    @close="onClose"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="text-md text-black font-semibold">Informasi</div>
        <div class="field-group">
          <div class="field-label">Cover</div>
          <AppCardAvatar
            :src="getCover"
          />
        </div>
        <div class="field-group">
          <div class="field-label">ID Meja</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.table_id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.table_id" class="field-error">
            {{ errorMessage.table_id && errorMessage.table_id[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Nama</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.name"
            :disabled="isDetailForm"
          ></el-input>
          <div v-if="errorMessage.name" class="field-error">
            {{ errorMessage.name && errorMessage.name[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Kode (optional)</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.code"
            :disabled="isDetailForm"
          ></el-input>
          <div v-if="errorMessage.code" class="field-error">
            {{ errorMessage.code && errorMessage.code[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Keterangan (optional)</div>
          <el-input
            placeholder=""
            type="textarea"
            v-model="form.description"
            :disabled="isDetailForm"
            :autosize="{ minRows: 2, maxRows: 2 }"
          ></el-input>
          <div v-if="errorMessage.description" class="field-error">
            {{ errorMessage.description && errorMessage.description[0] }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="text-md text-black font-semibold">Konfigurasi</div>
        <div class="field-group">
          <div class="flex items-center justify-between gap-2">
            <div class="field-label">Status</div>
            <el-switch
              v-model="form.status"
              :disabled="isDetailForm"
              :active-value="'active'"
              :inactive-value="'inactive'"
              active-text="Aktif"
              inactive-text="Non-Aktif"
            ></el-switch>
          </div>
          <div v-if="errorMessage.status" class="field-error">
            {{ errorMessage.status && errorMessage.status[0] }}
          </div>
        </div>
      </div>
    </div>
  </AppSideForm>
</template>

<script>
import { mapState } from 'vuex'
import AppCardAvatar from '../../../modules/AppCardAvatar'
import AppSideForm from '../../../modules/AppSideForm'
import AppImage from '../../../modules/AppImage'

export default {
  name: 'App',
  data() {
    return {}
  },
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    ...mapState({
      form: (state) => state.storeTable.form,
      errorMessage: (state) => state.storeTable.errorMessage,
      dayLists: (state) => state.storeTable.dayLists,
      typeForm: (state) => state.storeTable.typeForm,
    }),
    isDetailForm() {
      let status = false
      if (this.typeForm === 'detail') {
        status = true
      }
      return status
    },
    getCover() {
      return this.form.image
        ? this.tableImageThumbnailUrl + this.form.image
        : ''
    },
    title() {
      let currentTitle = ''
      switch (this.typeForm) {
        case 'create':
          currentTitle = 'Tambah Meja'
          break
        case 'detail':
          currentTitle = 'Detail Meja'
          break
        case 'edit':
          currentTitle = 'Edit Meja'
          break
      }
      return currentTitle
    },
  },
  components: {
    AppCardAvatar,
    AppSideForm,
    AppImage,
  },
  methods: {
    uploadImage(data) {
      this.$emit('uploadImage', data)
    },
    removeImage(data) {
      this.$emit('removeImage', data)
    },
    onSave() {
      this.$emit('save')
    },
    onClose() {
      this.$emit('close')
    },
  },
}
</script>
