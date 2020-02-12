<template>
  <div id="app">
    <div class="top-box">
      <input type="file" name="files[]" @change="handleLoadFile" />
      <button @click="saveTextFile">save text file</button>
      <form>
        <label for="select">Выбор по ключу: </label>
        <select v-model="filter.key" name="select">
          <option
            v-for="(label, id) in selectOptions"
            :key="id"
            :value="id"
          >{{label}}</option>
        </select>
        <label for="input">Сортировка по значению: </label>
        <input v-model="filter.type" name="input" />
      </form>
    </div>
    <div class="container">
      <CreateHistoryCard class="card" @createCard="createCard" />
      <HistoryLineCard
        class="card"
        v-for="(data, key) in filteredData"
        @editCard="editCard"
        @deleteCard="deleteCard"
        :data="{...data, key}" 
        :key="key" 
      />
    </div>
  </div>
</template>

<script>
import HistoryLineCard from './components/HistoryLineCard.vue';
import CreateHistoryCard from './components/CreateHistoryCard.vue';

export default {
  name: 'app',
  data() {
    return {
      text: [],
      filter: {
        key: "",
        type: ""
      },
      selectOptions: {
        line: "Сюжетная линия",
        history: "История",
        step1: "Шаг 1",
        step2: "Шаг 2",
        step3: "Шаг 3",
        pic: "Картинка",
      }
    }
  },
  components: {
    HistoryLineCard,
    CreateHistoryCard
  },
  methods: {
    createCard(newCard) {
      this.text.push(newCard);
    },
    writeTextFile(newText) {
      // Create link element and imitate click
      // for download file without confirm

      const link = document.createElement('a');
      link.setAttribute('download', 'info.txt');
      link.href = this.makeTextFile(newText);
      document.body.appendChild(link);

      // wait for the link to be added to the document
      window.requestAnimationFrame(function () {
        const event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
      });
    },
    saveTextFile() {
      this.writeTextFile(this.text);
    },
    editCard({ id, type, data }) {
      this.text[id][type] = data;
    },
    deleteCard(index) {
      this.text.splice(index, 1);
    },
    makeTextFile(newText) {
      const data = new Blob(
        [...JSON.stringify(newText)], 
        {type: 'text/plain'}
      );
      return window.URL.createObjectURL(data);
    },
    handleLoadFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (() => {
        return event => {
          const loadedText = event.target.result;
          if (!loadedText) alert("Файл пуст либо не отформаттированн")
          else this.text = JSON.parse(loadedText);
        };
      })();

      // Read text file.
      reader.readAsText(file);
    }
  },
  computed: {
    filteredData() {
      const { key, type } = this.filter;
      if (!key && !type) return this.text;
      return this.text.filter(card => {
        if (card[key].toLowerCase().indexOf(type.toLowerCase()) >= 0) {
          return card;
        }
      });
    },
  }
}
</script>

<style lang="scss">
body {
  font-family: arial;
}

.top-box {
  display: flex;
  justify-content: center;

  @media (max-width: 720px) {
    flex-flow: row wrap;
  }
}

form {
  padding-left: 30px;

  select {
    margin-right: 20px;
  }
}

.container {
  padding-top: 20px;
  display: flex;
  flex-flow: row wrap;
  width: 100%;

  @media (max-width: 720px) {
    flex-flow: column nowrap;

    .card {
      width: 100%;
    }
  }

  .card { 
    width: 50%;
    padding: 10px;
    box-sizing: border-box;

    @media (max-width: 720px) {
    width: 100%;
  }
  }
}
</style>
