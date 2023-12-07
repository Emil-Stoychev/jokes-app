<script>
import VueWriter from 'vue-writer';
export default {
  data() {
    return { 
      arr: ["Funny", "Jokes", "FunnyJokes"],
      laughterEmojis: ["😄", "😂", "😜", "🤣", "😎", "🤪", "😆", "🤩", "🚀"],
      showRandomLaughterEmoji: false,
      randomLaughterEmoji: ""
    };
  },
  methods: {
    showRandomLaughter() {
      const randomIndex = Math.floor(Math.random() * this.laughterEmojis.length);
      this.randomLaughterEmoji = this.laughterEmojis[randomIndex];
      this.showRandomLaughterEmoji = true;
    }
  }
};
</script>

<template>
  <div class="about-container">
    <h1>About <span class="company-name"><VueWriter :array="arr" :eraseSpeed="50" :typeSpeed="70" /></span> 😄</h1>
    <p>Welcome to <span class="company-name">FunnyJokes</span> 😂, the laughter hub created by a one-person comedy
      maestro.
      I'm here to tickle your 😜 <span class="company-name">funny</span> bone and bring joy to your day with a collection
      of handpicked 🤣
      <span class="company-name">jokes</span>.
    </p>

    <div class="team-section">
      <h2>The Team (Spoiler: It's Just Me!) 🎭</h2>
      <ul>
        <li><strong><span class="company-name">Joke</span> Guru:</strong> I've mastered the art of turning everyday
          situations into hilarious anecdotes. 😎
        </li>
        <li><strong>Pun Enthusiast:</strong> Puns are my forte; expect a pun or two around every corner of <span
            class="company-name">FunnyJokes</span>. 🤪
        </li>
        <li><strong>Chief Chuckler:</strong> As the sole laughter generator, I ensure this digital space is filled with
          contagious chuckles. 😆</li>
      </ul>
    </div>

    <p class="p-down-el">Join me on this laughter journey, explore my favorite 🤩 <span class="company-name">jokes</span>, and let's turn
      FunnyJokes into a go-to spot for anyone
      in need of a good laugh! 🚀</p>

      <div class="container-btn-laugh">
        <button @click="showRandomLaughter" class="random-laughter-button">Summon Chuckles 😄</button>
        <div v-if="showRandomLaughterEmoji" class="random-laughter-emoji">{{ randomLaughterEmoji }}</div>
      </div>
  </div>
</template>

<style scoped>
/* ABOUT */
.about-container {
  user-select: none;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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

h1,
p,
.team-section,
.container-btn-laugh {
    opacity: 0;
}

h1 {
    font-size: 2.5rem;
    animation: fade-in 1s ease-out forwards;
}

.about-container > p:first-of-type {
    font-size: 1.2rem;
    line-height: 1.6;
    animation: fade-in 1s ease-out 0.5s forwards;
}

.p-down-el {
  font-size: 1.2rem;
    line-height: 1.6;
    animation: fade-in 1s ease-out 1.5s forwards;
}

.team-section {
    margin-top: 20px;
    animation: fade-in 1s ease-out 1s forwards;
}



h2 {
  font-size: 2rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.container-btn-laugh {
  margin: 4rem 0 1rem 0;
  position: relative;
  animation: fade-in 1s ease-out 2s forwards;
}

.random-laughter-button {
  margin-top: 2%;
  font-size: 1.5rem;
  padding: 1em;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.random-laughter-emoji {
  position: absolute;
  top: -2.5rem;
  font-size: 2rem;
  width: 100%;
}


@media screen and (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }

  h2 {
    font-size: 1.8rem;
  }

  li {
    font-size: 1rem;
  }

  .random-laughter-button {
    font-size: 1rem;
  }
}

@media screen and (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
  }

  h2 {
  font-size: 1.3rem;
}
}
</style>
