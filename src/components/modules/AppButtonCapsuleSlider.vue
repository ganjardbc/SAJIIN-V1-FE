<template>
  <div
    id="AppButtonCapsuleSlider"
    class="w-full flex items-center"
  >
    <div class="flex-1 flex whitespace-no-wrap" style="height: 42px; overflow-x: auto">
      <div
        v-if="!disableAll"
        class="relative inline-flex mr-2"
      >
        <div
          class="py-1 pl-1 pr-3 bg-white rounded-full border border-gray-200 flex items-center gap-2 cursor-pointer"
          :class="{
            'bg-vermillion-100': selectedIndex === 'all',
            'border-vermillion-500': selectedIndex === 'all',
          }"
          @click="onSelected('all', 'active')"
        >
          <div
            class="flex items-center justify-center bg-vermillion-100 rounded-full"
            :class="{
              'bg-vermillion-200': selectedIndex === 'all'
            }"
            style="width: 32px; height: 32px"
          >
            <i :class="`text-md text-vermillion-500 ${customIcon ? customIcon : 'fa fa-lw fa-check'}`"></i>
          </div>
          <div class="text-sm text-black font-semibold">
            {{ customAllLabel ? customAllLabel : 'Semua' }}
          </div>
        </div>
      </div>
      <div
        v-for="(dt, i) in filteredData"
        :key="i"
        class="relative inline-flex mr-2"
      >
        <div
          class="p-1 bg-white rounded-full border border-gray-200 flex items-center gap-2 cursor-pointer"
          :class="{
            'bg-vermillion-100': selectedIndex === (returnIndex ? i : dt.id),
            'border-vermillion-500': selectedIndex === (returnIndex ? i : dt.id),
            'bg-gray-100': dt.status == 'inactive',
            'cursor-not-allowed': dt.status == 'inactive',
            'pr-8': enableEditButton,
            'pr-3': !enableEditButton,
          }"
          @click="onSelected(returnIndex ? i : dt.id, dt.status)"
        >
          <div
            class="flex items-center justify-center rounded-full"
            :class="{
              'bg-vermillion-200': selectedIndex === (returnIndex ? i : dt.id),
              'bg-vermillion-100': dt.status == 'active',
              'bg-gray-200': dt.status == 'inactive',
            }"
            style="width: 32px; height: 32px"
          >
            <el-avatar
              v-if="dt.image"
              size="small"
              :src="dt.image"
            />
            <i
              v-else
              class="text-md"
              :class="[
                `${dt.icon ? dt.icon : 'fa fa-lw fa-check'}`,
                {
                  'text-vermillion-500': dt.status == 'active',
                  'text-gray-500': dt.status == 'inactive',
                }
              ]"
            />
          </div>

          <div
            class="text-sm font-semibold"
            :class="{
              'text-black': dt.status == 'active',
              'text-gray-500': dt.status == 'inactive',
            }"
          >
            {{ dt.label }}
          </div>

          <AppCardCapsule
            v-if="dt.value"
            :label="dt.value"
            size="small"
          />
        </div>

        <el-button
          v-if="enableEditButton"
          class="absolute"
          style="top: 5px; right: -4px; width: 32px; height: 32px"
          size="small"
          circle
          @click="onEdit(dt)"
        >
          <i class="text-xs fa fa-lw fa-edit"></i>
        </el-button>
      </div>
    </div>

    <el-button
      v-if="enableCreateButton"
      circle
      style="width: 40px; height: 40px"
      @click="onCreate"
    >
      <i class="text-gray-700 fa fa-lw fa-plus"></i>
    </el-button>
  </div>
</template>
<script>
import AppCardCapsule from './AppCardCapsule'

export default {
  name: 'AppButtonCapsuleSlider',
  components: {
    AppCardCapsule,
  },
  data() {
    return {
      selectedIndex: this.index || this.index === 0 ? this.index : 'all',
    }
  },
  mounted() {
    this.selectedIndex = this.index || this.index === 0 ? this.index : 'all'
  },
  props: {
    index: null,
    data: null,
    disableAll: false,
    returnIndex: false,
    customAllLabel: '',
    customIcon: '',
    enableCreateButton: false,
    enableEditButton: false,
  },
  watch: {
    index: function (props) {
      this.selectedIndex = props
    },
  },
  computed: {
    filteredData() {
      return (
        this.data &&
        this.data.map((item) => {
          return {
            ...item,
            status: item.status ? item.status : 'active',
          }
        })
      )
    },
  },
  methods: {
    onSelected(id, status) {
      if (status === 'active') {
        if (id === 'all') {
          this.$emit('onChange', 'all')
        } else {
          this.$emit('onChange', id)
        }
      }
    },
    onEdit(data) {
      this.$emit('onEdit', data)
    },
    onCreate() {
      this.$emit('onCreate')
    },
  },
}
</script>
