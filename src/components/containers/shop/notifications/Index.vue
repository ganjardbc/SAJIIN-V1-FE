<template>
  <div id="App" class="w-full flex flex-col">
    <div class="subnavbar">
      <div class="flex items-center justify-between lg:px-4 w-full lg:w-sm m-auto">
        <el-badge :value="totalUnread" :max="99">
          <div class="text-xl text-black font-semibold">Notifikasi</div>
        </el-badge>
        <el-button size="small" circle @click="onReload">
        <i class="fa fa-lw fa-retweet"></i>
      </el-button>
      </div>
    </div>

    <div v-loading="loading" class="flex flex-col gap-4 p-4 w-full lg:w-sm m-auto">
      <AppEmpty v-if="data.length === 0" />
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="(dt, i) in data"
          :key="i"
          class="p-4 rounded-lg flex flex-col gap-2 cursor-pointer hover:bg-gray-100"
          :class="{
            'bg-gray-100': !dt.is_read,
          }"
          @click="onRoute(dt)"
        >
          <div class="flex gap-4">
            <div
              class="flex items-center justify-center bg-gray-100 rounded-full"
              :class="{
                'bg-gray-100': dt.is_read,
                'bg-vermillion-200': !dt.is_read,
              }"
              style="width: 38px; height: 38px"
            >
              <i
                class="text-md fa fa-bell"
                :class="{
                  'text-gray-500': dt.is_read,
                  'text-vermillion-500': !dt.is_read,
                }"
              />
            </div>
            <div class="flex-1 flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <div class="text-xs text-black font-semibold capitalize">
                  {{ getLabel(dt.type) }}
                </div>
                <div class="text-xs text-right text-gray-500">
                  {{ dt.created_at | moment('from', 'now') }}
                </div>
              </div>

              <div class="text-sm text-black font-normal">
                {{ dt.message }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="data.length !== totalRecord"
        class="flex justify-center items-center"
      >
        <el-button @click="onLoadMore">
          Load More
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppEmpty from '@/components/modules/AppEmpty'
import icon from '@/assets/img/icon.png'

export default {
  name: 'App',
  data() {
    return {
      icon: icon,
      currentPage: 0,
      selectedIndex: 0,
    }
  },
  components: {
    AppEmpty,
  },
  computed: {
    ...mapState({
      filter: (state) => state.storeNotification.filter,
      form: (state) => state.storeNotification.form,
      data: (state) => state.storeNotification.data,
      totalRecord: (state) => state.storeNotification.totalRecord,
      totalUnread: (state) => state.storeNotification.totalUnread,
      totalRead: (state) => state.storeNotification.totalRead,
      loading: (state) => state.storeNotification.loading,
    }),
    limit: {
      get() {
        return this.$store.state.storeNotification.limit
      },
      set(value) {
        this.$store.state.storeNotification.limit = value
      },
    },
    offset: {
      get() {
        return this.$store.state.storeNotification.offset
      },
      set(value) {
        this.$store.state.storeNotification.offset = value
      },
    },
    shopId() {
      return this.$store.state.storeShop.form.id
    },
    paramShopId() {
      return this.$route.params.shopId
    },
  },
  methods: {
    ...mapActions({
      getNotification: 'storeNotification/getData',
      resetFilter: 'storeNotification/resetFilter',
      setFormData: 'storeNotification/setFormData',
      updateData: 'storeNotification/updateData',
      getMatrix: 'storeDashboard/getMatrix',
    }),
    onLoadMore() {
      this.offset = this.offset + this.limit
      this.getData()
    },
    onReload() {
      this.resetFilter()
      this.getData()
    },
    onSearch(data) {
      this.filter.search = data
      this.resetFilter()
      this.getData()
    },
    onRoute(data) {
      const type = data.type
      const roleName = this.$cookies.get('user')
        ? this.$cookies.get('user').role_name
        : ''

      this.updateNotification(data)

      if (type === 'order' || type === 'order-status') {
        let path = 'employee-orders'

        if (roleName === 'owner') {
          path = 'shop-orders'
        }

        this.$router
          .push({
            name: path,
            query: {
              search: data.target,
            },
          })
          .catch((error) => {
            if (error.name != 'NavigationDuplicated') {
              throw error
            }
          })
      } else if (type === 'cashbook') {
        let path = 'employee-cash-book'

        if (roleName === 'owner') {
          path = 'shop-cash-book'
        }

        this.$router
          .push({
            name: path,
            query: {
              search: data.target,
            },
          })
          .catch((error) => {
            if (error.name != 'NavigationDuplicated') {
              throw error
            }
          })
      } else {
        this.$message('Undefined notification !')
      }
    },

    // CRUD
    updateNotification(data) {
      this.setFormData({
        ...data,
        is_read: 1,
      })
      const token = this.$cookies.get('tokenBearer')
      this.updateData({
        ...this.form,
        token: token,
      }).then((res) => {
        const status = res.data.status
        const newData = res.data.data
        if (status === 'ok') {
          const findData = this.data.find(
            (item) => item.notification_id === newData.notification_id
          )
          if (findData) {
            findData.is_read = newData.is_read
          }
        }
      })
    },

    // LIST DATA
    getLabel(value) {
      let label = 'Pesanan'
      if (value === 'order') label = 'Pesanan'
      if (value === 'order-status') label = 'Status'
      if (value === 'cashbook') label = 'Buku Kas'
      return label
    },
    getData() {
      const token = this.$cookies.get('tokenBearer')
      const shop_id = this.shopId
      if (shop_id) {
        this.getNotification({ token, shop_id })
      }
    },
    getDashboardMatrix() {
      const shop_id = this.shopId
      const payload = {
        token: this.$cookies.get('tokenBearer'),
        shop_id: shop_id,
      }
      this.getMatrix(payload)
    },

    // OTHERS
    buildPushNotification(data) {
      if (Notification.permission === 'granted') {
        new Notification(data.shopName, {
          body: data.message,
          icon: this.icon,
        })
      }
    },
    buildNotification(data) {
      this.$notify({
        title: data.shopName,
        message: data.message,
        position: 'top-right',
        type: 'success',
        offset: 70,
        duration: 0,
      })
    },
  },
  watch: {
    shopId(prevProps, nextProps) {
      if (prevProps !== nextProps) {
        this.onReload()
        this.getDashboardMatrix()
      }
    },
  },
  mounted() {
    this.onReload()
    this.getDashboardMatrix()
  },
  sockets: {
    notification: function (data) {
      this.buildNotification(data)
      this.buildPushNotification(data)
      this.onReload()
      this.getDashboardMatrix()
    },
  },
}
</script>
<style>
.app-card-notification {
  word-break: unset;
}
</style>
