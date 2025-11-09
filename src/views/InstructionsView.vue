<script setup>
</script>

<template>
    <div class="app">
        <div class="container">
            <h1>Instructions</h1>
            <div class="img-list">
                <img src="https://sdfsdf.dev/300x200.png" alt="">
                <img src="https://sdfsdf.dev/300x200.png" alt="">
                <img src="https://sdfsdf.dev/300x200.png" alt="">
            </div>
            <p style="display: block;">
                “Target Start”是一款前端游戏，玩家可以通过网络浏览器访问游玩。游戏提供了创意模
                式和挑战模式。在创意模式下，玩家可以使用工具箱设计游戏场景。在挑战模式中，玩家可
                以挑战自己创建的地图，也可以通过上传地图游玩其他人制作的游戏关卡。
            </p>
            <RouterLink class="link-button" to="/">Home</RouterLink>
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
    align-items: center;
    max-width: 50%;
    gap: 2rem;
}

.img-list {
    display: flex;
    gap: 1rem;
}

.link-button {
    border: 2px solid #333;
    padding: 1rem 4rem 1rem 2rem;
    box-sizing: border-box;
}
</style>