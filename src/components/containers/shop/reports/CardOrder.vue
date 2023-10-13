<template>
	<div id="AppCardOrder">
		<div class="card bg-white-grey no-padding margin margin-bottom-15px">
            <div class="width width-100 display-flex space-between align-center wrap">
                <div class="width width-50 padding padding-top-10px padding-bottom-10px">
                    <div class="padding padding-5px content-center">
                        <div class="display-flex center align-center">
                            <i class="fonts fonts-8 main-color fa fa-lg fa-info-circle margin margin-right-5px"></i>
                            <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Jumlah Produk</span>
                        </div>
                        <div class="fonts fonts-11 semibold black overflow-ellipsis align-center">{{ grandItem }} produk</div>
                    </div>
                </div>
                <div class="width width-50 padding padding-top-10px padding-bottom-10px">
                    <div class="padding padding-5px border-left content-center">
                        <div class="display-flex center align-center">
                            <i class="fonts fonts-8 main-color fa fa-lg fa-info-circle margin margin-right-5px"></i>
                            <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Total Keseluruhan</span>
                        </div>
                        <div class="fonts fonts-11 semibold black overflow-ellipsis align-center">{{ format(grandTotal) }}</div>
                    </div>
                </div>
            </div>
        </div>

		<el-table :data="filteredData" border empty-text="Data Kosong">
			<el-table-column 
				type="index" 
				label="No" 
				width="50" 
				align="center"
				:index="indexMethod"></el-table-column>
			<el-table-column label="ID Pesanan" min-width="200">
				<template slot-scope="scope">
					<div><AppCardCapsule :data="scope.row.order.status" :label="scope.row.order.order_id" /></div>
				</template>
			</el-table-column>
			<el-table-column label="Tgl Pesanan" min-width="150">
				<template slot-scope="scope">
					<div>{{ scope.row.order.created_at | moment("DD MMM YYYY") }}</div>
				</template>
			</el-table-column>
			<el-table-column label="Platform" min-width="150">
				<template slot-scope="scope">
					<div>{{ scope.row.order.platform_name || '-' }}</div>
				</template>
			</el-table-column>
			<el-table-column label="Produk" min-width="320">
				<template slot-scope="scope">
					<div 
						v-for="(dt, i) in scope.row.details" 
						:key="i" 
						class="width width-100 padding padding-bottom-5px padding-top-5px">
						<div>{{ dt.product_name }} {{ dt.product_detail ? `- ${dt.product_detail}` : '' }}</div>
						<div class="display-flex space-between">
							<div> {{ dt.quantity }} x</div>
							<div style="font-weight: bold;">{{ format(dt.price) }}</div>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="Total" align="right" min-width="180">
				<template slot-scope="scope">
					<div style="font-weight: bold;">{{ format(scope.row.order.total_price) }}</div>
				</template>
			</el-table-column>
		</el-table>

		<div class="width width-100 display-flex flex-end align-center padding padding-top-15px">
            <div class="fonts fonts-10 normal black">Total {{ data.length }}</div>
            <el-pagination
                background 
				:current-page="page"
                :page-size="pageSize"
				:pager-count="3"
                layout="prev, pager, next"
                :total="data.length"
				@current-change="handleCurrentChange">
            </el-pagination>
        </div>
	</div>
</template>
<script>
import AppCardCapsule from '../../../modules/AppCardCapsule'

export default {
    name: 'AppCardOrder',
	props: {
		data: {
			required: true 
		}
	},
    data () {
    	return {
			page: 1,
			pageSize: 5,
		}
    },
    components: {
    	AppCardCapsule
    },
    computed: {
		filteredData () {
			return this.data.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page)
		},
		grandTotal () {
			let total = 0
			if (this.data && this.data.length > 0) {
				this.data && this.data.map((item) => {
					total += item.order.total_price
				})
			}
			return total 
		},
		grandItem () {
			let total = 0
			if (this.data && this.data.length > 0) {
				this.data && this.data.map((item) => {
					total += item.order.total_item
				})
			}
			return total 
		},
    },
    methods: {
    	indexMethod (index) {
            return (index + 1) + ((this.page - 1) * this.pageSize)
        },
		handleCurrentChange (value) {
			this.page = value
		},
    }
}
</script>