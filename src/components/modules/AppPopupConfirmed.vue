<template>
  <AppCardPopup
    title="Konfirmasi"
    size="xxs"
    disable-header
    @onClose="onClickNo"
  >
    <div class="flex flex-col gap-4 justify-center items-center">
      <div
        class="flex justify-center items-center rounded-full bg-vermillion-100"
        style="width: 96px; height: 96px;"
      >
        <i class="text-4xl text-vermillion-500 far fa-4x fa-question-circle" />
      </div>

      <div
        class="text-lg text-black font-semibold text-center"
      >
        {{ title }}
      </div>

      <div class="w-full flex justify-between items-center">
        <el-button
          class="w-full"
          type="info"
          plain
          @click="onClickNo"
        >
          Tutup
        </el-button>
        <el-button
          class="w-full"
          type="primary"
          @click="onClickYes"
        >
          Iya, Lanjutkan
        </el-button>
      </div>
    </div>
  </AppCardPopup>
</template>
<script>
import AppCardPopup from './AppCardPopup'

export default {
  name: 'App',
  data() {
    return {
      dialogVisible: true,
    }
  },
  components: {
    AppCardPopup,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClickNo() {
      this.$emit('onClickNo')
    },
    onClickYes() {
      this.$emit('onClickYes')
    },
  },
}
</script>
