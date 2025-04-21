<template>
  <div
    class="relative"
    :style="{
      width: avatarSize.width,
      height: avatarSize.height,
    }">
    <el-avatar
      :src="src"
      class="w-full h-full bg-white shadow-lg flex justify-center items-center"
      :shape="shape"
      :fit="fit"
    />
    <el-button
      v-if="isUpload"
      size="small"
      circle
      style="
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 32px;
        height: 32px;
      "
      @click="uploadImage"
    >
      <i
        class="text-gray-700 fa-lw fa fa-camera"
      />
    </el-button>
  </div>
</template>
<script>
export default {
  name: 'AppCardAvatar',
  props: {
    src: {
      type: String,
      required: true,
    },
    isUpload: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium',
    },
    shape: {
      type: String,
      default: 'square',
    },
    fit: {
      type: String,
      default: 'cover',
    },
  },
  computed: {
    avatarSize() {
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
  methods: {
    uploadImage() {
      this.$emit('upload');
    },
  },
};
</script>