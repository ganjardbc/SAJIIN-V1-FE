<template>
    <div id="App">
        <AppCardPopup title="QR Toko" @onClose="onClose">
            <div class="width width-100 display-flex center">
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
                        <img :src="shopImageThumbnailUrl + data.image" alt="" style="height: 25px;">
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
            <div slot="footer" class="padding padding-15px border-top">
                <div v-if="data.is_digital_menu_active" class="padding padding-bottom-15px">
                    <AppShopLink :link="`${initUrl}visitor/${data.shop_id}`" :disableLabel="true" />
                </div>
                <button 
                    class="btn btn-main-reverse with-hover with-border btn-full" 
                    @click="onPrintPreview">
                    Download atau Cetak QR Toko
                </button>
            </div>
        </AppCardPopup>
    </div>
</template>
<script>
import { Printd } from 'printd'
import VueQrcode from 'vue-qrcode'
import AppCardPopup from './AppCardPopup'
import AppShopLink from './AppShopLink'
import logo from '@/assets/img/logo.png'

export default {
    name: 'App',
    data () {
        return {
            logo: logo,
            selectedIndex: 0,
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
    },
    components: {
        VueQrcode,
        AppCardPopup,
        AppShopLink,
    },
    methods: {
        onClose () {
            this.$emit('onClose')
        },
        onPrintPreview () {
            const printer = new Printd()
            const cssCover = `
                .width {
                    position: relative;
                }
                .width.width-100 {
                    width: 100%;
                }
                .width.width-50px {
                    width: 50px;
                }
                .width.width-60px {
                    width: 60px;
                }
                .width.width-80px {
                    width: 80px;
                }
                .width.width-150px {
                    width: 150px;
                }
                .width.width-720px {
                    width: 720px;
                }
                .width.width-center {
                    margin: auto;
                }
                .image {
                    position: relative;
                }
                .image.image-padding {
                    width: 100%;
                    padding-bottom: 100%;
                }
                .image img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                }
            `
            const cssFonts = `
                .fonts {
                    font-family: sans-serif;
                    color: #000;
                }
                .fonts.fonts-8px {
                    font-size: 8px;
                }
                .fonts.fonts-9px {
                    font-size: 9px;
                }
                .fonts.fonts-10px {
                    font-size: 10px;
                }
                .fonts.fonts-11px {
                    font-size: 11px;
                }
                .fonts.fonts-14px {
                    font-size: 14px;
                }
                .fonts.fonts-24px {
                    font-size: 24px;
                }
                .fonts.align-center {
                    text-align: center;
                }
                .fonts.semibold {
                    font-weight: bold;
                }
                .fonts.normal {
                    font-weight: normal;
                }
                .fonts.white {
                    color: #fff;
                }
                .fonts.black {
                    color: #151f2d;
                }
                .fonts.grey {
                    color: #555;
                }
            `
            const cssDisplay = `
                .display-flex {
                    display: flex;
                    flex-direction: row;
                }
                .display-flex.space-between {
                    justify-content: space-between;
                }
                .display-flex.center {
                    justify-content: center;
                }
                .display-flex.align-center {
                    align-items: center;
                }
            `
            const cssPadding = `
                .padding {
                    position: relative;
                }
                .padding.padding-5px {
                    padding: 5px;
                }
                .padding.padding-top-5px {
                    padding-top: 5px;
                }
                .padding.padding-bottom-5px {
                    padding-bottom: 5px;
                }
                .padding.padding-10px {
                    padding: 10px;
                }
                .padding.padding-top-10px {
                    padding-top: 10px;
                }
                .padding.padding-bottom-10px {
                    padding-bottom: 10px;
                }
                .padding.padding-15px {
                    padding: 15px;
                }
                .padding.padding-top-15px {
                    padding-top: 15px;
                }
                .padding.padding-bottom-15px {
                    padding-bottom: 15px;
                }
                .padding.padding-30px {
                    padding: 30px;
                }
                .padding.padding-top-30px {
                    padding-top: 30px;
                }
                .padding.padding-bottom-30px {
                    padding-bottom: 30px;
                }
            `
            const cssMargin = `
                .margin {
                    position: relative;
                }
                .margin.margin-5px {
                    margin: 5px;
                }
                .margin.margin-top-5px {
                    margin-top: 5px;
                }
                .margin.margin-bottom-5px {
                    margin-bottom: 5px;
                }
                .margin.margin-10px {
                    margin: 10px;
                }
                .margin.margin-top-10px {
                    margin-top: 10px;
                }
                .margin.margin-bottom-10px {
                    margin-bottom: 10px;
                }
                .margin.margin-15px {
                    margin: 15px;
                }
                .margin.margin-top-15px {
                    margin-top: 15px;
                }
                .margin.margin-bottom-15px {
                    margin-bottom: 15px;
                }
                .margin.margin-30px {
                    margin: 30px;
                }
                .margin.margin-top-30px {
                    margin-top: 30px;
                }
                .margin.margin-bottom-30px {
                    margin-bottom: 30px;
                }
            `
            const cssBorder = `
                .border-bottom {
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                }
                .btn {
                    position: relative;
                    font-family: "GraphikSemibold", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                    padding: 11px 12.8px;
                    border: 0;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: bold;
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                }
                .btn.btn-main {
                    background-color: #FB3640;
                    color: #fff;
                    border: 1px #FB3640 solid;
                }
                .btn.btn-small-icon {
                    width: 30px;
                    height: 30px;
                    padding: 8px 0;
                    text-align: center;
                }
                .btn.btn-circle {
                    border-radius: 40px;
                }
            `
            const cssBackground = `
                * {
                    margin: 0;
                    padding: 0;
                }
                @media print {
                    body {-webkit-print-color-adjust: exact;}
                }
                .bg-white-grey {
                    background-color: #f9f9f9;
                }
                .bg-main {
                    background-color: #FB3640;
                }
            `
            const styles = [ cssBackground, cssCover, cssFonts, cssDisplay, cssPadding, cssMargin, cssBorder ]
            printer.print( 
                document.getElementById('component-to-print'), 
                styles
            )
        },
    }
}
</script>
