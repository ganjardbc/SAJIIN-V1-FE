<template>
  <div
    class="px-2 py-1 flex justify-center items-center rounded-md"
    :class="background"
  >
    <div
      class="text-xs font-semibold"
      :class="color"
    >
      {{ label }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      default: '',
      required: true,
    },
    background: {
      default: 'bg-white',
      required: true,
    },
    color: {
      default: 'black',
      required: true,
    },
  },
}
</script>
