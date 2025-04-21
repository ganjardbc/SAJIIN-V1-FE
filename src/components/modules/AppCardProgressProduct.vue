<template>
  <div id="App">
    <div v-if="data" class="flex items-center gap-1">
      <span class="text-sm text-black font-semibold">
        {{ calculateAllDone(data) }} / {{ calculateAll(data) }}
      </span>
      <span
        v-if="calculateAllDone(data) === 0"
        class="text-sm text-black font-semibold"
        >Todo</span
      >
      <span v-else class="text-sm text-black font-semibold">
        {{
          calculateAllDone(data) === calculateAll(data)
            ? 'Selesai'
            : 'Diproses'
        }}
      </span>
      <i
        v-if="isStatusDone(data)"
        class="text-lg text-green-500 fa fa-check-circle"
      ></i>
      <i
        v-else-if="isStatusOnProgress(data)"
        class="text-lg text-orange-500 fa fa-check-circle"
      ></i>
      <i
        v-else-if="isStatusEmpty(data)"
        class="text-lg text-gray-500 fa fa-check-circle"
      ></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppCardProgressProduct',
  props: {
    data: null,
  },
  methods: {
    calculateAllDone(data) {
      let status = 0
      data &&
        data.map((item) => {
          if (item.status === 'on-progress' || item.status === 'done') {
            status += item.quantity
          }
        })
      return status
    },
    calculateDone(data) {
      let status = 0
      data &&
        data.map((item) => {
          if (item.status === 'done') {
            status += item.quantity
          }
        })
      return status
    },
    calculateOnProgress(data) {
      let status = 0
      data &&
        data.map((item) => {
          if (item.status === 'on-progress') {
            status += item.quantity
          }
        })
      return status
    },
    calculateAll(data) {
      let status = 0
      data &&
        data.map((item) => {
          status += item.quantity
        })
      return status
    },
    isStatusDone(data) {
      return this.calculateDone(data) === this.calculateAll(data)
    },
    isStatusOnProgress(data) {
      return this.calculateAllDone(data) > 0
    },
    isStatusEmpty(data) {
      return this.calculateOnProgress(data) === 0
    },
  },
}
</script>
