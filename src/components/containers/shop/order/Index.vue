<template>
    <div id="EmployeeHome">
        <AppTabLinks :data="tabs" @onChange="onChange" />
        <Orders v-if="selectedIndex === 'orders'" />
        <TaskLists v-if="selectedIndex === 'task-lists'" />
    </div>
</template>
<script>
import AppTabLinks from '../../../modules/AppTabLinks'
import Orders from './orders/Index'
import TaskLists from './taskLists/Index'

export default {
    name: 'EmployeeHome',
    data () {
        return {
            selectedIndex: 'orders',
            tabs: [
                {id: 1, title: 'Pesanan', path: 'orders'},
                {id: 2, title: 'Task Lists', path: 'task-lists'},
            ]
        }
    },
    components: {
        AppTabLinks,
        Orders,
        TaskLists,
    },
    methods: {
        onChange (value) {
            this.selectedIndex = value.name
        }
    }
}
</script>