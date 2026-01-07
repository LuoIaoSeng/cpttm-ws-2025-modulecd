<script setup>
import { computed, ref } from 'vue';

const levelIndex = ref(0)

const records = ref(JSON.parse(localStorage.getItem('rank')))

const displayTable = computed(() => {
    const r = records.value
    console.log(r)
    r.sort((a, b) => {
        const ra = a.levelRecords[levelIndex.value]
        const rb = b.levelRecords[levelIndex.value]
        if (ra.time > rb.time) {
            return 1
        } else {
            return -1
        }
    })
    return r
})

function formatTime(t) {
    return `${(parseInt(t / 60000) + '').padStart(2, '0')}:${(parseInt(t / 1000) + '').padStart(2, '0')}:${(t % 1000 + '').padStart(3, '0')}`
}

</script>

<template>
    <div class="app">
        <div class="level-list">
            <button @click="levelIndex = 0" :class="levelIndex == 0 ? 'current' : ''">Level 1</button>
            <button @click="levelIndex = 1" :class="levelIndex == 1 ? 'current' : ''">Level 2</button>
            <button @click="levelIndex = 2" :class="levelIndex == 2 ? 'current' : ''">Level 3</button>
        </div>
        <!-- {{ records }} -->
        <div v-if="records != null" class="table-wrapper">
            <table>
                <tr>
                    <th>
                        Rank
                    </th>
                    <th>
                        Name
                    </th>
                    <th>
                        Time
                    </th>
                    <th>
                        Hp
                    </th>
                </tr>
                <tr v-for="(col, index) in displayTable">
                    <td>
                        {{ index + 1 }}
                    </td>
                    <td>
                        {{ col.nickname }}
                    </td>
                    <td>
                        {{ formatTime(col.levelRecords[levelIndex].time) }}
                    </td>
                    <td>
                        {{ col.levelRecords[levelIndex].hp }}
                    </td>
                </tr>
            </table>
        </div>
        <div v-else class="table-wrapper">
            <span>No Records</span>
        </div>

        <RouterLink class="link-button" to="/">Home</RouterLink>
    </div>
</template>

<style scoped>
.app {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
}

.link-button {
    padding: 0.6rem 1.3rem;
    box-sizing: border-box;
    border: 1px solid #111;
    background-color: white;
    transition: 275ms;
    font-size: 1.2rem;
    text-decoration: none;
    color: #111;
    cursor: pointer;
    box-shadow: 5px 5px 0px 1px #111;
}

.link-button:hover {
    background-color: #555;
    color: white;
}

.level-list {
    display: flex;
    gap: 2rem;
}

.level-list button {
    padding: 0.6rem 1.3rem;
    font-size: 1.4rem;
}

.level-list button {
    padding: 1rem;
    font-size: 1.2rem;
    border: 1px solid #111;
    background-color: white;
    transition: 100ms;
    box-shadow: 5px 5px 0px 1px #111;
}

.level-list button:hover {
    background-color: #555;
    color: white;
}

.current {
    background-color: #555 !important;
    color: white;
}

.table-wrapper {
    padding: 0.6rem 3rem;
    border-radius: 2rem;
    background-color: white;
    border: 1px solid #111;
}

table {
    table-layout: auto;
    background-color: white;
    border-collapse: collapse;
    width: 50%;
}

td,
th {
    padding: 1rem;
    text-align: center;
    border-bottom: 2px solid #111;
}
</style>
