<template>
    <div>
        <el-input 
            :size="size"
            :maxlength="maxlength"
            :placeholder="placeholder"
            :controls="true"
            v-model="inputValue"
            @input="onInput"
            @blur="onBlur"
            :style="inputStyle"
            :disabled="disabled">
            <template slot="prepend"><slot></slot></template>
        </el-input>
    </div>
</template>
<script>
export default {
    props: {
        placeholder: {
            default: '0'
        },
        value: {
            default: undefined,
        },
        intOnly: {
            default: false,
        },
        center: {
            type: Boolean,
            default: false,
        },
        size: {
            default: undefined,
        },
        width: {
            default: undefined,
        },
        minWidth: {
            default: undefined,
        },
        thousandSeparated: {
            type: Boolean,
            default: false,
        },
        typingTimeout: {
            type: Number,
            default: 0,
        },
        maxlength: {
            type: Number,
            default: undefined,
        },
        max: {
            default: Infinity,
        },
        min: {
            default: -Infinity,
        },
        disabled: {
            default: false,
        },
    },
    data() {
        return {
            inputValue: this.thousandSeparated
                ? this.thousandSeparator(this.value)
                : this.value,
            numberValue: 0,
            typingTimeoutTimer: null,
        }
    },
    methods: {
        onInput() {
            this.numberValue = this.numberValidator(this.inputValue)

            if (this.thousandSeparated) {
                this.inputValue = this.thousandSeparator(this.numberValue)
            }

            let emitted = Number(this.numberValue)
            if (this.typingTimeout) {
                clearTimeout(this.typingTimeoutTimer)
                this.typingTimeoutTimer = setTimeout(() => {
                this.$emit('input', emitted)
                }, this.typingTimeout)
            } else {
                this.$emit('input', emitted)
            }
        },
        onBlur() {
            let emitted = Number(this.numberValue)
            if (emitted > this.max) {
                this.thousandSeparated
                ? (this.inputValue = this.thousandSeparator(this.max))
                : this.max
                this.numberValue = this.numberValidator(this.inputValue)
                this.$emit('input', this.max)
            }
        },
        numberValidator(input) {
            if (
                String(input).replace(/[^.]/g, '').length > 1 ||
                input > this.max ||
                input < this.min
            ) {
                return this.numberValue
            }
            return String(input).replace(/[^.\d]/g, '')
        },
        thousandSeparator(input) {
            let splitted = String(input).split('.')

            let characteristic = splitted[0]
            let mantissa = null
            if (splitted.length > 1) {
                mantissa = splitted[1]
            }
            let separated = characteristic.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            if (mantissa !== null) {
                return separated + '.' + mantissa
            } else {
                return separated
            }
        },
    },
    computed: {
        inputStyle() {
            return {
                minWidth: this.minWidth,
                width: this.width,
            }
        },
    },
    watch: {
        value() {
            this.inputValue = this.thousandSeparated
                ? this.thousandSeparator(this.value)
                : this.value
        },
    },
}
</script>