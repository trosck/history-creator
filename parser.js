const fs = require("fs");

const fileName = process.argv[2];

const test = /\//.test(fileName);

if (!fileName) throw new Error("Укажите название файла!").message;
else if (test) throw new Error("Файл должен находиться в том же каталоге, что и парсер.").message;

const text = fs.readFileSync("./" + fileName);

const parsedText = JSON.parse(text);

let maxIndex = 0;
for (let i = 0; i < parsedText.length; i++) {
  if (parsedText[i].currentLine > maxIndex) maxIndex = parsedText[i].currentLine;
}

const textArray = new Array(maxIndex).fill(null);

for (let i = 0; i < parsedText.length; i++) {
  textArray[parsedText[i]["currentLine"]] = parsedText[i];
}

const stringArray = textArray.map(textLine => {
  return textLine != null ? (
    "history=" +
    textLine.history +
    "__end " +

    "step1=" +
    textLine.step1 +
    "__end " +

    "step1Route=" +
    textLine.step1Route +
    "__end " +

    "step2=" +
    textLine.step2 +
    "__end " +

    "step2Route=" +
    textLine.step2Route +
    "__end " +

    "step3=" +
    textLine.step3 +
    "__end " +

    "step3Route=" +
    textLine.step3Route +
    "__end " +

    "pic=" +
    textLine.pic +
    "__end " + 

    "currentLine=" +
    textLine.currentLine +
    "__end "
  ) : '-';
});
console.log(stringArray);
fs.writeFileSync("./parsedInfo.txt", stringArray.join("\n"));
