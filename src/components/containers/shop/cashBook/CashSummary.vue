<template>
  <div class="flex flex-col gap-4">
    <div class="w-full flex justify-between items-center">
      <div class="flex-1 flex-col gap-1">
        <div class="text-xs text-gray-500">Kas Summary</div>
        <div class="flex items-center gap-2">
          <div class="text-sm text-vermillion-500 font-semibold">
            {{ format(cashSummary) }}
          </div>
          <el-popover placement="bottom" width="180" trigger="click">
            <div class="w-full flex flex-col gap-2">
              <div class="w-full text-sm text-black font-semibold">Kas Summary</div>
              <div class="flex gap-2">
                <i class="text-sm text-green-500 fa fa-info-circle" />
                <div class="flex-1">
                  <div class="text-xs text-gray-500">Modal</div>
                  <div class="w-full text-sm text-black font-semibold">
                    {{ format(cashModal || 0) }}
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <i class="text-sm text-green-500 fa fa-info-circle" />
                <div class="flex-1">
                  <div class="text-xs text-gray-500">Keuntungan</div>
                  <div class="w-full text-sm text-black font-semibold">
                    {{ format(cashProfit || 0) }}
                  </div>
                </div>
              </div>
            </div>
            <i
              slot="reference"
              class="cursor-pointer text-sm text-gray-700 fa fa-lg fa-info-circle"
            ></i>
          </el-popover>
        </div>
      </div>

      <div class="px-4">
        <i class="text-sm text-black fa fa-equals" />
      </div>

      <div class="flex-1 flex-col justify-end gap-1">
        <div class="text-xs text-gray-500 text-right">Kas Aktual</div>
        <div class="text-sm text-black font-semibold text-right">
          {{ format(cashActual) }}
        </div>
      </div>
    </div>

    <el-alert
      v-if="enableCashWarning && cashSummary > cashActual"
      title="Kas Aktual Tidak Sama dengan Kas Summary !"
      description="Sepertinya Kas Summary dan kas aktual tidak sama, mohon cek kembali kas yang ada."
      type="error"
      :closable="true"
      show-icon
    />

    <div class="p-2 border border-gray-200 rounded-lg bg-white flex items-center justify-between">
      <div class="flex-1 flex justify-center">
        <div class="flex flex-col items-center gap-1">
          <div class="flex items-center gap-2">
            <i class="text-xs text-green-500 fa fa-arrow-up" />
            <div class="text-xs text-gray-500">Kas Masuk</div>
          </div>
          <div class="flex items-center gap-2">
            <div class="text-sm text-black font-semibold">
              {{ format(cashIn) }}
            </div>
            <el-popover
              v-if="cashDetail"
              placement="bottom"
              width="180"
              trigger="click"
            >
              <div class="w-full flex flex-col gap-2">
                <div class="w-full text-sm text-black font-semibold">
                  Kas Masuk
                </div>
                <div
                  v-for="(item, i) in cashDetail"
                  :key="i"
                  class="flex gap-2"
                >
                  <div
                    class="border border-gray-200 rounded-md overflow-hidden"
                    style="width: 22px; height: 22px"
                  >
                    <img
                      :src="
                        item.image
                          ? paymentImageThumbnailUrl + item.image
                          : ''
                      "
                      alt=""
                      class="w-full h-full"
                    />
                  </div>
                  <div class="flex-1 flex flex-col">
                    <div class="text-xs text-gray-500">
                      {{ item.name }}
                    </div>
                    <div class="text-sm text-black font-semibold">
                      {{ format(item.cash_in) }}
                    </div>
                  </div>
                </div>
              </div>
              <i
                slot="reference"
                class="cursor-pointer text-sm text-gray-700 fa fa-lg fa-info-circle"
              ></i>
            </el-popover>
          </div>
        </div>
      </div>

      <div class="h-16 border-l border-gray-200"></div>

      <div class="flex-1 flex justify-center">
        <div class="flex flex-col items-center gap-1">
          <div class="flex items-center gap-2">
            <i class="text-xs text-red-500 fa fa-arrow-down" />
            <div class="text-xs text-gray-500">Kas Keluar</div>
          </div>
          <div class="flex items-center gap-2">
            <div class="text-sm text-black font-semibold">
              {{ format(cashOut) }}
            </div>
            <el-popover
              v-if="cashDetail"
              placement="bottom"
              width="180"
              trigger="click"
            >
              <div class="w-full flex flex-col gap-2">
                <div class="w-full text-sm text-black font-semibold">
                  Kas Keluar
                </div>
                <div
                  v-for="(item, i) in cashDetail"
                  :key="i"
                  class="flex gap-2"
                >
                  <div
                    class="border border-gray-200 rounded-md overflow-hidden"
                    style="width: 22px; height: 22px"
                  >
                    <img
                      :src="
                        item.image
                          ? paymentImageThumbnailUrl + item.image
                          : ''
                      "
                      alt=""
                      class="w-full h-full"
                    />
                  </div>
                  <div class="flex-1 flex flex-col">
                    <div class="text-xs text-gray-500">
                      {{ item.name }}
                    </div>
                    <div class="text-sm text-black font-semibold">
                      {{ format(item.cash_out) }}
                    </div>
                  </div>
                </div>
              </div>
              <i
                slot="reference"
                class="cursor-pointer text-sm text-gray-700 fa fa-lg fa-info-circle"
              ></i>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CloseCashbook',
  props: {
    cashSummary: {
      required: true,
    },
    cashModal: {
      required: true,
    },
    cashProfit: {
      required: true,
    },
    cashActual: {
      required: true,
    },
    cashIn: {
      required: true,
    },
    cashOut: {
      required: true,
    },
    cashDetail: {
      required: true,
      default: () => [],
    },
    enableCashWarning: {
      type: Boolean,
      default: false,
    },
  }
}
</script>