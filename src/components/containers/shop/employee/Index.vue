<template>
  <div id="EmployeeHome">
    <AppHeaderMobile title="Karyawan" />
    <AppTabLinks :data="tabs" @onChange="onChange" />
    <EmployeeLists v-if="selectedIndex === 'employees'" />
    <EmployeeShifts v-if="selectedIndex === 'shifts'" />
  </div>
</template>
<script>
import AppTabLinks from '../../../modules/AppTabLinks'
import AppHeaderMobile from '../../../modules/AppHeaderMobile'
import EmployeeLists from './employees/Index'
import EmployeeShifts from './shifts/Index'

export default {
  name: 'EmployeeHome',
  data() {
    return {
      selectedIndex: 'employees',
      tabs: [
        { id: 1, title: 'Karyawan', path: 'employees' },
        { id: 2, title: 'Shift', path: 'shifts' },
      ],
    }
  },
  components: {
    AppTabLinks,
    AppHeaderMobile,
    EmployeeLists,
    EmployeeShifts,
  },
  methods: {
    onChange(value) {
      this.selectedIndex = value.name
    },
  },
}
</script>
