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
          <div class="field-label">ID Paltform</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.discount_id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.discount_id" class="field-error">
            {{ errorMessage.discount_id && errorMessage.discount_id[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Nama Diskon</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.discount_name"
            :disabled="isDetailForm"
          ></el-input>
          <div v-if="errorMessage.discount_name" class="field-error">
            {{ errorMessage.discount_name && errorMessage.discount_name[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Tipe Diskon</div>
          <el-select
            v-model="form.discount_type"
            placeholder="Pilih"
            no-data-text="Data Tidak Ditemukan"
            :disabled="isDetailForm"
          >
            <el-option
              v-for="item in discountType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div v-if="errorMessage.discount_type" class="field-error">
            {{ errorMessage.discount_type && errorMessage.discount_type[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Tipe Nilai</div>
          <el-select
            v-model="form.discount_value_type"
            placeholder="Pilih"
            no-data-text="Data Tidak Ditemukan"
            :disabled="isDetailForm"
          >
            <el-option
              v-for="item in discountValueType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div v-if="errorMessage.discount_value_type" class="field-error">
            {{
              errorMessage.discount_value_type &&
              errorMessage.discount_value_type[0]
            }}
          </div>
        </div>
        <div
          v-if="form.discount_value_type === 'percentage'"
          class="field-group"
        >
          <div class="field-label">Persentase</div>
          <div class="field-caption">Masukan nilai diskon dalam persen.</div>
          <input-number
            class="width width-100"
            v-model="form.discount_value"
            thousand-separated
            :min="0"
            :max="100"
            placeholder="0"
            :disabled="isDetailForm"
          >
            <template>%</template>
          </input-number>
          <div v-if="errorMessage.discount_value" class="field-error">
            {{ errorMessage.discount_value && errorMessage.discount_value[0] }}
          </div>
        </div>
        <div v-if="form.discount_value_type === 'nominal'" class="field-group">
          <div class="field-label">Nominal</div>
          <div class="field-caption">
            Masukan nilai diskon dalam nominal uang.
          </div>
          <input-number
            class="width width-100"
            v-model="form.discount_value"
            thousand-separated
            :min="0"
            placeholder="0"
            :disabled="isDetailForm"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.discount_value" class="field-error">
            {{ errorMessage.discount_value && errorMessage.discount_value[0] }}
          </div>
        </div>
        <div class="field-group">
          <div class="field-label">Keterangan (opsional)</div>
          <el-input
            placeholder=""
            type="textarea"
            v-model="form.discount_description"
            :disabled="isDetailForm"
            :autosize="{ minRows: 2, maxRows: 2 }"
          ></el-input>
          <div v-if="errorMessage.discount_description" class="field-error">
            {{
              errorMessage.discount_description &&
              errorMessage.discount_description[0]
            }}
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
import InputNumber from '../../../modules/InputNumber'

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
      form: (state) => state.storeDiscount.form,
      errorMessage: (state) => state.storeDiscount.errorMessage,
      typeForm: (state) => state.storeDiscount.typeForm,
      discountType: (state) => state.storeDiscount.discountType,
      discountValueType: (state) => state.storeDiscount.discountValueType,
    }),
    isDetailForm() {
      let status = false
      if (this.typeForm === 'detail') {
        status = true
      }
      return status
    },
    getCover() {
      return this.form.discount_image
        ? this.discountImageThumbnailUrl + this.form.discount_image
        : ''
    },
    title() {
      let currentTitle = ''
      switch (this.typeForm) {
        case 'create':
          currentTitle = 'Tambah Diskon'
          break
        case 'detail':
          currentTitle = 'Detail Diskon'
          break
        case 'edit':
          currentTitle = 'Edit Diskon'
          break
      }
      return currentTitle
    },
  },
  components: {
    AppCardAvatar,
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
      this.$emit('save')
    },
    onClose() {
      this.$emit('close')
    },
  },
}
</script>
