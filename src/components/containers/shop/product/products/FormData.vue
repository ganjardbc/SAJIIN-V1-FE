<template>
  <div id="App" class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div class="text-md text-black font-semibold">Informasi</div>
      <div class="field-group">
        <div class="field-label">Cover</div>
        <AppCardAvatar
          :src="getCover"
        />
      </div>
      <div class="field-group">
        <div class="field-label">ID Produk</div>
        <el-input
          placeholder=""
          type="text"
          v-model="form.product_id"
          :disabled="true"
        ></el-input>
        <div v-if="errorMessage.product_id" class="field-error">
          {{ errorMessage.product_id && errorMessage.product_id[0] }}
        </div>
      </div>
      <div class="field-group">
        <div class="field-label">Kategori</div>
        <el-select
          v-model="form.category_id"
          placeholder="Pilih"
          no-data-text="Data Tidak Ditemukan"
          :disabled="isDetailForm"
        >
          <el-option
            v-for="item in filteredCategory"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <div v-if="errorMessage.category_id" class="field-error">
          {{ errorMessage.category_id && errorMessage.category_id[0] }}
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
</template>

<script>
import { mapState } from 'vuex'
import InputNumber from '../../../../modules/InputNumber'
import AppCardAvatar from '../../../../modules/AppCardAvatar'

export default {
  name: 'App',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      form: (state) => state.storeProduct.form,
      errorMessage: (state) => state.storeProduct.errorMessage,
      typeForm: (state) => state.storeProduct.typeForm,
      category: (state) => state.storeCategory.data,
    }),
    isDetailForm() {
      let status = false
      if (this.typeForm === 'detail') {
        status = true
      }
      return status
    },
    isCreateForm() {
      let status = false
      if (this.typeForm === 'create') {
        status = true
      }
      return status
    },
    getCover() {
      return this.form.image
        ? this.productImageThumbnailUrl + this.form.image
        : ''
    },
    filteredCategory() {
      return (
        this.category &&
        this.category.filter((item) => item.status === 'active')
      )
    },
  },
  components: {
    AppCardAvatar,
    InputNumber,
  },
  props: {},
  methods: {},
}
</script>
