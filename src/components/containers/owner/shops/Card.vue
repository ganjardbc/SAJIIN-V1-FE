<template>
  <div id="App">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="card box-shadow margin margin-top-15px margin-bottom-15px"
    >
      <div
        class="display-flex space-between align-center padding padding-bottom-15px margin margin-bottom-15px border-bottom"
      >
        <div class="display-flex align-center">
          <div class="width width-30px">
            <i class="fa fa-1x fa-store fonts main-color"></i>
          </div>
          <div>
            <div class="fonts fonts-10 semibold">{{ dt.shop.shop_id }}</div>
            <div class="fonts fonts-10 grey">
              {{ dt.shop.created_at | moment('DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div class="display-flex flex-end align-center">
          <AppCardCapsule
            :data="dt.shop.status"
            :label="dt.shop.status === 'active' ? 'Aktif' : 'Non-Aktif'"
            class="margin margin-left-10px"
          />
        </div>
      </div>

      <div class="display-flex space-between align-center">
        <div class="width width-40px margin margin-right-15px">
          <div class="image image-padding border-full">
            <img
              v-if="dt.shop.image"
              :src="shopImageThumbnailUrl + dt.shop.image"
              alt=""
              class="post-center"
            />
            <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
          </div>
        </div>
        <div style="width: calc(100% - 55px)">
          <div class="fonts fonts-11 semibold">{{ dt.shop.name }}</div>
        </div>
      </div>

      <div
        class="width width-100 display-flex padding padding-top-15px padding-bottom-15px border-bottom"
      >
        <div class="width width-50">
          <AppCardCaption
            icon="far fa-lg fa-calendar"
            :caption="`${dt.shop.open_day} - ${dt.shop.close_day}`"
          />
          <AppCardCaption
            icon="far fa-lg fa-clock"
            :caption="`${dt.shop.open_time} - ${dt.shop.close_time}`"
          />
        </div>
        <div class="width width-50">
          <AppCardCaption
            :icon="`far fa-lg ${dt.shop.is_digital_menu_active ? 'fa-check-circle' : 'fa-times-circle'}`"
            :iconColor="`${dt.shop.is_digital_menu_active ? 'green' : 'red'}`"
            :caption="`Digital Menu`"
          />
          <AppCardCaption
            :icon="`far fa-lg ${dt.shop.is_digital_order_active ? 'fa-check-circle' : 'fa-times-circle'}`"
            :iconColor="`${dt.shop.is_digital_order_active ? 'green' : 'red'}`"
            :caption="`Digital Order`"
          />
        </div>
      </div>

      <div
        class="display-flex space-between align-center padding padding-top-15px"
      >
        <el-switch
          v-model="dt.shop.status"
          :active-value="'active'"
          :inactive-value="'inactive'"
          active-text="Aktif"
          inactive-text="Non-Aktif"
          @change="onChangeStatus(dt.shop)"
        ></el-switch>
        <div v-if="dt.shop.status === 'active'" class="display-flex flex-end">
          <button
            v-if="dt.shop.is_digital_menu_active"
            class="btn btn-main-reverse btn-icon with-hover"
            @click="onQrCode(dt.shop)"
          >
            <i class="icn fa fa-lw fa-qrcode"></i>
          </button>
          <button
            class="btn btn-sekunder margin margin-left-10px"
            @click="onManage(dt.shop)"
          >
            <i class="icn icn-left fa fa-lw fa-store"></i> Kelola
          </button>
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
