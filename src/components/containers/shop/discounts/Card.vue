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
            {{ dt.discount_id }}
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

      <el-alert
        v-if="dt.currency_type === 'percentage'"
        :title="`Manambah harga di semua produk sebanyak ${dt.order_fee}% ketika membuat pesanan baru.`"
        :closable="false"
        show-icon
      >
      </el-alert>

      <div class="flex flex-col md:flex-row justify-between gap-4">
        <AppCardAvatar
          :src="`${discountImageThumbnailUrl}${dt.discount_image}`"
          :is-upload="isRoleOwner"
          @upload="onChangeCover(dt)"
        />
        <div
          class="flex-1 flex flex-col gap-2"
        >
          <div class="w-full flex flex-col gap-1">
            <div class="text-sm text-black font-semibold">
              {{ dt.discount_name }}
            </div>
            <AppCardCaption
              v-if="dt.discount_value_type === 'percentage'"
              icon="fa fa-lg fa-percentage"
              :caption="`Diskon ${dt.discount_value}%`"
            />
            <AppCardCaption
              v-if="dt.discount_value_type === 'nominal'"
              icon="fa fa-lg fa-calculator"
              :caption="`Diskon ${format(dt.discount_value)}`"
            />
            <AppCardCaption
              v-if="dt.discount_type"
              icon="fa fa-lg fa-info-circle"
              :caption="`Per ${dt.discount_type === 'transaction' ? 'Transaksi' : 'Produk'}`"
            />
            <AppCardCaption
              v-if="dt.discount_description"
              icon="fa fa-lg fa-info-circle"
              :caption="dt.discount_description"
            />
          </div>
          <div class="w-full flex justify-between items-center">
            <div class="text-sm text-black font-semibold">Status</div>
            <el-switch
              v-model="dt.status"
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
import AppCardAvatar from '../../../modules/AppCardAvatar'
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppCardCaption from '../../../modules/AppCardCaption'

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

    // QR CODE
    onQrCode(data) {
      this.$emit('onQrCode', data)
    },
  },
}
</script>
