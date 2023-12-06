import { defineStore } from "pinia";
import {
  getUserByToken,
  login,
  register,
  editUserAcc,
} from "../services/authService";

const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    isAuthenticated: false,
  }),
  getters: {},
  actions: {
    checkUserByToken() {
      const token = localStorage.getItem("sessionStorage");
      if (token) {
        getUserByToken(token).then((res) => {
          try {
            if (!res.message) {
              this.user = res;
              this.isAuthenticated = true;
              return res;
            } else {
              this.user = {};
              this.isAuthenticated = false;
              localStorage.removeItem("sessionStorage");
              console.log(res);
            }
          } catch (error) {
            console.log(error);
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
          if (!res.message) {
            this.user = res;
            this.isAuthenticated = true;
            localStorage.setItem("sessionStorage", res?.token);
            return res;
          } else {
            this.user = {};
            this.isAuthenticated = false;
            localStorage.removeItem("sessionStorage");
            return { message: "" };
          }
        } catch (error) {
          this.user = {};
          this.isAuthenticated = false;
          localStorage.removeItem("sessionStorage");
          console.log(error);
          return { message: "" };
        }
      });
    },
    registerUser(dataInputs) {
      return register(dataInputs).then((res) => {
        try {
          if (!res.message) {
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
    editUser(dataInputs) {
      return editUserAcc(
        dataInputs,
        localStorage.getItem("sessionStorage")
      ).then((res) => {
        try {
          if (!res.message) {
            this.user = res;
            this.isAuthenticated = true;
            localStorage.setItem("sessionStorage", res?.token);
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
    logoutUser() {
      this.user = {};
      this.isAuthenticated = false;
      localStorage.removeItem("sessionStorage");
    },
  },
});

export default useAuthStore;
