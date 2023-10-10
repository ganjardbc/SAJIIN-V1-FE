<template>
    <div id="App">
        <AppSideForm 
            :title="'Detail Pesanan'"
            :subtitle="form.order_id"
            :enableCustomFooter="true"
            :onClose="onClose">
            <div v-if="isActiveOrder(form)" slot="toolbar">
                <button 
                    class="btn btn-sekunder margin margin-right-10px"
                    @click="onChangeStatus(form, 'canceled')">
                    Cancel
                </button>
            </div>

            <div class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px">
                <div class="display-flex">
                    <div style="width: calc(100% - 75px);">
                        <div class="fonts fonts-11 semibold" style="margin-bottom: 10px;">{{ form.shop_name ? form.shop_name : '-' }}</div>
                        <div class="margin margin-bottom-15px">
                            <div class="fonts fonts-10 grey">
                                ID Pesanan
                            </div>
                            <div class="fonts fonts-10 semibold black">
                                {{ form.order_id }}
                            </div>
                        </div>
                        <div class="margin margin-bottom-15px">
                            <div class="fonts fonts-10 grey">
                                Status Pesanan
                            </div>
                            <div class="display-flex padding padding-top-10px">
                                <AppCardCapsule :data="form.status" />
                            </div>
                        </div>
                        <div class="margin margin-bottom-15px">
                            <div class="fonts fonts-10 grey">
                                Tgl Pesanan
                            </div>
                            <div class="fonts fonts-10 black semibold">
                                {{ form.created_at | moment("dddd, DD MMM YYYY") }}
                            </div>
                        </div>
                        <div 
                            v-if="form.cashbook"
                            class="margin margin-bottom-15px">
                            <div class="fonts fonts-10 grey">
                                Buku Kas
                            </div>
                            <div class="fonts fonts-10 black semibold">
                                {{ form.cashbook && form.cashbook.cash_date | moment("dddd, DD MMM YYYY") }}
                            </div>
                        </div>
                        <div class="margin margin-bottom-15px">
                            <div class="fonts fonts-10 grey">
                                Kasir
                            </div>
                            <div class="fonts fonts-10 black semibold">
                                {{ form.cashier_name || '-' }}
                            </div>
                        </div>
                        <div class="margin margin-bottom-15px">
                            <div class="fonts fonts-10 grey">
                                Pelanggan
                            </div>
                            <div class="fonts fonts-10 semibold black">
                                {{ form.customer_name || '-' }}
                            </div>
                        </div>
                        <div 
                            class="margin margin-bottom-0">
                            <div class="fonts fonts-10 grey">
                                Meja
                            </div>
                            <div class="fonts fonts-10 semibold black">
                                {{ form.table_name || '-' }}
                            </div>
                        </div>
                    </div>
                    <div style="width: 75px;">
                        <div class="image image-padding image-radius border-full">
                            <img v-if="form.shop_image" :src="shopImageThumbnailUrl + form.shop_image" alt="">
                            <i v-else class="post-middle-absolute fa fa-lg fa-store" />
                        </div>
                    </div>
                </div>

                <div class="padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"></div>

                <div>
                    <div class="fonts fonts-9 grey normal margin margin-bottom-10px">
                        Kami masih bisa merubah data pesanan selama status pesanan adalah "Pesanan Baru" atau "Diproses".
                    </div>
                    <button 
                        class="btn btn-sekunder btn-full" 
                        :disabled="!isButtonCustomerDisabled(form)"
                        @click="onCustomer(form)">
                        Edit Pesanan
                    </button>
                </div>
            </div>

            <div class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px">
                <div class="display-flex space-between align-center margin margin-bottom-5px">
                    <div class="fonts fonts-11 semibold black">Produk</div>
                    <AppCardProgressProduct :data="form.details" />
                </div>
                <div class="display-flex space-between margin margin-bottom-10px">
                    <div class="width width-70">
                        <div class="fonts fonts-10 grey">Produk</div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-10 grey">Harga</div>
                    </div>
                </div>

                <div 
                    v-for="(dt, index) in form.details" 
                    :key="index" 
                    class="width width-100 margin margin-bottom-18px">
                    <div class="display-flex space-between margin margin-bottom-5px">
                        <div class="width width-70 display-flex">
                            <div class="width width-40px margin margin-right-15px">
                                <div class="image image-padding border-full">
                                    <img v-if="dt.product_image" :src="productImageThumbnailUrl + dt.product_image" alt="" class="post-center">
                                    <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                                </div>
                            </div>
                            <div style="width: calc(100% - 60px);">
                                <div class="fonts fonts-10 semibold black">
                                    {{ dt.product_name }}
                                    <span v-if="dt.product_detail" class="fonts fonts-10 normal black"> - {{ dt.product_detail }}</span>
                                </div>
                                <div class="fonts fonts-9 grey">
                                    {{ dt.quantity }} x {{ format(dt.price) }}
                                    <!-- HIDDEN TEMPORARY -->
                                    <!-- <span v-if="dt.is_discount" class="fonts fonts-9 grey text-line">{{ format(dt.second_price) }}</span> -->
                                </div>
                                <div v-if="dt.note" class="fonts fonts-9 grey">
                                    {{ dt.note }}
                                </div>
                                <AppCardCapsule class="margin margin-top-8px" :data="dt.status" />
                            </div>
                        </div>
                        <div class="width width-30">
                            <div class="fonts fonts-10 semibold black">{{ format(dt.subtotal) }}</div>
                        </div>
                    </div>
                </div>

                <div class="margin margin-bottom-15px border-bottom border-dashed"></div>

                <div class="display-flex space-between margin margin-bottom-5px">
                    <div class="width width-70">
                        <div class="fonts fonts-10 semibold black">Total ({{ form.total_item }} produk)</div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-10 semibold black">{{ format(form.total_price) }}</div>
                    </div>
                </div>

                <div class="display-flex space-between">
                    <div class="width width-70">
                        <div class="fonts fonts-10 normal black">Diskon</div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-10 normal black">{{ format(0) }}</div>
                    </div>
                </div>

                <div  class="padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"></div>

                <div class="display-flex space-between">
                    <div class="width width-70">
                        <div class="fonts fonts-10 normal black">Platform</div>
                    </div>
                    <div class="width width-30">
                        <div v-if="form.platform_id" class="display-flex align-center">
                            <div class="image image-20px border-full">
                                <img v-if="form.platform_image" :src="platformImageThumbnailUrl + form.platform_image" alt="" class="post-center">
                                <i v-else class="post-middle-absolute icn fa fa-lw fa-image"></i>
                            </div>
                            <div class="fonts fonts-10 semibold black margin margin-left-5px">
                                {{ form.platform_name }}
                            </div>
                        </div>
                        <div v-else class="fonts fonts-10 semibold black">-</div>
                    </div>
                </div>

                <div class="padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"></div>

                <!-- HIDDEN TEMPORARY -->

                <!-- <div v-if="form.is_discount" class="display-flex space-between">
                    <div class="width width-70">
                        <div class="fonts fonts-10 normal black">Discount</div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-10 normal black">{{ format(form.total_discount) }}</div>
                    </div>
                </div>

                <div v-if="form.is_discount" class="padding padding-bottom-15px margin margin-bottom-15px border-bottom"></div> -->

                <div>
                    <div class="fonts fonts-9 grey normal margin margin-bottom-10px">
                        Kamu masih bisa merubah data produk selama status pesanan adalah "Pesanan Baru / Diproses" dan status pembayaran adalah "Belum Bayar".
                    </div>
                    <button 
                        class="btn btn-sekunder btn-full" 
                        :disabled="!isButtonEditDisabled(form)"
                        @click="onProduct(form)">
                        Edit Produk
                    </button>
                </div>
            </div>

            <div class="card bg-white box-shadow margin margin-bottom-15px margin-top-15px">
                <div class="fonts fonts-11 semibold black">Pembayaran</div>
                <div class="display-flex space-between align-center margin margin-bottom-10px">
                    <div class="width width-70">
                        <div class="fonts fonts-10 black">Status</div>
                    </div>
                    <div class="width width-30 display-flex">
                        <AppCardCapsule :data="form.payment_status ? 'paid' : 'unpaid'" />
                    </div>
                </div>
                <div class="display-flex space-between align-center margin margin-bottom-15px">
                    <div class="width width-70">
                        <div class="fonts fonts-10 black">Metode</div>
                    </div>
                    <div class="width width-30">
                        <div v-if="form.payment_id" class="display-flex align-center">
                            <div class="image image-20px border-full">
                                <img 
                                    v-if="form.payment && form.payment.image" 
                                    :src="paymentImageThumbnailUrl + (form.payment && form.payment.image)" 
                                    alt="" 
                                    class="post-center">
                                <i v-else class="post-middle-absolute icn fa fa-lw fa-image"></i>
                            </div>
                            <div class="fonts fonts-10 semibold black margin margin-left-5px">
                                {{ form.payment_name }}
                            </div>
                        </div>
                        <div v-else class="fonts fonts-10 semibold black">-</div>
                    </div>
                </div>

                <div class="fonts fonts-11 semibold black">Tagihan</div>
                <div class="display-flex space-between">
                    <div class="width width-70">
                        <div class="fonts fonts-10 black">Bayar</div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-10 black semibold">{{ format(form.bills_price) }}</div>
                    </div>
                </div>
                <div class="display-flex space-between">
                    <div class="width width-70">
                        <div class="fonts fonts-10 black">Kembali</div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-10 black semibold">{{ format(form.change_price) }}</div>
                    </div>
                </div>

                <div v-if="form.status === 'on-progress' && !form.payment_status">
                    <div class="padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"></div>

                    <div class="fonts fonts-9 grey normal margin margin-bottom-10px">
                        Kamu bisa melakukan pembayaran untuk pesanan ini.
                    </div>
                    <button 
                        class="btn btn-sekunder btn-full" 
                        @click="onCheckout(form)">
                        Lakukan Pembayaran
                    </button>
                </div>

                <div v-if="form.status !== 'canceled' && form.payment_status">
                    <div class="padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"></div>

                    <div class="fonts fonts-9 grey normal margin margin-bottom-10px">
                        Kamu bisa download/print nota untuk pesanan ini.
                    </div>
                    <button 
                        class="btn btn-sekunder btn-full" 
                        @click="onReceipt(form)">
                        Nota Pesanan
                    </button>
                </div>
            </div>

            <div slot="footer">
                <div class="right-form-footer display-flex space-between">
                    <div v-if="form.status !== 'canceled' && form.payment_status" style="width: calc(50% - 7.5px);">
                        <button 
                            class="btn btn-full btn-sekunder"
                            @click="onReceipt(form)">
                            Nota Pesanan
                        </button>
                    </div>

                    <div v-if="form.status === 'on-progress' && !form.payment_status" style="width: calc(50% - 7.5px);">
                        <button 
                            class="btn btn-full btn-sekunder"
                            @click="onCheckout(form)">
                            Lakukan Pembayaran
                        </button>
                    </div>

                    <div v-if="form.status === 'on-progress' || form.status === 'done'" style="width: calc(50% - 7.5px);">
                        <button 
                            :disabled="isButtonDoneDisabled(form)"
                            class="btn btn-full btn-green"
                            @click="onChangeStatus(form, 'done')">
                            Tandai Selesai
                        </button>
                    </div>

                    <div v-if="form.status === 'new-order'" class="width width-100">
                        <button 
                            class="btn btn-full btn-sekunder"
                            @click="onChangeStatus(form, 'on-progress')">
                            Ambil Pesanan
                        </button>
                    </div>

                    <div v-if="form.status === 'canceled'" class="width width-100">
                        <button 
                            class="btn btn-full btn-sekunder btn-full" 
                            @click="onChangeStatus(form, 'new-order')">
                            Re-open Pesanan
                        </button>
                    </div>
                </div>
            </div>
        </AppSideForm>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import AppSideForm from '../../../../modules/AppSideForm'
import AppCardCapsule from '../../../../modules/AppCardCapsule'
import AppImage from '../../../../modules/AppImage'
import AppTabs from '../../../../modules/AppTabs'
import AppCardProgressProduct from '../../../../modules/AppCardProgressProduct'

export default {
    name: 'App',
    data () {
        return {}
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
        getCover () {
            return this.form.image ? this.productImageThumbnailUrl + this.form.image : ''
        },
    },
    components: {
        AppCardCapsule,
        AppSideForm,
        AppImage,
        AppTabs,
        AppCardProgressProduct,
    },
    methods: {
        isOrderStatusCanceled (data) {
            return data.status === 'canceled'
        },
        isButtonEditDisabled (data) {
            return !data.payment_status && (data.status === 'new-order' || data.status === 'on-progress')
        },
        isButtonCustomerDisabled (data) {
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
        onChangeTabs (data) {
            this.selectedIndex = data
        },
        uploadImage (data) {
            this.$emit('uploadImage', data)
        },
        removeImage (data) {
            this.$emit('removeImage', data)
        },
        onSave () {
            this.$emit('onSave')
        },
        onClose () {
            this.$emit('onClose')
        },
        onChangeStatus (data, status) {
            const payload = {
                ...data,
                status: status
            }
            this.$emit('onChangeStatus', payload)
        },
        onCheckout (data) {
            this.$emit('onCheckout', data)
        },
        onReceipt (data) {
            this.$emit('onReceipt', data)
        },
        onProduct (data) {
            this.$emit('onProduct', data)
        },
        onCustomer (data) {
            this.$emit('onCustomer', data)
        }
    },
}
</script>