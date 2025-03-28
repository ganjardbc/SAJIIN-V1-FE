<template>
  <div id="App">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="card box-shadow margin margin-top-15px margin-bottom-15px"
    >
      <div
        class="display-flex space-between align-center padding padding-bottom-15px margin margin-bottom-20px border-bottom"
      >
        <div class="display-flex align-center">
          <div class="width width-30px">
            <i class="fa fa-1x fa-coins fonts main-color"></i>
          </div>
          <div>
            <div class="fonts fonts-10 semibold">{{ dt.expense_list_id }}</div>
            <div class="fonts fonts-10 grey">
              {{ dt.created_at | moment('DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div class="display-flex flex-end align-center">
          <AppCardCapsule :data="dt.status" class="margin margin-left-10px" />
          <el-popover placement="bottom-end" width="180" trigger="click">
            <div class="width width-100">
              <button
                class="btn btn-white btn-full btn-align-left"
                @click="onEdit(dt)"
              >
                <i class="icn icn-left fa fa-lw fa-edit"></i> Edit
              </button>
              <button
                class="btn btn-white btn-full btn-align-left"
                @click="onDetail(dt)"
              >
                <i class="icn icn-left fa fa-lw fa-align-left"></i> Detail
              </button>
              <button
                v-if="isRoleOwner"
                class="btn btn-white btn-full btn-align-left"
                @click="onDelete(dt)"
              >
                <i class="icn icn-left fa fa-lw fa-trash-alt"></i> Hapus
              </button>
            </div>
            <button slot="reference" class="btn btn-icon btn-circle btn-white">
              <i class="fa fa-lw fa-ellipsis-v"></i>
            </button>
          </el-popover>
        </div>
      </div>

      <div class="display-flex space-between">
        <div class="width width-80px margin marign-right-15px">
          <div class="image image-padding border-full">
            <img
              v-if="dt.image"
              :src="expenseListImageThumbnailUrl + dt.image"
              alt=""
              class="post-center"
            />
            <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
            <button
              class="btn btn-sekunder btn-small-icon btn-circle"
              style="position: absolute; bottom: 5px; right: 5px"
              @click="onChangeCover(dt)"
            >
              <i
                class="post-middle-absolute fonts fonts-11 grey fa fa-lg fa-camera"
              />
            </button>
          </div>
        </div>
        <div style="width: calc(100% - 95px)">
          <div class="width width-100">
            <div class="fonts fonts-11 semibold">
              {{ dt.expense_date | moment('DD MMMM YYYY') }}
            </div>
            <AppCardLabelValue
              label="Biaya"
              :value="format(dt.expense_price)"
            />
            <AppCardLabelValue label="Tipe" :value="dt.expense_type.name" />
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
          <div class="display-flex space-between padding padding-top-15px">
            <div class="fonts micro black semibold">Status</div>
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
import m from 'moment'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardLabelValue from '../../../../modules/AppCardLabelValue'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardCapsule,
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
