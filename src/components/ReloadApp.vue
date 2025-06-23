<template>
  <div id="App" class="card-toast show">
    <div class="card-toast-content m-4">
      <div class="w-full flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div style="width: 50px">
            <i class="fa fa-2x fa-bell text-vermillion-500" />
          </div>
          <div class="flex-1 flex flex-col gap-1">
            <div class="text-md text-black font-semibold">
              New update is available
            </div>
            <div class="text-xs text-gray-500">
              Click "Update Now" to reload the app
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <el-button
            class="w-full"
            @click="closeReload"
          >
            Later
          </el-button>
          <el-button
            class="w-full"
            type="primary"
            @click="reloadApplication"
          >
            Update Now
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    closeReload() {
      this.$emit('closeReload')
    },
    reloadApplication() {
      this.$emit('reloadApplication')
    },
  },
}
</script>

