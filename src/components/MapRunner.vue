<script setup>

import { onMounted, useTemplateRef } from 'vue';
import { BlockSize, NumY, NumX } from '@/assets/config';

const props = defineProps([
    'map',
    'demo'
])

const canvasRef = useTemplateRef('canvas')
const blockImageRef = useTemplateRef('blockImage')
const spawnImageRef = useTemplateRef('spawnImage')
const starImageRef = useTemplateRef('starImage')
const springImageRef = useTemplateRef('springImage')

let ctx = null

function drawBlock(x, y, type) {
    if (ctx === null) {
        alert('ctx is null')
    }
    switch (type) {
        case 0:
            ctx.fillStyle = '#cef1ff'
            ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
        case 1:
            ctx.drawImage(blockImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
        case 2:
            ctx.drawImage(spawnImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
        case 3:
            ctx.drawImage(starImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
        case 4:
            ctx.drawImage(springImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
    }
}
function drawMap() {

    ctx.fillStyle = '#cef1ff'
    ctx.fillRect(0, 0, BlockSize * NumX, BlockSize * NumY)

    for (let i = 0; i < props.map.length; i++) {
        for (let j = 0; j < props.map[i].length; j++) {
            drawBlock(j, i, props.map[i][j])
        }
    }
}
function initMap() {

    canvasRef.value.width = BlockSize * NumX
    canvasRef.value.height = BlockSize * NumY

    drawMap()
}

onMounted(() => {
    ctx = canvasRef.value.getContext('2d')
    initMap()
})

</script>

<template>
    <canvas ref="canvas"></canvas>
    <img ref="blockImage" src="/src/assets/Block.svg" alt="">
    <img ref="spawnImage" src="/src/assets/Spawn.svg" alt="">
    <img ref="springImage" src="/src/assets/Spring.svg" alt="">
    <img ref="starImage" src="/src/assets/Star.svg" alt="">
</template>

<style scoped>
img {
    display: none;
}
</style>