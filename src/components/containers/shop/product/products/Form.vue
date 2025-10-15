<template>
  <AppSideForm
    :value="openForm"
    :title="title"
    :enableSaveButton="isButtonApplyEnable"
    @save="onSave"
    @close="onClose"
  >
    <div class="flex flex-col gap-4">
      <el-alert
        v-if="errorMessage.details && errorMessage.details[0]"
        title="Masukan Varian"
        description="Kamu harus menambahkan setidaknya satu varian."
        type="error"
        :closable="false"
        show-icon
      >
      </el-alert>

      <AppTabs
        :selectedIndex.sync="selectedIndex"
        :data="tabs"
        :isFull="true"
        :onChange="(data) => onChangeTabs(data)"
      />
      <FormData v-if="selectedIndex === 0" />
      <ProductVarian v-if="selectedIndex === 1" />
    </div>
  </AppSideForm>
</template>

<script>
import { mapState } from 'vuex'
import AppSideForm from '../../../../modules/AppSideForm'
import AppEmpty from '../../../../modules/AppEmpty'
import AppImage from '../../../../modules/AppImage'
import AppTabs from '../../../../modules/AppTabs'
import FormData from './FormData'
import ProductVarian from './productVarian/Index'

const tabs = [
  { id: 1, label: 'Data', status: 'active' },
  { id: 2, label: 'Varian', status: '' },
]

export default {
  name: 'App',
  data() {
    return {
      selectedIndex: 1,
      tabs: tabs,
    }
  },
  props: {
    openForm: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  mounted() {
    this.selectedIndex = 0
  },
  watch: {
    formId() {
      this.selectedIndex = 0
    },
  },
  computed: {
    ...mapState({
      form: (state) => state.storeProduct.form,
      errorMessage: (state) => state.storeProduct.errorMessage,
      typeForm: (state) => state.storeProduct.typeForm,
      category: (state) => state.storeCategory.data,
    }),
    formId: {
      get() {
        return this.$store.state.storeProduct.form.id
      },
      set(value) {
        this.$store.state.storeProduct.form.id = value
      },
    },
    title() {
      let currentTitle = ''
      switch (this.typeForm) {
        case 'create':
          currentTitle = 'Tambah Produk'
          break
        case 'detail':
          currentTitle = 'Detail Produk'
          break
        case 'edit':
          currentTitle = 'Edit Produk'
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
      let status = false
      if (this.typeForm === 'create') {
        status = true
      }
      return status
    },
    isButtonApplyEnable() {
      let status = false
      if (!this.isDetailForm) {
        if (this.form.category_id && this.form.name && this.form.description) {
          status = true
        }
      }

      return status
    },
    getCover() {
      return this.form.image
        ? this.productImageThumbnailUrl + this.form.image
        : ''
    },
  },
  components: {
    AppEmpty,
    AppSideForm,
    AppImage,
    AppTabs,
    ProductVarian,
    FormData,
  },
  methods: {
    onChangeTabs(data) {
      this.selectedIndex = data
    },
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
