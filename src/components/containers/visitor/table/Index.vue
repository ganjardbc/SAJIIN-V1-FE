<template>
  <div id="App">
    <div
      v-loading="loading"
      class="w-full border border-gray-300 rounded-md bg-white p-2"
    >
      <div class="flex justify-between items-center">
        <div
          v-if="selectedData"
          class="flex-1 flex justify-between items-center gap-4"
        >
          <AppCardAvatar
            v-if="selectedData.discount_image"
            :src="tableImageThumbnailUrl + selectedData.image"
            size="xsmall"
          />
          <AppCardIcon
            v-else
            icon="fa-th-large"
            color="text-vermillion-500"
            size="xsmall"
          />
          <div class="flex-1 flex flex-col">
            <div class="text-sm text-black font-semibold">
              {{ selectedData && selectedData.name }}
            </div>
            <div class="text-xs text-gray-500">
              {{ selectedData && selectedData.code }}
            </div>
          </div>
        </div>
        <div
          v-else
          class="pl-2 flex-1 text-black font-semibold text-sm"
        >
          Pilih Meja
          <span
            class="text-sm text-gray-500"
          >(opsional)</span>
        </div>
        <el-button
          v-if="selectedData"
          :size="'small'"
          circle
          :style="{
            width: '32px',
            height: '32px',
          }"
          @click="onRemove"
        >
          <i class="fa fa-lw fa-times"></i>
        </el-button>
        <el-button
          v-else
          :size="'small'"
          circle
          :style="{
            width: '32px',
            height: '32px',
          }"
          @click="onOpen"
        >
          <i class="fa fa-lw fa-chevron-right"></i>
        </el-button>
      </div>
    </div>

    <AppCardPopup v-if="visiblePopup" title="Pilih Meja" @onClose="onClose">
      <div class="w-full flex flex-col gap-4">
        <SearchField
          :placeholder="'Cari meja ..'"
          :enableResponsive="true"
          :onChange="(data) => onSearch(data)"
        />

        <div v-loading="loading" class="w-full flex flex-col gap-4">
          <AppEmpty v-if="data.length === 0" />
          <div
            v-for="(dt, i) in data"
            :key="i"
            class="w-full p-4 bg-white rounded-md border border-gray-200"
          >
            <div class="flex justify-between items-center gap-4">
              <AppCardAvatar
                v-if="dt.image"
                :src="tableImageThumbnailUrl + dt.image"
                size="xsmall"
              />
              <AppCardIcon
                v-else
                icon="fa-th-large"
                color="text-vermillion-500"
                size="xsmall"
              />
              <div class="flex-1 flex flex-col">
                <div class="text-sm text-black font-semibold">
                  {{ dt.name }} ({{ dt.code }})
                </div>
                <div class="text-xs text-gray-500">{{ dt.description }}</div>
              </div>
              <el-button
                size="small"
                :type="selectedID === dt.id ? 'primary' : 'default'"
                :disabled="dt.status === 'inactive'"
                circle
                :style="{
                  width: '32px',
                  height: '32px',
                }"
                @click="onChange(dt)"
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
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import SearchField from '../../../modules/SearchField'
import AppEmpty from '../../../modules/AppEmpty'
import AppCardPopup from '../../../modules/AppCardPopup'
import AppCardAvatar from '../../../modules/AppCardAvatar'
import AppCardIcon from '../../../modules/AppCardIcon'

export default {
  name: 'App',
  data() {
    return {
      visiblePopup: false,
      currentPage: 1,
      selectedID: null,
    }
  },
  props: {
    value: null,
  },
  mounted() {
    this.getDataTable()
  },
  components: {
    SearchField,
    AppEmpty,
    AppCardPopup,
    AppCardAvatar,
    AppCardIcon,
  },
  computed: {
    ...mapState({
      data: (state) => state.storeVisitorTable.data,
      totalRecord: (state) => state.storeVisitorTable.totalRecord,
      limit: (state) => state.storeVisitorTable.limit,
      filter: (state) => state.storeVisitorTable.filter,
      loading: (state) => state.storeVisitorTable.loading,
      dataShop: (state) => state.storeVisitorShop.data,
    }),
    selectedShop() {
      return this.dataShop.shop
    },
    selectedData() {
      return this.data.find((item) => item.id === this.selectedID)
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.getDataTable()
      }
    },
    value(props) {
      this.selectedID = props
    },
  },
  methods: {
    ...mapActions({
      getData: 'storeVisitorTable/getData',
      resetFilter: 'storeVisitorTable/resetFilter',
      setPagination: 'storeVisitorTable/setPagination',
    }),
    onClose() {
      this.visiblePopup = false
    },
    onOpen() {
      this.visiblePopup = true
      this.resetFilter()
      this.getDataTable()
    },
    onChange(data) {
      this.visiblePopup = false
      this.$emit('onChange', data)
    },
    onRemove() {
      this.$emit('onClear')
    },
    onRefresh() {
      this.getDataTable()
    },
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getDataTable()
    },
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getDataTable()
    },

    // LIST DATA
    getDataTable() {
      const shop_id = this.selectedShop.id
      this.filter.status = ''
      this.getData({ shop_id })
    },
  },
}
</script>
