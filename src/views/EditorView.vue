<script setup>
import { NumX, NumY } from '@/assets/config';
import MapEditor from '@/components/MapEditor.vue';
import { onMounted, ref } from 'vue';

const maps = ref([
    {
        level: 'level1',
        data: [
            ...new Array(NumY).fill(new Array(NumX).fill(0))
        ]
    }
])

maps.value.forEach((obj) => {
    // console.log(obj.data)
    obj.data[NumY - 1] = [...Array(NumX).fill(1)]
})

const mapIndex = ref(0)

const tool = ref(-1)

onMounted(() => {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })
})

function handleMouseDown(e) {
    // console.log(e)
    if(e.button === 2) {
        tool.value = -1
    }
}

</script>

<template>

    <div class="tool">
        <button class="tool-button" @click="tool = 2">
            <img src="/src/assets/Spawn.svg" alt="">
        </button>
        <button class="tool-button" @click="tool = 3">
            <img src="/src/assets/Star.svg" alt="">
        </button>
        <button class="tool-button" @click="tool = 4">
            <img src="/src/assets/Spring.svg" alt="">
        </button>
        <button class="tool-button" @click="tool = 0">
            <img src="/src/assets/Erase.svg" alt="">
        </button>
    </div>

    <MapEditor :map="maps[mapIndex].data" :tool="tool"></MapEditor>

    {{ tool }}

</template>

<style scoped>
.tool {
    display: flex;
}

.tool-button {
    width: 50px;
    height: 50px;
    outline: none;
    border: none;
}

.tool-button:hover {
    background: #ccc;
}

.tool-button:active {
    background: #ddd;
}

.tool-button > img {
    width: 100%;
    height: 100%;
}
</style>
