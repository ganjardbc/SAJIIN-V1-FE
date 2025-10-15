<template>
  <div id="App" class="w-full flex gap-2 items-center justify-between">
    <div class="text-xs text-black truncate">{{ label }}</div>
    <div class="text-xs text-black text-right font-semibold truncate">{{ value }}</div>
  </div>
</template>
<script>
export default {
  name: 'App',
  props: {
    label: null,
    value: null,
  },
}
</script>
