<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function loadMap() {
    const input = document.querySelector('#fileInput')
    input.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if (!file) {
            alert('请选择一个文件')
        }

        const reader = new FileReader()

        reader.onload = (e) => {
            localStorage.setItem('maps', e.target.result)
            router.push('/preview')
        }

        reader.readAsText(file)
    })

    input.click()
}

</script>

<template>
    <div class="app">
        <div class="container">
            <h1>Home Page</h1>
            <RouterLink class="link-button" to="editor/0">Map Editor</RouterLink>
            <RouterLink class="link-button" to="instructions">Instructions</RouterLink>
            <RouterLink to="preview" v-if="() => {
                return localStorage.getItem('maps') !== null
            }" class="link-button">Continue</RouterLink>
            <div class="link-button" @click="loadMap">Load Map File</div>
            <input type="file" id="fileInput" />
        </div>
    </div>
</template>

<style scoped>
#fileInput {
    display: none;
}

.app {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.link-button {
    padding: 1rem 4rem 1rem 2rem;
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
</style>