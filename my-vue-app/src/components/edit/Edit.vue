<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      dataInputs: {
        text: '',
        textColor: '#FFFFFF',
        bgColor: '#3b3b3b',
        size: 1,
        textAlign: 'start'
      },
      emojies: ['default.gif', 'thinking.gif', 'hide-pass.png', 'show-pass.gif', 'wrong.gif', 'ready.gif', 'loading.gif'],
      currentEmojie: null,
      isFocusInput: false,
      isLoading: false,
    }
  },
  validations() {
    return {
      dataInputs: {
        text: { required, minLength: minLength(3) },
      }
    }
  },
  created() {
    this.currentEmojie = this.emojies[0];
  },
  methods: {
    handleFocus() {
      this.isFocusInput = !this.isFocusInput

      if (this.isFocusInput) {
        this.currentEmojie = this.emojies[1]
      } else {
        this.currentEmojie = this.emojies[0]
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
    },
    handleSizeInput() {
      const size = parseFloat(this.dataInputs.size);
      if (isNaN(size) || size < 1) {
        this.dataInputs.size = 1;
      } else if (size > 2) {
        this.dataInputs.size = 2;
      }
    },
  }
};
</script>

<template>
  <div>
    <form class="form" @submit.prevent="handleSubmit">
      <h2>Edit</h2>

      <img class="emojie" :src="`/images/${this.currentEmojie}`" alt="Emoji" />

      <div class="input-container">
        <label for="text">Text</label>
        <textarea type="text" id="text" class="longText" :style="{ color: dataInputs.textColor, backgroundColor: dataInputs.bgColor, fontSize: `${dataInputs.size}rem`, textAlign: dataInputs.textAlign }" v-model.trim="dataInputs.text" @focus="handleFocus"
          @blur="handleFocus" />
        <div class="input-errors" v-for="error of v$.dataInputs.text.$errors" :key="error.$uid">
          <div class="error-msg">{{ error.$message }}</div>
        </div>
      </div>

      <div class="input-container">
        <label for="textColor">Text Color</label>
        <input type="color" id="textColor" class="colorPicker" v-model.trim="dataInputs.textColor" @focus="handleFocus" @blur="handleFocus" />
      </div>

      <div class="input-container">
        <label for="bgColor">Background Color</label>
        <input type="color" id="bgColor" class="colorPicker" v-model.trim="dataInputs.bgColor" @focus="handleFocus" @blur="handleFocus" />
      </div>

      <div class="input-container">
        <label>Size</label>
        <div class="radioBox">
          <div >
            <input type="radio" id="size1" value="1" v-model.trim="dataInputs.size">
            <label for="size1">1</label>
          </div>
          <div>
            <input type="radio" id="size1.5" value="1.5" v-model.trim="dataInputs.size">
            <label for="size1.5">1.5</label>
          </div>
          <div>
            <input type="radio" id="size2" value="2" v-model.trim="dataInputs.size">
            <label for="size2">2</label>
          </div>
        </div>
      </div>

      <div class="input-container">
        <label>Text Position</label>
        <div class="radioBox">
          <div >
            <input type="radio" id="pos1" value="start" v-model.trim="dataInputs.textAlign">
            <label for="pos1">Left</label>
          </div>
          <div>
            <input type="radio" id="pos2" value="center" v-model.trim="dataInputs.textAlign">
            <label for="pos2">Center</label>
          </div>
          <div>
            <input type="radio" id="pos3" value="end" v-model.trim="dataInputs.textAlign">
            <label for="pos3">Right</label>
          </div>
        </div>
      </div>

      <button>Edit</button>
    </form>
  </div>
</template>

<style scoped>
.form {
  user-select: none;
  max-width: 620px;
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

textarea.longText {
  height: 120px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input.colorPicker {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  height: 40px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 4px;
  margin: 1rem 0;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

div.radioBox {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
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
}
</style>