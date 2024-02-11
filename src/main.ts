import { fromEvent, Subject } from "rxjs";
import "./style.css";
import WORDS_LIST from "./word-list.json";

const onKeyDown$ = fromEvent<KeyboardEvent>(document, "keydown");
const letterRows = document.getElementsByClassName("letter-row");

let letterIndex = 0;
let letterRowIndex = 0;
const userWord: string[] = [];
const getRandomWord = () =>
  WORDS_LIST[Math.floor(Math.random() * WORDS_LIST.length)];
const rightWord = getRandomWord();
console.log(rightWord);

const userWinOrLoose$ = new Subject<void>();

const insertLetter = {
  next: (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    if (key.length === 1 && key.match(/[a-z]/i)) {
      let letterBox =
        Array.from(letterRows)[letterRowIndex].children[letterIndex];
      letterBox.textContent = key;
      userWord.push(key);
      letterBox.classList.add("filled-letter");
      letterIndex++;
    }
  },
};

const checkWord = {
  next: (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      if (userWord.join("") === rightWord) {
        userWinOrLoose$.next();
      }
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);
userWinOrLoose$.subscribe(() => {
  let wordRow = Array.from(letterRows)[letterRowIndex];
  for (let i = 0; i < 5; i++) {
    const box = wordRow.children[i];
    box.classList.add("letter-green");
  }
});
