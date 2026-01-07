<script setup>

import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { BlockSize, NumY, NumX } from '@/assets/config';

const props = defineProps([
    'map',
    'demo'
])

const canvasRef = useTemplateRef('canvas')
const blockImageRef = useTemplateRef('blockImage')
const playerImageRef = useTemplateRef('playerImage')
const starImageRef = useTemplateRef('starImage')
const springImageRef = useTemplateRef('springImage')

let ctx = null
let loopId = null
let keySet = new Set()

const game = ref({
    stars: 0,
    time: 0,
    hp: 3,
    pause: false,
    finished: false
})

let objects = []
let player = {
    x: -1,
    y: -1,
    px: 0,
    py: 0,
    sx: 0,
    sy: 0,
    grounded: true
}

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
            ctx.drawImage(playerImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
        case 3:
            ctx.drawImage(starImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
        case 4:
            ctx.drawImage(springImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
    }
}

function initMap() {

    canvasRef.value.width = BlockSize * NumX
    canvasRef.value.height = BlockSize * NumY

    ctx.fillStyle = '#cef1ff'
    ctx.fillRect(0, 0, BlockSize * NumX, BlockSize * NumY)

    for (let i = 0; i < props.map.length; i++) {
        for (let j = 0; j < props.map[i].length; j++) {
            if (props.map[i][j] == 2) {
                player.x = j
                player.y = i
            } else {
                if (props.map[i][j] == 3) {
                    game.value.stars++
                }
                objects.push({
                    x: j,
                    y: i,
                    px: j,
                    py: i,
                    type: props.map[i][j]
                })
            }
            drawBlock(j, i, props.map[i][j])
        }
    }
}

onMounted(() => {
    ctx = canvasRef.value.getContext('2d')
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    initMap()
    loopId = requestAnimationFrame(loop)
})

function onKeyUp(e) {
    keySet.delete(e.key)
}

function onKeyDown(e) {
    keySet.add(e.key)
}

function isInteract(x1, y1, x2, y2) {
    const [w1, h1, w2, h2] = [1, 1, 1, 1]
    // Check if the rectangles intersect
    return x1 < x2 + w2 &&  // Right edge of rect1 is right of left edge of rect2
        x1 + w1 > x2 &&  // Left edge of rect1 is left of right edge of rect2
        y1 < y2 + h2 &&  // Bottom edge of rect1 is below top edge of rect2
        y1 + h1 > y2;    // Top edge of rect1 is above bottom edge of rect2
}

function checkCollision(x, y) {
    let o = null
    objects.forEach((obj) => {
        if (obj.type != 0) {
            const flag = isInteract(x, y, obj.x, obj.y)
            if (flag && o == null) {
                o = obj
            }
        }
    })
    return o
}

function handleCollision() {

    let xobj = checkCollision(player.x, player.py)

    if (xobj != null) {
        if (xobj.type == 1) {
            player.x = player.px
        }
    }

    player.sy += 9.8 / 60
    player.y += player.sy / 60

    let yobj = checkCollision(player.px, player.y)

    if (yobj != null) {
        if (yobj.type != -1) {
            player.y = player.py
        }
    }

    if (xobj != null) {
        if (xobj.type == 3) {
            drawBlock(xobj.x, xobj.y, 0)
            objects = objects.filter((obj) => {
                return !(obj.x == xobj.x && obj.y == xobj.y)
            })
            game.value.stars--
        }
    } else if (yobj != null) {
        if (yobj.type == 3) {
            drawBlock(yobj.x, yobj.y, 0)
            objects = objects.filter((obj) => {
                return !(obj.x == yobj.x && obj.y == yobj.y)
            })
            game.value.stars--
        }
    }
    if (game.value.stars == 0) {
        game.value.pause = true
        game.value.finished = true
    }
}

function input() {
    const speed = 10
    player.sx = 0
    if (keySet.has('a')) {
        player.sx = -1
    }
    if (keySet.has('w') && player.grounded) {
        player.sy = -10
        player.grounded = false
    }
    if (keySet.has('d')) {
        player.sx = 1
    }
    player.x += player.sx * speed / 60
}

function loop() {
    if (!game.value.pause) {
        player.px = player.x
        player.py = player.y
        drawBlock(player.px, player.py, 0)
        let b = checkCollision(player.x, player.y + 0.5)
        if (b != null) {
            if (b.type == 1) {
                player.grounded = true
            }
        }
        input()
        handleCollision()
        drawBlock(player.x, player.y, 2)
    }
    loopId = requestAnimationFrame(loop)
}

onUnmounted(() => {
    cancelAnimationFrame(loopId)
})

</script>

<template>
    <canvas ref="canvas"></canvas>
    <img ref="blockImage" src="/src/assets/Block.svg" alt="">
    <img ref="playerImage" src="/src/assets/Player.svg" alt="">
    <img ref="springImage" src="/src/assets/Spring.svg" alt="">
    <img ref="starImage" src="/src/assets/Star.svg" alt="">
    <div v-if="game.finished">
        <div v-if="props.demo">
            You Finished This Level
        </div>
    </div>
</template>

<style scoped>
img {
    display: none;
}
</style>