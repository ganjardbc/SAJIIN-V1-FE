<template>
  <div id="App" class="flex flex-col gap-4">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
    >
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">
        <div class="flex-1 flex flex-col">
          <div class="text text-xs text-black font-semibold">
            {{ dt.product_id }}
          </div>
          <div class="text text-xs text-gray-500">
            {{ dt.created_at | moment('DD MMMM YYYY') }}
          </div>
        </div>
        <div class="flex flex-end items-center gap-2">
          <AppCardCapsule :data="dt.status" />
          <el-popover placement="bottom-end" class="flex-1" trigger="click">
            <div class="default-menu">
              <button
                class="menu-item small"
                @click="onEdit(dt)"
              >
                <i class="icon fa fa-lw fa-edit"></i>
                <span class="label text-left">Edit</span>
              </button>
              <button
                v-if="isRoleOwner"
                class="menu-item small"
                @click="onDelete(dt)"
              >
                <i class="icon fa fa-lw fa-trash-alt"></i>
                <span class="label text-left">Hapus</span>
              </button>
            </div>
            <el-button
              slot="reference"
              size="small"
              circle
              style="width: 32px; height: 32px;"
            >
              <i class="fa fa-lw fa-ellipsis-v"></i>
            </el-button>
          </el-popover>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-between gap-4">
        <AppCardAvatar
          :src="`${productImageThumbnailUrl}${dt.image}`"
          :is-upload="isRoleOwner"
          @upload="onChangeCover(dt)"
        />
        <div class="flex-1 flex flex-col gap-2">
          <div class="w-full flex flex-col gap-1">
            <div class="text-sm text-black font-semibold">
              {{ dt.name }}
            </div>
            <AppCardCaption
              v-if="dt.description"
              icon="fa fa-lg fa-info-circle"
              :caption="dt.description"
            />
            <AppCardCaption
              v-if="dt.price"
              icon="fa fa-lg fa-calculator"
              :caption="format(dt.price)"
            />
          </div>
        </div>
      </div>

      <AppCardCollapse
        v-if="dt.details.length > 0"
        :title="`Varian (${dt.details.length})`"
        class="margin margin-top-15px"
      >
        <div
          class="w-full"
          style="overflow-y: auto; max-height: 400px"
        >
          <div
            v-for="(detail, j) in dt.details"
            :key="j"
            style="margin: 15px 4px"
          >
            <div class="p-4 bg-white rounded-lg border border-gray-200 flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="w-full flex flex-col gap-1">
                  <div class="flex justify-between items-center">
                    <div class="text-sm text-black font-semibold">
                      {{ detail.name }}
                    </div>
                    <AppCardCapsule :data="detail.status" />
                  </div>
                  <AppCardCaption
                    v-if="detail.description"
                    icon="fa fa-lg fa-info-circle"
                    :caption="detail.description"
                  />
                  <AppCardCaption
                    icon="fa fa-lg fa-calculator"
                    :caption="format(detail.price)"
                  />
                </div>
              </div>
              <div class="w-full flex justify-between items-center">
                <div class="text-sm text-black font-semibold">Status</div>
                <el-switch
                  v-model="detail.status"
                  :active-value="'active'"
                  :inactive-value="'inactive'"
                  active-text="Aktif"
                  inactive-text="Non-Aktif"
                  @change="onChangeVarianStatus(detail)"
                ></el-switch>
              </div>
            </div>
          </div>
        </div>
      </AppCardCollapse>

      <div class="flex justify-between items-center gap-2">
        <el-switch
          v-model="dt.status"
          active-text="Aktif"
          inactive-text="Non-Aktif"
          :active-value="'active'"
          :inactive-value="'inactive'"
          @change="onChangeProductStatus(dt)"
        ></el-switch>
        <div class="flex justify-end items-center">
          <el-button
            size="medium"
            @click="onDetail(dt)"
          >
            Detail
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppCardAvatar from '../../../../modules/AppCardAvatar'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardCollapse from '../../../../modules/AppCardCollapse'
import AppCardCaption from '../../../../modules/AppCardCaption'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardAvatar,
    AppCardCapsule,
    AppCardCollapse,
    AppCardCaption,
  },
  computed: {
    isRoleOwner() {
      let status = false
      const user = this.$cookies.get('user')
      if (user.role_name === 'owner') {
        status = true
      }
      return status
    },
  },
  methods: {
    // COVER
    onChangeCover(data) {
      this.$emit('onChangeCover', data)
    },

    // DETAIL
    onDetail(data) {
      this.$emit('onDetail', data)
    },

    // EDIT
    onEdit(data) {
      this.$emit('onEdit', data)
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', data)
    },

    // STATUS
    onChangeProductStatus(data) {
      this.$emit('onChangeProductStatus', data)
    },
    onChangeVarianStatus(data) {
      this.$emit('onChangeVarianStatus', data)
    },
  },
}
</script>
