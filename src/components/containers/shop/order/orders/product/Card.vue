<template>
    <div id="App">
        <div v-for="(dt, index) in data" :key="index" class="margin margin-top-15px margin-bottom-15px">
            <div class="card bg-white box-shadow">
                <div class="display-flex">
                    <div class="width width-50px">
                        <div class="image image-40px border-full">
                            <img 
                                v-if="dt.product_image"
                                :src="productImageThumbnailUrl + dt.product_image" 
                                alt=""
                                class="post-center" 
                                style="width: 100%;">
                            <i v-else class="post-middle-absolute icn fa fa-lw fa-image"></i>
                        </div>
                    </div>
                    <div style="width: calc(100% - 50px);">
                        <div class="width width-100">
                            <div class="fonts fonts-10 black semibold">{{ dt.product_name }}</div>
                            <div v-if="dt.product_detail" class="fonts fonts-9 black display-flex align-center padding padding-left-5px">
                                <i class="fonts fonts-2 fa fa-lw fa-circle margin margin-right-5px"></i>
                                {{ dt.product_detail }}
                            </div>
                        </div>
                        <div class="post-top-right-absolute" style="top: 15px; right: 15px;">
                            <AppCardCapsule :data="dt.status" />
                        </div>
                    </div>
                </div>
                <div class="display-flex space-between margin margin-top-10px">
                    <div class="display-flex align-center">
                        <span class="fonts fonts-10 semibold black">{{ format(dt.price) }}</span>
                        <span 
                            v-if="dt.is_discount || dt.is_platform" 
                            class="fonts fonts-9 grey text-line margin margin-left-5px">{{ format(dt.second_price) }}</span>
                    </div>
                    <div class="fonts fonts-10 semibold red align-right">{{ format(dt.subtotal) }}</div>
                </div>
                <div v-if="dt.is_discount" class="display-flex align-center space-between margin margin-top-5px margin-bottom-5px">
                    <div class="image image-20px border-full">
                        <img v-if="dt.discount_image" :src="discountImageThumbnailUrl + dt.discount_image" alt="" class="post-center">
                        <i v-else class="post-middle-absolute fonts fonts-6 icn fa fa-lw fa-percentage"></i>
                    </div>
                    <div style="width: calc(100% - 25px);" class="display-flex space-between margin margin-left-5px">
                        <div class="fonts fonts-9 normal grey">Diskon</div>
                        <div class="fonts fonts-9 normal grey align-right">{{ format(dt.discount_price) }}</div>
                    </div>
                </div>
                <div v-if="dt.is_platform" class="display-flex align-center space-between margin margin-top-5px margin-bottom-5px">
                    <div class="image image-20px border-full">
                        <img v-if="dt.platform_image" :src="platformImageThumbnailUrl + dt.platform_image" alt="" class="post-center">
                        <i v-else class="post-middle-absolute fonts fonts-6 icn fa fa-lw fa-flag"></i>
                    </div>
                    <div style="width: calc(100% - 25px);" class="display-flex space-between margin margin-left-5px">
                        <div class="fonts fonts-9 normal grey">Platform</div>
                        <div class="fonts fonts-9 normal grey align-right">
                            {{ format(dt.platform_price) }}
                        </div>
                    </div>
                </div>
                <div class="display-flex space-between display-mobile">
                    <div class="width width-200px width-mobile display-flex margin margin-top-10px">
                        <button 
                            :class="`btn btn-icon btn-sekunder`" 
                            style="margin-right: 5px;"
                            @click="onDelete(index)">
                            <i class="far fa-lw fa-trash-alt"></i>
                        </button>
                        <div style="width: calc(100% - 45px);">
                            <el-input 
                                placeholder="Tulis catatan"
                                type="text"
                                v-model="dt.note"></el-input>
                        </div>
                    </div>
                    <div class="width width-130px width-mobile margin margin-top-10px">
                        <el-input-number 
                            v-model="dt.quantity"
                            @change="(data) => onTotal(data, index)" 
                            :min="1"
                            :max="100"
                            style="width: 100%;"></el-input-number>
                    </div>
                </div>
                <div class="width width-100 margin margin-top-10px">
                    <FieldDiscount 
                        :value="dt.discount_id"
                        :smallField="true"
                        :disabledSelection="true"
                        label="Diskon Produk"
                        discountType="product"
                        @onChange="(data) => onChangeDiscount(data, dt)"
                        @onClear="onClearDiscount(dt)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'
import FieldDiscount from '../../../discounts/Field'

export default {
    name: 'App',
    props: {
        data: null,
        form: null,
    },
    components: {
        AppCardCapsule,
        FieldDiscount,
    },
    methods: {
        ...mapActions({
            deleteProduct: 'storeOrders/deleteProduct',
            changeQuantityProduct: 'storeOrders/changeQuantityProduct',
            changeDiscountProduct: 'storeOrders/changeDiscountProduct',
        }),
        onTotal (value, index) {
            const payload = {
                quantity: value,
                index: index
            }
            if (value !== 0) {
                this.changeQuantityProduct(payload)
            } else {
                this.deleteProduct(index)
            }
        },
        onDelete (index) {
            this.deleteProduct(index)
        },
        onChangeDiscount (discount, product) {
            const payload = {
                current_calculation: 'discount',
                current_status: 'create',
                current_type: discount.discount_type,
                current_value: discount.discount_value,
                discount_id: discount.id,
                discount_image: discount.discount_image,
                discount_name: discount.discount_name,
                discount_description: discount.discount_description,
                discount_value: discount.discount_value,
                discount_type: discount.discount_type,
                discount_value_type: discount.discount_value_type,
                product_id: product.product_id,
                proddetail_id: product.proddetail_id,
            }
            this.changeDiscountProduct(payload)
        },
        onClearDiscount (product) {
            const payload = {
                current_calculation: 'discount',
                current_status: 'clear',
                current_type: product.discount_type,
                current_value: product.discount_value,
                discount_id: '',
                discount_image: '',
                discount_name: '',
                discount_description: '',
                discount_value: '',
                discount_type: '',
                discount_value_type: '',
                product_id: product.product_id,
                proddetail_id: product.proddetail_id,
            }
            this.changeDiscountProduct(payload)
        }
    }
}
</script>