<template>
  <div id="EmployeeHome">
    <AppHeaderMobile title="Karyawan" />
    <AppTabLinks :data="tabs" @onChange="onChange" />
    <EmployeeShifts v-if="selectedIndex === 'shifts'" />
    <EmployeeLists v-if="selectedIndex === 'employees'" />
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
      selectedIndex: 'shifts',
      tabs: [
        { id: 1, title: 'Shift', path: 'shifts' },
        { id: 2, title: 'Karyawan', path: 'employees' },
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
