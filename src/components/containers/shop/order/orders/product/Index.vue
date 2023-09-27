<template>
    <div id="App">
        <AppSideForm 
            :title="'Edit Produk'" 
            :subtitle="form.order_id"
            :enableCustomFooter="true"
            :onClose="onClose">
            <div slot="toolbar">
                <button 
                    class="btn btn-sekunder margin margin-right-10px"
                    @click="onOpenVisibleAddProduct">
                    Tambah
                </button>
            </div>
            <div class="width width-100 padding padding-bottom-15px">
                <AppEmpty v-if="form.details && form.details.length === 0" />
                <Card v-if="form.details" :data.sync="form.details" :form.sync="form" />
                <div class="padding padding-bottom-15px margin margin-bottom-30px border-bottom"></div>
                <div class="card box-shadow bg-white">
                    <div class="field-group">
                        <FieldPlatform
                            :value="form.platform_id"
                            @onChange="onChangePlatform"
                            @onClear="onClearPlatform" />
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="right-form-footer">
                    <div class="card bg-white box-shadow margin margin-bottom-20px">
                        <div class="display-flex space-between">
                            <div class="fonts fonts-10 semibold black">Total ({{ form.total_item }} produk)</div>
                            <div class="fonts fonts-10 semibold black">{{ format(form.total_price) }}</div>
                        </div>
                        <div class="display-flex space-between">
                            <div class="fonts fonts-10 normal black">Diskon</div>
                            <div class="fonts fonts-10 normal black align-right">{{ format(0) }}</div>
                        </div>
                        <!-- HIDDEN TEMPORARY -->
                        <!-- <div v-if="isThereDiscount" class="display-flex space-between">
                            <div class="fonts fonts-10 normal black">Discount</div>
                            <div class="fonts fonts-10 normal black align-right">{{ format(totalDiscount) }}</div>
                        </div> -->
                    </div>
                    <button 
                        class="btn btn-main btn-full" 
                        :disabled="form.details && form.details.length === 0"
                        @click="onSave">
                        Simpan Produk
                    </button>
                </div>
            </div>
        </AppSideForm>

        <AddProduct v-if="visibleAddProduct" @onClose="onCloseVisibleAddProduct" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AppSideForm from '../../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../../modules/AppCardCapsule'
import AppEmpty from '../../../../../modules/AppEmpty'
import AddProduct from './addProduct/Index'
import Card from './Card'
import FieldPlatform from '../../../platforms/Field'

export default {
    name: 'App',
    data () {
        return {
            visibleAddProduct: false 
        }
    },
    mounted () {
        this.selectedIndex = 0
    },
    watch: {
        formId () {
            this.selectedIndex = 0
        }
    },
    computed: {
        ...mapState({
            form: (state) => state.storeOrders.form,
            errorMessage: (state) => state.storeOrders.errorMessage,
            typeForm: (state) => state.storeOrders.typeForm,
            category: (state) => state.storeCategory.data,
        }),
        formId: {
            get () {
                return this.$store.state.storeOrders.form.id
            },
            set (value) {
                this.$store.state.storeOrders.form.id = value
            }
        },
        orderPriceBeforeDiscount () {
            let price = 0
            this.form && this.form.details && this.form.details.map((item) => {
                let quantity = item.quantity
                price += quantity * item.price
                // HIDDEN TEMPORARY
                // if (item.is_discount) {
                //     price += quantity * item.second_price
                // } else {
                //     price += quantity * item.price
                // }
            })
            return price
        },
        totalDiscount () {
            return this.orderPriceBeforeDiscount - this.form.total_price
        },
        isThereDiscount () {
            let status = false
            // HIDDEN TEMPORARY
            // this.form && this.form.details && this.form.details.map((item) => {
            //     if (item.is_discount) {
            //         status = true 
            //     }
            // })
            return status
        },
    },
    components: {
        AppCardCapsule,
        AppSideForm,
        AppEmpty,
        Card,
        AddProduct,
        FieldPlatform,
    },
    methods: {
        ...mapActions({
            changePlatformProduct: 'storeOrders/changePlatformProduct',
        }),
        isOrderStatusCanceled (data) {
            return data.status === 'canceled'
        },
        isButtonEditProductDisabled (data) {
            return data.status === 'new-order' || data.status === 'on-progress'
        },
        isButtonDoneDisabled (data) {
            return data.payment_status && data.status !== 'on-progress'
        },
        isOrderStatusDC (data) {
            return data.status === 'done' || data.status === 'canceled'
        },
        isActiveOrder (data) {
            let status = false
            if (data.status === 'new-order') status = true 
            if (data.status === 'on-progress') status = true 
            return status
        },
        onSave () {
            this.$emit('onSave')
        },
        onClose () {
            this.$emit('onClose')
        },
        onOpenVisibleAddProduct () {
            this.visibleAddProduct = true
        },
        onCloseVisibleAddProduct () {
            this.visibleAddProduct = false
        },

        // PLATFORM 
        onChangePlatform (data) {
            this.form.platform_id = data.id 
            this.form.platform_image = data.image 
            this.form.platform_name = data.name 
            this.form.platform_fee = data.order_fee
            this.form.platform_type = data.order_type
            this.form.platform = data

            const payload = {
                platform_fee: this.form.platform_fee,
            }
            this.changePlatformProduct(payload)
        },
        onClearPlatform () {
            this.form.platform_fee = ''
            this.form.platform_id = ''
            this.form.platform_image = ''
            this.form.platform_name = ''
            this.form.platform_type = ''
            this.form.platform = null

            const payload = {
                platform_fee: this.form.platform_fee,
            }
            this.changePlatformProduct(payload)
        },
    },
}
</script>