<script setup>

import { computed, getCurrentInstance, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { BlockSize, NumY, NumX } from '@/assets/config'

const props = defineProps([
    'map',
    'demo',
    'pause'
])

const emit = defineEmits([
    'next',
    'onFinished',
    'hpLose'
])

const canvasRef = useTemplateRef('canvas')
const playerImageRef = useTemplateRef('playerImage')
const starImageRef = useTemplateRef('starImage')
const springImageRef = useTemplateRef('springImage')
const platformImageRef = useTemplateRef('PlatformImage')

let ctx = null
let loopId = null
let keySet = new Set()

const game = ref({
    stars: 0,
    time: 0,
    hp: 3,
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
    dir: 1,
    grounded: true
}

let resetPlayer = null

let platforms = []

function drawVariantBlock(x, y) {
    const m = props.map
    let [t, l, r, b] =
        [
            m[y - 1]?.[x] ?? 0,
            m[y]?.[x - 1] ?? 0,
            m[y]?.[x + 1] ?? 0,
            m[y + 1]?.[x] ?? 0
        ]
    let [tl, tr, bl, br] =
        [
            m[y - 1]?.[x - 1] ?? 0,
            m[y - 1]?.[x + 1] ?? 0,
            m[y + 1]?.[x - 1] ?? 0,
            m[y + 1]?.[x + 1] ?? 0
        ]
    t = t > 1 ? 0 : t
    r = r > 1 ? 0 : r
    b = b > 1 ? 0 : b
    l = l > 1 ? 0 : l
    ctx.fillStyle = '#1DF74C'
    ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize, BlockSize)
    ctx.fillStyle = '#F7941D'
    if (tl && t && tr && l && r && bl && b && br) {
        ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize, BlockSize)
    } else if (!(t || r || b || l)) {
        ctx.fillRect(x * BlockSize + 5, y * BlockSize + 5, BlockSize - 10, BlockSize - 10)
    } else if (!(t || r || b) && l) {
        ctx.fillRect(x * BlockSize, y * BlockSize + 5, BlockSize - 5, BlockSize - 10)
    } else if (!(t || l || b) && r) {
        ctx.fillRect(x * BlockSize + 5, y * BlockSize + 5, BlockSize - 5, BlockSize - 10)
    } else if (!(l || r || b) && t) {
        ctx.fillRect(x * BlockSize + 5, y * BlockSize, BlockSize - 10, BlockSize - 5)
    } else if (!(t || r || l) && b) {
        ctx.fillRect(x * BlockSize + 5, y * BlockSize + 5, BlockSize - 10, BlockSize - 5)
    } else if (t && r && b && l) {
        ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize, BlockSize)
    } else if (!(t || b) && l && r) {
        ctx.fillRect(x * BlockSize, y * BlockSize + 5, BlockSize, BlockSize - 10)
    } else if (!(l || r) && t && b) {
        ctx.fillRect(x * BlockSize + 5, y * BlockSize, BlockSize - 10, BlockSize)
    } else if (!(t || l) && b && r) {
        ctx.fillRect(x * BlockSize + 5, y * BlockSize + 5, BlockSize - 5, BlockSize - 5)
    } else if (!(t || r) && l && b) {
        ctx.fillRect(x * BlockSize, y * BlockSize + 5, BlockSize - 5, BlockSize - 5)
    } else if (!(b || l) && t && r) {
        ctx.fillRect(x * BlockSize + 5, y * BlockSize, BlockSize - 5, BlockSize - 5)
    } else if (!(b || r) && l && t) {
        ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize - 5, BlockSize - 5)
    } else if (t && r && b && !l) {
        ctx.fillRect(x * BlockSize + 5, y * BlockSize, BlockSize - 5, BlockSize)
    } else if (t && r && !b && l) {
        ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize, BlockSize - 5)
    } else if (t && !r && b && l) {
        ctx.fillRect(x * BlockSize, y * BlockSize, BlockSize - 5, BlockSize)
    } else if (!t && r && b && l) {
        ctx.fillRect(x * BlockSize, y * BlockSize + 5, BlockSize, BlockSize - 5)
    }
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
            drawVariantBlock(x, y)
            break
        case 2:
            if (player.dir === -1) {
                ctx.save() // Save the current canvas state

                // Translate the origin to the right side of where the rect will be drawn
                ctx.translate(player.x * BlockSize + BlockSize, player.y * BlockSize)

                // Scale the x-axis by -1 (flips horizontally)
                ctx.scale(-1, 1)

                // Draw the rectangle at the original top-left corner relative to the new origin
                ctx.drawImage(playerImageRef.value, 0, 0, BlockSize, BlockSize)

                ctx.restore() // Restore the canvas to its original state
            } else {
                ctx.drawImage(playerImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            }
            break
        case 3:
            ctx.drawImage(starImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
        case 4:
            ctx.drawImage(springImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
            break
        case 5:
            ctx.fillStyle = '#1DF74C'
            ctx.beginPath()
            ctx.moveTo(x * BlockSize, (y + 1) * BlockSize)
            ctx.lineTo((x + 1) * BlockSize, y * BlockSize)
            ctx.lineTo((x + 1) * BlockSize, (y + 1) * BlockSize)
            ctx.closePath()
            ctx.fill()
            break
        case 6:
            ctx.fillStyle = '#1DF74C'
            ctx.beginPath()
            ctx.moveTo((x + 1) * BlockSize, (y + 1) * BlockSize)
            ctx.lineTo(x * BlockSize, y * BlockSize)
            ctx.lineTo(x * BlockSize, (y + 1) * BlockSize)
            ctx.closePath()
            ctx.fill()
            break
        case 7:
        case 8:
            ctx.drawImage(platformImageRef.value, x * BlockSize, y * BlockSize, BlockSize, BlockSize)
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
            const type = props.map[i][j]
            if (type == -2) continue
            if (type == 2) {
                player.x = j
                player.y = i
            } else {
                if (type == 3) {
                    game.value.stars++
                }
                if (type == 7 || type == 8) {
                    platforms.push({
                        x: j,
                        y: i,
                        px: j,
                        py: i,
                        dir: 1,
                        type: type
                    })
                } else {
                    objects.push({
                        x: j,
                        y: i,
                        px: j,
                        py: i,
                        dir: 1,
                        type: type
                    })
                }
            }
            drawBlock(j, i, type)
        }
    }

    resetPlayer = structuredClone(player)
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
        y1 + h1 > y2    // Top edge of rect1 is above bottom edge of rect2
}

function checkCollision(x, y, arr) {
    let o = null
    arr.forEach((obj) => {
        if (obj.type != 0) {
            const flag = isInteract(x, y, obj.x, obj.y)
            if (flag && o == null) {
                o = obj
                return
            }
        }
    })
    return o
}

function handleVariantCollision(obj, xobj, yobj) {
    switch (obj.type) {
        case 1:
            player.sy = 0
            player.y = Math.ceil(player.y)
            player.grounded = true
            break
        // star
        case 3:
            drawBlock(obj.x, obj.y, 0)
            objects = objects.filter((o) => {
                return !(obj.x == o.x && obj.y == o.y)
            })
            game.value.stars--
            break
        // spring
        case 4:
            player.x = player.px
            player.sx = 0
            player.sy = -40
            break
        case 5:
            player.y = obj.y + obj.x - player.x - 1
            player.y = obj.x - player.x < 0 ? obj.y - 1 : player.y
            if (player.x - player.px < 0) {
                player.y = obj.x - player.x > 1 ? obj.y : player.y
            }
            break
        case 6:
            player.y = obj.y + -(obj.x - player.x) - 1
            player.y = obj.x - player.x > -0.01 ? obj.y - 1 : player.y
            if (player.x - player.px > 0) {
                player.y = obj.x - player.x < -1 ? obj.y : player.y
            }
            break
    }
}

function handlePlatformCollision(platform) {
    if (player.y > platform.y + 0.5) {
        player.sy = 0
        player.y = platform.y + 1
    } else if (player.y < platform.y - 1 + 0.1 && player.x > platform.x && player.x < platform.x + 1) {
        player.y = platform.y - 1
        player.grounded = true
        player.sy = 0
    } else if (player.y >= platform.y) {
        player.x = resetPlayer.x
        player.y = resetPlayer.y
        player.sx = player.sy = 0
        player.dir = 1

        if (!props.demo) {
            game.value.hp--
            if (game.value.hp === 0) {
                game.value.pause = true
            }
        }
    }
}

function handleCollision() {

    let platform = checkCollision(player.x, player.y, platforms)
    if (platform != null) {
        handlePlatformCollision(platform)
        return
    }

    let xobj = checkCollision(player.x, player.y, objects)

    if (xobj != null) {
        if (xobj.type == 1) {
            player.x = player.px
        }
    }

    player.sy += 1
    player.y += player.sy / 120

    let yobj = checkCollision(player.px, player.y, objects)

    if (yobj != null) {
        if (yobj.type != -1) {
            player.y = player.py
        }
    }

    if (xobj !== null || yobj !== null) {

        if (xobj != null) {
            handleVariantCollision(xobj, xobj, yobj)
        } else if (yobj != null) {
            handleVariantCollision(yobj, xobj, yobj)
        }
    }

    if (game.value.stars == 0) {
        game.value.finished = true

        if (!props.demo) {
            emit('onFinished')
        }
    }
}

function input() {
    const speed = 10
    player.sx = 0
    if (keySet.has('a')) {
        player.sx = -1
    }
    if (keySet.has('w') && player.grounded) {
        player.sy = -30
        player.grounded = false
    }
    if (keySet.has('d')) {
        player.sx = 1
    }
    player.x += speed * player.sx / 120
}

function loop() {
    if (!game.value.finished && !props.pause) {

        platforms.forEach((platform) => {
            drawBlock(platform.x, platform.y, 0)
            if (platform.type === 7) {
                platform.x += platform.dir * 0.05
                if (platform.x > platform.px + 1) {
                    platform.x = platform.px + 1
                    platform.dir = -1
                }
                if (platform.x < platform.px - 1) {
                    platform.x = platform.px - 1
                    platform.dir = 1
                }
                drawBlock(platform.x, platform.y, 7)
            } else {

                platform.y += platform.dir * 0.05
                if (platform.y > platform.py + 1) {
                    platform.y = platform.py + 1
                    platform.dir = -1
                }
                if (platform.y < platform.py - 1) {
                    platform.y = platform.py - 1
                    platform.dir = 1
                }
                drawBlock(platform.x, platform.y, 8)
            }
        })

        player.px = player.x
        player.py = player.y
        drawBlock(player.px, player.py, 0)
        input()
        handleCollision()
        // if (Math.sqrt((player.x - player.px) ** 2 + (player.y - player.py) ** 2) > 10) {
        //     player.x = player.px
        //     player.y = player.py
        // }
        // if (player.sx == 0 && player.grounded) {
        //     player.sy = 0
        //     player.y = Math.ceil(player.y)
        // }
        if (player.x > player.px) {
            player.dir = 1
        } else if (player.x < player.px) {
            player.dir = -1
        }
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
    <img ref="playerImage" src="/src/assets/Player.svg" alt="">
    <img ref="springImage" src="/src/assets/Spring.svg" alt="">
    <img ref="starImage" src="/src/assets/Star.svg" alt="">
    <img ref="PlatformImage" src="/src/assets/Platform.png" alt="">
    <div v-if="game.finished">
        <div v-if="props.demo" class="demo-finished-tip">
            You Finished This Level
        </div>
        <div v-else>
            <div v-if="getCurrentInstance().vnode.key < 2">
                <span>You Won!</span>
                <button @click="emit('next')">Next</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.demo-finished-tip {
    font-size: 2rem;
    font-weight: bold;
}

img {
    display: none;
}
</style>