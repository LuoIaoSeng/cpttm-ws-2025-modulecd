<script setup>

</script>

<template>
    <div class="app">
        <div class="container">
            <h1>Home Page</h1>
            <RouterLink class="item">Map Editor</RouterLink>
            <RouterLink class="item">Instructions</RouterLink>
            <RouterLink class="item">Load Map File</RouterLink>
        </div>
    </div>
</template>

<style scoped>
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

.item {
    border: 2px solid #333;
    padding: 1rem 4rem 1rem 2rem;
    box-sizing: border-box;
}
</style>