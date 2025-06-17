<template>
  <AppCardPopup
    :title="title"
    size="xs"
    @onClose="onClose"
  >
    <template v-if="isEditForm" #toolbar>
      <el-button size="small" @click="onDelete(form)">
        Hapus
      </el-button>
    </template>

    <div class="flex flex-col gap-4 w-full">
      <div class="flex flex-col gap-2 w-full">
        <div class="text-md text-black font-semibold">Informasi</div>
        <div class="field-group">
          <div class="field-label">Cover</div>
          <AppCardAvatar
            :src="getCover"
            :is-upload="isEditForm"
            @upload="uploadImage(form)"
          />
        </div>
        <div class="field-group">
          <div class="field-label">ID Kategori</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.expense_type_id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.expense_type_id" class="field-error">
            {{
              errorMessage.expense_type_id && errorMessage.expense_type_id[0]
            }}
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
          <div class="field-label">Keterangan (opsional)</div>
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

      <div class="flex flex-col gap-2 w-full">
        <div class="text-md text-black font-semibold">Konfigurasi</div>
        <div class="field-group">
          <div class="flex justify-between items-center">
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
    
    <template #footer>
      <el-button
        class="w-full"
        type="primary"
        :disabled="isDetailForm"
        @click="onSave"
      >
        Simpan Data
      </el-button>
    </template>
  </AppCardPopup>
</template>

<script>
import { mapState } from 'vuex'
import AppCardPopup from '../../../../modules/AppCardPopup'
import AppCardAvatar from '../../../../modules/AppCardAvatar'

export default {
  name: 'App',
  data() {
    return {}
  },
  mounted() {},
  computed: {
    ...mapState({
      form: (state) => state.storeExpenseType.form,
      errorMessage: (state) => state.storeExpenseType.errorMessage,
      dayLists: (state) => state.storeExpenseType.dayLists,
      typeForm: (state) => state.storeExpenseType.typeForm,
    }),
    isDetailForm() {
      let status = false
      if (this.typeForm === 'detail') {
        status = true
      }
      return status
    },
    isEditForm() {
      let status = false
      if (this.typeForm === 'edit') {
        status = true
      }
      return status
    },
    getCover() {
      return this.form.image
        ? this.expenseTypeImageThumbnailUrl + this.form.image
        : ''
    },
    title() {
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
  },
  components: {
    AppCardPopup,
    AppCardAvatar,
  },
  methods: {
    uploadImage(data) {
      this.$emit('uploadImage', data)
    },
    removeImage(data) {
      this.$emit('removeImage', data)
    },
    onSave() {
      this.$emit('onSave')
    },
    onClose() {
      this.$emit('onClose')
    },
    onDelete(data) {
      this.$emit('onDelete', data)
    },
  },
}
</script>
