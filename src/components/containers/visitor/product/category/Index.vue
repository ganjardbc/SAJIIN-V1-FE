<template>
    <div id="App" class="padding padding-15px">
        <div class="fonts fonts-11 semibold">Kategori</div>
        <AppButtonCapsuleSlider
            :index.sync="selectedIndex"
            customAllLabel="Semua Produk" 
            customIcon="fa fa-lw fa-box"
            :data="filteredCateogry"
            @onChange="onCategory" />
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import AppButtonCapsuleSlider from '../../../../modules/AppButtonCapsuleSlider'

export default {
    data () {
        return {
            selectedIndex: 'all'
        }
    },
    components: {
        AppButtonCapsuleSlider,
    },
    mounted () {
        this.getDataCategory()
    },
    computed: {
        ...mapState({
            data: (state) => state.storeVisitorCategory.data,
            filterProduct: (state) => state.storeVisitorProductList.filter,
            dataShop: (state) => state.storeVisitorShop.data,
        }),
        selectedShop () {
            return this.dataShop.shop
        },
        filteredCateogry () {
            return this.data.map((item) => {
                return {
                    id: item.id,
                    label: item.name,
                    image: item.image ? this.categoryImageThumbnailUrl + item.image : '',
                    icon: 'fa fa-lw fa-box',
                }
            })
        }
    },
    methods: {
        ...mapActions({
            getCategory: 'storeVisitorCategory/getData',
            getProduct: 'storeVisitorProductList/getData',
            resetFilterProduct: 'storeVisitorProductList/resetFilter',
        }),
        onCategory (data) {
            if (data === 'all') {
                this.filterProduct.category = ''
            } else {
                this.filterProduct.category = data 
            }
            this.selectedIndex = data
            this.resetFilterProduct()
            this.getDataProduct()
        },
        getDataCategory () {
            const shop_id = this.selectedShop && this.selectedShop.id
            if (shop_id) this.getCategory({ shop_id })
        },
        getDataProduct () {
            const shop_id = this.selectedShop && this.selectedShop.id
            if (shop_id) this.getProduct({ shop_id })
        },
    },
    watch: {
        dataShop(props, prevProps) {
            if (props !== prevProps) {
                this.getDataCategory()
            }
        }
    }
}
</script>