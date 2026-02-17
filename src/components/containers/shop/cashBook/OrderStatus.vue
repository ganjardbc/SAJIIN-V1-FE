<template>
  <div id="OrderStatus" class="w-full">
    <div v-if="data" class="flex justify-between items-center">
      <div class="text-xs tet-black">Status Pesanan</div>
      <div class="flex items-center gap-2">
        <div
          v-if="!data.order_total"
          class="flex items-center gap-2"
        >
          <span class="text-xs tet-black">Tidak Ada Pesanan</span>
          <i class="text-md text-red-500 fa fa-times-circle" />
        </div>
        <div v-else class="flex items-center gap-2">
          <span class="text-xs text-black font-semibold">
            {{ data.order_done }}/{{ data.order_total }}
            {{ data.order_total === data.order_done ? 'Selesai' : 'Diproses' }}
          </span>
          <i
            v-if="data.order_total === data.order_done"
            class="text-md text-green-500 fa fa-check-circle"
          ></i>
          <i
            v-else
            class="text-md text-orange-500 fa fa-check-circle"
          ></i>
        </div>
        <el-button
          v-if="enableButton"
          size="small"
          circle
          @click="onClick"
        >
          <i class="fa fa-lw fa-list-ul"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrderStatus',
  props: {
    data: null,
    enableButton: false,
  },
  methods: {
    onClick() {
      this.$emit('onClick')
    },
  },
}
</script>
