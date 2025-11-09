<script setup>
import { onActivated, onMounted, useTemplateRef } from 'vue';
import { BlockSize, NumY, NumX } from '@/assets/config';

const props = defineProps([
    'map',
    'tool'
])

console.log(props.map)

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
            const image = new Image()
            image.src = '/src/assets/Block.svg'
            ctx.drawImage(image, j * BlockSize, i * BlockSize, BlockSize, BlockSize)
    }
}

function drawMap() {
    
    ctx.fillStyle = '#cef1ff'
    ctx.fillRect(0, 0, BlockSize * NumX, BlockSize * NumY)

    for (let i = 0; i < props.map.length; i++) {
        for (let j = 0; j < props.map[i].length; j++) {
            drawBlock(i, j, props.map[i][j])
        }
    }
}

function initMap() {

    canvasRef.value.width = BlockSize * NumX
    canvasRef.value.height = BlockSize * NumY

    drawMap()
}

function handleMousemove(e) {
    if (props.tool !== -1) {

        drawMap()

        const rect = canvasRef.value.getBoundingClientRect()
        let [sx, sy] = [e.clientX - rect.x, e.clientY - rect.y]
        let [x, y] = [
            parseInt(sx / BlockSize),
            parseInt(sy / BlockSize)
        ]
        console.log(x, y)
        drawBlock(y, x, props.tool)
    }
}

onMounted(() => {
    ctx = canvasRef.value.getContext('2d')
    initMap()
    canvasRef.value.addEventListener('mousemove', handleMousemove)
})

</script>

<template>
    <canvas ref="canvas"></canvas>
</template>

<style scoped></style>