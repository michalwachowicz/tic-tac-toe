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

  const _emptyCells = () =>
    gameBoard.filter(
      (i) => i != player.getSymbol() && i != computer.getSymbol()
    )

  const _checkIfWins = (obj, a, b, c) => {
    return (
      gameBoard[a] === obj.getSymbol() &&
      gameBoard[b] === obj.getSymbol() &&
      gameBoard[c] === obj.getSymbol()
    )
  }

  const _checkWinner = () => {
    for (let possibility of winPossibilities) {
      const [a, b, c] = possibility
      if (_checkIfWins(player, a, b, c)) {
        winner = player
        break
      } else if (_checkIfWins(computer, a, b, c)) {
        winner = computer
        break
      }
    }
    if (winner == null) {
      if (_emptyCells().length < 1) {
        winner = 'Tie!'
      }
    }
  }

  const _updateGameBoard = (index, value) => {
    gameBoard[index] = value
    displayController.setItemText(
      displayController.getItemByIndex(index),
      value
    )
    _checkWinner()

    if (winner != null) {
      displayController.toggleGameOver()
      displayController.displayWinner(
        winner == 'Tie!' ? winner : `Winner: ${winner.getName()}`
      )
    }
  }

  const playerPlay = (index) => {
    if (_isCellEmpty(index) || winner != null) return

    _updateGameBoard(index, player.getSymbol())

    if (winner == null) _computerPlay()
  }

  const _computerPlay = () => {
    if (winner != null) return

    let index = -1
    while (index === -1 || _isCellEmpty(index)) {
      index = Math.floor(Math.random() * gameBoard.length)
    }

    _updateGameBoard(index, computer.getSymbol())
  }

  const clear = () => {
    displayController.clearGrid()
    for (let i = 0; i < gameBoard.length; i++) {
      gameBoard[i] = ''
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
