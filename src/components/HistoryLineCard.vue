<template>
  <div>
    <div class="inner-card">
      <div 
        class="wrapper"
        v-for="(name, id) in labels"
        :key="id"
        :class="name.class"
      >
        <span class="title">{{ name.title }}</span>
        <span class="step" :ref="name.class" @click="showInput(name.class)">{{ data[name.class] }}</span>
        <textarea class="card-edit" type="textarea" :ref="name.class + 'Input'" @blur="unFocusInput(name.class)" />
      </div>
      <button class="delete-button" @click="handleDelete">Удалить</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      labels: [{
        title: "Текущая линия:",
        class: "currentLine"
      },{
        title: "История:",
        class: "history"
      },{
        title: "Шаг 1:",
        class: "step1"
      },{
        title: "Переход к линии:",
        class: "step1Route"
      },{
        title: "Шаг 2:",
        class: "step2"
      },{
        title: "Переход к линии:",
        class: "step2Route"
      },{
        title: "Шаг 3:",
        class: "step3"
      },{
        title: "Переход к линии:",
        class: "step3Route"
      },{
        title: "Картинка: ",
        class: "pic"
      }]
    }
  },
  methods: {
    showInput(refName) {
      this.$refs[refName][0].style.display = "none";

      const input = this.$refs[refName + "Input"][0];
      input.style.display = "block";
      input.value = this.data[refName];
      input.focus();
      if (input.value === '...' || input.value === '0') input.select();
    },
    unFocusInput(refName) {
      const input = this.$refs[refName + "Input"][0];
      input.style.display = "none";

      const text = this.$refs[refName][0]
      text.style.display = "block";
      text.value = this.data[refName];
      console.log(input.value)
      this.$emit("editCard", {
        type: refName,
        id: this.data.key,
        data: input.value
      });
    },
    handleDelete() {
      if (confirm("Точно???")) {
        this.$emit("deleteCard", this.data.key);
      }
    }
  },
}
</script>

<style lang="scss">
h1, p {
  margin: 0;
}

.delete-button {
  padding: 10px;
  position: absolute;
  top: 3%;
  right: 3%;
}

.card-edit {
  display: none;
  height: content;
}

.inner-card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: relative;

  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }
}

.wrapper {
  display: flex;
  flex-flow: column nowrap;

  .title {
    font-size: 27px;
    font-weight: 500;
  }

  .history {
    font-weight: 400;
    font-size: 25px;
  }

  &:not(:first-child) {
    padding-top: 20px;
  }
}
</style>