<template>
  <Teleport to="#portal-slider">
    <section>
      <div
        v-if="isFormOpen"
        class="fixed top-0 right-0 w-screen h-screen transition-all duration-300 fade-in-out"
        :class="{
          'opacity-0 pointer-events-none': !isFormOpen,
          'opacity-100 pointer-events-auto': isFormOpen,        
        }"
        :style="{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99,
        }"
      />

      <div
        class="fixed top-0 right-0 w-full md:w-xs h-screen md:p-4 z-10 transition-all duration-300 ease-in-out"
        :style="{
          right: isFormOpen ? '0' : '-100%',
          transform: isZoomed ? 'scale(1.2)' : 'scale(1)',
          zIndex: 99,
        }"
      >
        <div class="bg-white md:rounded-lg md:shadow-xl flex flex-col h-full w-full overflow-y-auto">
          <div class="sticky top-0 bg-white z-10 px-4 py-2 flex justify-between items-center border-b border-gray-200">
            <div class="flex-1">
              <div class="text-md text-black font-semibold">
                {{ title }}
              </div>
              <div v-if="subtitle" class="text-xs text-gray-500">
                {{ subtitle }}
              </div>
            </div>
            <div class="flex-1 flex justify-end items-center">
              <slot name="toolbar" />
              <el-button
                title="Close"
                size="medium"
                circle
                class="border-none"
                @click="onClose"
              >
                <i class="fa fa-lg fa-times" />
              </el-button>
            </div>
          </div>

          <div class="w-full p-4">
            <slot />
          </div>

          <div class="sticky bottom-0 bg-white z-5 p-4 border-t border-gray-200">
            <div v-if="isThereCustomFooter">
              <slot name="footer" />
            </div>
            <el-button
              v-else
              title="Save"
              type="primary"
              class="w-full"
              :disabled="!enableSaveButton"
              @click="onSave"
            >
              Simpan Data
            </el-button>
          </div>
        </div>
      </div>
    </section>
  </Teleport>
</template>

<script>
import Teleport from 'vue2-teleport';

export default {
  name: 'AppSideForm',
  components: {
    Teleport,
  },
  data() {
    return {
      isZoomed: false,
    }
  },
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    enableSaveButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    enableCustomFooter: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    isFormOpen() {
      return this.value
    },
    isThereCustomFooter() {
      return this.$slots.footer
    },
  },
  methods: {
    onZoom() {
      this.isZoomed = !this.isZoomed
    },
    onClose() {
      this.$emit('close', false)
    },
    onSave() {
      this.$emit('save')
    },
  },
}
</script>
