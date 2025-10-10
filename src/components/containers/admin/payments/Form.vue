<template>
  <AppSideForm
    :title="title"
    :value="openForm"
    :enableSaveButton="!isDetailForm"
    @save="onSave"
    @close="onClose"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4">
        <div class="text-md text-black font-semibold">
          Informasi
        </div>
        <div class="field-group">
          <div class="field-label">Cover</div>
          <AppCardAvatar
            :src="getCover"
            size="medium"
            shape="square"
          />
        </div>
        <div class="field-group">
          <div class="field-label">ID Pembayaran</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.payment_id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.payment_id" class="field-error">
            {{ errorMessage.payment_id && errorMessage.payment_id[0] }}
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
          <div class="field-label">Keterangan</div>
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

      <div class="flex flex-col gap-4">
        <div class="text-md text-black font-semibold">
          Konfigurasi
        </div>
        <div class="field-group">
          <div class="flex justify-between items-center">
            <div class="field-label">Status</div>
            <el-switch
              v-model="form.status"
              :disabled="isDetailForm"
              active-text="Aktif"
              inactive-text="Non-Aktif"
              :active-value="'active'"
              :inactive-value="'inactive'"
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
import AppSideForm from '../../../modules/AppSideForm'
import AppImage from '../../../modules/AppImage'
import AppCardAvatar from '../../../modules/AppCardAvatar'

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
      form: (state) => state.storePayment.form,
      errorMessage: (state) => state.storePayment.errorMessage,
      typeForm: (state) => state.storePayment.typeForm,
    }),
    title() {
      let currentTitle = ''
      switch (this.typeForm) {
        case 'create':
          currentTitle = 'Tambah Pembayaran'
          break
        case 'detail':
          currentTitle = 'Detail Pembayaran'
          break
        case 'edit':
          currentTitle = 'Edit Pembayaran'
          break
      }
      return currentTitle
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
        ? this.paymentImageThumbnailUrl + this.form.image
        : ''
    },
  },
  components: {
    AppSideForm,
    AppImage,
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
  },
}
</script>
