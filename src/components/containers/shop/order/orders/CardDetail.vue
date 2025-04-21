<template>
  <div class="flex flex-col gap-4">
    <div
      v-for="(detail, index) in data"
      :key="index"
      class="w-full p-4 bg-white rounded-lg border border-gray-200 flex flex-col gap-2"
    >
      <div class="flex justify-between items-center gap-4">
        <AppCardAvatar
          :src="productImageThumbnailUrl + detail.product_image"
          :is-upload="false"
          size="xsmall"
        />
        <div class="flex-1 flex justify-between items-center gap-4">
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
          </div>
          <AppCardCapsule :data="detail.status" />
        </div>
      </div>

      <div class="w-full flex flex-col gap-2">
        <div v-if="detail.note" class="flex justify-between items-center">
          <div class="text text-sm text-black">Catatan</div>
          <div class="text text-sm font-semibold text-black text-right">
            {{ detail.note }}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div class="text text-sm text-black">Harga</div>
          <div class="flex items-center gap-2">
            <span
              v-if="detail.is_discount"
              class="text text-sm font-semibold text-black text-right"
              >{{ format(detail.second_price) }}</span
            >
            <span
              class="text text-sm font-semibold text-black text-right"
              >{{ format(detail.price) }}</span
            >
          </div>
        </div>
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
        <div class="flex justify-between items-center">
          <div class="text text-sm text-black">Jumlah</div>
          <div class="text text-sm font-semibold text-black text-right">
            {{ detail.quantity }} x
          </div>
        </div>
        <div class="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
          <div class="text text-sm text-black">Total</div>
          <div class="text text-sm font-semibold text-vermillion-500 text-right">
            {{ format(detail.subtotal) }}
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
    data: null,
  },
  components: {
    AppCardCapsule,
    AppCardAvatar,
    AppCardIcon,
  },
}
</script>
