<template>
    <div id="App">
        <AppSideForm 
            :title="'Pembayaran'" 
            :enableCustomFooter="true"
            :onClose="onClose">
            <div class="right-form-body">
                <div class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px">
                    <div class="display-flex space-between align-center padding padding-bottom-10px">
                        <div class="fonts fonts-11 semibold black">
                            Pembayaran
                        </div>
                        <AppCardCapsule 
                            :data="form.payment_status ? 'paid' : 'unpaid'" />
                    </div>
                    <div class="margin margin-bottom-15px">
                        <FieldPayment 
                            :value="form.payment_id"
                            @onChange="onChangePayment"
                            @onClear="onClearPayment"
                        />
                    </div>
                    <div class="display-flex space-between">
                        <div class="fonts fonts-10 semibold black">Total</div>
                        <div class="fonts fonts-10 semibold main-color">{{ format(orderPrice) }}</div>
                    </div>
                    <div class="padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"></div>
                    <div class="display-flex space-between">
                        <div class="fonts fonts-10 normal grey">Diskon</div>
                        <div class="fonts fonts-10 normal black">{{ format(0) }}</div>
                    </div>
                    <!-- HIDDEN TEMPORARY -->
                    <!-- <div v-if="isThereDiscount" class="padding padding-bottom-15px margin margin-bottom-15px border-bottom"></div>
                    <div v-if="isThereDiscount" class="display-flex space-between">
                        <div class="fonts fonts-10 normal grey">Discount</div>
                        <div class="fonts fonts-10 normal black">{{ format(totalDiscount) }}</div>
                    </div> -->
                </div>
                <div class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px">
                    <div class="fonts fonts-11 semibold black">
                        Tagihan
                    </div>
                    <div class="field-group">
                        <div class="field-label">Bayar</div>
                        <input-number
                            class="width width-100"
                            v-model="form.bills_price"
                            thousand-separated
                            :min="0"
                            placeholder="0"
                            @input="onChangeBills"
                            >
                            <template>Rp</template>
                        </input-number>
                        <div 
                            v-if="errorMessage.bills_price" 
                            class="field-error">
                            {{ errorMessage.bills_price && errorMessage.bills_price[0] }}
                        </div>
                    </div>
                    <div class="padding padding-bottom-5px">
                        <AppCardPriceSuggestion @onChange="onChangeBiilsSuggestion" />
                    </div>
                    <div class="padding padding-bottom-7px margin margin-bottom-15px border-bottom border-dashed"></div>
                    <div class="display-flex space-between">
                        <div class="fonts fonts-10 semibold black">Kembali</div>
                        <div class="fonts fonts-10 semibold main-color">{{ format(form.change_price) }}</div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <div class="right-form-footer">
                    <button 
                        class="btn btn-main btn-full"
                        :disabled="isButtonEnable"
                        @click="onCreateOrder">
                        Buat Pesanan
                    </button>
                </div>
            </div>
        </AppSideForm>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import AppEmpty from '../../../../modules/AppEmpty'
import AppSideForm from '../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppCardPriceSuggestion from '../../../../modules/AppCardPriceSuggestion'
import InputNumber from '../../../../modules/InputNumber'
import FieldPayment from '../../payments/Field'

export default {
    name: 'App',
    components: {
        AppEmpty,
        AppSideForm,
        AppCardCapsule,
        AppCardPriceSuggestion,
        InputNumber,
        FieldPayment,
    },
    computed: {
        ...mapState({
            form: (state) => state.storeCashier.form.order,
            details: (state) => state.storeCashier.form.details ,
            errorMessage: (state) => state.storeCashier.errorMessage
        }),
        formPayment: {
            set(value) {
                this.$store.state.storeCashier.form.payment = value 
            },
            get() {
                return this.$store.state.storeCashier.form.payment
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
        isButtonEnable () {
            let status = false 
            if (!this.form.payment_id) {
                status = true 
            }
            if (!this.form.bills_price) {
                status = true 
            }
            if (this.form.change_price < 0) {
                status = true 
            }
            return status
        },
    },
    methods: {
        ...mapActions({
            setOrder: 'storeCashier/setOrder',
            setOrderBills: 'storeCashier/setOrderBills'
        }),
        onCreateOrder () {
            this.$emit('onCreateOrder')
        },
        onClose () {
            this.$emit('onClose')
        },
        onChangeBiilsSuggestion (data) {
            this.form.bills_price = data 
            this.setOrderBills(data)
        },
        onChangeBills (data) {
            this.form.bills_price = data 
            this.setOrderBills(data)
        },

        // PAYMENT
        onChangePayment (data) {
            this.form.payment_id = data.id 
            this.form.payment_name = data.name 
            this.formPayment = data 
        },
        onClearPayment () {
            this.form.payment_id = ''
            this.form.payment_name = ''
            this.formPayment = null
        },
    }
}
</script>