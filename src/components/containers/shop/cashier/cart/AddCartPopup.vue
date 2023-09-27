<template>
    <div id="AddCartPopup">
        <AppCardPopup title="Tambah ke Keranjang" @onClose="onClose">
            <div class="width width-100">
                <div class="field-group display-flex border-bottom" style="padding-top: 0;">
                    <div style="width: calc(100% - 77px);">
                        <div class="fonts fonts-11 semibold">{{ data.name }}</div>
                        <div class="fonts fonts-9 normal grey">
                            {{ detailSelected 
                                ? format(varianPrice(detailSelected))
                                : data.price 
                                    ? format(data.price) 
                                    : ''
                            }}
                        </div>
                    </div>
                    <div style="width: 60px; margin-left: 15px;">
                        <div class="image image-padding border-full">
                            <img 
                                v-if="data.image" 
                                :src="productImageThumbnailUrl + data.image" 
                                alt="" 
                                class="post-center">
                            <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                        </div>
                    </div>
                </div>

                <div 
                    v-if="data.details && data.details.length > 0 ? true : false" 
                    class="field-group"
                    style="padding-bottom: 0;">
                    <div class="display-flex align-center space-between">
                        <div class="field-label">Varian</div>
                        <div class="fonts fonts-10 black margin margin-bottom-8px">{{ data.details.length }} Item</div>
                    </div>
                    <ul class="menu-capsule">
                        <li 
                            v-for="(dt, index) in data.details" 
                            :key="index" 
                            :class="
                                data.status === 'active'
                                    ? dt.is_available 
                                        ? detailSelected === dt.id  
                                            ? 'enable' 
                                            : '' 
                                        : 'disable'
                                    : 'disable'
                            " 
                            @click="onChangeDetail(dt.id)">
                            <div class="row">
                                <div style="width: 25px;">
                                    <i class="icn fa fa-1x fa-box" />
                                </div>
                                <div>
                                    <div class="ttl">{{ dt.name }}</div>
                                    <div class="val">
                                        <span class="fonts fonts-10 black semibold">{{ format(dt.price) }}</span>
                                        <!-- HIDDEN TEMPORARY -->
                                        <!-- <span v-if="dt.is_discount" class="fonts fonts-9 grey normal text-line">{{ format(dt.second_price) }}</span> -->
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>

                <div class="field-group">
                    <div class="field-label">Jumlah</div>
                    <el-input-number 
                        v-model="form.quantity"
                        :min="0"
                        :max="100"
                        style="width: 100%;"></el-input-number>
                </div>

                <div class="field-group">
                    <div class="display-flex space-between margin margin-bottom-10px">
                        <div class="fonts fonts-10 semibold black">Total ({{ orderQuantity }} produk)</div>
                        <div class="fonts fonts-10 semibold main-color">{{ format(orderPrice) }}</div>
                    </div>
                    <button 
                        class="btn btn-full btn-main" 
                        :disabled="enableButtonAddProduct || !form.price"
                        @click="onAddProduct">
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>
        </AppCardPopup>
    </div>
</template>
<script>
import AppCardPopup from '../../../../modules/AppCardPopup'

export default {
    name: 'AddCartPopup',
    data () {
        return {
            detailSelected: null,
            form: {
                quantity: 0,
                price: 0,
                subtotal: 0,
                proddetail_id: '',
                product_id: '',
                product_image: '',
                product_name: '',
                product_detail: ''
            }
        }
    },
    mounted () {
        this.onChangeDetail(null)
    },
    props: {
        data: null 
    },
    components: {
        AppCardPopup
    },
    computed: {
        enableButtonAddProduct () {
            let status = false
            if (this.data.status === 'inactive') {
                status = true
            }
            if (this.form.quantity === 0) {
                status = true 
            }
            if (!this.form.price) {
                status = true 
            }
            return status
        },
        orderQuantity () {
            return this.form.quantity
        },
        orderPrice () {
            this.form.subtotal = this.form.quantity * this.form.price
            return this.form.subtotal
        }
    },
    methods: {
        varianPrice (data) {
            const varian = this.data.details.find((item) => item.id === data)
            return varian ? varian.price : 0
        },
        onChangeDetail (index) {
            const product = this.data

            if (this.detailSelected === index) {
                this.detailSelected = null 
                this.form.proddetail_id = null 
                this.form.product_detail = null

                if (product.price  ) {
                    this.form.price = product.price 
                } else {
                    this.form.price = null 
                }
            } else {
                const detail = this.data.details.find((item) => item.id === index)
                const detailId = detail ? detail.id : null 
                const detailName = detail ? detail.name : null 
                const detailPrice = detail ? detail.price : null 

                this.detailSelected = index
                this.form.proddetail_id = detailId
                this.form.product_detail = detailName

                if (index) {
                    this.form.price = detailPrice 
                } else {
                    this.form.price = product.price  
                }
            }

            this.form.product_id = product && product.id
            this.form.product_image = product && product.image
            this.form.product_name = product && product.name
            this.form.quantity = 0
        },
        onClose () {
            this.$emit('onClose')
        },
        onAddProduct () {
            const payload = {
                ...this.data,
                quantity: this.form.quantity,
                price: this.form.price,
                subtotal: this.form.subtotal,
                proddetail_id: this.form.proddetail_id,
                product_id: this.form.product_id,
                product_image: this.form.product_image,
                product_name: this.form.product_name,
                product_detail: this.form.product_detail,
            }
            this.$emit('onAddProduct', payload)
        }
    }
}
</script>