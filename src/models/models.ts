export interface Point {
  row: number;
  column: number;
};

export type Direction = number[]

export enum Color {
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

export type HtmlElements = {
  board: HTMLDivElement;
  flowsDone: HTMLParagraphElement;
  movesCounter: HTMLParagraphElement;
  percentDone: HTMLParagraphElement;
  boardSize: HTMLSelectElement;
  popupGameFinished: HTMLDivElement;
  timeToFinishGame: HTMLParagraphElement;
  moveToFinishGame: HTMLParagraphElement;
  shareToClipboardToolTip: HTMLSpanElement;
  toggleSolutionButton: HTMLButtonElement;
  newLevelButton: HTMLButtonElement;
  newLevelButtonEnd: HTMLButtonElement;
  shareButton: HTMLButtonElement;
};

export interface Share {
  color: number,
  flowStartRow: number,
  flowStartColumn: number,
  flowEndRow: number,
  flowEndColumn: number,
  solution: Point[]
}
