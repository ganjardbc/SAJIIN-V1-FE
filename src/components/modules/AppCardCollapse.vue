<template>
  <div id="App" class="p-2 rounded-lg bg-gray-100">
    <div
      class="flex justify-between items-center gap-2"
      style="cursor: pointer"
      @click="openCollapse"
    >
      <slot
        v-if="$slots.title"
        name="title"
      />
      <div v-else class="text-sm text-black font-semibold">
        {{ title ? title : 'Collapse' }}
      </div>
      <el-button size="small" circle>
        <i
          :class="`icn fa fa-lw ${visibleCollapse ? 'fa-chevron-up' : 'fa-chevron-down'}`"
        ></i>
      </el-button>
    </div>
    <div v-if="visibleCollapse">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'App',
  props: {
    title: null,
    customTitle: false,
  },
  data() {
    return {
      visibleCollapse: false,
    }
  },
  methods: {
    openCollapse() {
      this.visibleCollapse = !this.visibleCollapse
    },
  },
}
</script>
