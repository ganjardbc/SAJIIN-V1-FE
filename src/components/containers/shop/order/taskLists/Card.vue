<template>
  <div id="App" class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="(dt, i) in data"
      :key="i"
      class="bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4"
    >
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">
        <div class="flex-1 flex flex-col">
          <div class="text text-xs text-black font-semibold">
            {{ dt.order.order_id }}
          </div>
          <div class="text text-xs text-gray-500">
            {{ dt.order.created_at | moment('DD MMMM YYYY') }}
          </div>
        </div>
        <AppCardCapsule :data="dt.order.status" />
      </div>

      <div class="w-full flex justify-between items-center gap-2">
        <div class="text-sm text-black">Produk</div>
        <AppCardProgressProduct :data="dt.details" />
      </div>

      <div
        class="w-full flex flex-col gap-4"
        style="max-height: 255px; overflow-x: hidden"
      >
        <div
          v-for="(detail, j) in dt.details"
          :key="j"
          class="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex justify-between gap-4">
            <AppCardAvatar
              :src="`${productImageThumbnailUrl}${detail.product_image}`"
              size="small"
            />
            <div class="flex-1 flex flex-col">
              <div class="text-sm text-black font-semibold truncate">
                {{ detail.product_name }}
              </div>
              <div
                v-if="detail.product_detail"
                class="text-xs text-gray-500 truncate"
              >
                {{ detail.product_detail }}
              </div>
              <div class="text-xs text-gray-500 truncate">
                {{ detail.quantity }}x
              </div>
              <div
                v-if="detail.note"
                class="text-xs text-gray-500 truncate"
              >
                {{ detail.note }}
              </div>
            </div>
          </div>

          <div
            v-if="detail.employee"
            class="w-full p-2 bg-gray-100 rounded-md"
          >
            <div class="flex justify-between items-center gap-2">
              <AppCardAvatar
                :src="`${employeeImageThumbnailUrl}${detail.employee.image}`"
                size="xsmall"
                shape="circle"
              />
              <div class="flex-1 flex flex-col">
                <div class="text-sm text-black font-semibold truncate">
                  {{ detail.employee.name }}
                </div>
                <div class="text-xs text-gray-500 truncate">
                  {{ detail.updated_at | moment('DD/MM/YYYY hh:mm') }}
                </div>
              </div>
            </div>
          </div>

          <el-button
            v-if="detail.status === 'to-do'"
            class="w-full"
            @click="onChangeStatus(detail, 'on-progress')"
          >
            Siapkan Produk
          </el-button>

          <el-button
            v-if="detail.status === 'on-progress'"
            class="w-full"
            :disabled="
              detail &&
              detail.employee &&
              detail.employee.id !== dataUser.owner_id
            "
            @click="onChangeStatus(detail, 'done')"
          >
            Produk Selesai Dibuat
          </el-button>

          <el-button
            v-if="detail.status === 'done'"
            class="w-full"
            :disabled="
              detail &&
              detail.employee &&
              detail.employee.id !== dataUser.owner_id
            "
            @click="onChangeStatus(detail, 'to-do')"
          >
            Siapkan Ulang
          </el-button>
        </div>
      </div>
      <div class="display-flex flex-end width width-100">
        <el-button
          class="w-full"
          @click="onChangeOrderStatus(dt.order, 'ready')"
        >
          Antarkan Produk
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import VueLoadImage from 'vue-load-image'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardProgressProduct from '../../../../modules/AppCardProgressProduct'
import AppCardAvatar from '../../../../modules/AppCardAvatar'

export default {
  name: 'App',
  props: {
    data: null,
  },
  components: {
    VueLoadImage,
    AppCardCapsule,
    AppCardProgressProduct,
    AppCardAvatar,
  },
  computed: {
    dataUser() {
      return this.$cookies.get('user')
    },
  },
  methods: {
    onChangeStatus(data, status) {
      const user_id = this.dataUser.id
      let payload = {
        ...data,
        status: status,
        assigned_id: user_id,
      }
      this.$emit('onChangeStatus', payload)
    },
    onChangeOrderStatus(data, status) {
      let payload = {
        ...data,
        status: status,
      }
      this.$emit('onChangeOrderStatus', payload)
    },
  },
}
</script>
