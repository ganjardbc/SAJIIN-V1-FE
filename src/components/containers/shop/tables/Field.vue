<template>
  <section>
    <div
      v-loading="loading"
      class="w-full border border-gray-200 rounded-md bg-white"
      :class="{
        'p-2': smallField,
        'p-4': !smallField,
      }"
    >
      <div class="flex justify-between items-center">
        <div
          v-if="selectedData"
          class="flex-1 flex justify-between items-center"
          :class="{
            'gap-2': smallField,
            'gap-4': !smallField,
          }"
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
          class="pl-2 flex-1 text-black font-semibold"
          :class="{
            'text-xs': smallField,
            'text-sm': !smallField,
          }"
        >
          Pilih Meja
          <span
            class="text-gray-500"
            :class="{
              'text-xs': smallField,
              'text-sm': !smallField,
            }"
          >(opsional)</span>
        </div>
        <el-button
          v-if="selectedData"
          :size="smallField ? 'mini' : 'small'"
          circle
          :style="{
            width: smallField ? '28px' : '36px',
            height: smallField ? '28px' : '36px',
          }"
          @click="onRemove"
        >
          <i class="fa fa-times"></i>
        </el-button>
        <el-button
          v-else
          :size="smallField ? 'mini' : 'small'"
          circle
          :style="{
            width: smallField ? '28px' : '36px',
            height: smallField ? '28px' : '36px',
          }"
          @click="onOpen"
        >
          <i class="fa fa-chevron-right"></i>
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
  </section>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import SearchField from '../../../modules/SearchField'
import AppEmpty from '../../../modules/AppEmpty'
import AppCardPopup from '../../../modules/AppCardPopup'
import AppCardAvatar from '../../../modules/AppCardAvatar'
import AppCardIcon from '../../../modules/AppCardIcon'

export default {
  name: 'AppFieldTables',
  data() {
    return {
      visiblePopup: false,
      currentPage: 1,
      selectedID: null,
    }
  },
  props: {
    value: null,
    smallField: false,
  },
  created() {
    this.selectedID = this.value
    this.getDataField()
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
      data: (state) => state.storeTable.field.data,
      totalRecord: (state) => state.storeTable.field.totalRecord,
      limit: (state) => state.storeTable.field.limit,
      filter: (state) => state.storeTable.field.filter,
      loading: (state) => state.storeTable.field.loading,
    }),
    shopId() {
      return this.$store.state.storeSelectedShop.selectedData
    },
    selectedData() {
      return this.data.find((item) => item.id === this.selectedID)
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.getDataField()
      }
    },
    value(props) {
      this.selectedID = props
    },
  },
  methods: {
    ...mapActions({
      getFieldData: 'storeTable/getFieldData',
      resetFilter: 'storeTable/resetFieldFilter',
      setPagination: 'storeTable/setFieldPagination',
    }),
    onClose() {
      this.visiblePopup = false
    },
    onOpen() {
      this.visiblePopup = true
      this.resetFilter()
      this.getDataField()
    },
    onChange(data) {
      this.visiblePopup = false
      this.$emit('onChange', data)
    },
    onRemove() {
      this.$emit('onClear')
    },
    onRefresh() {
      this.getDataField()
    },
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getDataField()
    },
    handleCurrentChange(value) {
      this.setPagination(value)
      this.getDataField()
    },

    // LIST DATA
    getDataField() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      this.filter.status = ''
      this.getFieldData({ token, shop_id })
    },
  },
}
</script>
