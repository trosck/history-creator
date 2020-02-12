<template>
  <div class="create-card">
    <div class="wrapper">
      <span class="title">История:</span>
      <textarea class="card-create" type="textarea" v-model="history" @focus="inputFocus" />
    </div>
    <div class="wrapper">
      <span class="title">Шаг 1:</span>
      <span class="next-line-wrapper">
        <span>Переход к линии:</span>
        <input v-model.number="step1Route" type="number" class="next-line-edit" @focus="inputFocus" />
      </span>
      <textarea class="card-create" type="textarea" v-model="step1" @focus="inputFocus" />
    </div>
    <div class="wrapper">
      <span class="title">Шаг 2:</span>
      <span class="next-line-wrapper">
        <span>Переход к линии:</span>
      <input v-model.number="step2Route" type="number" class="next-line-edit" @focus="inputFocus" />
      </span>
      <textarea class="card-create" type="textarea" v-model="step2" @focus="inputFocus" />
    </div>
    <div class="wrapper">
      <span class="title">Шаг 3:</span>
      <span class="next-line-wrapper">
        <span>Переход к линии:</span>
        <input v-model.number="step3Route" type="number" class="next-line-edit" @focus="inputFocus" />
      </span>
      <textarea class="card-create" type="textarea" v-model="step3" @focus="inputFocus" />
    </div>
    <div class="wrapper pic">
      <span class="title">Картинка:</span>
      <input class="card-create" type="textarea" v-model="pic" @focus="inputFocus" />
    </div>
    <div class="wrapper current-line">
      <span class="title">Текущая линия:</span>
      <input class="card-create" type="number" v-model.number="currentLine" @focus="inputFocus" />
    </div>
    <div class="wrapper">
      <button class="card-create button" @click="handleCreate">Создать</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      history: "...",
      step1: "...",
      step1Route: 0,
      step2: "...",
      step2Route: 0,
      step3: "...",
      step3Route: 0,
      pic: "...",
      currentLine: 0
    }
  },
  methods: {
    handleCreate() {
      this.$emit("createCard", { 
        history: this.history, 
        step1: this.step1,
        step2: this.step2,
        step3: this.step3,
        pic: this.pic,
        step1Route: this.step1Route,
        step2Route: this.step2Route,
        step3Route: this.step3Route,
        currentLine: this.currentLine
      });
      this.history = "...", 
      this.step1 = "...",
      this.step2 = "...",
      this.step3 = "...",
      this.pic = "...",
      this.step1Route = 0,
      this.step2Route = 0,
      this.step3Route = 0,
      this.currentLine = 0
    },
    inputFocus(event) {
      const value = event.target.value;
      if (value === '...' || value === '0') event.target.select();
    }
  },
}
</script>

<style lang="scss">
.create-card {
  border: 1px solid #b8d7db;
  border-radius: 10px;
}
.next-line-wrapper {
  display: flex;
  align-items: center;
  padding: 10px 0;

  .next-line-edit {
    width: 40px;
    margin-left: 15px;
  }
}

.card-create {
  font-size: 25px;
  &.button {
    height: 50px;
  }
}

.wrapper {
  display: flex;
  flex-flow: column nowrap;

  &.current-line, &.pic {
    flex-flow: row nowrap;

    input {
      width: 40px;
      margin-left: 15px;
    }
  }

  &.pic input {
    width: 200px;
  }

  .title {
    font-size: 20px;
    font-weight: 500;
  }

  .history {
    font-weight: 400;
    font-size: 18px;
  }

  &:not(:first-child) {
    padding-top: 20px;
  }
}
</style>