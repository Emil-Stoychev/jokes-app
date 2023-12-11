import { defineStore } from "pinia";
import { showError } from "../globalError/Snackbar.vue";
import {
  getUserByToken,
  login,
  register,
  editUserAcc,
  deleteAccount,
  toggleStarReq
} from "../services/authService";

const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    isAuthenticated: false,
    isLoading: false,
  }),
  getters: {},
  actions: {
    checkUserByToken() {
      const token = localStorage.getItem("sessionStorage");
      if (token) {
        return getUserByToken(token).then((res) => {
          try {
            if (!res?.message) {
              this.user = res;
              this.isAuthenticated = true;
              return res;
            } else {
              this.user = {};
              this.isAuthenticated = false;
              localStorage.removeItem("sessionStorage");
              showError(res?.message)
            }
          } catch (error) {
            showError(error || res?.message)
          }
        });
      } else {
        this.user = {};
        this.isAuthenticated = false;
        localStorage.removeItem("sessionStorage");
      }
    },
    loginUser(dataInputs) {
      return login(dataInputs).then((res) => {
        try {
          if (!res?.message) {
            showError(res?.username, 'welcome')
            this.user = res;
            this.isAuthenticated = true;
            localStorage.setItem("sessionStorage", res?.token);
            return res;
          } else {
            this.user = {};
            this.isAuthenticated = false;
            localStorage.removeItem("sessionStorage");
            showError(res?.message)
            return { message: "" };
          }
        } catch (error) {
          this.user = {};
          this.isAuthenticated = false;
          localStorage.removeItem("sessionStorage");
          showError(error || res?.message)
          return { message: "" };
        }
      });
    },
    registerUser(dataInputs) {
      return register(dataInputs).then((res) => {
        try {
          if (!res?.message) {
            showError('Successfully registered!')
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
    editUser(dataInputs) {
      return editUserAcc(
        dataInputs,
        localStorage.getItem("sessionStorage")
      ).then((res) => {
        try {
          if (!res?.message) {
            this.user = res;
            this.isAuthenticated = true;
            localStorage.setItem("sessionStorage", res?.token);
            showError('Successfully edited!')
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
    logoutUser() {
      this.user = {};
      this.isAuthenticated = false;
      localStorage.removeItem("sessionStorage");
    },
    deleteAcc() {
      return deleteAccount(localStorage.getItem("sessionStorage")).then(
        (res) => {
          try {
            this.user = {};
            this.isAuthenticated = false;
            localStorage.removeItem("sessionStorage");
            showError('User was deleted!')
            return res?.ok;
          } catch (error) {
            showError(error || res?.message)
            return res?.ok
          }
        }
      );
    },
    toggleStar(jokeAuthor) {
      return toggleStarReq(
        jokeAuthor,
        localStorage.getItem("sessionStorage")
      ).then((res) => {
        try {
          if (!res?.message) {
            this.user = res;
            return res;
          } else {
            return { message: "" };
          }
        } catch (error) {
          console.log(error);
          return { message: "" };
        }
      });
    },
    startLoading() {
      this.isLoading = true
    },
    stopLoading() {
      this.isLoading = false
    }
  },
});

export default useAuthStore;
