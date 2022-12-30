let html = {
    board: document.getElementById("board") as HTMLDivElement,
    flowsDone: document.getElementById("flowsDone") as HTMLParagraphElement,
    movesCounter: document.getElementById("movesCounter") as HTMLParagraphElement,
    percentDone: document.getElementById("percentDone") as HTMLParagraphElement,
    boardSize: document.getElementById("boardSize") as HTMLSelectElement,
    popupGameFinished: document.getElementById("popupGameFinished") as HTMLDivElement,
    timeToFinishGame: document.getElementById("timeToFinishGame") as HTMLParagraphElement,
    moveToFinishGame: document.getElementById("moveToFinishGame") as HTMLParagraphElement,
    shareToClipboardToolTip: document.getElementById("shareToClipboardToolTip") as HTMLSpanElement
}