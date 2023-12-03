<script>
export default {
    data() {
        return {
            navLinks: [
                { value: '/', name: 'Home', selected: true },
                { value: '/create', name: 'Create', selected: false },
                { value: '/profile', name: 'Profile', selected: false },
                { value: '/about', name: 'About', selected: false },
                { value: '/login', name: 'Login', selected: false },
            ]
        }
    },
};
</script>

<template>
    <nav>
        <img src="https://i.pinimg.com/originals/03/3f/59/033f59d49fcf7135adb4e0424eea109b.png" />
        <ul>
            <router-link v-for="el of this.navLinks" :to="el.value" :key="el.value" :class="{ 'selected': this.$route.path === el.value }">{{ el.name }}</router-link>
        </ul>
    </nav>
</template>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    position: relative;
    margin: 0 auto;
    align-items: center;
    background-color: var(--bg-color-sub);
    border-bottom: var(--border-main-color);
    max-width: var(--max-width);
}

img {
    object-fit: cover;
    width: 10rem;
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

ul > a {
    cursor: pointer;
    padding: 0.5rem;
    text-decoration: none;
    color: white;
    position: relative;
    overflow: hidden;
}

ul > a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 4px;
    background-color: rgb(11, 199, 11);
    transition: width 0.5s ease;
}

ul > a.selected::after {
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
}
</style>
