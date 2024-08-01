const Gameboard = (() => {
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

  const getWinner = () => {
    const winner = winningCombinations.find(([a, b, c]) => {
      const symbol = gameboard[a];
      return symbol && symbol == gameboard[b] && symbol == gameboard[c];
    });

    return winner ? gameboard[winner[0]] : null;
  };

  const getGameboard = () => gameboard;

  generateWinningCombinations();

  return { getGameboard, getWinner };
})();

const DisplayController = (() => {
  const getValue = (index, board) => (board && board[index]) || " ";

  const display = (board) => {
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
