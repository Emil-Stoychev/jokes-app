<script>
import { RouterLink } from 'vue-router';
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      dataInputs: {
        username: '',
        password: ''
      },
      emojies: ['default.gif', 'thinking.gif', 'hide-pass.png', 'show-pass.gif', 'wrong.gif', 'ready.gif', 'loading.gif'],
      currentEmojie: null,
      showPass: false,
      isFocusInput: false,
      isFocusPass: false,
      isLoading: false,
    }
  },
  validations() {
    return {
      dataInputs: {
        username: { required, minLength: minLength(3), maxLength: maxLength(15) },
        password: { required, minLength: minLength(3), maxLength: maxLength(20) },
      }
    }
  },
  created() {
    this.currentEmojie = this.emojies[0];
  },
  methods: {
    showPassFn() {
      this.showPass = !this.showPass

      if (this.showPass) {
        this.currentEmojie = this.emojies[3]
      } else {
        this.currentEmojie = this.emojies[2]
      }
    },
    handleFocus() {
      this.isFocusInput = !this.isFocusInput

      if (this.isFocusInput) {
        this.currentEmojie = this.emojies[1]
      } else {
        this.currentEmojie = this.emojies[0]
      }
    },
    handleFocusPass() {
      this.isFocusPass = !this.isFocusPass

      if (!this.showPass) {
        if (this.isFocusPass) {
          this.currentEmojie = this.emojies[2]
        } else {
          this.currentEmojie = this.emojies[0]
        }
      } else {
        if (this.showPass) {
          this.currentEmojie = this.emojies[3]
        } else {
          this.currentEmojie = this.emojies[2]
        }
      }
    },
    async handleSubmit() {
      this.isLoading = true
      this.currentEmojie = this.emojies[6];
      const validated = await this.v$.$validate()
      this.isLoading = false

      if (validated) {
        this.currentEmojie = this.emojies[5]
        console.log(this.dataInputs);
      } else {
        this.currentEmojie = this.emojies[4]
      }
    }
  }
};
</script>

<template>
  <div>
    <form class="form" @submit.prevent="handleSubmit">
      <h2>Login</h2>

      <img class="emojie" :src="`/images/${this.currentEmojie}`" alt="Emoji" />

      <div class="input-container">
        <label for="username">Username</label>
        <input type="text" id="username" v-model.trim="dataInputs.username" @focus="handleFocus" @blur="handleFocus" />
        <div class="input-errors" v-for="error of v$.dataInputs.username.$errors" :key="error.$uid">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>

      <div class="input-container">
        <label for="password">Password</label>
        <input :type="showPass ? 'text' : 'password'" id="password" v-model.trim="dataInputs.password"
          @focus="handleFocusPass" @blur="handleFocusPass" />
        <div class="input-errors" v-for="error of v$.dataInputs.password.$errors" :key="error.$uid">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>

      <div class="showPassCont">
        <input id="showPass" type="checkbox" @click="showPassFn">
        <label for="showPass">Show password</label>
      </div>

      <button>Submit</button>

      <RouterLink to="/register">You don't have an account? Click here</RouterLink>
    </form>
  </div>
</template>

<style scoped>
.form {
  user-select: none;
  max-width: 400px;
  margin: 2rem auto;
  padding: 20px;
  background-color: var(--bg-color-sub);
  color: #fff;
  border: var(--border-main-color);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2.5rem;
}

.emojie {
  width: 30%;
}

.input-container {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

.input-container>input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-errors {
  margin-top: 8px;
  color: #ff0000;
}

.showPassCont {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.showPassCont > label {
  margin-bottom: 0;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 1rem 0;
}

button:hover {
  background-color: #45a049;
}

@media screen and (max-width: 600px) {
  .form {
    margin: 1rem auto;
    padding: 15px;
  }

  h2 {
    font-size: 2rem;
  }

  .emojie {
    width: 50%;
  }

  .showPassCont {
    gap: 0.2rem;
  }
}
</style>
