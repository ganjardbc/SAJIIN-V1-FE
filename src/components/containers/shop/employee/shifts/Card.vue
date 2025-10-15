<template>
  <div id="App" class="flex flex-col gap-4">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
    >
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <i class="fa fa-1x fa-clock text-vermillion-500"></i>
          <div class="flex-1 flex flex-col">
            <div class="text text-xs text-black font-semibold">
              {{ dt.shift.shift_id }}
            </div>
            <div class="text text-xs text-gray-500">
              {{ dt.shift.created_at | moment('DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div class="flex flex-end items-center gap-2">
          <AppCardCapsule :data="dt.shift.status" />
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
                class="menu-item small"
                @click="onDetail(dt)"
              >
                <i class="icon fa fa-lw fa-align-left"></i>
                <span class="label text-left">Detail</span>
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
        <div class="flex-1 flex flex-col gap-2">
          <div class="w-full flex flex-col gap-1">
            <div class="text-sm text-black font-semibold">
              {{ dt.shift.title }}
            </div>
            <AppCardCaption
              icon="fa fa-lg fa-info-circle"
              :caption="dt.shift.description"
            />
            <AppCardCaption
              icon="fa fa-lg fa-clock"
              :caption="`${dt.shift.start_time} - ${dt.shift.end_time}`"
            />
          </div>
          <div class="w-full flex justify-between items-center">
            <div class="text-sm text-black font-semibold">Status</div>
            <el-switch
              v-model="dt.shift.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              active-text="Aktif"
              inactive-text="Non-Aktif"
              @change="onChangeStatus(dt)"
            ></el-switch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardCaption from '../../../../modules/AppCardCaption'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardCapsule,
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
    onChangeStatus(data) {
      this.$emit('onChangeStatus', data)
    },
  },
}
</script>
