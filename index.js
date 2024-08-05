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

  const getGameboard = () => gameboard;

  generateWinningCombinations();

  return { getGameboard, getWinnerMark, placeMark };
};

const GameController = () => {
  const board = Gameboard();

  const players = [
    { name: "Player 1", mark: "x" },
    { name: "Player 2", mark: "o" },
  ];

  let activePlayer = players[0];
  let winner = null;

  const switchActivePlayer = () =>
    (activePlayer = activePlayer == players[0] ? players[1] : players[0]);

  const getWinner = () => winner;
  const getGameboard = () => board.getGameboard();

  const playRound = (index) => {
    if (winner || !board.placeMark(activePlayer.mark, index)) return false;

    const winnerMark = board.getWinnerMark();

    if (winnerMark) {
      winner = players.find((player) => player.mark == winnerMark);
    } else {
      switchActivePlayer();
    }

    return true;
  };

  return { playRound, getWinner, getGameboard };
};

const DisplayController = (() => {
  const game = GameController();

  const getValue = (index) => {
    const board = game.getGameboard();
    return (board && board[index]) || " ";
  };

  const display = () => {
    const board = game.getGameboard();
    let displayedBoard = "";

    for (let i = 0; i < board.length; i += 3) {
      displayedBoard += `${getValue(i, board)} | ${getValue(
        i + 1,
        board
      )} | ${getValue(i + 2, board)}\n`;
      if (i + 3 < board.length) displayedBoard += "---------\n";
    }

    console.log(displayedBoard);
  };

  return { display };
})();
