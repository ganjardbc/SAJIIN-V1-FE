<template>
  <div id="AppHeaderMobile" class="main-breadcrumb display-flex align-center">
    <button class="btn btn-icon btn-white" @click="goBack">
      <i class="fa fa-lg fa-arrow-left"></i>
    </button>
    <div class="fonts fonts-11 semibold black margin margin-left-10px">
      {{ title ? title : 'Kembali' }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppHeaderMobile',
  props: {
    title: '',
  },
  methods: {
    goBack() {
      this.$router.back()
    },
  },
}
</script>
