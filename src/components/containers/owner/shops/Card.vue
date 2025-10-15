<template>
  <div class="w-full grid grid-cols-1 gap-4">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
    >
      <div
        class="flex justify-between items-center pb-4 border-b border-gray-200"
      >
        <div class="flex items-center gap-2">
          <i class="fa fa-1x fa-store text-vermillion-500"></i>
          <div class="flex-1 flex flex-col">
            <div class="text text-xs text-black font-semibold">
              {{ dt.shop.shop_id }}
            </div>
            <div class="text text-xs text-gray-500">
              {{ dt.shop.created_at | moment('DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div class="flex flex-end items-center gap-2">
          <AppCardCapsule :data="dt.shop.status" />
        </div>
      </div>

      <div class="flex items-center justify-between gap-4">
        <el-avatar
          size="large"
          :src="`${shopImageThumbnailUrl}${dt.shop.image}`"
          class="shadow-lg"
          shape="square"
        />
        <div
          class="flex-1 flex flex-col gap-2"
          style="width: calc(100% - 128px)"
        >
          <div class="text-md text-black font-semibold">
            {{ dt.shop.name }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex-1 flex flex-col gap-1">
          <AppCardCaption
            icon="far fa-lg fa-calendar"
            :caption="`${dt.shop.open_day} - ${dt.shop.close_day}`"
          />
          <AppCardCaption
            icon="far fa-lg fa-clock"
            :caption="`${dt.shop.open_time} - ${dt.shop.close_time}`"
          />
        </div>
        <div class="flex-1 flex flex-col gap-1">
          <AppCardCaption
            :icon="`far fa-lg ${dt.shop.is_digital_menu_active ? 'fa-check-circle' : 'fa-times-circle'}`"
            :iconColor="`${dt.shop.is_digital_menu_active ? 'text-green-500' : 'text-red-500'}`"
            :caption="`Digital Menu`"
          />
          <AppCardCaption
            :icon="`far fa-lg ${dt.shop.is_digital_order_active ? 'fa-check-circle' : 'fa-times-circle'}`"
            :iconColor="`${dt.shop.is_digital_order_active ? 'text-green-500' : 'text-red-500'}`"
            :caption="`Digital Order`"
          />
        </div>
      </div>

      <div class="w-full flex justify-between items-center gap-2 border-t border-gray-200 pt-4">
        <el-switch
          v-model="dt.shop.status"
          :active-value="'active'"
          :inactive-value="'inactive'"
          active-text="Aktif"
          inactive-text="Non-Aktif"
          @change="onChangeStatus(dt.shop)"
        ></el-switch>

        <div v-if="dt.shop.status === 'active'" class="flex items-center justify-end">
          <el-button
            v-if="dt.shop.is_digital_menu_active"
            size="medium"
            class="border-none px-2"
            @click="onQrCode(dt.shop)"
          >
            <i class="fa fa-lw fa-qrcode text-vermillion-500"></i>
          </el-button>
          <el-button
            size="medium"
            @click="onManage(dt.shop)"
          >
            <i class="mr-2 fa fa-lw fa-store"></i> Kelola
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppCardCaption from '../../../modules/AppCardCaption'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardCapsule,
    AppCardCaption,
  },
  methods: {
    // MANAGE
    onManage(data) {
      this.$emit('onManage', data)
    },

    // STATUS
    onChangeStatus(data) {
      this.$emit('onChangeStatus', data)
    },

    onQrCode(data) {
      this.$emit('onQrCode', data)
    },
  },
}
</script>
