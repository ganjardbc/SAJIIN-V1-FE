<template>
  <div
    class="flex flex-col justify-center items-center shadow-lg bg-white"
    :class="{
      'rounded-full': shape === 'circle',
      'rounded-lg': shape === 'square',
    }"
    :style="{
      width: iconSize.width,
      height: iconSize.height,
    }"
  >
    <i
      class="text-sm fa fa-lw"
      :class="[
        icon,
        color,
      ]"
    ></i>
  </div>
</template>
<script>
export default {
  name: 'AppCardIcon',
  props: {
    icon: {
      type: String,
      default: 'fa-circle',
    },
    size: {
      type: String,
      default: 'medium',
    },
    shape: {
      type: String,
      default: 'square',
    },
    color: {
      type: String,
      default: 'text-black',
    },
  },
  computed: {
    iconSize() {
      let width = '94px';
      let height = '94px';

      switch (this.size) {
        case 'large':
          width = '128px';
          height = '128px';
          break;
        case 'medium':
          width = '94px';
          height = '94px';
          break;
        case 'small':
          width = '64px';
          height = '64px';
          break;
        case 'xsmall':
          width = '32px';
          height = '32px';
          break;
        case 'xxsmall':
          width = '24px';
          height = '24px';
          break;
      }

      return {
        width,
        height,
      };
    },
  },
}
</script>