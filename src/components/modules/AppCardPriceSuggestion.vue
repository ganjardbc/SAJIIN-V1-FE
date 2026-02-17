<template>
  <div id="App" class="w-full flex flex-wrap gap-2">
    <el-tag
      v-for="(dt, i) in data"
      :key="i"
      size="small"
      class="cursor-pointer"
      @click="onChange(dt.value)"
    >
      {{ format(dt.value) }}
    </el-tag>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      data: [
        { value: 10000 },
        { value: 20000 },
        { value: 50000 },
        { value: 100000 },
        { value: 150000 },
      ],
    }
  },
  methods: {
    onChange(data) {
      this.$emit('onChange', data)
    },
  },
}
</script>
