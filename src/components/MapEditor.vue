<script setup>
import { onMounted, useTemplateRef } from 'vue';
import { BlockSize, NumY, NumX } from '@/assets/config';

const props = defineProps([
    'map'
])

const canvasRef = useTemplateRef('canvas')

let ctx = null

function initMap() {
    ctx = canvasRef.value.getContext('2d')

    canvasRef.value.width = BlockSize * NumX
    canvasRef.value.height = BlockSize * NumY

    ctx.fillStyle = '#cef1ff'
    ctx.fillRect(0, 0, BlockSize * NumX, BlockSize * NumY)

    for (let i = 0; i < props.map.length; i++) {
        for (let j = 0; j < props.map[i].length; j++) {
            
        }
    }
}

onMounted(() => {
    initMap()
})

</script>

<template>
    <canvas ref="canvas"></canvas>
</template>

<style scoped></style>