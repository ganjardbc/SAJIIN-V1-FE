<template>
    <div id="App">
        <div :class="`card-capsule ${getColor()}`">
            {{ label ? label : getLabel() }}
        </div>
    </div>
</template>
<script>
export default {
    name: 'App',
    data () {
        return {
            defaultLabel: ''
        }
    },
    props: {
        data: null,
        label: null,
    },
    methods: {
        getColor () {
            let color = 'normal'
            switch (this.data) {
                case 'unconfirmed':
                    color = 'normal'
                    break
                case 'confirmed':
                    color = 'wip'
                    break
                case 'cooking':
                    color = 'wip'
                    break
                case 'delivered':
                    color = 'wip'
                    break
                case 'on-progress':
                    color = 'wip'
                    break
                case 'todo':
                    color = 'normal'
                    break
                case 'to-do':
                    color = 'normal'
                    break
                case 'new-order':
                    color = 'normal'
                    break
                case 'wip':
                    color = 'wip'
                    break
                case 'ready':
                    color = 'wip'
                    break
                case 'done':
                    color = 'active'
                    break
                case 'canceled':
                    color = 'inactive'
                    break
                case 'active':
                    color = 'active'
                    break
                case 'inactive':
                    color = 'inactive'
                    break
                case 'paid':
                    color = 'active'
                    break
                case 'unpaid':
                    color = 'todo'
                    break
                case 'open':
                    color = 'active'
                    break
                case 'closed':
                    color = 'inactive'
                    break
            }
            return color
        },
        getLabel () {
            let label = '-'
            switch (this.data) {
                case 'unconfirmed':
                    label = 'Belum Dikonfirmasi' 
                    break
                case 'confirmed':
                    label = 'Dikonfirmasi'
                    break
                case 'cooking':
                    label = 'Memasak'
                    break
                case 'delivered':
                    label = 'Diterima'
                    break
                case 'on-progress':
                    label = 'Disiapkan'
                    break
                case 'ready':
                    label = 'Diantarkan'
                    break
                case 'todo':
                    label = 'Todo'
                    break
                case 'to-do':
                    label = 'Todo'
                    break
                case 'new-order':
                    label = 'Baru'
                    break
                case 'wip':
                    label = 'WIP'
                    break
                case 'done':
                    label = 'Selesai'
                    break
                case 'canceled':
                    label = 'Dibatalkan'
                    break
                case 'active':
                    label = 'Aktif'
                    break
                case 'inactive':
                    label = 'Non-Aktif'
                    break
                case 'paid':
                    label = 'Dibayar'
                    break
                case 'unpaid':
                    label = 'Belum Bayar'
                    break
                case 'open':
                    label = 'Buka'
                    break
                case 'closed':
                    label = 'Tutup'
                    break
            }
            return label
        }
    }
}
</script>