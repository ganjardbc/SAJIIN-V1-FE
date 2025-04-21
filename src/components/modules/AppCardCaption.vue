<template>
  <div class="w-full flex-1 flex gap-2">
    <div
      class="flex items-center justify-center"
      style="width: 18px; height: 18px"
    >
      <i
        class="text-md"
        :class="`${iconColor ? iconColor : 'text-gray-700'} ${icon}`"
      />
    </div>
    <div class="flex-1">
      <div class="text-xs text-gray-700">{{ caption }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  props: {
    icon: null,
    iconColor: null,
    caption: null,
  },
}
</script>
