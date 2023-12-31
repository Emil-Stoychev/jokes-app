<script>
import useJokeStore from '../store/jokeStore'
import useAuthStore from '../store/authStore'
import html2canvas from 'html2canvas';
import { format } from 'timeago.js';
import { inject, ref } from 'vue';
import { showError } from '../globalError/Snackbar.vue';

export default {
  setup() {
    const jokeStore = useJokeStore()
    const authStore = useAuthStore()
    const socket = inject('socket')

    let newCreatedJokeNot = ref(false)

    socket?.on('afterCreateNewJoke', () => {
      if (!newCreatedJokeNot.value) {
        newCreatedJokeNot.value = true
      }
    })

    return { jokeStore, authStore, format, newCreatedJokeNot }
  },
  data() {
    return {
      allJokes: [],
      sortOptions: {
        byCreated: true,
        byLikes: false,
        byLength: false,
        byRank: false,
      },
      skipNumber: 0,
      stopPagination: false,
      isReqSend: false,
      firstRendering: false,
      like: false,
      hideClass: false
    }
  },
  methods: {
    async deleteJoke(jokeId) {
      const res = await this.jokeStore.deleteCurrJoke(jokeId, this.allJokes)

      if (!res.message) {
        this.allJokes = res
      } else {
        return console.log(res);
      }
    },
    async likeToggle(jokeId) {
      const res = await this.jokeStore.likeJokeToggle(jokeId, this.allJokes)

      if (!this.like) {
        this.like = true

        setTimeout(() => {
          this.like = false
        }, 1300);
      }
      if (!!res.message) {
        this.allJokes = res
      } else {
        return res
      }
    },
    goToEdit(jokeId) {
      this.$router.push(`/edit/${jokeId}`)
    },
    async sortingBy(option) {
      this.sortOptions = {
        ...this.sortOptions,
        [option]: !this.sortOptions[option]
      }

      if (option == 'byCreated') {
        this.authStore.startLoading();
        this.allJokes = []
        this.skipNumber = 0
        this.stopPagination = false

        this.sortOptions = {
          ...this.sortOptions,
          byLikes: false,
          byLength: false,
          byRank: false,
        }

        this.isReqSend = true
        this.allJokes = await this.jokeStore.getAllJokes(this.skipNumber, this.sortOptions.byCreated) || []
        this.authStore.stopLoading();
        this.isReqSend = false
        this.skipNumber += 10;
      }

      this.sortingFn(option, false)
    },
    async toggleStar(jokeAuthor) {
      await this.authStore.toggleStar(jokeAuthor)
    },
    sortingFn(option, must, arr) {
      if (option == 'byLikes' || must) {
        if (this.sortOptions['byLikes']) {
          if (must) {
            arr = arr.sort((a, b) => a.likes.length - b.likes.length)
          } else {
            this.allJokes = this.allJokes.sort((a, b) => a.likes.length - b.likes.length)
          }
        } else {
          if (must) {
            arr = arr.sort((a, b) => b.likes.length - a.likes.length)
          } else {
            this.allJokes = this.allJokes.sort((a, b) => b.likes.length - a.likes.length)
          }
        }
      } else if (option == 'byLength' || must) {
        if (this.sortOptions['byLength']) {
          if (must) {
            arr = arr.sort((a, b) => a.text.length - b.text.length)
          } else {
            this.allJokes = this.allJokes.sort((a, b) => a.text.length - b.text.length)
          }
        } else {
          if (must) {
            arr = arr.sort((a, b) => b.text.length - a.text.length)
          } else {
            this.allJokes = this.allJokes.sort((a, b) => b.text.length - a.text.length)
          }
        }
      } else if (option == 'byRank' || must) {
        if (this.sortOptions['byRank']) {
          if (must) {
            arr = arr.sort((a, b) => a.author.rank - b.author.rank)
          } else {
            this.allJokes = this.allJokes.sort((a, b) => a.author.rank - b.author.rank)
          }
        } else {
          if (must) {
            arr = arr.sort((a, b) => b.author.rank - a.author.rank)
          } else {
            this.allJokes = this.allJokes.sort((a, b) => b.author.rank - a.author.rank)
          }
        }
      }

      if (must) {
        return arr
      }
    },
    async showLatestJokes() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.hideLatestJokes()
      this.authStore.startLoading();
      this.allJokes = []
      this.skipNumber = 0
      this.stopPagination = false

      this.sortOptions = {
        ...this.sortOptions,
        byLikes: false,
        byLength: false,
        byRank: false,
      }

      this.allJokes = await this.jokeStore.getAllJokes(this.skipNumber, this.sortOptions.byCreated) || []
      this.firstRendering = true
      this.skipNumber += 10;
      this.authStore.stopLoading();
    },
    hideLatestJokes() {
      if (!this.hideClass) {
        this.hideClass = true

        setTimeout(() => {
          this.newCreatedJokeNot = false
          this.hideClass = false
        }, 1000);
      }
    },
    async downloadAsImage(joke) {
      const currentDiv = event.currentTarget.closest('.box');
      const textCnt = currentDiv.querySelector('.textCnt');
      const scrollY = textCnt.scrollTop;
      textCnt.style.height = `${textCnt.scrollHeight}px`;
      textCnt.scrollTo(0, 0);
      const canvas = await html2canvas(textCnt);
      textCnt.style.height = '';
      textCnt.scrollTo(0, scrollY);

      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = `${joke?._id}.png`;
      link.click();
      showError('Thank you for downloading!')
    }
  },

  async mounted() {
    if (!this.firstRendering) {
      this.authStore.startLoading();
      this.allJokes = await this.jokeStore.getAllJokes(this.skipNumber, this.sortOptions.byCreated) || []
      this.firstRendering = true
      this.skipNumber += 10;
      this.authStore.stopLoading();
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }

    window.addEventListener('scroll', async () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (this.stopPagination) return
        if (this.isReqSend) return

        this.isReqSend = true
        this.authStore.startLoading();
        const moreJokes = await this.jokeStore.getAllJokes(this.skipNumber, this.sortOptions.byCreated) || []
        this.authStore.stopLoading();
        this.isReqSend = false

        if (moreJokes.length == 0) {
          this.stopPagination = true
        }
        this.skipNumber += 10;

        let sortedJokes = this.sortingFn('', true, moreJokes)

        this.allJokes = [...this.allJokes, ...sortedJokes]
      }
    });
  }
}

</script>

<template>
  <div v-show="this.newCreatedJokeNot" :class="`latestContentMsg ${this.hideClass && 'hideClassForLatestMsg'}`">
    <h4>Explore the latest content.</h4>
    <div>
      <button @click="hideLatestJokes">Hide</button>
      <button @click="showLatestJokes">Show</button>
    </div>
  </div>


  <div class="filteringBtns" v-if="this.allJokes.length > 0">
    <button @click="sortingBy('byCreated')" :style="{ backgroundColor: this.sortOptions.byCreated ? 'green' : 'red' }">BY
      CREATED</button>
    <button @click="sortingBy('byLikes')" :style="{ backgroundColor: this.sortOptions.byLikes ? 'green' : 'red' }">BY
      LIKES</button>
    <button @click="sortingBy('byLength')" :style="{ backgroundColor: this.sortOptions.byLength ? 'green' : 'red' }">BY
      LENGTH</button>
    <button @click="sortingBy('byRank')" :style="{ backgroundColor: this.sortOptions.byRank ? 'green' : 'red' }">BY
      RANK</button>
  </div>

  <div class="container">

    <h2 v-if="!this.allJokes.length && !this.isReqSend">No jokes yet.</h2>

    <div v-for="joke of this.allJokes" :key="joke?._id" class="box">
      <div class="author">
        <img class="emojie" :src="`/images/${joke.author?.avatar}`" />
        <svg v-show="this.authStore?.user?._id && this.authStore?.user?._id != joke?.author?._id"
          @click="toggleStar(joke.author?._id)" class="star" xmlns="http://www.w3.org/2000/svg"
          :fill="this.authStore.user?.likedStars?.includes(joke.author._id) ? 'yellow' : 'white'" height="28" width="28"
          viewBox="0 0 576 512">
          <path
            d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
        </svg>
        <div class="authorInfo">
          <h2>{{ joke.author?.username }}</h2>
          <h3>Rank: {{ joke.author?.rank }}</h3>
          <h3 class="createdTime">{{ format(joke?.createdAt) }}</h3>
        </div>
      </div>

      <span class="downloadSpan" @click="downloadAsImage(joke)"><svg fill="white" xmlns="http://www.w3.org/2000/svg" height="24"
          width="24" viewBox="0 0 512 512">
          <path
            d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
        </svg></span>

      <div class="textCnt" :style="{ backgroundColor: joke.bgColor }">
        <p
          :style="{ color: joke.textColor, fontSize: `${joke.size}rem`, textAlign: joke.textAlign, fontWeight: joke.fontWeight, fontStyle: joke.fontStyle, fontFamily: joke.fontFamily, letterSpacing: `${joke.letterSpacing}px` }">
          {{ joke.text }}</p>
      </div>

      <div class="btns">
        <button :class="this.like && 'likeBtn'" type="button" @click="likeToggle(joke?._id)">
          <svg xmlns="http://www.w3.org/2000/svg"
            :fill="joke.likes?.find(x => x == this.authStore.user?._id) ? 'yellow' : 'white'" height="28" width="28"
            viewBox="0 0 512 512">
            <path
              d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm130.7 57.9c-4.2-13.6 7.1-25.9 21.3-25.9H364.5c14.2 0 25.5 12.4 21.3 25.9C369 368.4 318.2 408 258.2 408s-110.8-39.6-127.5-94.1zm86.9-85.1l0 0 0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0zm160 0l0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0 0 0z" />
          </svg>
          <p class="likesCount">{{ joke?.likes?.length }}</p>
        </button>
        <div class="btns-sub" v-show="this.authStore?.user?._id == joke?.author?._id">
          <button type="button" @click="goToEdit(joke?._id)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="24" width="24" viewBox="0 0 512 512">
              <path
                d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
            </svg>
          </button>
          <button type="button" @click="deleteJoke(joke?._id)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="24" width="24" viewBox="0 0 448 512">
              <path
                d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>


<style scoped>
/* LATEST CONTENT DIV MESSAGE */

div.latestContentMsg {
  position: fixed;
  top: 3rem;
  width: 500px;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-color);
  user-select: none;
  height: 60px;
  border-radius: 1rem;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 300ms ease-in-out;
  animation: showLatestContentAnim 1s ease-out forwards;
  opacity: 0.9;
}

@keyframes showLatestContentAnim {
  from {
    top: -10rem;
  }

  to {
    top: 3rem;
  }
}

div.hideClassForLatestMsg {
  transition: all 300ms ease-in-out;
  animation: hideLatestContentAnim 1s ease-out forwards;
}

@keyframes hideLatestContentAnim {
  from {
    top: 3rem;
  }

  to {
    top: -10rem;
  }
}


div.latestContentMsg>h4 {
  padding: 0 0.5rem;
  letter-spacing: 2px;
  width: 100%;
}

div.latestContentMsg>div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
}

div.latestContentMsg>div>button {
  padding: 0.5rem 0.8rem;
  height: 40px;
  letter-spacing: 1px;
  background-color: #4CAF50;
  border: none;
  border-radius: 0.6rem;
  font-size: 14px;
  cursor: pointer;
  margin: 0 0.3rem;
}

div.latestContentMsg>div>button:hover {
  background-color: #45a049;
}

@media (max-width: 530px) {
  div.latestContentMsg {
    width: 95%;
    max-width: 95%;
  }

  .latestContentMsg>h4 {
    font-size: 14px;
  }

  div.latestContentMsg>div>button {
    font-size: 12px;
    padding: 0.4rem 0.6rem;
  }
}

/* CONTAINER */
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0 auto;
  gap: 2rem;
  padding: 2rem;
  opacity: 0;
  animation: fade-in 0.3s ease-out 0.3s forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.box {
  width: 100%;
  max-width: 400px;
  height: 400px;
  border-radius: 1rem;
  box-shadow: 0px 0px 10px var(--bg-color-sub);
  user-select: none;
  overflow: hidden;
  position: relative;
}

.emojie {
  width: 15%;
  max-width: 50px;
  height: auto;
  object-fit: cover;
}

.author {
  display: flex;
  justify-content: flex-start;
  background-color: var(--bg-color-sub);
  align-items: center;
  padding: 0.5rem;
  gap: 1rem;
}

.authorInfo {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
}

.authorInfo h2,
.authorInfo h3 {
  font-size: 12px;
  margin: 0;
  text-align: start;
}

.authorInfo h3.createdTime {
  position: absolute;
  right: 1rem;
  top: 0.5rem;
}

.star {
  position: absolute;
  margin: 0 auto;
  left: 50%;
  cursor: pointer;
  z-index: 2;
  transition: all 300ms ease-in-out;
}

.star:hover {
  transform: scale(1.1) rotate(45deg);
}

.textCnt {
  overflow-y: auto;
  height: 70%;
}

/* DOWNLOAD SPAN */

span.downloadSpan {
  position: absolute;
  bottom: 4.2rem;
  right: 1rem;
  cursor: pointer;
}

.textCnt>p {
  padding: 2rem 1rem;
  margin: 0;
  word-wrap: break-word;
}

div.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-color-sub);
  gap: 1rem;
  padding: 1rem;
}

div.btns-sub {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
}

div.btns>button,
div.btns-sub>button {
  cursor: pointer;
  border: none;
  background-color: transparent;
  position: relative;
  transition: all 150ms ease-in-out;
}

.likeBtn {
  animation: likeAnim 1.3s infinite linear;
}

@keyframes likeAnim {
  0% {
    transform: scale(1.1) rotate(10deg);
  }

  20% {
    transform: scale(1.1) rotate(-10deg);
  }

  40% {
    transform: scale(1.1) rotate(10deg);
  }

  60% {
    transform: scale(1.1) rotate(-10deg);
  }

  80% {
    transform: scale(1.1) rotate(10deg);
  }


  100% {
    transform: scale(1) rotate(0deg);
  }
}

p.likesCount {
  position: absolute;
  left: 3rem;
  top: -0.25rem;
  z-index: 3;
}

div.btns>button svg.liked {
  fill: red;
}

/* FILTERING BUTTONS */

div.filteringBtns {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem;
}

div.filteringBtns>button {
  padding: 0.7rem 1.5rem;
  letter-spacing: 1px;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
}

div.filteringBtns>button:hover {
  background-color: #45a049;
}

@media screen and (max-width: 450px) {
  .container {
    padding: 1rem 0.2rem;
  }
}
</style>

