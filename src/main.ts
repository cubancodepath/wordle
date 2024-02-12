import { fromEvent, Subject } from "rxjs";
import "./style.css";
import WORDS_LIST from "./word-list.json";

function pluralize(
  total: number,
  languageCode: string,
  singular: string,
  plural: string
) {
  const pluralRules = new Intl.PluralRules(languageCode);
  const rule = pluralRules.select(total);
  return `${total} ${rule === "one" ? singular + " is" : plural + " are"}`;
}

const onKeyDown$ = fromEvent<KeyboardEvent>(document, "keydown");
const letterRows = document.getElementsByClassName("letter-row");
const messageText = document.querySelector(".message-text") as HTMLDivElement;

let letterIndex = 0;
let letterRowIndex = 0;
let userWord: string[] = [];
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
      if (userWord.length !== 5) {
        messageText!.textContent = `${pluralize(
          5 - userWord.length,
          "en-US",
          "letter",
          "letters"
        )} missing`;
        return;
      }

      if (userWord.join("") === rightWord) {
        userWinOrLoose$.next();
      }

      for (let i = 0; i < 5; i++) {
        let letterColor = "";

        const letterBox = Array.from(letterRows)[letterRowIndex].children[i];
        let letterPosition = Array.from(rightWord).indexOf(userWord[i]);

        switch (letterPosition) {
          case -1:
            letterColor = "letter-grey";
            break;
          case i:
            letterColor = "letter-green";
            break;
          default:
            letterColor = "letter-yellow";
        }

        letterBox.classList.add(letterColor);
      }

      if (userWord.length === 5) {
        letterIndex = 0;
        userWord = [];
        letterRowIndex++;
      }
    }
  },
};

const deleteLetter = {
  next: (event: KeyboardEvent) => {
    if (event.key === "Backspace" && letterIndex !== 0) {
      let currentRow = letterRows[letterRowIndex];
      let letterBox = currentRow.children[letterIndex - 1];
      letterBox.textContent = "";
      letterBox.classList.remove("filled-letter");
      letterIndex--;
      userWord.pop();
    }
  },
};

onKeyDown$.subscribe(insertLetter);
onKeyDown$.subscribe(checkWord);
onKeyDown$.subscribe(deleteLetter);

userWinOrLoose$.subscribe(() => {
  let wordRow = Array.from(letterRows)[letterRowIndex];
  for (let i = 0; i < 5; i++) {
    const box = wordRow.children[i];
    box.classList.add("letter-green");
  }
});
