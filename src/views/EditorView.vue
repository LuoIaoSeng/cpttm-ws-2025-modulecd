<script setup>
import { NumX, NumY } from '@/assets/config';
import MapEditor from '@/components/MapEditor.vue';
import MapRunner from '@/components/MapRunner.vue';
import router from '@/router';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const maps = ref([
    {
        level: 'level 1',
        data: []
    },
    {
        level: 'level 2',
        data: []
    },
    {
        level: 'level 3',
        data: []
    },
])

if (route.params.useLocalStorage == '1') {
    maps.value = JSON.parse(localStorage.getItem('maps'))
}
else {
    maps.value.forEach((obj) => {
        for (let i = 0; i < NumY; i++) {
            obj.data.push(new Array(NumX).fill(0))
        }
        for (let i = 0; i < NumX; i++) {
            obj.data[NumY - 1][i] = 1
        }
    })
}

const mapIndex = ref(0)

const tool = ref(-1)

onMounted(() => {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('keypress', handleKeyPress)
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
    })
})

function handleKeyPress(e) {
    if (e.key === 'r') {
        if (tool.value === 7) {
            tool.value = 8
        } else if (tool.value === 8) {
            tool.value = 7
        }
    }
}

function loadMap() {
    const input = document.querySelector('#fileInput')
    input.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (!file) {
            alert('请选择一个文件')
        }

        const reader = new FileReader()

        reader.onload = (e) => {
            maps.value = JSON.parse(e.target.result)
        }

        reader.readAsText(file)
    })

    input.click()
}

function handleMouseDown(e) {
    // console.log(e)
    if (e.button === 2) {
        tool.value = -1
    }
}

function toHome() {
    router.push('/')
}

function exportMaps() {
    maps.value = {
        ...maps.value,
        sign: 'HOHOHO'
    }
    const data = JSON.stringify(maps.value)
    const blob = new Blob([data])
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'maps'
    a.click()
}

function playDemo() {
    const map = maps.value[mapIndex.value].data
    let counter = new Array(10).fill(0)
    for (let i = 0; i < NumY; i++) {
        for (let j = 0; j < NumX; j++) {
            counter[map[i][j]]++
        }
    }
    if (counter[2] == 0) {
        alert("Please add one spawn")
        return
    }
    if (counter[2] > 1) {
        alert("Number of spwan cannot greater than 1")
        return
    }
    if (counter[3] == 0) {
        alert("Please add stars")
        return
    }
    isPlayDemo.value = true
}

function backEditor() {
    isPlayDemo.value = false
}

const isPlayDemo = ref(false)

</script>

<template>
    <div class="container">
        <div class="menu-list">
            <div>
                <button @click="mapIndex = 0">Level 1</button>
                <button @click="mapIndex = 1">Level 2</button>
                <button @click="mapIndex = 2">Level 3</button>
            </div>
            <div>
                <button v-if="!isPlayDemo" @click="playDemo">Play&nbsp;Demo</button>
                <button v-else @click="backEditor">Back&nbsp;Editor</button>
                <button @click="loadMap">Import</button>
                <input type="file" id="fileInput">
                <button @click="exportMaps">Export</button>
                <button @click="toHome">
                    Home
                </button>
            </div>
        </div>
        <div class="editor-panel">
            <div v-if="!isPlayDemo" class="tool">
                <button class="tool-button" @click="tool = 2">
                    <img src="/src/assets/Spawn.svg" alt="">
                </button>
                <button class="tool-button" @click="tool = 3">
                    <img src="/src/assets/Star.svg" alt="">
                </button>
                <button class="tool-button" @click="tool = 1">
                    <img src="/src/assets/Block.svg" alt="">
                </button>
                <button class="tool-button" @click="tool = 4">
                    <img src="/src/assets/Spring.svg" alt="">
                </button>
                <button class="tool-button" @click="tool = 5">
                    <img src="/src/assets/LSlope.png" alt="">
                </button>
                <button class="tool-button" @click="tool = 6">
                    <img src="/src/assets/RSlope.png" alt="">
                </button>
                <button class="tool-button" @click="tool = 7">
                    <img src="/src/assets/Platform.png" alt="">
                </button>
                <button class="tool-button" @click="tool = 0">
                    <img src="/src/assets/Erase.svg" alt="">
                </button>
            </div>

            <MapRunner v-if="isPlayDemo" :demo="true" :map="maps[mapIndex].data"></MapRunner>
            <MapEditor v-else :map="maps[mapIndex].data" :tool="tool"></MapEditor>
            {{ tool }}
        </div>
    </div>

</template>

<style scoped>
.container {
    display: flex;
    width: 100%;
    height: 100vh;
}

.menu-list {
    padding: 1rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 0;
}

.menu-list>div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.menu-list button {
    padding: 1rem;
    font-size: 1.2rem;
    border: 1px solid #111;
    background-color: white;
    transition: 100ms;
    box-shadow: 5px 5px 0px 1px #111;
}

.menu-list button:hover {
    background-color: #555;
    color: white;
}

.editor-panel {
    padding: 1rem;
}

.tool {
    display: flex;
    gap: 5px;
    margin-bottom: 1rem;
}

.tool-button {
    width: 70px;
    height: 70px;
    padding: 5px;
    outline: none;
    background-color: white;
    border: 5px solid #111;
}

.tool-button:hover {
    background: #ccc;
}

.tool-button:active {
    background: #ddd;
}

.tool-button>img {
    width: 100%;
    height: 100%;
}

#fileInput {
    display: none;
}
</style>
