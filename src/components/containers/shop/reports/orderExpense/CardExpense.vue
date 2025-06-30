<template>
  <div id="AppCardExpense" class="w-full flex flex-col gap-4">
    <div class="w-full flex flex-col gap-2">
      <div class="flex-1 flex items-center gap-4">
        <div class="w-1/2 flex items-center">
          <i class="fa fa-lg fa-check-circle mr-2 text-sm text-gray-500" />
          <div
            class="text-sm font-normal text-gray-900"
            >Jumlah Pembelian</div
          >
        </div>
        <div class="flex-1 text-sm font-semibold text-black">
          : {{ data.length }} pembelian
        </div>
      </div>

      <div class="flex-1 flex items-center gap-4">
        <div class="w-1/2 flex items-center">
          <i class="fa fa-lg fa-check-circle mr-2 text-sm text-gray-500" />
          <div
            class="text-sm font-normal text-gray-900"
            >Total Pembelian</div
          >
        </div>
        <div class="flex-1 text-sm font-semibold text-black">
          : {{ format(grandTotal) }}
        </div>
      </div>
    </div>

    <el-table :data="filteredData" border empty-text="No Data">
      <el-table-column
        type="index"
        label="No"
        width="50"
        align="center"
        :index="indexMethod"
      ></el-table-column>
      <el-table-column label="ID Transaksi" min-width="200">
        <template slot-scope="scope">
          <div>
            <AppCardCapsule
              :data="scope.row.expense.status"
              :label="scope.row.expense.expense_list_id"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Tanggal" min-width="150">
        <template slot-scope="scope">
          <div>
            {{ scope.row.expense.expense_date | moment('DD MMM YYYY') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Tipe" min-width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.type.name || '-' }}</div>
          <div v-if="scope.row.expense.description" style="font-size: 12px">
            {{ scope.row.expense.description }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Pembayaran" min-width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.payment.name || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Total" align="right" min-width="200">
        <template slot-scope="scope">
          <div style="font-weight: bold">
            {{ format(scope.row.expense.expense_price) }}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="w-full flex justify-between items-center">
      <div class="text-sm text-black font-semibold">Total {{ data.length }}</div>
      <el-pagination
        background
        :current-page="page"
        :page-size="pageSize"
        :pager-count="5"
        layout="prev, pager, next"
        :total="data.length"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import AppCardCapsule from '../../../../modules/AppCardCapsule'

export default {
  name: 'AppCardExpense',
  props: {
    data: {
      required: true,
    },
    order: {
      required: true,
    },
  },
  data() {
    return {
      page: 1,
      pageSize: 5,
    }
  },
  components: {
    AppCardCapsule,
  },
  computed: {
    filteredData() {
      return this.data.slice(
        this.pageSize * this.page - this.pageSize,
        this.pageSize * this.page
      )
    },
    grandTotal() {
      let total = 0
      if (this.data && this.data.length > 0) {
        this.data &&
          this.data.map((item) => {
            total += item.expense.expense_price
          })
      }
      return total
    },
    grandChange() {
      let total = 0
      if (this.order && this.order.length > 0) {
        this.order &&
          this.order.map((item) => {
            total += item.order.change_price
          })
      }
      return total
    },
    cashOut() {
      let total = this.grandTotal + this.grandChange
      return total
    },
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.page - 1) * this.pageSize
    },
    handleCurrentChange(value) {
      this.page = value
    },
  },
}
</script>
