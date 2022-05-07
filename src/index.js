import KEYS from './scripts/keys'
import './styles/style.scss'

const createBaseElement = () => {
  const main = document.createElement('main')
  document.body.appendChild(main)

// Header
  const header = document.createElement('h1')
  header.innerHTML = 'Virtual Keyboard (Windows)'
  main.appendChild(header)

// Info
  const info = document.createElement('p')
  info.innerHTML = 'Для переключения языка комбинация: Ctrl + Shift (Слево)'
  main.appendChild(info)

// Textarea
  const display = document.createElement('div')
  display.classList.add('display')
  main.appendChild(display)

  const textArea = document.createElement('textarea')
  textArea.classList.add('screen')
  display.appendChild(textArea)

// Keyboard
  const keyboard = document.createElement('div')
  keyboard.classList.add('keyboard')
  main.appendChild(keyboard)

}

const addRowToKeyboard = (rows = Object.keys(KEYS)) => {
  rows.map(row => {
    const rowEl = document.createElement('div')
    rowEl.classList.add('keyboard__row')

    addKeyToRow(rowEl, KEYS[row])

    rows[rows.length - 1] === row ? addPlugToRow(rowEl) : null

    const keyboard = document.getElementsByClassName('keyboard')[0]
    keyboard.appendChild(rowEl)
  })
}

const addKeyToRow = (rowEl, keys) => {
  keys.map(key => {
    const keyEl = document.createElement('span')
    keyEl.id = key.id
    keyEl.classList.add('key', 'key__' + key.type)
    keyEl.innerHTML = typeof key.value === 'object' ? key.value.en[0] : key.value.toUpperCase()
    rowEl.appendChild(keyEl)
  })
}

const addPlugToRow = rowEl => {
  const plugEl = document.createElement('span')
  plugEl.id = 'Plug'
  rowEl.appendChild(plugEl)
}

// Start
window.onload = () => {
  createBaseElement()
  addRowToKeyboard()
}
