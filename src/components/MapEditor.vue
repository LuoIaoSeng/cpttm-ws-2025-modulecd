<script setup>
import { onMounted, useTemplateRef } from 'vue';
import { BlockSize, NumY, NumX } from '@/assets/config';

const props = defineProps([
    'map'
])

const canvasRef = useTemplateRef('canvas')

let ctx = null

function drawBlock(i, j, type) {
    if (ctx === null) {
        alert('ctx is null')
    }
    switch (type) {
        case 0:
            break
        case 1:
            ctx.fillStyle = '#f7941d'
            ctx.fillRect(j * BlockSize, i * BlockSize, BlockSize, BlockSize)
    }
}

function initMap() {
    ctx = canvasRef.value.getContext('2d')

    canvasRef.value.width = BlockSize * NumX
    canvasRef.value.height = BlockSize * NumY

    ctx.fillStyle = '#cef1ff'
    ctx.fillRect(0, 0, BlockSize * NumX, BlockSize * NumY)

    for (let i = 0; i < props.map.length; i++) {
        for (let j = 0; j < props.map[i].length; j++) {
            drawBlock(i, j, props.map[i][j])
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