<template>
	<div id="AppCardExpense">
        <div class="card bg-white-grey no-padding margin margin-bottom-15px">
            <div class="width width-100 display-flex space-between align-center wrap">
                <div class="width width-50 padding padding-top-10px padding-bottom-10px">
                    <div class="padding padding-5px content-center">
                        <div class="display-flex center align-center">
                            <i class="fonts fonts-8 main-color fa fa-lg fa-info-circle margin margin-right-5px"></i>
                            <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Jumlah Pengeluaran</span>
                        </div>
                        <div class="fonts fonts-11 semibold black overflow-ellipsis align-center">{{ data.length }} pengeluaran</div>
                    </div>
                </div>
                <div class="width width-50 padding padding-top-10px padding-bottom-10px">
                    <div class="padding padding-5px border-left border-mobile-none  content-center">
                        <div class="display-flex center align-center">
                            <i class="fonts fonts-8 main-color fa fa-lg fa-info-circle margin margin-right-5px"></i>
                            <span class="fonts fonts-9 normal grey overflow-ellipsis align-center">Total Keseluruhan</span>
                        </div>
                        <div class="fonts fonts-11 semibold black overflow-ellipsis align-center">{{ format(grandTotal) }}</div>
                    </div>
                </div>
            </div>
        </div>

		<el-table :data="filteredData" border empty-text="No Data">
			<el-table-column 
				type="index" 
				label="No" 
				width="50" 
				align="center"
				:index="indexMethod"></el-table-column>
			<el-table-column label="ID Pengeluaran" min-width="200">
				<template slot-scope="scope">
					<div><AppCardCapsule :data="scope.row.expense.status" :label="scope.row.expense.expense_list_id" /></div>
				</template>
			</el-table-column>
			<el-table-column label="Tgl Pengeluaran" min-width="150">
				<template slot-scope="scope">
					<div>{{ scope.row.expense.expense_date | moment("DD MMM YYYY") }}</div>
				</template>
			</el-table-column>
			<el-table-column label="Tipe Pengeluaran" min-width="150">
				<template slot-scope="scope">
					<div>{{ scope.row.type.name || '-' }}</div>
                    <div v-if="scope.row.expense.description" style="font-size: 12px;">{{ scope.row.expense.description }}</div>
				</template>
			</el-table-column>
			<el-table-column label="Pembayaran" min-width="150">
				<template slot-scope="scope">
					<div>{{ scope.row.payment.name || '-' }}</div>
				</template>
			</el-table-column>
			<el-table-column label="Total" align="right" min-width="200">
				<template slot-scope="scope">
					<div style="font-weight: bold;">{{ format(scope.row.expense.expense_price) }}</div>
				</template>
			</el-table-column>
		</el-table>

        <div class="width width-100 display-flex flex-end align-center padding padding-top-15px">
            <div class="fonts fonts-10 normal black">Total {{ data.length }}</div>
            <el-pagination
                background 
				:current-page="page"
                :page-size="pageSize"
				:pager-count="5"
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
    name: 'AppCardExpense',
    props: {
		data: {
			required: true 
		},
        order: {
			required: true 
		},
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
					total += item.expense.expense_price
				})
			}
			return total 
		},
        grandChange () {
			let total = 0
			if (this.order && this.order.length > 0) {
				this.order && this.order.map((item) => {
					total += item.order.change_price
				})
			}
			return total 
		},
        cashOut () {
            let total = this.grandTotal + this.grandChange
            return total 
        }
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