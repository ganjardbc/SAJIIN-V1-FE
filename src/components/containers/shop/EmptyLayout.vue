<template>
  <div class="default-layout w-full h-full">
    <div class="header">
      <div class="w-full lg:w-sm mx-auto flex items-center justify-start gap-4">
        <el-button
          size="large"
          circle
          class="border-none"
          @click="onClickBack"
        >
          <i class="fa fa-lg fa-arrow-left" />
        </el-button>
        <div class="text-2xl text-black font-semibold">
          {{ metaTitle }}
        </div>
      </div>
    </div>

    <div
      class="w-full overflow-y-auto"
      style="height: calc(100vh - 60px)"
    >
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    metaTitle() {
      return this.$route.meta.title || 'Kembali';
    },
  },
  methods: {
    onClickBack() {
      this.$router.back();
    },
  },
};
</script>
