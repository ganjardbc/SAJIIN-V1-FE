<template>
  <div id="App" class="flex flex-col gap-4">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
    >
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <i class="fa fa-1x fa-book-open text-vermillion-500"></i>
          <div class="flex-1 flex flex-col">
            <div class="text text-xs text-black font-semibold">
              {{ dt.cashbook.cashbook_id }}
            </div>
            <div class="text text-xs text-gray-500">
              {{ dt.cashbook.created_at | moment('DD MMMM YYYY') }}
            </div>
          </div>
        </div>
        <div class="flex flex-end items-center gap-2">
          <AppCardCapsule :data="dt.cashbook.status" />
          <el-popover placement="bottom-end" class="flex-1" trigger="click">
            <div class="default-menu">
              <button 
                v-if="dt.cashbook.cash_status === 'closed'"
                class="menu-item small"
                @click="onReOpen(dt.cashbook)">
                <i class="icon fa fa-lw fa-cog"></i>
                <span class="label text-left">Re-Open</span>
              </button>
              <button 
                class="menu-item small"
                @click="onDelete(dt.cashbook)">
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

      <div class="flex justify-between items-center">
        <div class="flex-1">
          <div class="text-xs text-gray-500">Periode</div>
          <div class="w-full text-sm text-black font-semibold">
            <span v-if="dt.cashbook.cash_date !== dt.cashbook.cash_end_date">
              {{ dt.cashbook.cash_date | moment('DD MMMM YYYY') }} -
              {{ dt.cashbook.cash_end_date | moment('DD MMMM YYYY') }}
            </span>
            <span v-else>
              {{ dt.cashbook.cash_date | moment('DD MMMM YYYY') }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-xs text-gray-500">Toko</div>
          <AppCardCapsule :data="dt.cashbook.cash_status" />
        </div>
      </div>

      <CashSummary
        :cash-summary="dt.cashbook.cash_summary"
        :cash-modal="dt.cashbook.cash_modal"
        :cash-actual="dt.cashbook.cash_actual"
        :cash-profit="dt.cashbook.cash_profit"
        :cash-in="dt.cashbook.cash_in"
        :cash-out="dt.cashbook.cash_out"
        :cash-detail="dt.cashbook.cash_detail"
        :enable-cash-warning="dt.cashbook.cash_status === 'closed'"
      />

      <OrderStatus
        :data="dt.cashbook"
        @onClick="onOpenDetail(dt.cashbook)"
      />

      <div class="flex justify-between items-center gap-2">
        <el-switch
          v-model="dt.cashbook.status"
          active-text="Aktif"
          inactive-text="Non-Aktif"
          :active-value="'active'"
          :inactive-value="'inactive'"
          :disabled="dt.cashbook.cash_status === 'open'"
          @change="onChangeStatus(dt.cashbook)"
        ></el-switch>
        <div class="flex justify-end items-center">
          <el-button
            v-if="dt.cashbook.cash_status === 'open'"
            size="medium"
            :disabled="isCanClosing(dt.cashbook)"
            @click="onOpenCashBook(dt.cashbook)"
          >
            <el-popover
              v-if="isCanClosing(dt.cashbook)"
              placement="left"
              width="210"
              trigger="hover"
              style="word-break: break-word"
            >
              <i
                slot="reference"
                class="text-sm text-gray-500 fa fa-info-circle"
              ></i>
              <div class="fonts fonts-10 normal red">
                Untuk menutup buku kas, semua pesanan harus diselesaikan
                terlebih dahulu.
              </div>
            </el-popover>
            Tutup
          </el-button>
          <el-button
            v-else
            size="medium"
            :disabled="isStatusInactive(dt.cashbook)"
            @click="onDownload(dt.cashbook)"
          >
            Laporan
          </el-button>
          <el-button
            size="medium"
            @click="onOpenDetail(dt.cashbook)"
          >
            Detail
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppCardCapsule from '../../../modules/AppCardCapsule'
import AppCardCaption from '../../../modules/AppCardCaption'
import OrderStatus from './OrderStatus'
import CashSummary from './CashSummary'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    AppCardCapsule,
    AppCardCaption,
    OrderStatus,
    CashSummary,
  },
  methods: {
    // OTHER
    isCanClosing(data) {
      let status = true
      if (data.status === 'active') {
        if (data.order_done < data.order_total) {
          status = true
        } else {
          status = false
        }
      }
      return status
    },
    isCanDelete(data) {
      let status = true
      if (data.status === 'active') {
        if (data.order_total > 0) {
          status = true
        } else {
          status = false
        }
      }
      return status
    },
    isStatusInactive(data) {
      let status = true
      if (data.status === 'active') {
        status = false
      }
      return status
    },
    isFullPeriode(data) {
      let status = false
      if (data && data.cash_date && data.cash_end_date) {
        status = true
      }
      return status
    },

    // COVER
    onChangeCover(data) {
      this.$emit('onChangeCover', data)
    },

    // DETAIL
    onDetail(data) {
      this.$emit('onDetail', data)
    },

    // RE OPEN
    onReOpen(data) {
      const payload = {
        ...data,
        cash_status: 'open',
      }
      this.$emit('onReOpen', payload)
    },

    // DELETE
    onDelete(data) {
      this.$emit('onDelete', data)
    },

    // STATUS
    onChangeStatus(data) {
      this.$emit('onChangeStatus', data)
    },

    // DOWNLOAD
    onDownload(data) {
      this.$emit('onDownload', data)
    },

    // CASH BOOK
    onOpenCashBook(data) {
      this.$emit('onOpenCashBook', data)
    },

    // ORDER LIST
    onOpenOrderList(data) {
      this.$emit('onOpenOrderList', data)
    },

    // DETAIL
    onOpenDetail(data) {
      this.$emit('onOpenDetail', data)
    },
  },
}
</script>
