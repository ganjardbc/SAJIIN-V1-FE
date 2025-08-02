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
            {{ dt.employee.employee_id }}
          </div>
          <div class="text text-xs text-gray-500">
            {{ dt.employee.created_at | moment('DD MMMM YYYY') }}
          </div>
        </div>
        <div class="flex flex-end items-center gap-2">
          <AppCardCapsule :data="dt.employee.status" />
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
          :src="`${employeeImageThumbnailUrl}${dt.employee.image}`"
        />
        <div
          class="flex-1 flex flex-col gap-2"
        >
          <div class="w-full flex flex-col gap-1">
            <div class="text-sm text-black font-semibold">
              {{ dt.employee.name }}
            </div>
            <AppCardCaption
              v-if="dt.user"
              icon="fa fa-lg fa-user"
              :caption="dt.user.username"
            />
            <AppCardCaption
              v-if="dt.role"
              icon="fa fa-lg fa-flag"
              :caption="dt.role.description"
            />
            <AppCardCaption
              v-if="dt.shift"
              icon="fa fa-lg fa-clock"
              :caption="`${dt.shift.title} (${dt.shift.start_time} - ${dt.shift.end_time})`"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-between items-center gap-2">
        <el-switch
          v-model="dt.status"
          active-text="Aktif"
          inactive-text="Non-Aktif"
          :active-value="'active'"
          :inactive-value="'inactive'"
          @change="onChangeStatus(dt)"
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
import AppCardCaption from '../../../../modules/AppCardCaption'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardAvatar,
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
    // DETAIL
    onDetail(data) {
      this.$emit('onDetail', {
        ...data.employee,
        user: data.user,
      })
    },

    // EDIT
    onEdit(data) {
      this.$emit('onEdit', {
        ...data.employee,
        user: data.user,
      })
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', {
        ...data.employee,
        user: data.user,
      })
    },

    // STATUS
    onChangeStatus(data) {
      this.$emit('onChangeStatus', {
        ...data.employee,
        user: data.user,
      })
    },
  },
}
</script>
