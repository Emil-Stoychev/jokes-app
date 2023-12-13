<script>
import useAuthStore from '../../store/authStore';
import useJokeStore from '../../store/jokeStore';
import html2canvas from 'html2canvas';
import { useVuelidate } from '@vuelidate/core'
import { sameAs } from '@vuelidate/validators'
import { onMounted } from 'vue'
import { format } from 'timeago.js'
import { useRoute } from 'vue-router';
import { showError } from '../../globalError/Snackbar.vue';

export default {
  setup() {
    const authStore = useAuthStore()
    const jokeStore = useJokeStore()

    const route = useRoute()

    onMounted(() => {
      authStore.checkUserByToken(route?.params?.id);
    });

    return { authStore, jokeStore, v$: useVuelidate(), format };
  },
  data() {
    return {
      jokes: [],
      currentSlide: '',
      deleteToggle: false,
      confirmText: '',
      skipNumber: 0,
      stopPagination: false,
      isReqSend: false,
      like: false
    }
  },
  validations() {
    return {
      confirmText: { sameAs: sameAs('confirm') },
    }
  },
  methods: {
    async changeSide(name) {
      if (this.isReqSend) return
      this.jokes = []
      this.currentSlide = name
      this.skipNumber = 0
      this.stopPagination = false
      this.isReqSend = true

      const userId = this.route?.params?.id ? this.route.params.id : this.authStore.user?._id

      if (name == 'myJokes') {
        const res = await this.jokeStore.getAllJokesByUser(userId, this.skipNumber);

        this.jokes = res
      } else {
        const res = await this.jokeStore.getAllLikedJokesByUser(userId, this.skipNumber);

        this.jokes = res
      }

      this.isReqSend = false
      this.skipNumber += 10;
    },
    async loadingMoreJokes() {
      const container = this.$refs.scrollContainer;
      const containerHeight = container.offsetHeight;
      const scrollHeight = container.scrollHeight;
      const scrollTop = container.scrollTop;

      if (containerHeight + scrollTop >= scrollHeight - 100) {
        if (this.stopPagination || this.isReqSend) return;

        this.isReqSend = true;
        const userId = this.route?.params?.id ? this.route.params.id : this.authStore.user?._id

        if (this.currentSlide === 'myJokes') {
          const res = await this.jokeStore.getAllJokesByUser(userId, this.skipNumber);
          this.handlePaginationResponse(res);
        } else {
          const res = await this.jokeStore.getAllLikedJokesByUser(userId, this.skipNumber);
          this.handlePaginationResponse(res);
        }

        this.isReqSend = false;
      }
    },
    handlePaginationResponse(res) {
      if (res.length === 0) {
        this.stopPagination = true;
      }
      this.skipNumber += 10;
      this.jokes = [...this.jokes, ...res];
    },
    async deleteJoke(jokeId) {
      const res = await this.jokeStore.deleteCurrJoke(jokeId, this.jokes)

      if (!res.message) {
        this.jokes = res
        this.authStore.user.ownJokesCount--
      } else {
        return console.log(res);
      }
    },
    async likeToggle(jokeId, option) {
      const res = await this.jokeStore.likeJokeToggle(jokeId, this.jokes)

      if (!this.like) {
        this.like = true

        setTimeout(() => {
          this.like = false
        }, 1300);
      }
      if (Boolean(option)) {
        this.authStore.user.likedJokesCount--
      } else {
        this.authStore.user.likedJokesCount++
      }

      if (!!res.message) {
        this.jokes = res
      } else {
        return res
      }
    },
    goToEdit(jokeId) {
      this.$router.push(`/edit/${jokeId}`)
    },
    deleteToggleFn() {
      this.confirmText = ''
      this.deleteToggle = !this.deleteToggle
    },
    async toggleStar(jokeAuthor) {
      await this.authStore.toggleStar(jokeAuthor)
    },
    async deleteAccFn() {
      const validated = await this.v$.$validate()
      if (validated) {
        await this.authStore.deleteAcc()
        this.$router.push('/register')
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
};
</script>
<template>
  <div class="container">

    <div :class="`profile ${this.currentSlide == '' && 'profileSelected'}`" @click="this.currentSlide = ''">
      <img :src="`/images/${this.authStore.user?.avatar}`" />
      <div>
        <h2>{{ this.authStore.user?.username }}</h2>
        <h3>Rank: {{ this.authStore.user?.rank }}</h3>
      </div>
    </div>

    <div class="sliderCont">
      <h2 @click="changeSide('myJokes')" :class="currentSlide == 'myJokes' && 'selected'">My jokes</h2>
      <h2 @click="changeSide('likedJokes')" :class="currentSlide == 'likedJokes' && 'selected'">Liked jokes</h2>
    </div>

    <hr :class="this.isReqSend && 'loading'" />

    <div v-show="this.currentSlide == ''" class="profileDetails">
      <h2 class="detailsHeader">DETAILS INFORMATION</h2>

      <div class="detailsHeaderDiv">
        <h2 class="detailsHeader">Stars: <span> {{ this.authStore.user?.blacklisted?.length || 0 }} </span></h2>
        <h2 class="detailsHeader">My jokes: <span> {{ this.authStore.user?.ownJokesCount || 0 }} </span></h2>
        <h2 class="detailsHeader">Liked jokes: <span> {{ this.authStore.user?.likedJokesCount || 0 }} </span></h2>
        <h2 class="detailsHeader">Created: <span> {{ format(this.authStore.user?.createdAt) }} </span></h2>
      </div>

      <div class="profileBtns">
        <button v-show="!this.deleteToggle" type="button"
          @click="this.$router.push(`/editProfile/${this.authStore.user?._id}`)">EDIT</button>
        <button v-show="!this.deleteToggle" type="button" @click="deleteToggleFn" class="deleteBtn">DELETE</button>

        <div v-show="this.deleteToggle" class="deleteAccBtnsCnt">

          <div class="input-container">
            <label for="confirmText">Type <strong>confirm</strong> to delete your profile</label>
            <input type="text" id="confirmText" v-model.trim="confirmText" @focus="handleFocus" @blur="handleFocus" />
            <div class="input-errors" v-for="error of v$.confirmText.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </div>

          <div class="delete-sub">
            <button type="button" @click="deleteToggleFn">CANCEL</button>
            <button type="button" @click="deleteAccFn" class="deleteBtn">DELETE</button>
          </div>
        </div>

      </div>
    </div>

    <div v-show="this.currentSlide != ''" class="posts" @scroll="loadingMoreJokes" ref="scrollContainer">

      <div v-for="joke of this.jokes" :key="joke?._id" class="box">
        <div class="author">
          <img v-if="this.currentSlide != 'myJokes'" class="emojie" :src="`/images/${joke.author?.avatar}`" />
          <svg v-show="this.authStore?.user?._id && this.authStore?.user?._id != joke?.author"
            @click="toggleStar(joke.author?._id)" class="star" xmlns="http://www.w3.org/2000/svg"
            :fill="this.authStore.user?.likedStars?.includes(joke.author?._id) ? 'yellow' : 'white'" height="28"
            width="28" viewBox="0 0 576 512">
            <path
              d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
          </svg>
          <div class="authorInfo">
            <h2>{{ joke.author?.username }}</h2>
            <h3 v-if="this.currentSlide != 'myJokes'">Rank: {{ joke.author?.rank }}</h3>
            <h3 class="createdTime">{{ format(joke?.createdAt) }}</h3>
          </div>
        </div>

        <span class="downloadSpan" @click="downloadAsImage(joke)"><svg fill="white" xmlns="http://www.w3.org/2000/svg"
            height="24" width="24" viewBox="0 0 512 512">
            <path
              d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
          </svg></span>

        <div class="textCnt" :style="{ backgroundColor: joke.bgColor }">
          <p
            :style="{ color: joke.textColor, fontSize: `${joke.size}rem`, textAlign: joke.textAlign, fontWeight: joke.fontWeight, fontStyle: joke.fontStyle, fontFamily: joke.fontFamily, letterSpacing: `${joke.letterSpacing}px` }">
            {{ joke.text }}
          </p>
        </div>

        <div class="btns">
          <button type="button" :class="this.like && 'likeBtn'"
            @click="likeToggle(joke?._id, joke.likes?.find(x => x == this.authStore.user?._id) ? true : false)">
            <svg xmlns="http://www.w3.org/2000/svg"
              :fill="joke.likes?.find(x => x == this.authStore.user?._id) ? 'yellow' : 'white'" height="28" width="28"
              viewBox="0 0 512 512">
              <path
                d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm130.7 57.9c-4.2-13.6 7.1-25.9 21.3-25.9H364.5c14.2 0 25.5 12.4 21.3 25.9C369 368.4 318.2 408 258.2 408s-110.8-39.6-127.5-94.1zm86.9-85.1l0 0 0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0zm160 0l0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0 0 0z" />
            </svg>
            <p class="likesCount">{{ joke?.likes?.length }}</p>
          </button>
          <div class="btns-sub" v-if="this.currentSlide == 'myJokes'">
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

  </div>
</template>

<style scoped>
/* DOWNLOAD SPAN */

span.downloadSpan {
  position: absolute;
  bottom: 4.2rem;
  right: 1rem;
  cursor: pointer;
}

/* HR SEPARATOR */
hr {
  width: 75%;
  border-radius: 100%;
  transition: border-color 0.5s ease-in-out;
  background-position: 0 0;
}

/* MAIN CONTAINER */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: var(--bg-color-sub);
  border: var(--border-main-color);
  margin: 1rem;
  border-radius: 1rem;
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

/* PROFILE */
.profile {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  padding: 1rem;
  background-color: var(--bg-color);
  width: 450px;
  border-radius: 1rem;
  margin: 3rem auto 0 auto;
  border: 2px solid grey;
  box-shadow: 0px 0px 10px grey;
  cursor: pointer;
}

.profileSelected {
  box-shadow: 0px 0px 10px green;
  border: var(--border-main-color);
}

.profile>img {
  width: 150px;
}

.profile>div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile>div>h2,
.profile>div>h3 {
  margin: 0;
  padding: 0;
  text-align: left;
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

.detailsHeader {
  letter-spacing: 1px;
  margin: 0;
  padding: 0;
}

.detailsHeaderDiv {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 2rem auto;
  gap: 1rem;
}

.detailsHeaderDiv>.detailsHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* SLIDER CONTAINER */
.sliderCont {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  margin-top: 2rem;
}

.sliderCont>h2 {
  padding-bottom: 0.5rem;
  cursor: pointer;
}

.selected {
  border-bottom: var(--border-main-color);
}

/* MAIN HR LINE IF LOADING DATA */

hr.loading {
  animation: loadingAnimation 5s infinite linear;
}

@keyframes loadingAnimation {
  0% {
    border-bottom: 2px solid red;
    background-position: 100% 0;
  }

  25% {
    border-bottom: 2px solid yellow;
  }

  50% {
    border-bottom: 2px solid green;
  }

  75% {
    border-bottom: 2px solid blue;
  }

  100% {
    border-bottom: 2px solid red;
    background-position: 0 0;
  }
}


/* PROFILE INFORMATION */

div.profileBtns {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin: 0 auto;
}

div.profileBtns>button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 1rem 0;
  letter-spacing: 2px;
  font-weight: bolder;
  font-size: 16px;
}

div.profileBtns>button:hover {
  background-color: #45a049;
}

div.profileBtns>.deleteBtn {
  background-color: red;
}

div.profileBtns>.deleteBtn:hover {
  background-color: rgb(209, 3, 3);
}

/* DELETE ACCOUNT BUTTONS AND INPUT CONT */

label {
  display: block;
  margin-bottom: 8px;
}

div.input-container>input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

div.deleteAccBtnsCnt {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem auto;
}

div.delete-sub {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin: 1rem auto;
}

div.delete-sub>button {
  padding: 10px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 2px;
  font-weight: bolder;
  font-size: 16px;
}

div.delete-sub>button:hover {
  background-color: #45a049;
}

div.delete-sub>.deleteBtn {
  background-color: red;
}

div.delete-sub>.deleteBtn:hover {
  background-color: rgb(209, 3, 3);
}

/* POSTS */
.posts {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 2rem;
  padding: 2rem;
  height: 900px;
  overflow-y: auto;
  opacity: 0;
  animation: fade-in 0.3s ease-out 0.3s forwards;
}

.box {
  width: 100%;
  max-width: 400px;
  height: 400px;
  border-radius: 1rem;
  user-select: none;
  overflow: hidden;
  border: 2px solid grey;
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
  background-color: var(--bg-color);
  align-items: center;
  padding: 0.5rem;
  gap: 1rem;
  min-height: 50px;
}

.authorInfo {
  display: flex;
  flex-direction: column;
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
  top: 1rem;
}

.textCnt {
  overflow-y: auto;
  height: 68%;
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
  background-color: var(--bg-color);
  gap: 1rem;
  padding: 1rem;
  position: absolute;
  width: 100%;
  bottom: 0;
}

div.btns-sub {
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
  padding-right: 2rem;
  width: 100%;
}

div.btns>button,
div.btns-sub>button {
  cursor: pointer;
  border: none;
  background-color: transparent;
  position: relative;
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

@media screen and (max-width: 550px) {
  .container {
    margin: 1rem 0.5rem;
  }
}

@media screen and (max-width: 500px) {

  /* CONTAINER */
  .container {
    padding: 1rem 0.2rem;
  }

  /* PROFILE */
  .profile {
    flex-direction: column;
    gap: 2rem;
    padding: 1.5rem 0rem;
    width: 95%;
  }

  .profile>img {
    width: 100px;
  }

  .profile>div {
    gap: 0.5rem;
  }

  .profile>div>h2,
  .profile>div>h3 {
    text-align: center;
  }

  /* DETAILS INFO PROFILE BTNS */

  div.profileBtns {
    width: 80%;
  }

  .detailsHeader {
    font-size: 16px;
  }

  /* DELETE ACCOUNT BUTTONS */

  div.deleteAccBtnsCnt {
    width: 80%;
  }

  /* SLIDER */
  .sliderCont {
    gap: 2rem;
    width: 100%;
    flex-wrap: wrap;
  }

  .sliderCont>h2 {
    font-size: 18px;
  }
}

@media screen and (max-width: 350px) {
  .detailsHeaderDiv {
    width: 95%;
  }
}
</style>
