<template>
  <div id="App">
    <AppSideForm
      :title="title"
      :enableSaveButton="isCanSave"
      :onSave="onSave"
      :onClose="onClose"
    >
      <div class="margin margin-bottom-20px">
        <div class="fonts fonts-13 black semibold">Informasi</div>
        <div class="field-group">
          <div class="field-label">ID Buku Kas</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.cashbook_id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.cashbook_id" class="field-error">
            {{ errorMessage.cashbook_id && errorMessage.cashbook_id[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Tanggal Buka</div>
          <el-date-picker
            placeholder="Pilih tanggal"
            type="date"
            format="dd MMMM yyyy"
            v-model="form.cash_date"
            :disabled="isCreateForm"
            :picker-options="pickerOptions"
            style="width: 100% !important"
          ></el-date-picker>
          <div v-if="errorMessage.cash_date" class="field-error">
            {{ errorMessage.cash_date && errorMessage.cash_date[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Modal</div>
          <input-number
            class="width width-100"
            v-model="form.cash_modal"
            thousand-separated
            :min="0"
            placeholder="0"
            :disabled="isDetailForm"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.cash_modal" class="field-error">
            {{ errorMessage.cash_modal && errorMessage.cash_modal[0] }}
          </div>
        </div>
        <div v-if="isCreateForm" class="field-group">
          <div class="field-label">Kas Masuk</div>
          <input-number
            class="width width-100"
            v-model="form.cash_in"
            thousand-separated
            :min="0"
            placeholder="0"
            :disabled="true"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.cash_in" class="field-error">
            {{ errorMessage.cash_in && errorMessage.cash_in[0] }}
          </div>
        </div>
        <div v-if="isCreateForm" class="field-group">
          <div class="field-label">Kas Keluar</div>
          <input-number
            class="width width-100"
            v-model="form.cash_out"
            thousand-separated
            :min="0"
            placeholder="0"
            :disabled="true"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.cash_out" class="field-error">
            {{ errorMessage.cash_out && errorMessage.cash_out[0] }}
          </div>
        </div>
        <div v-if="isCreateForm" class="field-group">
          <div class="field-label">Kas Summary</div>
          <input-number
            class="width width-100"
            v-model="form.cash_summary"
            thousand-separated
            :min="0"
            placeholder="0"
            :disabled="true"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.cash_summary" class="field-error">
            {{ errorMessage.cash_summary && errorMessage.cash_summary[0] }}
          </div>
        </div>
      </div>

      <div v-if="isCreateForm" class="margin margin-bottom-20px">
        <div class="fonts fonts-13 black semibold">Penutupan</div>
        <div class="field-group">
          <div class="field-label">Status</div>
          <div class="display-flex space-between">
            <div class="fonts micro black">Ubah kas status</div>
            <el-switch
              v-model="form.cash_status"
              active-color="#38c172"
              active-text="Buka"
              inactive-text="Tutup"
              :active-value="'open'"
              :inactive-value="'closed'"
              :disabled="isDetailForm"
            ></el-switch>
          </div>
          <div v-if="errorMessage.cash_status" class="field-error">
            {{ errorMessage.cash_status && errorMessage.cash_status[0] }}
          </div>
        </div>
        <div v-if="form.cash_status === 'closed'" class="field-group">
          <div class="field-label">Kas Aktual</div>
          <input-number
            class="width width-100"
            v-model="form.cash_actual"
            thousand-separated
            :min="0"
            placeholder="0"
            :disabled="isDetailForm"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.cash_actual" class="field-error">
            {{ errorMessage.cash_actual && errorMessage.cash_actual[0] }}
          </div>
        </div>
        <el-alert
          v-if="form.cash_summary > form.cash_actual"
          title="Kas Aktual Tidak Sama dengan Kas Summary !"
          description="Sepertinya Kas Summary dan kas aktual tidak sama, mohon cek kembali kas yang ada."
          type="error"
          :closable="false"
          show-icon
        >
        </el-alert>
      </div>

      <div class="margin margin-bottom-0px">
        <div class="fonts fonts-13 black semibold">Konfigurasi</div>
        <div class="field-group">
          <div class="display-flex space-between">
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
    </AppSideForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppSideForm from '../../../modules/AppSideForm'
import AppImage from '../../../modules/AppImage'
import InputNumber from '../../../modules/InputNumber'

export default {
  name: 'App',
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  mounted() {},
  computed: {
    ...mapState({
      form: (state) => state.storeCashBook.form,
      errorMessage: (state) => state.storeCashBook.errorMessage,
      typeForm: (state) => state.storeCashBook.typeForm,
    }),
    title() {
      let currentTitle = ''
      switch (this.typeForm) {
        case 'create':
          currentTitle = 'Create Cash Book'
          break
        case 'detail':
          currentTitle = 'Detail Cash Book'
          break
        case 'edit':
          currentTitle = 'Edit Cash Book'
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
    isCreateForm() {
      let status = true
      if (this.typeForm === 'create') {
        status = false
      }
      return status
    },
    isEditForm() {
      let status = true
      if (this.typeForm === 'edit') {
        status = false
      }
      return status
    },
    isCanSave() {
      let status = false
      if (!this.isDetailForm) {
        status = true
      }
      return status
    },
  },
  components: {
    AppSideForm,
    AppImage,
    InputNumber,
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
