<template>
  <div id="App">
    <AppSideForm
      :title="title"
      :enableSaveButton="isButtonApplyEnable"
      :onSave="onSave"
      :onClose="onClose"
    >
      <div
        class="margin margin-bottom-20px padding padding-bottom-20px border-bottom"
      >
        <div class="fonts fonts-13 black semibold">Informasi</div>
        <div class="field-group">
          <div class="field-label">ID Varian</div>
          <el-input
            placeholder=""
            type="text"
            v-model="form.proddetail_id"
            :disabled="true"
          ></el-input>
          <div v-if="errorMessage.proddetail_id" class="field-error">
            {{ errorMessage.proddetail_id && errorMessage.proddetail_id[0] }}
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
        <div class="field-group">
          <div class="field-label">Harga</div>
          <input-number
            class="width width-100"
            v-model="form.price"
            thousand-separated
            :min="0"
            placeholder="0"
            :disabled="isDetailForm"
          >
            <template>Rp</template>
          </input-number>
          <div v-if="errorMessage.price" class="field-error">
            {{ errorMessage.price && errorMessage.price[0] }}
          </div>
        </div>
      </div>

      <!-- <div class="margin margin-bottom-20px padding padding-bottom-20px border-bottom">
                <div class="fonts fonts-13 black semibold">Discount</div>
                <div class="field-group">
                    <div class="field-label">Active</div>
                    <div class="display-flex space-between">
                        <div class="fonts micro black">Active discount for this varian ?</div>
                        <el-switch 
                            v-model="form.is_discount"
                            :disabled="isDetailForm"
                            :active-value="1"
                            :inactive-value="0"></el-switch>
                    </div>
                    <div 
                        v-if="errorMessage.is_discount" 
                        class="field-error">
                        {{ errorMessage.is_discount && errorMessage.is_discount[0] }}
                    </div>
                </div>
                <div class="field-group">
                    <div class="field-label">Discount</div>
                    <div class="field-caption">Field discount in precent ({{ form.value_discount ? form.value_discount : '0' }}%)</div>
                    <el-input-number
                        placeholder=""
                        :min="0"
                        v-model="form.value_discount"
                        :disabled="!form.is_discount || isDetailForm"
                        style="width: 100%;"></el-input-number>
                    <div 
                        v-if="errorMessage.value_discount" 
                        class="field-error">
                        {{ errorMessage.value_discount && errorMessage.value_discount[0] }}
                    </div>
                </div>
            </div> -->

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
import AppSideForm from '../../../../../modules/AppSideForm'
import AppImage from '../../../../../modules/AppImage'
import InputNumber from '../../../../../modules/InputNumber'

export default {
  name: 'App',
  data() {
    return {}
  },
  mounted() {},
  computed: {
    ...mapState({
      form: (state) => state.storeProduct.formDetail,
      errorMessage: (state) => state.storeProduct.errorMessageDetail,
      typeFormDetail: (state) => state.storeProduct.typeFormDetail,
    }),
    isButtonApplyEnable() {
      let status = false
      if (!this.isDetailForm) {
        if (this.form.name && this.form.price && this.form.description) {
          status = true
        }
      }

      return status
    },
    title() {
      let currentTitle = ''
      switch (this.typeFormDetail) {
        case 'create':
          currentTitle = 'Tambah Varian'
          break
        case 'detail':
          currentTitle = 'Detail Varian'
          break
        case 'edit':
          currentTitle = 'Edit Varian'
          break
      }
      return currentTitle
    },
    isDetailForm() {
      let status = false
      if (this.typeFormDetail === 'detail') {
        status = true
      }
      return status
    },
    getCover() {
      return this.form.image ? this.shopImageThumbnailUrl + this.form.image : ''
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
