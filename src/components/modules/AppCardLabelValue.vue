<template>
  <div id="App" class="display-flex align-center space-between">
    <div class="fonts fonts-9 grey overflow-ellipsis">{{ label }}</div>
    <div class="fonts fonts-9 grey overflow-ellipsis">{{ value }}</div>
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
