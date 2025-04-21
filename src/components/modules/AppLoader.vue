<template>
  <div
    id="AppLoader"
    class="w-full flex justify-center items-center p-4"
  >
    <div style="width: 25px">
      <i class="text-vermillion-500 fa fa-lw fa-spinner fa-spin" />
    </div>
    <div class="text-xs font-semibld text-black">
      {{ title ? title : 'Mohon Tunggu..' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLoader',
  props: {
    title: {
      type: String,
      required: false,
    },
  },
}
</script>
