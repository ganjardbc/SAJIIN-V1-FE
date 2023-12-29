<template>
    <div :class="`padding padding-x-2px ${background} border-small-radius margin margin-right-5px`">
        <div :class="`fonts fonts-8 semibold ${color} margin margin-y-5px`">
            {{ label }}
        </div>
    </div>
</template>
<script>
export default {
    props: {
        label: {
            default: '',
            required: true,
        },
        background: {
            default: 'bg-white',
            required: true,
        },
        color: {
            default: 'black',
            required: true,
        }
    }
}
</script>