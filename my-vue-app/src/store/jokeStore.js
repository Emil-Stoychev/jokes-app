import { defineStore } from "pinia";
import { showError } from "../globalError/Snackbar.vue";
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
  state: () => ({
  }),
  getters: {},
  actions: {
    getAllJokes(skip, createdAt) {
      return getAll(skip, createdAt).then((res) => {
        if (!res?.message) {
          return res;
        } else {
          return [];
        }
      });
    },
    getJokeByIdForEdit(jokeId) {
      return getJokeForEditById(
        jokeId,
        localStorage.getItem("sessionStorage")
      ).then((res) => {
        if(res?.message) {
          showError(res.message)
        }
        return res;
      });
    },
    getAllJokesByUser(userId, skip) {
      return allJokesByUser(userId, skip).then((res) => {
        if (!res?.message) {
          return res;
        } else {
          if(res?.message) {
            showError(res.message)
          }
          return [];
        }
      });
    },
    getAllLikedJokesByUser(userId, skip) {
      return allLikedJokesByUser(userId, skip).then((res) => {
        if (!res?.message) {
          return res;
        } else {
          if(res?.message) {
            showError(res.message)
          }
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
          if (!res?.message) {
            showError("Joke was created!");
            return res;
          } else {
            showError(res?.message);
            return { message: "" };
          }
        } catch (error) {
          showError(error || res?.message);
          return { message: "" };
        }
      });
    },
    deleteCurrJoke(jokeId, allJokes) {
      return deleteJoke(jokeId, localStorage.getItem("sessionStorage")).then(
        (res) => {
          try {
            if (!res?.message) {
              showError("Joke was deleted!");
              return allJokes.filter((x) => x?._id != jokeId);
            } else {
              showError(res?.message)
              return { message: "" };
            }
          } catch (error) {
            showError(error || res?.message)
            return { message: "" };
          }
        }
      );
    },
    likeJokeToggle(jokeId, allJokes, option) {
      return likeJoke(jokeId, localStorage.getItem("sessionStorage")).then(
        (res) => {
          try {
            if (!res?.message) {
              return allJokes.map((x) => {
                if (x?._id == jokeId) {
                  x.likes = res.likes;
                }

                return x;
              });
            } else {
              showError(res?.message)
              return { message: "" };
            }
          } catch (error) {
            showError(error || res?.message)
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
          if (!res?.message) {
            showError('Joke was edited!')
            return res;
          } else {
            showError(res?.message)
            return { message: "" };
          }
        } catch (error) {
          showError(error || res?.message)
          return { message: "" };
        }
      });
    },
  },
});

export default useJokeStore;
