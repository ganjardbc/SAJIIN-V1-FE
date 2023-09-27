<template>
    <div id="App" class="display-flex wrap">
        <div v-for="(item, i) in data" :key="i" class="column-3 mobile-column">
            <div class="margin margin-15px margin-mobile-left-none margin-mobile-right-none">
                <div class="card bg-white box-shadow">
                    <div class="display-flex">
                        <div class="width width-85px">
                            <div class="image image-70px border-full">
                                <img 
                                    v-if="item.image" 
                                    :src="productImageThumbnailUrl + item.image" 
                                    alt="" 
                                    class="post-center">
                                <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                            </div>
                        </div>
                        <div style="width: calc(100% - 85px)">
                            <div class="fonts fonts-11 semibold margin margin-bottom-5px">{{ item.name }}</div>
                            <div class="fonts fonts-10 grey">{{ format(item.price) }}</div>
                            <div v-if="item.details" class="fonts fonts-10 grey">{{ item.details.length }} Varian</div>
                        </div>
                    </div>

                    <div class="width width-100 padding padding-top-15px">
                        <button 
                            class="btn btn-main-reverse with-border with-hover btn-full"
                            :disabled="isButtonEnable(item)"
                            @click="openPopupCart(item)">
                            <i class="icn icn-left fa fa-lw fa-cart-plus"></i> Tambah ke Keranjang
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <AddCartPopup 
            v-if="visiblePopup" 
            :data.sync="selectedData" 
            @onClose="closePopupCart"
            @onAddProduct="onAddProduct" />
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import AddCartPopup from '../cart/AddCartPopup'
import AppCardCollapse from '../../../../modules/AppCardCollapse'

export default {
    name: 'App',
    data () {
        return {
            visiblePopup: false,
            selectedData: null,
        }
    },
    components: {
        AddCartPopup,
        AppCardCollapse
    },
    props: {
        data: null 
    },
    computed: {
        detailProduct () {
            return this.selectedData.details.map((item) => {
                let firstPrice = item.price
                let secondPrice = 0
                // if (item.is_discount) {
                //     secondPrice = item.price 
                //     firstPrice = item.price - (item.price * (item.value_discount / 100))
                // }
                return {
                    ...item,
                    price: firstPrice,
                    second_price: secondPrice,
                }
            })
        }
    },
    methods: {
        ...mapActions({
            addProduct: 'storeCashier/addProduct'
        }),
        isButtonEnable (data) {
            let status = false 
            if (data.status === 'inactive') {
                status = true
            } else {
                if (data.price) {
                    status = false 
                } else {
                    status = true
                }
            }
            return status
        },
        openPopupCart (value) {
            this.selectedData = value 
            this.visiblePopup = true 
        },
        closePopupCart () {
            this.selectedData = null 
            this.visiblePopup = false
        },
        onAddProduct (value) {
            const varian = this.detailProduct.find((item) => item.id === value.proddetail_id)
            const payload = {
                ...value,
                varian: varian
            }
            this.addProduct(payload)
            this.closePopupCart()
            this.$message(`${value.name} berhasil ditambahkan.`)
        },
    }
}
</script>