<template>
    <!-- 显示svg图标 -->
    <svg style="{width,height}">
        <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
</template>
<script setup lang="ts">
// 定义props
defineProps({
    // 矢量图前缀 
    prefix: {
        type: String,
        default: '#icon-'
    },
    'name': String,
    'color': {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '16px'
    },
    height: {
        type: String,
        default: '16px'
    },
})

</script>