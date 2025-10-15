<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="(detail, index) in filteredData"
      :key="index"
      class="w-full p-4 bg-white rounded-lg border border-gray-200 flex flex-col gap-2"
    >
      <div class="flex justify-between gap-4">
        <AppCardAvatar
          :src="productImageThumbnailUrl + detail.product_image"
          :is-upload="false"
          size="small"
        />

        <div class="flex-1 flex flex-col">
          <div class="text-sm text-black font-semibold">
            {{ detail.product_name }}
          </div>

          <div
            v-if="detail.product_detail"
            class="text-xs text-gray-500"
          >
            {{ detail.product_detail }}
          </div>

          <div v-if="detail.note" class="flex justify-between items-center">
            <div class="text text-xs text-black">
              Catatan
            </div>
            <div class="text text-xs font-semibold text-black text-right">
              {{ detail.note }}
            </div>
          </div>

          <div class="flex justify-between items-center">
            <div class="text text-xs text-black">
              {{ detail.quantity }} x
            </div>
            <div class="text text-xs font-semibold text-vermillion-500 text-right">
              {{ format(detail.subtotal) }}
            </div>
          </div>

          <div
            v-if="detail.is_discount || detail.is_platform"
            class="flex-1 flex flex-col gap-1"
          >
            <div
              v-if="detail.is_discount"
              class="flex items-center justify-between gap-2"
            >
              <AppCardAvatar 
                v-if="detail.discount_image"
                :src="discountImageThumbnailUrl + detail.discount_image"
                :is-upload="false"
                size="xxsmall"
                shape="circle"
              />
              <AppCardIcon
                v-else
                size="xxsmall"
                icon="fa-percentage"
                color="text-red-500"
                shape="circle"
              />
              <div
                class="flex-1 flex items-center justify-between gap-2"
              >
                <div class="text-xs text-black">
                  {{ detail.discount_name }}
                </div>
                <div class="text-xs text-gray-500 text-right font-semibold">
                  -{{
                    detail.discount_value_type === 'percentage'
                      ? `${detail.discount_fee}%`
                      : format(detail.discount_price)
                  }}
                </div>
              </div>
            </div>

            <div
              v-if="detail.is_platform"
              class="flex items-center justify-between gap-2"
            >
              <AppCardAvatar 
                v-if="detail.platform_image"
                :src="discountImageThumbnailUrl + detail.platform_image"
                :is-upload="false"
                size="xxsmall"
                shape="circle"
              />
              <AppCardIcon
                v-else
                size="xxsmall"
                icon="fa-flag"
                color="text-green-500"
                shape="circle"
              />
              <div
                class="flex-1 flex items-center justify-between gap-2"
              >
                <div class="text-xs text-black">
                  {{ detail.platform_name }}
                </div>
                <div class="text-xs text-gray-500 text-right font-semibold">
                  +{{
                    detail.platform_currency_type === 'percentage'
                      ? `${detail.platform_fee}%`
                      : format(detail.platform_price)
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardAvatar from '../../../../modules/AppCardAvatar'
import AppCardIcon from '../../../../modules/AppCardIcon'

export default {
  name: 'App',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    max: {
      type: Number,
      default: 0,
    },
  },
  components: {
    AppCardCapsule,
    AppCardAvatar,
    AppCardIcon,
  },
  computed: {
    filteredData() {
      if (this.max > 0) {
        return this.data.slice(0, this.max)
      }

      return this.data
    },
  }
}
</script>
