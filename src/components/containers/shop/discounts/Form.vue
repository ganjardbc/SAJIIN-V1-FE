<template>
  <div id="App">
    <AppSideForm
      :title="title"
      :enableSaveButton="!isDetailForm"
      :onSave="onSave"
      :onClose="onClose"
    >
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
                class="post-center"
              />
              <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
            </div>
          </div>
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

      <div class="margin margin-bottom-0px">
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
              inactive-text="Non-Aktif"
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
    return {}
  },
  mounted() {},
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
      return this.form.image
        ? this.discountImageThumbnailUrl + this.form.image
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
