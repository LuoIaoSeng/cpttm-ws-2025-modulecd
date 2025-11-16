<script setup>
import { onMounted, useTemplateRef, watch } from 'vue';
import { BlockSize, NumY, NumX } from '@/assets/config';

const props = defineProps([
    'map',
    'tool'
])


const canvasRef = useTemplateRef('canvas')
const blockImageRef = useTemplateRef('blockImage')
const spawnImageRef = useTemplateRef('spawnImage')
const starImageRef = useTemplateRef('starImage')
const springImageRef = useTemplateRef('springImage')

let ctx = null

let x = -1, y = -1
let prevX, prevY, prevV
let dragStartX, dragStartY

let isDragging = false

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

function canPlace(x, y, type) {
    if (type != 0 && props.map[y][x] != 0) {
        return false
    }
    switch (type) {
        case 0:
        case 1:
        case 4:
            return true
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

function handleMousemove(e) {
    if (props.tool !== -1) {

        const rect = canvasRef.value.getBoundingClientRect()
        const [sx, sy] = [e.clientX - rect.x, e.clientY - rect.y]

        x = parseInt(sx / BlockSize)
        y = parseInt(sy / BlockSize)

        if (prevX != x || prevY != y) {

            drawBlock(prevX, prevY, prevV)
        }

        if (isDragging && props.tool == 1) {
            drawMap()
            const dir = Math.abs(x - dragStartX) > Math.abs(y - dragStartY) ? 'x' : 'y'
            if (dir == 'x') {
                for (let i = Math.min(x, dragStartX); i <= Math.max(x, dragStartX); i++) {
                    drawBlock(i, dragStartY, 1)
                }
            } else {
                for (let i = Math.min(y, dragStartY); i <= Math.max(y, dragStartY); i++) {
                    drawBlock(dragStartX, i, 1)
                }
            }
        }


        prevX = x
        prevY = y
        prevV = props.map[y][x]

        drawBlock(x, y, props.tool)
    }
}

function handleMousedown(e) {
    if (e.button == 0) {
        isDragging = true
        dragStartX = x
        dragStartY = y
    }
}

function handleMouseup(e) {
    if (dragStartX == x && dragStartY == y && props.tool != -1 && isDragging) {
        isDragging = false
        if (canPlace(x, y, props.tool)) {
            props.map[y][x] = props.tool
        }
    } else if ((dragStartX != x || dragStartY != y) && props.tool == 1 && isDragging) {

        const dir = Math.abs(x - dragStartX) > Math.abs(y - dragStartY) ? 'x' : 'y'
        if (dir == 'x') {
            for (let i = Math.min(x, dragStartX); i <= Math.max(x, dragStartX); i++) {
                if (canPlace(i, dragStartY, 1)) {
                    props.map[dragStartY][i] = props.tool
                }
            }
        } else {
            for (let i = Math.min(y, dragStartY); i <= Math.max(y, dragStartY); i++) {
                if (canPlace(dragStartX, i, 1)) {
                    props.map[i][dragStartX] = props.tool
                }
            }
        }

        isDragging = false
    }
    drawMap()
}

watch(() => props.tool, async (n, o) => {
    if (n == -1 && o != -1) {
        drawBlock(prevY, prevX, prevV)
    }
})

onMounted(() => {
    ctx = canvasRef.value.getContext('2d')
    initMap()
    canvasRef.value.addEventListener('mousemove', handleMousemove)
    canvasRef.value.addEventListener('mousedown', handleMousedown)
    canvasRef.value.addEventListener('mouseup', handleMouseup)
})

</script>

<template>
    <canvas ref="canvas"></canvas>
    <img ref="blockImage" src="/src/assets/Block.svg" alt="">
    <img ref="spawnImage" src="/src/assets/Spawn.svg" alt="">
    <img ref="springImage" src="/src/assets/Spring.svg" alt="">
    <img ref="starImage" src="/src/assets/Star.svg" alt="">
    {{ props.map }}
</template>

<style scoped>
img {
    display: none;
}
</style>