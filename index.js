const Gameboard = () => {
  const winningCombinations = [];
  const gameboard = Array(9).fill(null);

  const generateWinningCombinations = () => {
    // Rows
    for (let i = 0; i < 3; i++) {
      winningCombinations.push([i * 3, i * 3 + 1, i * 3 + 2]);
    }

    // Columns
    for (let i = 0; i < 3; i++) {
      winningCombinations.push([i, i + 3, i + 6]);
    }

    // Diagonals
    winningCombinations.push([0, 4, 8]);
    winningCombinations.push([2, 4, 6]);
  };

  const getWinnerMark = () => {
    const winner = winningCombinations.find(([a, b, c]) => {
      const symbol = gameboard[a];
      return symbol && symbol == gameboard[b] && symbol == gameboard[c];
    });

    return winner ? gameboard[winner[0]] : null;
  };

  const placeMark = (mark, index) => {
    if (index >= gameboard.length || gameboard[index]) return false;

    gameboard[index] = mark;
    return true;
  };

  const reset = () => {
    for (let i = 0; i < gameboard.length; i++) {
      gameboard[i] = null;
    }
  };

  const getGameboard = () => gameboard;

  generateWinningCombinations();

  return { getGameboard, getWinnerMark, placeMark, reset };
};

const GameController = () => {
  const board = Gameboard();

  const players = [
    { name: "Player 1", mark: "×" },
    { name: "Player 2", mark: "○" },
  ];

  let activePlayer = players[0];
  let winner = null;

  const switchActivePlayer = () =>
    (activePlayer = activePlayer == players[0] ? players[1] : players[0]);

  const getWinner = () => winner;
  const getGameboard = () => board.getGameboard();
  const getActivePlayer = () => activePlayer;
  const isTie = () => getGameboard().every((cell) => cell);

  const playRound = (index) => {
    const markPlaced = board.placeMark(activePlayer.mark, index);

    if (winner || !markPlaced) return false;
    if (markPlaced && isTie()) return true;

    const winnerMark = board.getWinnerMark();

    if (winnerMark) {
      winner = players.find((player) => player.mark == winnerMark);
    } else {
      switchActivePlayer();
    }

    return true;
  };

  const newGame = (playerOne, playerTwo) => {
    board.reset();

    players[0].name = playerOne;
    players[1].name = playerTwo;

    activePlayer = players[0];
    winner = null;
  };

  return {
    playRound,
    getWinner,
    getGameboard,
    isTie,
    newGame,
    getActivePlayer,
  };
};

const DisplayController = (() => {
  const playerOne = document.querySelector("#name-1");
  const playerTwo = document.querySelector("#name-2");

  const winnerTitle = document.querySelector("h2.winner-title");
  const winnerMark = document.querySelector("h3.winner-mark");

  const newGameForm = document.querySelector("#new-game-form");
  const gameContainer = document.querySelector(".game-container");
  const gameGrid = document.querySelector("#game");
  const gameover = document.querySelector("#gameover");

  const cells = [];
  const game = GameController();

  const generateCells = () => {
    const board = game.getGameboard();

    for (let i = 0; i < board.length; i++) {
      const cell = document.createElement("div");

      cell.classList.add("cell");
      cell.dataset.index = i;

      gameGrid.appendChild(cell);
      cells.push(cell);
    }
  };

  const showWinner = (title, mark) => {
    winnerTitle.textContent = title;
    winnerMark.textContent = mark;

    gameGrid.classList.add("hidden");
    gameover.classList.remove("hidden");
  };

  gameGrid.addEventListener("click", (e) => {
    const cell = e.target;
    if (!cell.classList || !cell.classList.contains("cell")) return;

    const index = cell.dataset.index;
    const activePlayer = game.getActivePlayer();

    if (game.playRound(index)) {
      cell.textContent = activePlayer.mark;

      if (game.isTie()) {
        showWinner("Tie!", "×○");
        return;
      }

      const winner = game.getWinner();
      if (!winner) return;

      showWinner(`${winner.name} won the game!`, winner.mark);
    }
  });

  newGameForm.addEventListener("submit", (e) => {
    e.preventDefault();

    newGameForm.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    gameGrid.classList.remove("hidden");
    gameover.classList.add("hidden");

    cells.forEach((cell) => (cell.textContent = ""));

    game.newGame(playerOne.value, playerTwo.value);
  });

  generateCells();
})();
