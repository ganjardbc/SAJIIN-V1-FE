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
            v-model="form.platform_id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.platform_id" class="field-error">
            {{ errorMessage.platform_id && errorMessage.platform_id[0] }}
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
          <div class="field-label">Tipe Biaya</div>
          <el-select
            v-model="form.currency_type"
            placeholder="Pilih"
            no-data-text="Data Tidak Ditemukan"
            :disabled="isDetailForm"
            @change="onChangeCurrencyType"
          >
            <el-option
              v-for="item in platformValueType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div v-if="errorMessage.currency_type" class="field-error">
            {{ errorMessage.currency_type && errorMessage.currency_type[0] }}
          </div>
        </div>
        <div v-if="form.currency_type === 'percentage'" class="field-group">
          <div class="field-label">Biaya Persentase</div>
          <div class="field-caption">Masukan biaya platform dalam persen.</div>
          <input-number
            class="width width-100"
            v-model="form.order_fee"
            thousand-separated
            :min="0"
            :max="100"
            placeholder="0"
            :disabled="isDetailForm"
          >
            <template>%</template>
          </input-number>
          <div v-if="errorMessage.order_fee" class="field-error">
            {{ errorMessage.order_fee && errorMessage.order_fee[0] }}
          </div>
        </div>
        <div v-if="form.currency_type === 'nominal'" class="field-group">
          <div class="field-label">Biaya Nominal</div>
          <div class="field-caption">
            Masukan nilai platform dalam nominal uang.
          </div>
          <input-number
            class="width width-100"
            v-model="form.order_fee"
            thousand-separated
            :min="0"
            placeholder="0"
            :disabled="isDetailForm"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.order_fee" class="field-error">
            {{ errorMessage.order_fee && errorMessage.order_fee[0] }}
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
      form: (state) => state.storePlatform.form,
      errorMessage: (state) => state.storePlatform.errorMessage,
      typeForm: (state) => state.storePlatform.typeForm,
      platformValueType: (state) => state.storePlatform.platformValueType,
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
        ? this.platformImageThumbnailUrl + this.form.image
        : ''
    },
    title() {
      let currentTitle = ''
      switch (this.typeForm) {
        case 'create':
          currentTitle = 'Tambah Platform'
          break
        case 'detail':
          currentTitle = 'Detail Platform'
          break
        case 'edit':
          currentTitle = 'Edit Platform'
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
    onChangeCurrencyType() {
      this.form.order_fee = 0
    },
  },
}
</script>
