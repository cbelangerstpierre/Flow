import { HtmlElements } from "./models/models.js";

export const html: HtmlElements = {
  flowsDone: document.getElementById("flowsDone") as HTMLParagraphElement,
  movesCounter: document.getElementById("movesCounter") as HTMLParagraphElement,
  percentDone: document.getElementById("percentDone") as HTMLParagraphElement,
  timeToFinishGame: document.getElementById(
    "timeToFinishGame"
  ) as HTMLParagraphElement,
  moveToFinishGame: document.getElementById(
    "moveToFinishGame"
  ) as HTMLParagraphElement,
  boardSize: document.getElementById("boardSize") as HTMLSelectElement,
  toggleSolutionButton: document.getElementById(
    "toggleSolutionButton"
  ) as HTMLButtonElement,
  shareButton: document.getElementById("shareButton") as HTMLButtonElement,
  newLevelButton: document.getElementById(
    "newLevelButton"
  ) as HTMLButtonElement,
  newLevelButtonEnd: document.getElementById(
    "newLevelButtonEnd"
  ) as HTMLButtonElement,
  board: document.getElementById("board") as HTMLDivElement,
  popupGameFinished: document.getElementById(
    "popupGameFinished"
  ) as HTMLDivElement,
  shareToClipboardToolTip: document.getElementById(
    "shareToClipboardToolTip"
  ) as HTMLSpanElement,
};
