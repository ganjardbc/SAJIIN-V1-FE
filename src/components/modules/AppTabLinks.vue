<template>
    <div id="AppTabLinks">
        <el-tabs 
            v-model="selectedIndex"
            type="card" 
            :stretch="isFull"
            @tab-click="handleClick">
            <el-tab-pane  
                v-for="(item, i) in data" 
                :key="i" 
                :name="item.path"
                :label="item.title"></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name: 'AppTabLinks',
    data() {
        return {
            selectedIndex: this.data ? this.data[0].path : ''
        }
    },
    props: {
        data: null,
        isFull: false,
    },
    methods: {
        handleClick(value) {
            this.$emit('onChange', value)
        }
    }
}
</script>