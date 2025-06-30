<template>
  <div id="AppCardOrder" class="w-full flex flex-col gap-4">
    <div class="w-full flex flex-col gap-2">
      <div class="flex-1 flex items-center gap-4">
        <div class="w-1/2 flex items-center">
          <i class="fa fa-lg fa-check-circle mr-2 text-sm text-gray-500" />
          <div
            class="text-sm font-normal text-gray-900"
            >Jumlah Produk</div
          >
        </div>
        <div class="flex-1 text-sm font-semibold text-black">
          : {{ grandItem }} produk
        </div>
      </div>

      <div class="flex-1 flex items-center gap-4">
        <div class="w-1/2 flex items-center">
          <i class="fa fa-lg fa-check-circle mr-2 text-sm text-gray-500" />
          <div
            class="text-sm font-normal text-gray-900"
            >Total Kembalian</div
          >
        </div>
        <div class="flex-1 text-sm font-semibold text-black">
          : {{ format(changeTotal) }}
        </div>
      </div>

      <div class="flex-1 flex items-center gap-4">
        <div class="w-1/2 flex items-center">
          <i class="fa fa-lg fa-check-circle mr-2 text-sm text-gray-500" />
          <div
            class="text-sm font-normal text-gray-900"
            >Total Penjualan</div
          >
        </div>
        <div class="flex-1 text-sm font-semibold text-black">
          : {{ format(grandTotal) }}
        </div>
      </div>
    </div>

    <el-table :data="filteredData" border empty-text="Data Kosong">
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
              :data="scope.row.order.status"
              :label="scope.row.order.order_id"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Tanggal" min-width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.order.created_at | moment('DD MMM YYYY') }}</div>
        </template>
      </el-table-column>
      <el-table-column label="Produk" min-width="320">
        <template slot-scope="scope">
          <div
            v-for="(dt, i) in scope.row.details"
            :key="i"
            class="width width-100 padding padding-bottom-5px padding-top-5px"
          >
            <div style="font-weight: bold">
              {{ dt.product_name }}
              {{ dt.product_detail ? `- ${dt.product_detail}` : '' }}
            </div>
            <div class="display-flex space-between">
              <div style="font-size: 13px">Harga</div>
              <div style="font-size: 13px; font-weight: bold">
                {{ format(dt.price) }}
              </div>
            </div>
            <div v-if="dt.is_discount" class="display-flex space-between">
              <div style="font-size: 12px; margin-left: 10px">
                Diskon : {{ dt.discount_name }}
              </div>
              <div style="font-size: 12px">{{ format(dt.discount_price) }}</div>
            </div>
            <div v-if="dt.is_platform" class="display-flex space-between">
              <div style="font-size: 12px; margin-left: 10px">
                Platform : {{ dt.platform_name }}
              </div>
              <div style="font-size: 12px">{{ format(dt.platform_price) }}</div>
            </div>
            <div class="display-flex space-between">
              <div style="font-size: 13px">Jumlah</div>
              <div style="font-size: 13px; font-weight: bold">
                {{ dt.quantity }}x
              </div>
            </div>
          </div>
          <div class="width width-full border border-bottom border-dashed margin margin-bottom-5px"></div>
          <div class="display-flex space-between">
            <div style="font-size: 13px">Kembalian</div>
            <div style="font-size: 13px; font-weight: bold">
              {{ format(scope.row.order.change_price) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Diskon" min-width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.order.discount_name || '-' }}</div>
          <div
            v-if="scope.row.order.is_discount"
            class="display-flex space-between"
          >
            <div style="font-size: 12px">Biaya</div>
            <div style="font-size: 12px">
              {{ format(scope.row.order.discount_price) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Total" align="right" min-width="180">
        <template slot-scope="scope">
          <div style="font-size: 12px; font-weight: normal">
            {{ scope.row.order.total_item }} produk
          </div>
          <div style="font-weight: bold">
            {{ format(scope.row.order.total_price) }}
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
  name: 'AppCardOrder',
  props: {
    data: {
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
    changeTotal() {
      let total = 0
      if (this.data && this.data.length > 0) {
        this.data &&
          this.data.map((item) => {
            total += item.order.change_price
          })
      }
      return total
    },
    grandTotal() {
      let total = 0
      if (this.data && this.data.length > 0) {
        this.data &&
          this.data.map((item) => {
            total += item.order.total_price
          })
      }
      return total
    },
    grandItem() {
      let total = 0
      if (this.data && this.data.length > 0) {
        this.data &&
          this.data.map((item) => {
            total += item.order.total_item
          })
      }
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
