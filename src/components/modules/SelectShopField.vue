<template>
    <div id="App">
        <el-select 
            v-model="selectedData" 
            placeholder="Pilih Toko"
            class="select-shop">
            <el-option
                v-for="(item, i) in data"
                :key="i"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
    name: 'App',
    data () {
        return {}
    },
    mounted () {},
    computed: {
        ...mapState({
            data: (state) => state.storeSelectedShop.data,
            dataUser: (state) => state.storeAuth.data.user,
        }),
        selectedData: {
            get () {
                return this.$store.state.storeSelectedShop.selectedData
            },
            set (value) {
                const shop_id = this.$route.params.shopId
                const shop = this.data.find((item) => item.id === value)
                this.$store.state.storeSelectedShop.selectedData = value
                if (shop.shop_id !== shop_id) {
                    this.$cookies.set('shop', shop)
                    this.$message(`Berpindah ke Toko ${shop.name}.`)
                    this.$router.push({ name: 'shop-home', params: { shopId: shop.shop_id } })
                    this.getDataCashBook(shop.id)
                }
            }
        }
    },
    methods: {
        ...mapActions({
            getShop: 'storeSelectedShop/getData',
            getCashBook: 'storeCashBook/getCurrent',
            resetCashBook: 'storeCashBook/restDataCurrent',
        }),
        getData () {
            const token = this.$cookies.get('tokenBearer')
            const role = this.dataUser.role_name
            this.getShop({ token, role })
        },
        getDataCashBook (shop_id) {
            const token = this.$cookies.get('tokenBearer')
            const today = new Date()
            if (shop_id) {
                this.resetCashBook()
                this.getCashBook({ token, today: today, shop_id: shop_id })
                    .then((res) => {
                        const status = res.data.status 
                        if (status !== 'ok') {
                            this.$message({
                                message: 'Gagal mendapatkan Buku Kas',
                                type: 'error'
                            })
                        }
                    })
            }
        },
    }
}
</script>