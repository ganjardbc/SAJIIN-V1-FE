<template>
  <div id="App" class="flex flex-col gap-4">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="w-full p-4 shadow-lg bg-white rounded-lg flex flex-col gap-4"
    >
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">
        <div class="flex-1 flex flex-col">
          <div class="text text-xs text-black font-semibold">
            {{ dt.proddetail_id }}
          </div>
          <div class="text text-xs text-gray-500">
            {{ dt.created_at | moment('DD MMMM YYYY') }}
          </div>
        </div>
        <div class="flex flex-end items-center gap-2">
          <AppCardCapsule :data="dt.status" />
          <el-popover
            v-if="typeFormProduct !== 'detail'"
            placement="bottom-end"
            width="180"
            trigger="click"
          >
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
      <div class="w-full flex flex-col gap-1">
        <div class="text text-xs text-black font-semibold">
          {{ dt.name }}
        </div>
        <AppCardCaption
          icon="fa fa-lg fa-info-circle"
          :caption="dt.description"
        />
        <AppCardCaption
          icon="fa fa-lg fa-calculator"
          :caption="format(dt.price)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AppCardCaption from '../../../../../modules/AppCardCaption'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardCaption,
    AppCardCapsule,
  },
  computed: {
    ...mapState({
      typeFormProduct: (state) => state.storeProduct.typeForm,
    }),
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
  },
}
</script>
