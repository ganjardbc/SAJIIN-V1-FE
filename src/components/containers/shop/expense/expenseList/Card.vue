<template>
  <div id="App" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
    >
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">
        <div class="flex-1 flex flex-col">
          <div class="text text-xs text-black font-semibold">
            {{ dt.expense_list_id }}
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

      <div class="flex flex-col justify-between gap-4">
        <div class="flex gap-4">
          <AppCardAvatar
            :src="`${expenseListImageThumbnailUrl}${dt.image}`"
            :is-upload="isRoleOwner"
            @upload="onChangeCover(dt)"
          />
          <div class="flex-1">
            <div class="text-sm text-gray-500">
              {{ dt.expense_date | moment('DD MMMM YYYY') }}
            </div>
            <div class="text-sm text-black font-semibold">
              {{ format(dt.expense_price) }}
            </div>
          </div>
        </div>
        <div class="flex-1 flex flex-col gap-2">
          <div class="w-full flex flex-col gap-1">
            <AppCardLabelValue
              label="Tipe"
              :value="dt.expense_type.name"
            />
            <AppCardLabelValue
              v-if="dt.cashbook && dt.cashbook.cash_date"
              label="Buku Kas"
              :value="dateConvert(dt.cashbook.cash_date)"
            />
            <AppCardLabelValue
              v-if="dt.payment && dt.payment.name"
              label="Pembayaran"
              :value="dt.payment.name"
            />
            <AppCardLabelValue
              v-if="dt.description"
              label="Keterangan"
              :value="dt.description"
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
        <el-button
          class="w-full"
          @click="onDetail(dt)"
        >
          Detail Pembelian
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import m from 'moment'
import AppCardAvatar from '../../../../modules/AppCardAvatar'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardCollapse from '../../../../modules/AppCardCollapse'
import AppCardCaption from '../../../../modules/AppCardCaption'
import AppCardLabelValue from '../../../../modules/AppCardLabelValue'

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
    AppCardLabelValue,
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
    dateConvert(data) {
      return m(data).format('DD MMMM YYYY')
    },

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
