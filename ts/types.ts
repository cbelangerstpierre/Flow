interface Point {
  row: number;
  column: number;
}

enum Color {
  red,
  orange,
  yellow,
  green,
  cyan,
  blue,
  purple,
  pink,
  silver,
  lime,
  chocolate,
  crimson,
  darksalmon,
  orangered,
  yellowgreen,
}

type HtmlElements = {
  board: HTMLDivElement;
  flowsDone: HTMLParagraphElement;
  movesCounter: HTMLParagraphElement;
  percentDone: HTMLParagraphElement;
  boardSize: HTMLSelectElement;
  popupGameFinished: HTMLDivElement;
  timeToFinishGame: HTMLParagraphElement;
  moveToFinishGame: HTMLParagraphElement;
  shareToClipboardToolTip: HTMLSpanElement;
};
