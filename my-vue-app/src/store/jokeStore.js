import { defineStore } from "pinia";
import {
  createJoke,
  getAll,
  deleteJoke,
  likeJoke,
  allJokesByUser,
  allLikedJokesByUser,
} from "../services/jokeService";

const useJokeStore = defineStore("joke", {
  state: () => ({
    allJokes: [],
    myJokes: [],
    likedJokes: [],
  }),
  getters: {},
  actions: {
    getAllJokes() {
      getAll().then((res) => {
        if (!res.message) {
          this.allJokes = res;
        } else {
          console.log(res);
          this.allJokes = [];
        }
      });
    },
    getAllJokesByUser(userId) {
      allJokesByUser(userId).then((res) => {
        if (!res.message) {
          this.myJokes = res;
        } else {
          console.log(res);
          this.myJokes = [];
        }
      });
    },
    getAllLikedJokesByUser(userId) {
      allLikedJokesByUser(userId).then((res) => {
        if (!res.message) {
          this.likedJokes = res;
        } else {
          console.log(res);
          this.likedJokes = [];
        }
      });
    },
    createNewJoke(dataInputs) {
      return createJoke(
        dataInputs,
        localStorage.getItem("sessionStorage")
      ).then((res) => {
        try {
          if (!res.message) {
            return res;
          } else {
            return { message: "" };
          }
        } catch (error) {
          return { message: "" };
        }
      });
    },
    deleteCurrJoke(jokeId, option) {
      return deleteJoke(jokeId, localStorage.getItem("sessionStorage")).then(
        (res) => {
          try {
            if (!res.message) {
              if (option == "myJokes") {
                this.myJokes = this.myJokes.filter((x) => x?._id != jokeId);
              } else if ("allJokes") {
                this.allJokes = this.allJokes.filter((x) => x?._id != jokeId);
              }
              return res;
            } else {
              return { message: "" };
            }
          } catch (error) {
            return { message: "" };
          }
        }
      );
    },
    likeJokeToggle(jokeId, option) {
      return likeJoke(jokeId, localStorage.getItem("sessionStorage")).then(
        (res) => {
          try {
            if (!res.message) {
              if (option == "home") {
                this.allJokes = this.allJokes.map((x) => {
                  if (x?._id == jokeId) {
                    x.likes = res.likes;
                  }

                  return x;
                });
              } else if (option == "profile") {
                this.likedJokes = this.likedJokes.filter((x) => x?._id != jokeId);
              }
              return res;
            } else {
              return { message: "" };
            }
          } catch (error) {
            return { message: "" };
          }
        }
      );
    },
  },
});

export default useJokeStore;
