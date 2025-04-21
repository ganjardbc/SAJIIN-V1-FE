<template>
  <el-tag :size="size" :type="type ? type : getColor" class="rounded-md">
    {{ label ? label : getLabel }}
  </el-tag>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      defaultLabel: '',
    }
  },
  props: {
    data: null,
    label: null,
    type: {
      type: String,
    },
    size: {
      type: String,
      default: 'small',
    },
  },
  computed: {
    getColor() {
      let color = 'default'
      switch (this.data) {
        case 'unconfirmed':
          color = 'info'
          break
        case 'confirmed':
          color = 'warning'
          break
        case 'cooking':
          color = 'warning'
          break
        case 'delivered':
          color = 'warning'
          break
        case 'on-progress':
          color = 'warning'
          break
        case 'todo':
          color = 'info'
          break
        case 'to-do':
          color = 'info'
          break
        case 'new-order':
          color = 'info'
          break
        case 'wip':
          color = 'warning'
          break
        case 'ready':
          color = 'warning'
          break
        case 'done':
          color = 'success'
          break
        case 'canceled':
          color = 'danger'
          break
        case 'active':
          color = 'success'
          break
        case 'inactive':
          color = 'danger'
          break
        case 'paid':
          color = 'success'
          break
        case 'unpaid':
          color = 'info'
          break
        case 'open':
          color = 'success'
          break
        case 'closed':
          color = 'danger'
          break
      }
      return color
    },
    getLabel() {
      let label = '-'
      switch (this.data) {
        case 'unconfirmed':
          label = 'Belum Dikonfirmasi'
          break
        case 'confirmed':
          label = 'Dikonfirmasi'
          break
        case 'cooking':
          label = 'Memasak'
          break
        case 'delivered':
          label = 'Diterima'
          break
        case 'on-progress':
          label = 'Disiapkan'
          break
        case 'ready':
          label = 'Diantarkan'
          break
        case 'todo':
          label = 'Todo'
          break
        case 'to-do':
          label = 'Todo'
          break
        case 'new-order':
          label = 'Baru'
          break
        case 'wip':
          label = 'WIP'
          break
        case 'done':
          label = 'Selesai'
          break
        case 'canceled':
          label = 'Dibatalkan'
          break
        case 'active':
          label = 'Aktif'
          break
        case 'inactive':
          label = 'Non-Aktif'
          break
        case 'paid':
          label = 'Dibayar'
          break
        case 'unpaid':
          label = 'Belum Bayar'
          break
        case 'open':
          label = 'Buka'
          break
        case 'closed':
          label = 'Tutup'
          break
      }
      return label
    },
  },
}
</script>
