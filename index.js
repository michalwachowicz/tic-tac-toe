const Gameboard = (() => {
  const winningCombinations = [];
  const gameboard = Array(9).fill(null);

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

  return { winningCombinations, gameboard };
})();
