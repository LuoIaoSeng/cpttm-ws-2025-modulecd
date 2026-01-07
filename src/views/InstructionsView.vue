<script setup>
</script>

<template>
    <div class="app">
        <div class="container">
            <h1>Instructions</h1>
            <div class="img-list">
                <img src="/src/assets/i1.png" alt="">
                <img src="/src/assets/i2.png" alt="">
                <img src="/src/assets/i3.png" alt="">
            </div>
            <p style="display: block; font-size: 1.5rem;">
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

img {
    width: 500px;
    aspect-ratio: 16/9;
    border: 1px solid #111;
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