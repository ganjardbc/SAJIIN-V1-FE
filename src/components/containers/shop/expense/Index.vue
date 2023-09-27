<template>
    <div id="EmployeeHome">
        <AppTabLinks :data="tabs" @onChange="onChange" />
        <ExpenseList v-if="selectedIndex === 'expense'" />
        <ExpenseType v-if="selectedIndex === 'type'" />
    </div>
</template>
<script>
import AppTabLinks from '../../../modules/AppTabLinks'
import ExpenseList from './expenseList/Index'
import ExpenseType from './expenseType/Index'

export default {
    name: 'EmployeeHome',
    data () {
        return {
            selectedIndex: 'expense',
            tabs: [
                {id: 1, title: 'Pengeluaran', path: 'expense'},
                {id: 2, title: 'Tipe', path: 'type'},
            ]
        }
    },
    components: {
        AppTabLinks,
        ExpenseList,
        ExpenseType,
    },
    methods: {
        onChange (value) {
            this.selectedIndex = value.name
        }
    }
}
</script>