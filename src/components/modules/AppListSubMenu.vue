<template>
    <div id="AppListSubMenu">
        <el-popover 
            placement="right-end"
            width="230"
            trigger="click"
            v-model="visibleSubMenu">
            <div slot="reference" class="ml-link" style="cursor: pointer;">
                <div class="ml-icon" exact>
                    <i :class="data.icon" />
                </div>
                <div class="ml-label">
                    {{ data.label }}
                </div>
                <div class="ml-chevron val-container">
                    <div class="ml-value bg-transparent">
                        <div :class="`post-center fonts grey fonts-11px fa fa-lw ${visibleSubMenu ? 'fa-chevron-up' : 'fa-chevron-down'}`"></div>
                    </div>
                </div>
            </div>
            <div>
                <div v-for="(item, index) in data.menu" :key="index" @click="onClick">
                    <router-link 
                        :to="{name: item.link}" 
                        :title="item.label"
                        class="btn btn-white btn-align-left btn-div btn-circle">
                        <i :class="`icn icn-left ${item.icon}`"></i>
                        {{ item.label }}
                    </router-link>
                </div>
            </div>
        </el-popover>
    </div>
</template>
<script>
export default {
    name: 'AppListSubMenu',
    data () {
        return {
            visibleSubMenu: false,
        }
    },
    props: {
        data: []
    },
    methods: {
        onClick () {
            this.visibleSubMenu = false 
            this.$emit('onClick')
        }
    }
}
</script>