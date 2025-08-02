<template>
  <Teleport to="#portal-modal">
    <div class="default-dialog">
      <div
        class="dialog-container"
        :class="`w-${sizeResp} md:w-${size}`"
      >
        <div
          v-if="$slots.header && !disableHeader"
          class="dialog-header"
        >
          <slot name="header" />
        </div>
        <div
          v-if="!$slots.header && !disableHeader"
          class="dialog-header"
        >
          <div class="text-sm font-semibold">
            {{ title }}
          </div>
          <div class="display-flex flex-end align-center">
            <slot name="toolbar" />
            <el-button
              class="border-none"
              circle
              @click="onClose"
            >
              <i class="fa fa-lg fa-times"></i>
            </el-button>
          </div>
        </div>

        <div class="dialog-content">
          <slot />
        </div>

        <div
          v-if="$slots.footer"
          class="dialog-footer"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import Teleport from 'vue2-teleport';

export default {
  name: 'AppCardPopup',
  components: {
    Teleport,
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Form',
    },
    height: {
      type: String,
      required: false,
      default: 'auto',
    },
    size: {
      type: String,
      default: 'sm', // default size 
    },
    sizeResp: {
      type: String,
      default: 'full', // default size for md and up
    },
    disableHeader: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    },
  },
}
</script>
