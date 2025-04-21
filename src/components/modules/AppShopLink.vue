<template>
  <div id="AppShopLink" class="w-full flex flex-col gap-1">
    <div
      v-if="!disableLabel"
      class="text-xs text-black font-semibold"
    >
      Link Toko
    </div>
    <div class="p-2 flex items-center justify-between gap-2 bg-gray-100 border border-gray-200 rounded-lg">
      <a
        id="visitor-shop-link"
        :href="`${link}`"
        target="_blank"
        class="text-xs text-red-500 overflow-hidden truncate" style="width: calc(100% - 120px)"
      >
        {{ `${link}` }}
      </a>
      <div style="width: 100px" class="flex justify-end">
        <el-button
          size="small"
          class="w-full"
          @click="onCopy('visitor-shop-link')"
        >
          Salin Link
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppShopLink',
  props: {
    link: null,
    disableLabel: false,
  },
  methods: {
    onCopy(id) {
      const str = document.getElementById(id).innerHTML
      const el = document.createElement('input')
      el.value = str
      document.body.appendChild(el)
      el.select()

      try {
        var successful = document.execCommand('copy')
        var msg = successful ? 'Success' : 'Failed'
        this.$message(`${msg} copying this link !`)
      } catch (err) {
        this.makeToast('Oops, can not copy this link !')
      }

      document.body.removeChild(el)
    },
  },
}
</script>
