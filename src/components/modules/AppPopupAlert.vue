<template>
  <AppCardPopup
    title="Peringatan"
    size="xxs"
    disable-header
    @onClose="onClickNo"
  >
    <div class="flex flex-col gap-4 justify-center items-center">
      <div class="flex flex-col gap-4 justify-center items-center">
        <div
          class="flex justify-center items-center rounded-full bg-vermillion-100"
          style="width: 96px; height: 96px;"
        >
          <i
            :class="`text-4xl text-vermillion-500 ${icon ? icon : 'far fa-4x fa-check-circle'}`"
          ></i>
        </div>

        <div
          class="text-lg text-black font-semibold text-center"
        >
          {{ title }}
        </div>

        <div class="w-full flex justify-between items-center">
          <el-button class="w-full" @click="onClickOk">
            Ok, Saya Mengerti
          </el-button>
        </div>
      </div>
    </div>
  </AppCardPopup>
</template>
<script>
import AppCardPopup from './AppCardPopup'

export default {
  name: 'App',
  components: {
    AppCardPopup,
  },
  props: {
    title: null,
    icon: null,
  },
  methods: {
    onClickOk() {
      this.$emit('onClickOk')
    },
  },
}
</script>
