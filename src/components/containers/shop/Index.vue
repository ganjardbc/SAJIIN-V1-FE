<template>
  <div id="App" class="flex flex-col gap-4 p-4">
    <div class="relative bg-gray-100 rounded-xl p-4 flex flex-col gap-4">
      <div class="flex flex-col xl:flex-row gap-4">
        <div class="flex-1 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-4">
          <AppCardAvatar
            :src="`${shopImageThumbnailUrl}${dataShop.image}`"
            size="large"
            fit="contain"
          />
          <div class="flex-1 flex flex-col">
            <div class="text-3xl text-black font-semibold text-center lg:text-left truncate flex flex-col lg:flex-row items-center">
              {{ dataShop && dataShop.name }}
              <AppCardCapsule :data="dataShop.status" class="ml-2" />
            </div>
            <div class="text-sm text-center lg:text-left text-gray-500">
              {{ dataShop && dataShop.location }}
            </div>
            <div class="flex items-center justify-center lg:justify-start pt-2">
              <el-button size="medium" circle>
                <i class="fa fa-comment"></i>
              </el-button>
              <el-button size="medium" circle>
                <i class="fa fa-phone"></i>
              </el-button>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col gap-4">
          <div
            v-if="dataEmployee"
            class="bg-white rounded-lg shadow-md p-3 flex gap-3 items-center"
          >
            <el-badge
              is-dot
              type="success"
            >
              <el-avatar
                size="large"
                :src="`${employeeImageCoverUrl}${dataEmployee.image}`"
                style="width: 38; height: 38"
              />
            </el-badge>
            <div class="flex-1 flex flex-col">
              <div class="flex-1 text-sm text-black capitalize font-semibold truncate">
                {{ dataEmployee && dataEmployee.name }}
                <AppCardCapsule :data="dataEmployee.status" class="ml-2" />
              </div>
              <div class="text-xs text-gray-500 capitalize truncate">
                {{ dataUser && dataUser.role_name }} | Shift 1
              </div>
            </div>
            <el-button size="medium" circle>
              <i class="fa fa-edit"></i>
            </el-button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div
              v-for="(employee, i) in listOfEmployee"
              :key="i"
              class="p-2 bg-white rounded-lg border border-gray-200"
            >
              <div class="flex-1 text-sm text-black capitalize font-semibold truncate">
                {{ employee.name }}
              </div>
              <div class="flex-1 text-xs text-gray-500 truncate">
                {{ employee.role }} | {{ employee.shift }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative flex-1 flex flex-col md:flex-row gap-4 bg-white rounded-xl shadow-md p-4">
      <div class="flex-1 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex-1 w-full flex items-center gap-4">
          <div style="width: 48px; height: 48px" class="flex items-center justify-center bg-vermillion-100 rounded-full">
            <i class="text-md fa fa-book-open text-vermillion-500"></i>
          </div>

          <div class="flex-1 w-full flex flex-col gap-1">
            <div class="flex items-center gap-2 justify-between md:justify-start">
              <div class="text-xs lg:text-sm text-gray-700 font-semibold truncate">
                Buku Kas
              </div>
              <i class="fa fa-external-link text-md text-gray-500 cursor-pointer"></i>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs md:text-md text-gray-500">Tanggal</span>
              <span class="text-xs md:text-md text-black font-semibold">24 November 2025</span>
            </div>
          </div>
        </div>

        <div class="flex-1 w-full md:w-auto flex md:justify-end gap-4">
          <div class="w-full md:w-auto grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-xl">
            <div class="flex-1 flex items-center gap-2">
              <i class="text-md text-green-500 fa fa-arrow-up"></i>
              <span class="text-md md:text-lg text-black font-semibold">Rp. 1.000.000</span>
            </div>
            <div class="flex-1 flex items-center gap-2">
              <i class="text-md text-red-500 fa fa-arrow-down"></i>
              <span class="text-md md:text-lg text-black font-semibold">Rp. 500.000</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="(statistic, i) in listOfStatistic"
        :key="i"
        class="relative flex-1 flex flex-col gap-2 bg-white rounded-xl shadow-md p-4"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="text-xs lg:text-sm text-gray-700 font-semibold truncate">
            {{ statistic.title }}
          </div>
          <i
            class="text-sm cursor-pointer"
            :class="[
              statistic.icon,
              statistic.color,
            ]"
          />
        </div>
        <div class="text-3xl lg:text-5xl text-black font-semibold">
          {{ statistic.value }}
        </div>
        <div class="flex items-center gap-1">
          <i
            class="text-xs"
            :class="{
              'fa fa-arrow-up': statistic.status === 'up',
              'fa fa-arrow-down': statistic.status === 'down',
              'text-green-500': statistic.status === 'up',
              'text-red-500': statistic.status === 'down',
            }"
          />
          <span class="text-xs text-gray-700 font-semibold">
            {{ statistic.percentage }}%
          </span>
          <span class="text-xs text-gray-500">
            Bulan Ini
          </span>
        </div>
      </div>
    </div>    
  </div>
</template>
<script>
import { mapState } from 'vuex'
import AppEmpty from '../../modules/AppEmpty'
import AppCardAvatar from '../../modules/AppCardAvatar'
import AppCardCircle from '../../modules/AppCardCircle'
import AppCardCapsule from '../../modules/AppCardCapsule'

export default {
  name: 'App',
  metaInfo: {
    title: 'Shop',
    titleTemplate: '%s | Home',
    htmlAttrs: {
      lang: 'en',
      amp: true,
    },
  },
  data() {
    return {
      listOfStatistic: [
        {
          title: 'Total Pesanan',
          value: 122,
          icon: 'fa fa-shopping-cart',
          color: 'text-blue-500',
          percentage: 15,
          status: 'down',
        },
        {
          title: 'Sedang Disiapkan',
          value: 24,
          icon: 'fa fa-clock',
          color: 'text-yellow-500',
          percentage: 10,
          status: 'up',
        },
        {
          title: 'Sudah Selesai',
          value: 55,
          icon: 'fa fa-check-circle',
          color: 'text-green-500',
          percentage: 5,
          status: 'up',
        },
        {
          title: 'Dibatalkan',
          value: 3,
          icon: 'fa fa-times-circle',
          color: 'text-red-500',
          percentage: 20,
          status: 'down',
        },
      ],
      listOfEmployee: [
        {
          name: 'Employee 1',
          image: 'https://via.placeholder.com/150',
          status: 'active',
          role: 'Cashier',
          shift: 'Shift 1',
        },
        {
          name: 'Employee 2',
          image: 'https://via.placeholder.com/150',
          status: 'inactive',
          role: 'Waiter',
          shift: 'Shift 2',
        },
      ]
    }
  },
  computed: {
    ...mapState({
      dataShop: (state) => state.storeSelectedShop.form,
      dataAuth: (state) => state.storeAuth.data,
    }),
    dataUser() {
      return this.dataAuth && this.dataAuth.user
        ? this.dataAuth.user
        : null
    },
    dataEmployee() {
      return this.dataAuth && this.dataAuth.employee
        ? this.dataAuth.employee
        : null
    },
  },
  components: {
    AppEmpty,
    AppCardAvatar,
    AppCardCircle,
    AppCardCapsule,
  },
}
</script>
