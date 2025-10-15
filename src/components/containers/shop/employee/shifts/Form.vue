<template>
  <AppSideForm
    :value="openForm"
    :title="title"
    :enableSaveButton="!isDetailForm"
    @save="onSave"
    @close="onClose"
  >
    <template v-if="isEditForm" #toolbar>
      <el-button size="small" @click="onDelete(form)">
        Hapus
      </el-button>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="text-md text-black font-semibold">Informasi</div>
        <div class="field-group">
          <div class="field-label">ID Shift</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.shift_id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.shift_id" class="field-error">
            {{ errorMessage.shift_id && errorMessage.shift_id[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Judul</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.title"
            :disabled="isDetailForm"
          ></el-input>
          <div v-if="errorMessage.title" class="field-error">
            {{ errorMessage.title && errorMessage.title[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Jam Mulai</div>
          <el-input
            placeholder=""
            type="time"
            v-model="form.start_time"
            :disabled="isDetailForm"
          ></el-input>
          <div v-if="errorMessage.start_time" class="field-error">
            {{ errorMessage.start_time && errorMessage.start_time[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Jam Berakhir</div>
          <el-input
            placeholder=""
            type="time"
            v-model="form.end_time"
            :disabled="isDetailForm"
          ></el-input>
          <div v-if="errorMessage.end_time" class="field-error">
            {{ errorMessage.end_time && errorMessage.end_time[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Keterangan (Optional)</div>
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
import AppSideForm from '../../../../modules/AppSideForm'
import AppImage from '../../../../modules/AppImage'

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
      form: (state) => state.storeShift.form,
      errorMessage: (state) => state.storeShift.errorMessage,
      typeForm: (state) => state.storeShift.typeForm,
    }),
    title() {
      let currentTitle = ''
      switch (this.typeForm) {
        case 'create':
          currentTitle = 'Tambah Shift'
          break
        case 'detail':
          currentTitle = 'Detail Shift'
          break
        case 'edit':
          currentTitle = 'Edit Shift'
          break
      }
      return currentTitle
    },
    isEditForm() {
      let status = false
      if (this.typeForm === 'edit') {
        status = true
      }
      return status
    },
    isDetailForm() {
      let status = false
      if (this.typeForm === 'detail') {
        status = true
      }
      return status
    },
    getCover() {
      return this.form.image
        ? this.ShiftImageThumbnailUrl + this.form.image
        : ''
    },
  },
  components: {
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
    onDelete(data) {
      this.$emit('delete', data)
    },
  },
}
</script>
