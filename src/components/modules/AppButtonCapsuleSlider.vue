<template>
    <div id="AppButtonCapsuleSlider" class="display-flex space-between align-center wrap">
        <div class="horizontal-scroll" style="overflow-x: auto;">
            <div v-if="!disableAll" style="margin: 10px 10px 5px 0; flex-grow: 1; display: inline-block;">
                <div 
                    :class="`card card-status ${selectedIndex === 'all' ? 'active' : 'normal'} no-padding border-big-radius`" 
                    style="margin: 0 0;"
                    @click="onSelected('all')">
                    <div class="display-flex nowrap align-center" style="padding: 5px 10px 5px 5px;">
                        <div class="width width-40px">
                            <div class="image image-30px image-circle bg-white border-full">
                                <i :class="`post-middle-absolute icn ${customIcon ? customIcon : 'fa fa-lw fa-check'}`"></i>
                            </div>
                        </div>
                        <div style="width: calc(100% - 40px);">
                            <div class="fonts fonts-10 black semibold">{{ customAllLabel ? customAllLabel : 'Semua' }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="(dt, i) in data" :key="i" style="margin: 10px 13px 5px 0; flex-grow: 1; display: inline-block;">
                <div 
                    :class="`card card-status ${selectedIndex === (returnIndex ? i : dt.id) ? 'active' : 'normal'} no-padding border-big-radius`" 
                    style="margin: 0 0;"
                    @click="onSelected(returnIndex ? i : dt.id)">
                    <div class="display-flex nowrap align-center" style="padding: 5px 10px 5px 5px;">
                        <div class="width width-40px">
                            <div class="image image-30px image-circle bg-white border-full">
                                <img 
                                    v-if="dt.image" 
                                    :src="dt.image" 
                                    alt="" 
                                    class="post-center">
                                <i v-else :class="`post-middle-absolute icn ${dt.icon ? dt.icon : 'fa fa-lw fa-check'}`"></i>
                            </div>
                        </div>
                        <div style="width: calc(100% - 40px);" class="display-flex align-center">
                            <div class="fonts fonts-10 black semibold">{{ dt.label }}</div>
                            <div v-if="dt.value" class="card-value margin margin-left-10px">
                                {{ dt.value }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'AppButtonCapsuleSlider',
    data () {
        return {
            selectedIndex: this.index || this.index === 0 ? this.index : 'all',
        }
    },
    mounted () {
        this.selectedIndex = this.index || this.index === 0 ? this.index : 'all' 
    },
    props: {
        index: null,
        data: null,
        disableAll: false,
        returnIndex: false,
        customAllLabel: '',
        customIcon: '',
    },
    watch: {
        index: function (props) {
            this.selectedIndex = props 
        }
    },
    methods: {
        onSelected (data) {
            if (data === 'all') {
                // this.selectedIndex = 'all' 
                this.$emit('onChange', 'all')
            } else {
                // this.selectedIndex = data
                this.$emit('onChange', data)
            }
        }
    }
}
</script>