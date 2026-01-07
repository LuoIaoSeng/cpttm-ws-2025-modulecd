<script setup>
import MapEditor from '@/components/MapEditor.vue';
import { useRouter } from 'vue-router';

const maps = JSON.parse(localStorage.getItem('maps'))
const router = useRouter()

if (maps === null) {
    alert('No Maps')
    router.push('/')
}

if (maps.sign !== 'HOHOHO') {
    alert('Invalid Map')
    router.push('/')
}

</script>

<template>
    <div class="app">
        <h1>Preview</h1>
        <div class="preview">
            <div class="preview-wrapper" v-for="map in maps">
                <MapEditor v-if="map.data" :map="map.data"></MapEditor>
            </div>
        </div>
        <div class="button-list">
            <button>
                Start Game
            </button>
            <button>
                Rank
            </button>
            <button @click="() => {
                router.push({
                    path: '/editor/1',
                })
            }">
                Edit
            </button>
            <button @click="() => {
                router.push('/')
            }">
                Home
            </button>
        </div>
    </div>
</template>

<style scoped>
.app {
    width: 100%;
    height: 100vh;
    padding: 1rem 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
}

.preview {
    display: flex;
    gap: 4rem;
}

.preview-wrapper {
    zoom: 0.4;
}

.button-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.button-list button {
    padding: 1rem 4rem 1rem 2rem;
    box-sizing: border-box;
    border: 1px solid #111;
    background-color: white;
    transition: 100ms;
    font-size: 1.2rem;
    text-decoration: none;
    color: #111;
    cursor: pointer;
    box-shadow: 5px 5px 0px 1px #111;
    text-align: start;
}

.button-list button:hover {
    background-color: #555;
    color: white;
}
</style>