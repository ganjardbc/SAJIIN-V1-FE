<template>
    <div id="AppMoreMenu">
        <el-popover 
            placement="right"
            width="230"
            trigger="click"
            v-model="visibleSubMenu">
            <button slot="reference" class="btn btn-icon btn-white">
                <i class="fa fa-lg fa-bars"></i>
            </button>
            <div>
                <AppListButton :data="dataSideBar" />
            </div>
        </el-popover>
    </div>
</template>
<script>
import AppListButton from './AppListButton'

export default {
    name: 'AppMoreMenu',
    data () {
        return {
            visibleSubMenu: false,
        }
    },
    components: {
        AppListButton
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