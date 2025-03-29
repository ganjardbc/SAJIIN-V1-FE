<template>
  <div id="App" class="width width-500px width-center width-mobile display-grid grid-item-3 grid-item-mobile-small-2">
    <router-link
      v-if="filteredData.length >= 2"
      v-for="(dt, i) in filteredData"
      :key="i"
      :to="{ name: dt.link }"
      class="margin margin-top-15px margin-bottom-15px display-flex center"
    >
      <div class="card bg-white width width-80px">
        <div
          class="image image-60px image-center image-circle bg-main box-shadow"
        >
          <i
            :class="`post-middle-absolute fonts fonts-20 white ${dt.icon}`"
          ></i>
        </div>
        <div
          class="fonts align-center fonts-11 semibold black margin margin-top-15px"
        >
          {{ dt.title }}
        </div>
      </div>
    </router-link>
  </div>
</template>
<script>
export default {
  props: {
    data: null,
  },
  computed: {
    permissions() {
      return this.$cookies.get('permissions')
    },
    filteredData() {
      return this.data.filter((item) => {
        if (item.permission) {
          const stt = this.onCheckPermission(item.permission)
          if (!stt) {
            return false
          }
        }
        return true
      })
    },
  },
  methods: {
    onCheckPermission(value) {
      let stt = false
      let data = []
      try {
        data = JSON.parse(this.permissions)
      } catch (error) {
        data = this.permissions
      }
      if (data && data.length > 0) {
        const isTherePermission = data.find(
          (item) => item.permission_name === value
        )
        if (isTherePermission) {
          stt = true
        }
      }
      return stt
    },
  },
}
</script>
