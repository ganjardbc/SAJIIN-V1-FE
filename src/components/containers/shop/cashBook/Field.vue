<template>
  <section>
    <el-select
      v-model="selectedLabel"
      :placeholder="placeholder"
      popper-class="w-full"
      class="w-full"
      :clearable="true"
      :disabled="disabled"
      @clear="onClear"
      @focus="onOpenPopup"
    >
    </el-select>

    <AppCardPopup
      v-if="visiblePopup"
      title="Pilih Buku Kas"
      @onClose="onClosePopup"
    >
      <div class="w-full flex flex-col gap-4">
        <SearchField
          :placeholder="'Cari buku kas ..'"
          :enableResponsive="true"
          :onChange="(data) => onSearch(data)"
        />

        <div v-loading="loading" class="w-full flex flex-col gap-4">
          <AppEmpty v-if="data.length === 0" />
          <div
            v-for="(item, i) in data"
            :key="i"
            class="w-full p-4 bg-white rounded-md border border-gray-200"
          >
            <div class="flex justify-between items-center gap-4">
              <AppCardIcon
                icon="fa-book-open"
                color="text-vermillion-500"
                size="xsmall"
              />
              <div class="flex-1 flex flex-col">
                <div class="text-sm text-black font-semibold">
                  {{ item.cash_date | moment('DD MMMM YYYY') }}
                </div>
                <div v-if="item.cash_end_date" class="text-xs text-gray-500">
                  Tutup pada {{ item.cash_end_date | moment('DD MMMM YYYY') }}
                </div>
              </div>
              <el-button
                size="small"
                :type="selectedID === item.id ? 'primary' : 'default'"
                :disabled="item.status === 'inactive'"
                circle
                @click="onChange(item)"
              >
                <i class="fa fa-lw fa-check"></i>
              </el-button>
            </div>
          </div>
        </div>

        <div class="w-full flex justify-between items-center gap-2">
          <div class="text-md text-black">
            Total {{ totalRecord }}
          </div>
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="limit"
            :pager-count="5"
            layout="prev, pager, next"
            :total="totalRecord"
          >
          </el-pagination>
        </div>
      </div>
    </AppCardPopup>
  </section>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import SearchField from '../../../modules/SearchField'
import AppCardPopup from '../../../modules/AppCardPopup'
import AppCardIcon from '../../../modules/AppCardIcon'
import AppEmpty from '../../../modules/AppEmpty'
import moment from 'moment'

export default {
  name: 'CashbookField',
  data() {
    return {
      visiblePopup: false,
      currentPage: 1,
      selectedID: '',
      selectedLabel: !this.disabledAllLabel ? 'Semua Buku Kas' : '',
    }
  },
  mounted() {
    this.selectedID = this.findCurrentID(this.value)
    this.selectedLabel = this.findCurrentData(this.value)
    this.getData()
  },
  components: {
    SearchField,
    AppCardPopup,
    AppCardIcon,
    AppEmpty,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeCashBook.customFilter.data,
      totalRecord: (state) => state.storeCashBook.customFilter.totalRecord,
      limit: (state) => state.storeCashBook.customFilter.limit,
      filter: (state) => state.storeCashBook.customFilter.filter,
      loading: (state) => state.storeCashBook.customFilter.loading,
    }),
    shopId() {
      return this.$store.state.storeSelectedShop.selectedData
    },
  },
  props: {
    value: {
      default: null,
      required: true,
    },
    placeholder: {
      default: 'Pilih Buku Kas',
      required: false,
    },
    disabledAllLabel: {
      default: false,
      required: false,
    },
    disabled: {
      default: false,
      required: false,
    },
  },
  watch: {
    shopId(props, prevProps) {
      if (props !== prevProps) {
        this.getData()
      }
    },
    value(props) {
      this.selectedID = this.findCurrentID(props)
      this.selectedLabel = this.findCurrentData(props)
    },
  },
  methods: {
    ...mapActions({
      getDataCustomFilter: 'storeCashBook/getDataCustomFilter',
      resetFilter: 'storeCashBook/resetCustomFilterFilter',
      setPagination: 'storeCashBook/setCustomFilterPagination',
    }),
    onOpenPopup() {
      this.visiblePopup = true
      this.resetFilter()
      this.getData()
    },
    onClosePopup() {
      this.visiblePopup = false
    },
    onChange(value) {
      this.visiblePopup = false
      this.$emit('onChange', value)
    },
    onClear() {
      this.selectedID = ''
      this.$emit('onChange', '')
    },
    onSearch(value) {
      this.filter.search = value
      this.resetFilter()
      this.getData()
    },
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getData()
    },
    onRefresh() {
      this.getData()
    },
    findCurrentID(value) {
      return value ? value : ''
    },
    findCurrentData(value) {
      let label = !this.disabledAllLabel ? 'Semua Buku Kas' : ''
      let find = this.data && this.data.find((item) => item.id === value)
      if (find !== undefined) {
        label = moment(find.cash_date).format('DD MMMM YYYY')
      }
      return label
    },
    getData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getDataCustomFilter({ token, shop_id })
      }
    },
  },
}
</script>
