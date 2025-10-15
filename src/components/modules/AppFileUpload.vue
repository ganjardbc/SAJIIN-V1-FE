<template>
  <AppCardPopup
    title="Upload File"
    size="xs"
    @onClose="onClose"
  >
    <div class="flex flex-col gap-4">
      <input
        type="file"
        placeholder=""
        name="image"
        id="image"
        ref="file"
        accept="image/*"
        style="display: none"
        :disabled="visibleLoader"
        @change="previewFiles"
      />
      <label for="image">
        <div
          class="border-2 border-dashed border-gray-500 hover:border-vermillion-500 bg-white hover:bg-vermillion-100 flex justify-center items-center cursor-pointer rounded-lg w-full h-56"
        >
          <img 
            v-if="urlImage"
            :src="urlImage"
            class="w-full h-full object-cover rounded-lg"
            :style="{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }"
          />
          <div
            v-if="!urlImage"
            class="flex flex-col gap-4 justify-center items-center w-full h-full"
            :style="{
              width: '100%',
              height: '100%',
            }"
          >
            <i class="fa fa-3x fa-image text-gray-700"></i>

            <div class="text-gray-700 text-sm mt-2">
              Pilih Gambar atau File yang Akan Diunggah.
            </div>
          </div>
        </div>
      </label>
    </div>

    <template #footer>
      <el-button
        class="w-full"
        type="primary"
        :disabled="!visibleUploadButton"
        @click="onUploadImage"
      >
        Upload File
      </el-button>
    </template>
  </AppCardPopup>
</template>
<script>
import AppCardPopup from './AppCardPopup'

export default {
  name: 'App',
  data() {
    return {
      visibleLoader: false,
      visibleLoaderAction: false,
      urlImage: '',
      formImage: '',
      visibleUploadButton: false,
    }
  },
  components: {
    AppCardPopup,
  },
  props: {
    isEnable: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    previewFiles(event) {
      const file = event.target.files[0]
      this.urlImage = URL.createObjectURL(file)
      this.formImage = file
      this.visibleUploadButton = true
    },
    onUploadImage() {
      this.$emit('onUpload', this.formImage)
    },
    onClose() {
      this.$emit('onClose')
    },
  },
}
</script>
