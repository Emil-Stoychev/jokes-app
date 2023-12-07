import { defineStore } from "pinia";
import {
  createJoke,
  getAll,
  deleteJoke,
  likeJoke,
  allJokesByUser,
  allLikedJokesByUser,
  getJokeForEditById,
  editJokeById,
} from "../services/jokeService";

const useJokeStore = defineStore("joke", {
  state: () => ({}),
  getters: {},
  actions: {
    getAllJokes(skip) {
      return getAll(skip).then((res) => {
        if (!res.message) {
          return res;
        } else {
          console.log(res);
          return [];
        }
      });
    },
    getJokeByIdForEdit(jokeId) {
      return getJokeForEditById(
        jokeId,
        localStorage.getItem("sessionStorage")
      ).then((res) => {
        return res;
      });
    },
    getAllJokesByUser(userId, skip) {
      return allJokesByUser(userId, skip).then((res) => {
        if (!res.message) {
          return res;
        } else {
          console.log(res);
          return [];
        }
      });
    },
    getAllLikedJokesByUser(userId, skip) {
      return allLikedJokesByUser(userId, skip).then((res) => {
        if (!res.message) {
          return res;
        } else {
          console.log(res);
          return [];
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
    deleteCurrJoke(jokeId, allJokes) {
      return deleteJoke(jokeId, localStorage.getItem("sessionStorage")).then(
        (res) => {
          try {
            if (!res.message) {
              return allJokes.filter((x) => x?._id != jokeId);
            } else {
              return { message: "" };
            }
          } catch (error) {
            return { message: "" };
          }
        }
      );
    },
    likeJokeToggle(jokeId, allJokes, option) {
      return likeJoke(jokeId, localStorage.getItem("sessionStorage")).then(
        (res) => {
          try {
            if (!res.message) {
              return allJokes.map((x) => {
                if (x?._id == jokeId) {
                  x.likes = res.likes;
                }

                return x;
              });
            } else {
              return { message: "" };
            }
          } catch (error) {
            return { message: "" };
          }
        }
      );
    },
    editCurrJoke(dataInputs, jokeId) {
      return editJokeById(
        dataInputs,
        jokeId,
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
  },
});

export default useJokeStore;
