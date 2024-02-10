<template>
    <div id="EmployeeHome">
        <AppTabLinks v-if="!isNonFnB" :data="tabs" @onChange="onChange" />
        <Orders v-if="selectedIndex === 'orders'" />
        <TaskLists v-if="selectedIndex === 'task-lists'" />
    </div>
</template>
<script>
import { mapState } from 'vuex'
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
    computed: {
        ...mapState({
            dataShop: (state) => state.storeSelectedShop.form,
        }),
        isNonFnB () {
            return this.dataShop && this.dataShop.is_non_fnb
        },
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