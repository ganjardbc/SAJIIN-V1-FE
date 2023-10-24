<template>
    <div id="AppPopupQrCode">
        <AppCardPopup 
            v-show="visibilityQrToko" 
            title="QR Toko" 
            @onClose="onClose('#component-to-place')">
            <div class="width width-100 content-center" style="max-height: 400px; overflow-y: auto;">
                <AppLoader v-if="previewLoader" />
                <div style="
                    position: absolute; 
                    width: auto; 
                    margin: auto;
                    top: 0; 
                    height: 1px;
                    overflow: hidden;
                ">
                    <div 
                        id="component-to-print"
                        style="
                            position: relative; 
                            width: 376px;
                            height: 376px;
                            border-width: 1px; 
                            border-style: solid; 
                            border-color: #F0F0F0;
                        ">
                        <div class="display-flex space-between" style="padding: 10px 15px;">
                            <!-- <img :src="shopImageThumbnailUrl + data.image" alt="" style="height: 25px;"> -->
                            <div class="fonts fonts-11 semibold black">{{ data.name }}</div>
                            <img :src="logo" alt="" style="height: 25px;">
                        </div>
                        <div class="width width-100">
                            <div style="padding: 10px 0;">
                                <div style="width: 240px; margin: auto;">
                                    <div style="border-width: 4px; border-style: solid; border-color: #FB3640; border-radius: 20px; margin-bottom: 15px;">
                                        <div 
                                            class="image image-padding" 
                                            style="background-color: #fff; border-radius: 20px; overflow: hidden;">
                                            <VueQrcode :value="`${initUrl}visitor/${data.shop_id}`" />
                                        </div>
                                    </div>
                                    <div class="bg-main" style="position: relative; padding: 8px 15px; border-radius: 8px;">
                                        <div class="display-flex center" style="position: absolute; top: -8px; left: 0; width: 100%;">
                                            <div 
                                                style="
                                                    width: 20px;
                                                    height: 20px;
                                                    background-color: #FB3640;
                                                    transform: rotate(45deg);
                                                "></div>
                                        </div>
                                        <div class="fonts fonts-18px semibold white align-center">MENU & ORDER</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="component-to-place"></div>
            </div>
            <div v-if="!previewLoader" slot="footer" class="padding padding-15px border-top">
                <div 
                    v-if="data.is_digital_menu_active" 
                    class="padding padding-bottom-15px">
                    <AppShopLink :link="`${initUrl}visitor/${data.shop_id}`" :disableLabel="true" />
                </div>
                <button 
                    class="btn btn-main-reverse with-hover with-border btn-full" 
                    @click="onDownloadCanvas('component-to-place')">
                    Save As Image
                </button>
            </div>
        </AppCardPopup>
    </div>
</template>
<script>
import VueQrcode from 'vue-qrcode'
import html2canvas from 'html2canvas'
import AppCardPopup from './AppCardPopup'
import AppShopLink from './AppShopLink'
import AppLoader from './AppLoader'
import logo from '@/assets/img/logo.png'

export default {
    name: 'AppPopupQrCode',
    data () {
        return {
            logo: logo,
            selectedIndex: 0,
            visibilityQrToko: false,
            previewLoader: false,
            howToOrder: [
                {id: 1, title: 'Scan QR', description: 'Scan QR dengan kamera smartphone.'},
                {id: 2, title: 'Pilih Menu', description: 'Pilih menu & tambah ke Keranjang.'},
                {id: 3, title: 'Buat Pesanan', description: 'Isi data diri & buat pesanan.'},
            ],
            info: [
                {id: 1, icon: 'fab fa-lg fa-instagram', title: 'Instagram', value: '@sajiin_id'},
                {id: 2, icon: 'fa fa-lg fa-globe', title: 'Website', value: 'www.sajiin.com'},
                {id: 3, icon: 'fa fa-lg fa-envelope', title: 'Email', value: 'sajiin.official@gmail.com'},
            ]
        }
    },
    props: {
        data: null,
        visibility: false,
    },
    watch: {
        visibility (props) {
            if (props) {
                this.onOpen()
            } else {
                this.previewLoader = false
                this.visibilityQrToko = false 
            }
        }
    },
    components: {
        VueQrcode,
        AppCardPopup,
        AppShopLink,
        AppLoader,
    },
    methods: {
        onClose (toPlace) {
            document.querySelector(toPlace).innerHTML = ''
            this.$emit('onClose')
        },
        onOpen () {
            this.previewLoader = true
            this.visibilityQrToko = true
            setTimeout(() => {
                this.onOpenCanvas(
                    '#component-to-print', 
                    '#component-to-place')
            }, 500)
        },
        onOpenCanvas (toPrint, toPlace) {
            html2canvas(
                document.querySelector(toPrint), {
                    allowTaint: true,
                    tainttest: true,
                    logging: false,
                    useCORS: true,
                }
            ).then((canvas) => {
                document.querySelector(toPlace).appendChild(canvas)
            }).finally(() => {
                this.previewLoader = false
            })
        },
        onDownloadCanvas (toPlace) {
            const fileName = `qr-toko-${this.data.shop_id}.png`
            const canvasElement = document.getElementById(toPlace).children[0]
            const canvasUrl = canvasElement.toDataURL("image/png").replace("image/png", "image/octet-stream")

            const downloadLink = document.createElement('a')
            downloadLink.href = canvasUrl
            downloadLink.download = fileName

            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        }
    }
}
</script>
