<template>
    <div id="App">
        <AppMobileLayout :title="'Visitor'">
            <div style="padding-top: 30px; padding-bottom: 30px;">
                <div class="width width-400-px width-mobile width-center">
                    <div class="display-flex column align-center">
                        <div class="content-center margin margin-10px">
                            <div class="image image-circle image-130px bg-white-grey" style="margin: auto;">
                                <i class="post-center fa fa-2x fa-store" style="font-size: 32pt;"></i>
                            </div>
                            <div class="fonts fonts-14 black semibold" style="margin-top: 30px;">
                                Visitor
                            </div>
                            <div class="fonts fonts-10 grey">
                                Scan Kode QR dari Toko yang bergabung dengan Saji-in, <br/> untuk melihat daftar produk dan membuat pesanan.
                            </div>
                        </div>
                        <div class="margin margin-10px">
                            <router-link :to="{name: 'visitor-qrshop'}">
                                <button class="btn btn-main">
                                    <i class="icn icn-left fa fa-lw fa-qrcode"></i> Scan Kode QR Toko
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </AppMobileLayout>
    </div>
</template>
<script>
import AppMobileLayout from '../../modules/AppMobileLayout'
import logo from '@/assets/img/logo.png'

export default {
    metaInfo: {
        title: 'SAJI-IN',
        titleTemplate: '%s | QR Code Scanner',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            logo: logo,
        }
    },
    components: {
        AppMobileLayout
    }
}
</script>