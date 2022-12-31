class Game {
  boardSize: number;
  flows: Flow[] = [];
  showSolution: boolean = false;
  currentFlow?: Flow;

  constructor(boardSize: number) {
    this.boardSize = boardSize;
    this.createGame();
  }

  private createGame(): void {}
}
