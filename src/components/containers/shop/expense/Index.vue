<template>
  <div id="EmployeeHome">
    <AppHeaderMobile title="Pengeluaran" />
    <AppTabLinks :data="tabs" @onChange="onChange" />
    <ExpenseList v-if="selectedIndex === 'expense'" />
    <ExpenseType v-if="selectedIndex === 'type'" />
  </div>
</template>
<script>
import AppTabLinks from '../../../modules/AppTabLinks'
import AppHeaderMobile from '../../../modules/AppHeaderMobile'
import ExpenseList from './expenseList/Index'
import ExpenseType from './expenseType/Index'

export default {
  name: 'EmployeeHome',
  data() {
    return {
      selectedIndex: 'expense',
      tabs: [
        { id: 1, title: 'Pengeluaran', path: 'expense' },
        { id: 2, title: 'Tipe', path: 'type' },
      ],
    }
  },
  components: {
    AppTabLinks,
    AppHeaderMobile,
    ExpenseList,
    ExpenseType,
  },
  methods: {
    onChange(value) {
      this.selectedIndex = value.name
    },
  },
}
</script>
