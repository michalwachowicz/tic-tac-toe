const createPlayer = (name, symbol) => {
  const getName = () => name
  const getSymbol = () => symbol

  return { getName, getSymbol }
}

const displayController = (() => {
  const gridItems = Array.from(document.querySelectorAll('.grid-item'))

  const getItemByIndex = (index) => {
    return gridItems.find((item) => item.getAttribute('data-item') == index)
  }

  const getItemText = (item) => {
    return item.querySelector('.grid-item__text').textContent
  }

  const setItemText = (item, text) => {
    item.querySelector('.grid-item__text').textContent = text
  }

  const setupClickEvent = () => {
    gridItems.forEach((item) => {
      item.addEventListener('click', () =>
        gameBoard.playerPlay(+item.getAttribute('data-item'))
      )
    })
  }

  const _getGameOver = () => {
    return document.querySelector('.game-over')
  }

  const toggleGameOver = () => {
    _getGameOver().classList.toggle('hidden')
  }

  const displayWinner = (winner) => {
    _getGameOver().querySelector('.game-over__winner').textContent = winner
  }

  const clearGrid = () => {
    for (let item of gridItems) {
      setItemText(item, '')
    }
  }

  return {
    getItemByIndex,
    getItemText,
    setItemText,
    setupClickEvent,
    toggleGameOver,
    displayWinner,
    clearGrid,
  }
})()

const gameBoard = (() => {
  const winPossibilities = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ]
  const gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  const player = createPlayer('Player', 'x')
  const computer = createPlayer('Computer', 'o')
  let winner = null

  const _isCellEmpty = (i) => {
    return (
      gameBoard[i] === player.getSymbol() ||
      gameBoard[i] === computer.getSymbol()
    )
  }

  const _getEmptyCells = (arr) => arr.filter((i) => typeof i == 'number')

  const _checkIfWins = (board, obj, a, b, c) => {
    return (
      board[a] === obj.getSymbol() &&
      board[b] === obj.getSymbol() &&
      board[c] === obj.getSymbol()
    )
  }

  const _checkWinner = (board) => {
    for (let possibility of winPossibilities) {
      const [a, b, c] = possibility
      if (_checkIfWins(board, player, a, b, c)) {
        return player
      } else if (_checkIfWins(board, computer, a, b, c)) {
        return computer
      }
    }
    if (winner == null && _getEmptyCells(gameBoard).length === 0) {
      return 'Tie!'
    }
  }

  const _updateGameBoard = (index, value) => {
    gameBoard[index] = value
    displayController.setItemText(
      displayController.getItemByIndex(index),
      value
    )
    winner = _checkWinner(gameBoard)

    if (winner != null) {
      displayController.toggleGameOver()
      displayController.displayWinner(
        winner == 'Tie!' ? winner : `Winner: ${winner.getName()}`
      )
    }
  }

  const _minimax = (board, symbol) => {
    if (_checkWinner(board) === player) {
      return { score: -1 }
    } else if (_checkWinner(board) === computer) {
      return { score: 1 }
    } else if (_checkWinner(board) === 'Tie!') {
      return { score: 0 }
    }
    const moves = []
    const emptyCells = _getEmptyCells(board)

    for (let i = 0; i < emptyCells.length; i++) {
      const move = {}

      move.index = board[emptyCells[i]]
      board[emptyCells[i]] = symbol

      if (symbol === computer.getSymbol()) {
        const result = _minimax(board, player.getSymbol())
        move.score = result.score
      } else {
        const result = _minimax(board, computer.getSymbol())
        move.score = result.score
      }
      board[emptyCells[i]] = move.index
      moves.push(move)
    }

    let bestMove = null
    if (symbol === computer.getSymbol()) {
      let bestScore = -Infinity
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    } else {
      let bestScore = Infinity
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score
          bestMove = i
        }
      }
    }

    return moves[bestMove]
  }

  const playerPlay = (index) => {
    if (_isCellEmpty(index) || winner != null) return

    _updateGameBoard(index, player.getSymbol())

    if (winner == null) _computerPlay()
  }

  const _computerPlay = () => {
    if (winner != null) return

    _updateGameBoard(
      _minimax(gameBoard, computer.getSymbol()).index,
      computer.getSymbol()
    )
  }

  const clear = () => {
    displayController.clearGrid()
    for (let i = 0; i < gameBoard.length; i++) {
      gameBoard[i] = i
    }
    winner = null
  }

  displayController.setupClickEvent(player.getSymbol())
  return { playerPlay, clear }
})()

document.querySelector('.btn--reset').addEventListener('click', () => {
  displayController.toggleGameOver()
  gameBoard.clear()
})
