<template>
    <div id="App">
        <AppHeaderMobile title="Laporan" />
        <div class="width width-100">
            <div class="display-flex space-between align-center">
                <h1 class="fonts big black bold">Laporan</h1>
            </div>
            <div class="display-flex wrap">
                <div v-for="(item, i) in data" :key="i" class="column-3 mobile-column">
                    <div class="margin margin-15px margin-mobile-left-none margin-mobile-right-none">
                        <div class="card bg-white box-shadow" style="overflow: unset; padding-top: 35px; margin-top: 35px;">
                            <div class="post-top-left-absolute" style="top: -25px; left: 15px;">
                                <div class="image image-50px image-circle box-shadow bg-white">
                                    <i :class="`post-middle-absolute fonts fonts-12 main-color ${item.icon}`"></i>
                                </div>
                            </div>
                            <div class="fonts fonts-11 semibold black">{{ item.title }}</div>
                            <div class="fonts fonts-10 grey">{{ item.description }}</div>
                            <div class="width width-100 margin margin-top-15px padding padding-top-15px border-top">
                                <button class="btn btn-sekunder btn-full" @click="onOpenReport(item)">
                                    Buat Laporan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <GenerateReport 
            v-if="visibleGenerateReport" 
            :report="report"
            @onClose="onCloseReport" />
    </div>
</template>
<script>
import AppTabs from '../../../modules/AppTabs'
import AppHeaderMobile from '../../../modules/AppHeaderMobile'
import GenerateReport from './GenerateReport'

export default {
    name: 'App',
    metaInfo: {
        title: 'Shop',
        titleTemplate: '%s | Reports',
        htmlAttrs: {
            lang: 'en',
            amp: true
        }
    },
    data () {
        return {
            loadingDownload: false,
            visibleGenerateReport: false,
            data: [
                {
                    title: 'Laporan Keuangan',
                    description: 'Lihat laporan keuangan sesuai dengan periode tertentu',
                    icon: 'fa fa-lg fa-calendar-alt',
                    type: 'money',
                },
                {
                    title: 'Laporan Penjualan',
                    description: 'Lihat laporan penjualan sesuai dengan periode tertentu',
                    icon: 'fa fa-lg fa-calendar-alt',
                    type: 'sale',
                },
                {
                    title: 'Laporan Laba Rugi',
                    description: 'Lihat laporan laba rugi sesuai dengan periode tertentu',
                    icon: 'fa fa-lg fa-calendar-alt',
                    type: 'profit',
                },
            ],
            report: null,
        }
    },
    components: {
        AppTabs,
        AppHeaderMobile,
        GenerateReport,
    },
    methods: {
        onOpenReport(value) {
            console.log('onOpenReport', value)
            this.visibleGenerateReport = true 
            this.report = value
        },
        onCloseReport() {
            this.visibleGenerateReport = false
        }
    }
}
</script>