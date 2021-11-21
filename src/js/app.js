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

  return {
    getItemByIndex,
    getItemText,
    setItemText,
    setupClickEvent,
    toggleGameOver,
    displayWinner,
  }
})()

const gameBoard = (() => {
  const winPossibilities = [
    '012',
    '345',
    '678',
    '036',
    '147',
    '258',
    '048',
    '246',
  ]
  const gameBoard = ['', '', '', '', '', '', '', '', '']
  const player = createPlayer('Player', 'x')
  const computer = createPlayer('Computer', 'o')
  let winner = null

  const _checkIfWins = (obj, a, b, c) => {
    return (
      gameBoard[a] == obj.getSymbol() &&
      gameBoard[b] == obj.getSymbol() &&
      gameBoard[c] == obj.getSymbol()
    )
  }

  const _checkWinner = () => {
    for (let possibility of winPossibilities) {
      const [a, b, c] = possibility.split('')
      if (_checkIfWins(player, +a, +b, +c)) {
        winner = player
        break
      } else if (_checkIfWins(computer, +a, +b, +c)) {
        winner = computer
        break
      }
    }
    if (winner == null) {
      const emptySize = gameBoard.filter((i) => i == '').length
      if (emptySize < 1) {
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
  }

  const playerPlay = (index) => {
    if (gameBoard[index] != '' || winner != null) return

    _updateGameBoard(index, player.getSymbol())
    _checkWinner()

    if (winner == null) _computerPlay()
    else {
      displayController.toggleGameOver()
      displayController.displayWinner(
        winner == 'Tie!' ? winner : `Winner: ${winner.getName()}`
      )
    }
  }

  const _computerPlay = () => {
    if (winner != null) return

    let index = -1
    while (index === -1 || gameBoard[index] != '') {
      index = Math.floor(Math.random() * gameBoard.length)
    }

    _updateGameBoard(index, computer.getSymbol())
    _checkWinner()

    if (winner != null) {
      displayController.toggleGameOver()
      displayController.displayWinner(
        winner == 'Tie!' ? winner : `Winner: ${winner.getName()}`
      )
    }
  }

  const clear = () => {
    for (let i = 0; i < gameBoard.length; i++) {
      _updateGameBoard(i, '')
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
