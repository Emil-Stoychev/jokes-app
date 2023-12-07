<script>
</script>

<template>
    <div class="not-found-container">
        <div class="middle-section">
            <h1 class="glitch left4">4</h1>
            <img class="emojiRotate notFoundEmoji" src="/images/notfound.gif" />
            <h1 class="glitch right4">4</h1>
        </div>

        <div class="container-btn-home">
            <button @click="this.$router.push('/')" class="zoomBtn button-go-home">Go Home 🏡</button>
        </div>
    </div>
</template>

<style scoped>
/* NOT FOUND */
.not-found-container {
    user-select: none;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.middle-section {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 3rem 0;
}

.middle-section>h1 {
    font-size: 34rem;
    position: absolute;
}

h1.left4 {
    left: -2rem;
    color: var(--bg-color-sub);
}

h1.right4 {
    right: -2rem;
    color: var(--bg-color-sub);
}

.notFoundEmoji {
    width: 500px;
    z-index: 2;
}

.container-btn-home {
    margin: 4rem 0 1rem 0;
    position: relative;
}

.button-go-home {
    width: 60%;
    margin-top: 2%;
    font-size: 1.5rem;
    padding: 1em;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    letter-spacing: 1px;
    cursor: pointer;
}

.button-go-home:hover {
    background-color: #45a049;
}

.zoomBtn {
    animation: zoom 3s infinite linear alternate-reverse;
}

@keyframes zoom {
    20% {
        transform: scale(1.1);
        background-color: #45a049;
        box-shadow: 0px 0px 10px green;
    }

    100% {
        transform: scale(1.1);
        background-color: #45a049;
        box-shadow: 0px 0px 10px green;
    }
}

.emojiRotate {
    animation: rotate 3s infinite linear alternate-reverse;
}

@keyframes rotate {
    0% {
        transform: translate(0);
    }

    20% {
        transform: translate(-5px, 100px);
    }

    40% {
        transform: translate(5px, -5px);
        transform: rotate(10deg);
    }

    60% {
        transform: translate(-5px, 5px);
        transform: rotate(-10deg);
    }

    80% {
        transform: translate(5px, -30px);
    }

    100% {
        transform: translate(0);
    }
}

.glitch {
    animation: glitch 3s infinite linear alternate-reverse;
}

@keyframes glitch {
    0% {
        transform: translate(0);
        color: var(--bg-color-sub);
    }

    20% {
        transform: translate(-5px, 5px);
        color: rgba(255, 0, 0, 0.154);
        transform: rotate(5deg);
    }

    40% {
        transform: translate(5px, -5px);
        color: var(--bg-color-sub);
    }

    60% {
        transform: translate(-5px, 5px);
        color: var(--bg-color-sub);
    }

    80% {
        transform: translate(5px, -5px);
        color: rgba(255, 255, 0, 0.154);
        transform: rotate(-5deg);
    }

    100% {
        transform: translate(0);
        color: var(--bg-color-sub);
    }
}

@media screen and (max-width: 1000px) {
    .middle-section>h1 {
        font-size: 28rem;
    }

    .notFoundEmoji {
        width: 400px;
    }

    h1.left4 {
        left: 3rem;
    }

    h1.right4 {
        right: 3rem;
    }
}

@media screen and (max-width: 800px) {
    .not-found-container {
        max-width: 90%;
        width: 90%;
    }

    .middle-section>h1 {
        font-size: 24rem;
        padding: 0;
        margin: 0;
    }

    .notFoundEmoji {
        width: 350px;
    }

    h1.left4 {
        left: calc(5% - 2rem);
    }

    h1.right4 {
        right: calc(5% - 2rem);
    }
}


@media screen and (max-width: 650px) {

    .middle-section>h1 {
        font-size: 20rem;
    }

    .notFoundEmoji {
        width: 300px;
    }

    h1 {
        font-size: 2rem;
    }

    .button-go-home {
        font-size: 1rem;
    }
}

@media screen and (max-width: 500px) {
    .middle-section>h1 {
        font-size: 18rem;
    }

    .notFoundEmoji {
        width: 250px;
    }

    h1 {
        font-size: 1.5rem;
    }
}

@media screen and (max-width: 450px) {
    .middle-section>h1 {
        font-size: 14rem;
    }
}

@media screen and (max-width: 390px) {
    .notFoundEmoji {
        width: 200px;
    }
}

@media screen and (max-width: 310px) {

    .not-found-container {
        width: 80%;
    }

    .middle-section>h1 {
        font-size: 10rem;
    }

    .notFoundEmoji {
        width: 150px;
    }
}

@media screen and (max-width: 250px) {

    .middle-section>h1 {
        font-size: 8rem;
    }

    .notFoundEmoji {
        width: 120px;
    }
}</style>
