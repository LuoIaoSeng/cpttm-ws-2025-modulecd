<script setup>

</script>

<template>
    <div class="app">
        <div class="container">
            <h1>Home Page</h1>
            <RouterLink class="link-button" to="editor">Map Editor</RouterLink>
            <RouterLink class="link-button" to="instructions">Instructions</RouterLink>
            <RouterLink class="link-button">Load Map File</RouterLink>
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

.link-button {
    padding: 1rem 4rem 1rem 2rem;
    box-sizing: border-box;
    border: 3px solid #111;
    background-color: white;
    transition: 100ms;
    font-size: 1.2rem;
    text-decoration: none;
    color: #111;
}
.link-button:hover {
    box-shadow: 10px 10px 0px 1px #111;
}
</style>