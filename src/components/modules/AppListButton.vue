<template>
    <div id="AppListButton">
       <div v-for="(item, index) in dataSideBar" :key="index" @click="onClick">
            <router-link 
                :to="{name: item.link}" 
                :title="item.label"
                class="btn btn-white btn-align-left btn-big">
                <i :class="`icn icn-left ${item.icon}`"></i>
                {{ item.label }}
                <i class="icn icn-float-right fonts grey fa fa-lg fa-chevron-right"></i>
            </router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: 'AppListButton',
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
        },
        onCheckSubmenus (data) {
            let menu = []
            data && data.map((dt) => {
                const stt = this.onCheckPermission(dt.permission)
                if (stt) {
                    menu.push({
                        ...dt
                    })
                }
            })
            return menu
        },
        onCheckPermission (value) {
            let stt = false
            const data = this.permissions
            if (data && data.length > 0) {
                const isTherePermission = data.find((item) => item.permission_name === value)
                if (isTherePermission) {
                    stt = true
                }
            }
            return stt
        },
    },
    computed: {
        permissions() {
            return this.$cookies.get('permissions')
        },
        dataSideBar() {
            return this.onCheckSubmenus(this.data)
        }
    }
}
</script>