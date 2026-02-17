<template>
  <div
    id="AppEmpty"
    class="flex flex-col gap-4 justify-center items-center py-8"
  >
    <div
      class="flex items-center justify-center bg-vermillion-100 rounded-full"
      style="width: 118px; height: 118px"
    >
      <i :class="`text-4xl text-vermillion-500 ${icon ? icon : 'fa fa-3x fa-info-circle'}`"></i>
    </div>
    <div class="text-md text-black font-semibold text-center">
      {{ title ? title : 'DATA TIDAK DITEMUKAN' }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppEmpty',
  props: {
    icon: null,
    title: null,
  },
}
</script>
