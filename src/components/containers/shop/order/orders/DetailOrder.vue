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
                <div 
                    v-for="(detail, index) in form.details" 
                    :key="index" 
                    class="card bg-white border-full margin margin-bottom-18px">
                    <div class="display-flex space-between">
                        <div class="width width-45px margin margin-right-15px">
                            <div class="image image-padding border-full">
                                <img 
                                    v-if="detail.product_image" 
                                    :src="productImageThumbnailUrl + detail.product_image" 
                                    alt="" 
                                    class="post-center">
                                <i v-else class="post-middle-absolute icn fa fa-lg fa-image"></i>
                            </div>
                        </div>
                        <div style="width: calc(100% - 160px);">
                            <div class="fonts fonts-11 semibold">{{ detail.product_name }}</div>
                            <div v-if="detail.product_detail" class="fonts fonts-9 black display-flex align-center padding padding-left-5px">
                                <i class="fonts fonts-2 fa fa-lw fa-circle margin margin-right-5px"></i>
                                {{ detail.product_detail }}
                            </div>
                        </div>
                        <div class="width width-100px display-flex flex-end">
                            <AppCardCapsule :data="detail.status" />
                        </div>
                    </div>
                    <div class="width width-100 padding padding-top-10px">
                        <div v-if="detail.note" class="display-flex space-between">
                            <div class="fonts fonts-10 normal black">Catatan</div>
                            <div class="fonts fonts-10 normal black">{{ detail.note }}</div>
                        </div>
                        <div class="display-flex space-between">
                            <div class="fonts fonts-10 normal black">Harga</div>
                            <div class="display-flex align-center">
                                <span 
                                    v-if="detail.is_discount || detail.is_platform" 
                                    class="fonts fonts-9 grey text-line margin margin-right-5px">{{ format(detail.second_price) }}</span>
                                <span class="fonts fonts-10 normal black semibold align-right">{{ format(detail.price) }}</span>
                            </div>
                        </div>
                        <div v-if="detail.is_discount" class="display-flex align-center margin margin-top-5px margin-bottom-5px">
                            <div class="image image-20px border-full">
                                <img v-if="detail.discount_image" :src="discountImageThumbnailUrl + detail.discount_image" alt="" class="post-center">
                                <i v-else class="post-middle-absolute fonts fonts-6 icn fa fa-lw fa-percentage"></i>
                            </div>
                            <div style="width: calc(100% - 25px);" class="display-flex space-between margin margin-left-5px">
                                <div class="fonts fonts-9 normal grey">{{ detail.discount_name }}</div>
                                <div class="fonts fonts-9 normal grey align-right">
                                    -{{ detail.discount_value_type === 'percentage' 
                                        ? `${detail.discount_fee}%` 
                                        : format(detail.discount_price) }}
                                </div>
                            </div>
                        </div>
                        <div v-if="detail.is_platform" class="display-flex align-center margin margin-top-5px margin-bottom-5px">
                            <div class="image image-20px border-full">
                                <img v-if="detail.platform_image" :src="platformImageThumbnailUrl + detail.platform_image" alt="" class="post-center">
                                <i v-else class="post-middle-absolute fonts fonts-6 icn fa fa-lw fa-flag"></i>
                            </div>
                            <div style="width: calc(100% - 25px);" class="display-flex space-between margin margin-left-5px">
                                <div class="fonts fonts-9 normal grey">{{ detail.platform_name }}</div>
                                <div class="fonts fonts-9 normal grey align-right">
                                    +{{ detail.platform_currency_type === 'percentage' 
                                        ? `${detail.platform_fee}%`
                                        : format(detail.platform_price) }}
                                </div>
                            </div>
                        </div>
                        <div class="display-flex space-between margin margin-top-5px">
                            <div class="fonts fonts-10 normal black">Jumlah</div>
                            <div class="fonts fonts-10 normal black semibold align-right">{{ detail.quantity }} x</div>
                        </div>
                        <div class="padding padding-bottom-10px margin margin-bottom-10px border-bottom border-dashed"></div>
                        <div class="display-flex space-between">
                            <div class="fonts fonts-10 semibold black">Total</div>
                            <div class="fonts fonts-10 semibold main-color">{{ format(detail.subtotal) }}</div>
                        </div>
                    </div>
                </div>
                <div class="margin margin-bottom-15px border-bottom border-dashed"></div>
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
                <div class="display-flex space-between align-center margin margin-bottom-10px">
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
                        <div class="fonts fonts-10 black">Total ({{ form.total_item }} produk)</div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-10 semibold black">{{ format(form.total_price) }}</div>
                    </div>
                </div>
                <div v-if="form.is_discount" class="display-flex space-between margin margin-top-5px margin-bottom-5px">
                    <div class="width width-70 display-flex align-center">
                        <div class="image image-20px border-full">
                            <img v-if="form.discount_image" :src="discountImageThumbnailUrl + form.discount_image" alt="" class="post-center">
                            <i v-else class="post-middle-absolute fonts fonts-6 icn fa fa-lw fa-percentage"></i>
                        </div>
                        <div style="width: calc(100% - 25px);" class="margin margin-left-5px">
                            <div class="fonts fonts-9 normal grey">{{ form.discount_name }}</div>
                        </div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-9 normal grey">
                            -{{ form.discount_value_type === 'percentage' 
                                ? `${form.discount_fee}%` 
                                : format(form.discount_price) }}
                        </div>
                    </div>
                </div>
                <div v-if="isThereDiscountProduct || isThereDiscountTransaction" class="display-flex space-between">
                    <div class="width width-70">
                        <div class="fonts fonts-10 black">Total Diskon</div>
                    </div>
                    <div class="width width-30">
                        <div class="fonts fonts-10 black semibold">-{{ format(totalDiscount) }}</div>
                    </div>
                </div>
                <div class="padding padding-bottom-15px margin margin-bottom-15px border-bottom border-dashed"></div>
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

                <div v-if="form.status !== 'canceled' && !form.payment_status">
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
                    <div v-if="form.status === 'new-order'" class="width width-100">
                        <button 
                            class="btn btn-full btn-sekunder"
                            @click="onChangeStatus(form, 'on-progress')">
                            Terima Pesanan
                        </button>
                    </div>

                    <div v-if="form.status === 'on-progress'" class="width width-100">
                        <button 
                            :disabled="isButtonOnProgressDisabled(form)"
                            class="btn btn-full btn-sekunder"
                            @click="onChangeStatus(form, 'ready')">
                            Siap Diantarkan
                        </button>
                    </div>

                    <div v-if="form.status === 'ready'" class="width width-100">
                        <button 
                            class="btn btn-full btn-sekunder"
                            @click="onChangeStatus(form, 'delivered')">
                            Pesanan Diterima
                        </button>
                    </div>

                    <div v-if="form.status === 'delivered'" class="width width-100">
                        <button 
                            :disabled="!isButtonDoneDisabled(form)"
                            class="btn btn-full btn-green"
                            @click="onChangeStatus(form, 'done')">
                            Pesanan Selesai
                        </button>
                    </div>

                    <div v-if="form.status === 'done' || form.status === 'canceled'" class="width width-100">
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
        totalDiscountProduct () {
            let price = 0
            this.form.details && this.form.details.map((item) => {
                let quantity = item.quantity
                if (item.is_discount) {
                    price += quantity * item.discount_price
                }
            })
            return price
        },
        isThereDiscountProduct () {
            let status = false
            this.form.details && this.form.details.map((item) => {
                if (item.is_discount) {
                    status = true 
                }
            })
            return status
        },
        totalDiscountTransaction () {
            return this.form.discount_price 
        },
        isThereDiscountTransaction () {
            let status = false 
            if (this.form.discount_price ) {
                status = true 
            }
            return status
        },
        totalDiscount () {
            return this.totalDiscountProduct + this.totalDiscountTransaction
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
        isButtonOnProgressDisabled (data) {
            return data.status !== 'on-progress'
        },
        isButtonDoneDisabled (data) {
            return data.payment_status && data.status === 'delivered'
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