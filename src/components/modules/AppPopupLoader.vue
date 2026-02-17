<template>
  <AppCardPopup
    size="xxs"
    disable-header
  >
    <div class="flex flex-col justify-center items-center gap-4 py-4">
      <div
        class="flex justify-center items-center rounded-full bg-vermillion-100"
        style="width: 96px; height: 96px;"
      >
        <i class="text-4xl text-vermillion-500 fa fa-4x fa-spin fa-spinner" />
      </div>

      <div class="text-lg text-black font-semibold text-center">
        {{ title ? title : 'Mohon Tunggu...' }}
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
  },
}
</script>
