<template>
    <div id="AppTabs" style="white-space: nowrap; overflow-y: hidden; overflow-x: auto;">
        <el-radio-group 
            v-model="tabPosition" 
            fill="#FB3640"
            class="custom-tabs"
            @change="onClick">
            <el-radio-button 
                v-for="(item, i) in datas"
                :key="i"
                :label="i">{{ item.label }}</el-radio-button>
            <!-- :style="`width: calc(100% / ${datas.length})`" -->
        </el-radio-group>
    </div>
    <!-- UNUSED -->
    <!-- <div id="AppTabs" class="tabs theme-1">
        <button 
            v-if="isScrollable" 
            class="tabs-button" 
            @click="toLeft(path ? path : 'nav-topic')">
            <i class="fa fa-lg fa-angle-left" />
        </button>
        <ul 
            :class="`
                tabs-content 
                ${isFull ? 'full' : ''}
            `" 
            :style="`
                width: ${isScrollable ? 'calc(100% - 70px)' : '100%'}; 
                overflow-x: auto;
            `"
            :id="path ? path : 'nav-topic'">
            <li 
                v-for="(dt, index) in datas" 
                :key="index" 
                :class="selectedIndex === index ? 'active' : ''"
                @click="onClick(index)">
                <div class="display-flex align-center center">
                    <div class="tabs-label">{{ dt.label }}</div>
                    <div v-if="dt.val" class="tabs-val">{{ dt.val }}</div>
                </div>
            </li>
        </ul>
        <button 
            v-if="isScrollable" 
            class="tabs-button" 
            @click="toRight(path ? path : 'nav-topic')">
            <i class="fa fa-lg fa-angle-right" />
        </button>
    </div> -->
</template>

<script>
export default {
    name: 'AppTabs',
    props: {
        selectedIndex: {
            required: false
        },
        data: {
            required: true
        },
        onChange: {
            type: Function,
            required: false
        },

        // UNUSED 
        path: {
            required: false
        },
        isScrollable: {
            type: Boolean,
            required: false,
            default: false
        },
        isFull: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    data () {
        return {
            index: 0,
            datas: this.data,
            tabPosition: 0,
        }
    },
    methods: {
        onClick: function (index) {
            let payload = this.datas && this.datas.map((dt, idx) => {
                return {
                    ...dt,
                    status: idx === index ? 'active' : ''
                }
            })
            this.datas = payload
            this.onChange(index)
        },

        // UNUSED 
        toLeft: function (path) {
			var wd = $('#'+path).width()
			var sc = $('#'+path).scrollLeft()
			if (sc >= 0) {
				$('#'+path).animate({scrollLeft: (sc - wd)}, 500)
			}
		},
		toRight: function (path) {
			var wd = $('#'+path).width()
			var sc = $('#'+path).scrollLeft()
			if (true) {
				$('#'+path).animate({scrollLeft: (sc + wd)}, 500)
			}
		}
    },
    watch: {
        data: function (props) {
            this.datas = props 
        },
        selectedIndex: function (props) {
            this.tabPosition = props 
        }
    }
}
</script>
<style>
.custom-tabs {
    position: relative !important;
    width: 100% !important;
    display: flex !important;
    flex-direction: row !important;
}
.custom-tabs .el-radio-button {
    width: 100% !important;
    display: block !important;
}
.custom-tabs .el-radio-button .el-radio-button__inner {
    width: 100% !important;
}
</style>