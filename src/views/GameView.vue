<script setup>
import MapRunner from '@/components/MapRunner.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const maps = ref(JSON.parse(localStorage.getItem('maps')))

let startTime = new Date()

const timer = ref()

const hp = ref(3)

const pause = ref(false)

const router = useRouter()

const key = ref(0)

let k = setInterval(updateTimer, 1)

const formatTimer = computed(() => {
    const v = timer.value
    return `${(parseInt(v / 60000) % 60 + '').padStart(2, '0')}:${(parseInt(v / 1000) % 60 + '').padStart(2, '0')}:${(v % 1000 + '').padStart(3, '0')}`
})

const mapIndex = ref(0)

const finished = ref(false)

const records = {
    nickname: '',
    levelRecords: []
}

function toHome() {
    router.push('/')
}

function updateTimer() {
    timer.value = new Date() - startTime
}

function onLevelFinished() {
    records.levelRecords.push({
        level: mapIndex.value + 1,
        time: timer.value,
        hp: hp.value
    })
    clearInterval(k)
    finished.value = true
}

function nextLevel() {
    if (mapIndex.value < 2) {
        mapIndex.value++
        hp.value = 3
        startTime = new Date()
        k = setInterval(updateTimer, 1)
        finished.value = false
        key.value += 1
        pause.value = false
    }
}

function onPause() {
    if (hp.value > 0) {
        if (pause.value) {
            k = setInterval(updateTimer, 1)
        } else {
            clearInterval(k)
        }
        pause.value = !pause.value
    }
}

function onHpLose() {
    hp.value -= 1
    if (hp.value === 0) {
        pause.value = true
        clearInterval(k)
    }
}

function onSubmitRecord() {
    let a = localStorage.getItem('rank')
    const name = document.querySelector('#nickname').value
    records.nickname = name
    if (!a) {
        let arr = []
        arr.push(records)
        localStorage.setItem('rank', JSON.stringify(arr))
    } else {
        let b = JSON.parse(a)
        b.push(records)
        localStorage.setItem('rank', JSON.stringify(b))
    }
    router.push('/rank')
}

function resetGame() {
    hp.value = 3
    startTime = new Date()
    k = setInterval(updateTimer, 1)
    finished.value = false
    key.value += 1
    pause.value = false
}

</script>

<template>
    <div class="container">
        <div class="menu-list">
            <div>
                <button :class="mapIndex == 0 ? 'current' : ''">Level&nbsp;1</button>
                <button :class="mapIndex == 1 ? 'current' : ''">Level 2</button>
                <button :class="mapIndex == 2 ? 'current' : ''">Level 3</button>
            </div>
            <div>
                <button @click="onPause" class="clickable">
                    Pause
                </button>
                <button @click="toHome" class="clickable">
                    Home
                </button>
            </div>
        </div>
        <div>
            <div style="display: flex; gap: 1rem;">
                <div>
                    <div>Timer</div>
                    <div>{{ formatTimer }}</div>
                </div>
                <div>
                    <div>Hit Point</div>
                    <div>
                        <span v-for="i in hp">❤️</span>
                    </div>
                </div>
            </div>
            <MapRunner :map="maps[mapIndex].data" :demo="false" @onFinished="onLevelFinished" @next="nextLevel"
                @hpLose="onHpLose" :pause="pause" :key="key" />
            <div v-if="hp === 0">
                <button @click="resetGame" class="submit">Retry</button>
            </div>
            <div v-if="mapIndex == 2 && finished">
                <input type="text" id="nickname" placeholder="Input your nickname">
                <button @click="onSubmitRecord" class="submit">Submit</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#nickname {
    padding: 0.5rem;
    font-size: 1.4rem;
    outline: 0;
    margin-right: 1rem;
}

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
    width: 33%;
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
    transition: 100ms;
    box-shadow: 5px 5px 0px 1px #111;
}

.submit {
    padding: 1rem;
    font-size: 1.2rem;
    border: 1px solid #111;
    transition: 100ms;
    box-shadow: 5px 5px 0px 1px #111;
}

.clickable:hover, .submit:hover {
    background-color: #555;
    color: white;
}

.current {
    background-color: #555;
    color: white;
}
</style>
