<script setup>
</script>

<template>
  <div class="container">

    <div class="box">
      <div class="author">
        <img class="emojie" src="/images/profile.gif" />
        <div class="authorInfo">
          <h2>Emil Stoychev</h2>
          <h3>Rank: 2</h3>
        </div>
      </div>

      <div class="textCnt">
        <p>Some text here for this box and to test it</p>
      </div>

      <div class="btns">
        <button type="button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="28" width="28" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm130.7 57.9c-4.2-13.6 7.1-25.9 21.3-25.9H364.5c14.2 0 25.5 12.4 21.3 25.9C369 368.4 318.2 408 258.2 408s-110.8-39.6-127.5-94.1zm86.9-85.1l0 0 0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0zm160 0l0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0 0 0z"/></svg>
          </button>
          <div class="btns-sub">
            <button type="button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="24" width="24" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
            </button>
            <button type="button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" height="24" width="24" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
            </button>
          </div>
      </div>
    </div>

  </div>
</template>


<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 2rem;
  padding: 2rem;
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
}

.authorInfo h2,
.authorInfo h3 {
  font-size: 12px;
  margin: 0;
  text-align: start;
}

.textCnt {
  display: flex;
  flex-direction: column;
  height: 65%;
  overflow-y: auto;
}

.textCnt > p {
  padding: 1rem;
  margin: 0;
}

div.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-color-sub);
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

div.btns > button,
div.btns-sub > button {
  cursor: pointer;
  border: none;
  background-color: transparent;
}

div.btns > button svg.liked {
  fill: red;
}


@media screen and (max-width: 450px) {
  .container {
  padding: 1rem 0.2rem;
}
}
</style>
