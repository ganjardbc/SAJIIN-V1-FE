<template>
    <div id="App" class="right-form-card bg-white-grey">
        <div class="right-form-header display-flex space-between align-center bg-white-grey">
            <h1 class="fonts small black bold">
                Keranjang
                <span v-if="orderQuantity">({{ orderQuantity }})</span>
            </h1>
            <button 
                class="btn btn-small btn-main-reverse with-border with-hover"
                :disabled="!isThereDetails"
                @click="deleteAllProduct">
                Hapus Semua
            </button>
        </div>
        <div class="right-form-body bg-white-grey" style="padding-top: 0;">
            <div class="width width-100 padding">
                <AppEmpty v-if="!isThereDetails" />
                <CardProduct :data.sync="details" />

                <div class="padding padding-bottom-15px margin margin-bottom-30px border-bottom"></div>

                <div class="card box-shadow bg-white">
                    <div class="field-group">
                        <div class="field-label">Pelanggan</div>
                        <el-input 
                            placeholder="Nama Pelanggan"
                            type="text"
                            :disabled="!isThereDetails"
                            v-model="form.customer_name"></el-input>
                    </div>

                    <div v-if="isThereDetails" class="margin margin-bottom-15px">
                        <FieldTable 
                            :value="form.table_id"
                            @onChange="onChangeTable"
                            @onClear="onClearTable"
                        />
                    </div>

                    <div v-if="isThereDetails" class="margin margin-bottom-15px">
                        <FieldPlatform 
                            :value="form.platform_id"
                            @onChange="onChangePlatform"
                            @onClear="onClearPlatform"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="right-form-footer bg-white-grey">
            <div class="card bg-white box-shadow margin margin-bottom-20px">
                <div class="display-flex space-between">
                    <div class="fonts fonts-10 semibold black">Total ({{ orderQuantity }} produk)</div>
                    <div class="fonts fonts-10 semibold main-color">{{ format(orderPrice) }}</div>
                </div>
                <div class="display-flex space-between">
                    <div class="fonts fonts-10 normal black">Diskon</div>
                    <div class="fonts fonts-10 normal black align-right">{{ format(0) }}</div>
                </div>
                <!-- HIDDEN TEMPORARY -->
                <!-- <div v-if="isThereDiscount" class="display-flex space-between">
                    <div class="fonts fonts-10 normal black">Diskon</div>
                    <div class="fonts fonts-10 normal black align-right">{{ format(totalDiscount) }}</div>
                </div> -->
            </div>

            <div class="width width-100 display-flex">
                <button 
                    class="btn btn-main btn-full"
                    :disabled="isButtonEnable"
                    @click="onCreateOrder">
                    Buat Pesanan
                </button>
                <div class="width width-20px"></div>
                <button 
                    class="btn btn-sekunder btn-full"
                    :disabled="isButtonEnable"
                    @click="onCheckOut">
                    Pembayaran
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppEmpty from '../../../../modules/AppEmpty'
import AppSideForm from '../../../../modules/AppSideForm'
import AppCardCollapse from '../../../../modules/AppCardCollapse'
import CardProduct from './CardProduct'
import FieldPlatform from '../../platforms/Field'
import FieldTable from '../../tables/Field'

export default {
    name: 'App',
    components: {
        AppEmpty,
        AppSideForm,
        AppCardCollapse,
        CardProduct,
        FieldPlatform,
        FieldTable
    },
    computed: {
        ...mapState({
            form: (state) => state.storeCashier.form.order,
            errorMessage: (state) => state.storeCashier.errorMessage,
            details: (state) => state.storeCashier.form.details,
            dataCurrent: (state) => state.storeCashBook.dataCurrent,
        }),
        formTable: {
            set(value) {
                this.$store.state.storeCashier.form.table = value 
            },
            get() {
                return this.$store.state.storeCashier.form.table
            }
        },
        formPlatform: {
            set(value) {
                this.$store.state.storeCashier.form.platform = value 
            },
            get() {
                return this.$store.state.storeCashier.form.platform
            }
        },
        orderQuantity () {
            let quantity = 0
            this.details && this.details.map((item) => {
                quantity += item.quantity
            })
            return quantity
        },
        orderPrice () {
            let price = 0
            this.details && this.details.map((item) => {
                let quantity = item.quantity
                price += quantity * item.price
            })
            return price
        },
        orderPriceBeforeDiscount () {
            let price = 0
            this.details && this.details.map((item) => {
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
            return this.orderPriceBeforeDiscount - this.orderPrice
        },
        isThereDiscount () {
            let status = false
            // HIDDEN TEMPORARY
            // this.details && this.details.map((item) => {
            //     if (item.is_discount) {
            //         status = true 
            //     }
            // })
            return status
        },
        isThereDetails () {
            return this.details.length > 0
        },
        isButtonEnable () {
            let status = false 
            if (this.details.length === 0) {
                status = true 
            }
            if (!this.form.customer_name) {
                status = true 
            }
            return status
        },
        getShopData () {
            return this.dataCurrent && this.dataCurrent.shop
        },
        getUserData () {
            return this.$cookies.get('user')
        },
    },
    methods: {
        ...mapActions({
            setOrder: 'storeCashier/setOrder',
            deleteAllProduct: 'storeCashier/deleteAllProduct',
            changePlatformProduct: 'storeCashier/changePlatformProduct'
        }),
        onCreateOrder () {
            const payload = {
                user: this.getUserData,
                shop: this.getShopData,
                total_item: this.orderQuantity,
                total_price: this.orderPrice
            }
            this.setOrder(payload)
            this.$emit('onCreateOrder')
        },
        onCheckOut () {
            const payload = {
                user: this.getUserData,
                shop: this.getShopData,
                total_item: this.orderQuantity,
                total_price: this.orderPrice
            }
            this.setOrder(payload)
            this.$emit('onCheckOut')
        },
        onClose () {
            this.$emit('onClose')
        },

        // TABLE 
        onChangeTable (data) {
            this.form.table_id = data.id 
            this.form.table_name = data.name 
            this.formTable = data 
        },
        onClearTable () {
            this.form.table_id = ''
            this.form.table_name = ''
            this.formTable = null
        },

        // PLATFORM
        onChangePlatform (data) {
            this.form.platform_id = data.id 
            this.form.platform_name = data.name 
            this.form.platform_fee = data.order_fee
            this.form.platform_type = data.order_type
            this.form.platform_image = data.image
            this.formPlatform = data 

            const payload = {
                platform_fee: this.form.platform_fee,
            }
            this.changePlatformProduct(payload)
        },
        onClearPlatform () {
            this.form.platform_id = ''
            this.form.platform_name = ''
            this.form.platform_fee = ''
            this.form.platform_type = ''
            this.form.platform_image = ''
            this.formPlatform = null 

            const payload = {
                platform_fee: this.form.platform_fee,
            }
            this.changePlatformProduct(payload)
        }
    }
}
</script>