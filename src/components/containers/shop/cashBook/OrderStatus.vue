<template>
  <div id="OrderStatus">
    <div v-if="data" class="display-flex space-between align-center">
      <div class="fonts fonts-10 normal black">Status Pesanan</div>
      <div class="display-flex flex-start align-center">
        <div
          v-if="!data.order_total"
          class="display-flex flex-start align-center"
        >
          <span class="fonts fonts-10 semibold black">Tidak Ada Pesanan</span>
          <i
            class="fonts fonts-11 orange fa fa-1x fa-times-circle margin margin-left-5px"
          ></i>
        </div>
        <div v-else class="display-flex flex-start align-center">
          <span class="fonts fonts-10 semibold black">
            {{ data.order_done }}/{{ data.order_total }}
            {{ data.order_total === data.order_done ? 'Selesai' : 'Diproses' }}
          </span>
          <i
            v-if="data.order_total === data.order_done"
            class="fonts fonts-11 green fa fa-1x fa-check-circle margin margin-left-5px"
          ></i>
          <i
            v-else
            class="fonts fonts-11 orange fa fa-1x fa-check-circle margin margin-left-5px"
          ></i>
        </div>
        <button
          v-if="enableButton"
          class="btn btn-small-icon btn-sekunder btn-circle margin margin-left-10px"
          @click="onClick"
        >
          <i class="fa fa-lw fa-list-ul"></i>
        </button>
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
