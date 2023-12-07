<script>
import { useRoute } from 'vue-router';
import useAuthStore from '../../store/authStore';

export default {
    setup() {
        const authStore = useAuthStore()
        const route = useRoute();

        return { authStore, route }
    },
    data() {
        return {
            emojies: ['hiding-left.gif', 'hiding-right.gif'],
            leftPosition: `${Math.floor(Math.random() * (48 - 2 + 1) + 2)}rem`,
            rightPosition: `${Math.floor(Math.random() * (48 - 2 + 1) + 2)}rem`,
            isChanged: false,
            isLogoClicked: false
        }
    },
    methods: {
        hideAndChangePos() {
            this.isChanged = !this.isChanged
            this.leftPosition = `${Math.floor(Math.random() * (48 - 2 + 1) + 2)}rem`
            this.rightPosition = `${Math.floor(Math.random() * (48 - 2 + 1) + 2)}rem`
        },
        logout() {
            this.authStore.logoutUser();
            this.$router.push('/login')
        },
        rotateLogo(event) {
            if (!this.isLogoClicked) {
                this.isLogoClicked = true

                setTimeout(() => {
                    this.isLogoClicked = false
                }, 1500);
            }
        }
    },
    mounted() {
        this.authStore.checkUserByToken()
    }
};
</script>

<template>
    <img @click="hideAndChangePos" v-if="isChanged" class="hiding-left" :style="{ bottom: leftPosition }"
        :src="`/images/${emojies[0]}`" />
    <img @click="hideAndChangePos" v-else class="hiding-right" :style="{ bottom: rightPosition }"
        :src="`/images/${emojies[1]}`" />
    <nav>
        <img @click="rotateLogo" src="https://i.pinimg.com/originals/03/3f/59/033f59d49fcf7135adb4e0424eea109b.png" :class="this.isLogoClicked && 'rotateLogo'" />
        <ul>
            <router-link :to="{ path: '/' }" :class="{ 'selected': route.path === '/' }">Home</router-link>
            <router-link v-show="this.authStore.isAuthenticated" :to="{ path: '/create' }"
                :class="{ 'selected': route.path === '/create' }">Create</router-link>
            <router-link v-show="this.authStore.isAuthenticated" :to="{ path: '/profile' }"
                :class="{ 'selected': route.path === '/profile' }">Profile</router-link>
            <router-link :to="{ path: '/about' }" :class="{ 'selected': route.path === '/about' }">About</router-link>
            <router-link v-show="!this.authStore.isAuthenticated" :to="{ path: '/login' }"
                :class="{ 'selected': route.path === '/login' }">Login</router-link>
            <router-link v-show="this.authStore.isAuthenticated" :to="{ path: '/login' }"
                @click="logout">Logout</router-link>
        </ul>
    </nav>
</template>

<style scoped>
/* ABSOLUTE EMOJIES */

.hiding-left {
    position: fixed;
    left: -3rem;
    z-index: 1;
}

.hiding-right {
    position: fixed;
    right: -3rem;
    z-index: 1;
}

/* NAV */
nav {
    user-select: none;
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    position: relative;
    margin: 0 auto;
    align-items: center;
    background-color: var(--bg-color-sub);
    border-bottom: var(--border-main-color);
    max-width: var(--max-width);
    z-index: 100;
}

img {
    object-fit: cover;
    width: 10rem;
    transition: all 300ms ease-in-out;
}

.rotateLogo {
    animation: rotate 0.5s infinite linear alternate-reverse;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    border-radius: 10rem;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

ul {
    display: flex;
    gap: 4rem;
    justify-content: center;
    align-items: center;
    text-align: center;
    list-style: none;
    font-size: 1.5rem;
    flex-wrap: wrap;
}

ul>a {
    cursor: pointer;
    padding: 0.5rem;
    text-decoration: none;
    color: white;
    position: relative;
    overflow: hidden;
    transition: all 150ms ease-in-out;
}

ul>a:hover {
    transform: scale(1.1);
}

ul>a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 4px;
    background-color: rgb(11, 199, 11);
    transition: width 0.5s ease;
}

ul>a.selected::after {
    width: 100%;
}

@media screen and (max-width: 1200px) {
    nav {
        justify-content: center;
        flex-direction: column;
        padding: 0 0.1rem;
    }

    ul {
        gap: 2rem;
        padding: 0;
    }
}</style>
