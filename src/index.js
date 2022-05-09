import KEYS from './scripts/keys'
import './styles/style.scss'

// Global variables
let cursorPosition = null

/* --------------------------------------------------------------------------------- */

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

/* --------------------------------------------------------------------------------- */

const onKeyDown = event => {
  event.preventDefault()

  const { key } = event
  const textAreaEl = document.getElementsByClassName('screen')[0]

  textAreaEl.value = key.length < 2
    ? onSymbolKeyDown(textAreaEl, key)
    : onSpecialKeyDown(textAreaEl, key)
}

const onSymbolKeyDown = (textAreaEl, key) => {
  let { value } = textAreaEl
  let [cursorStart, cursorEnd] = cursorPosition
  let newValue = ''

  if (cursorStart === cursorEnd) {
    [newValue, cursorStart, cursorEnd] = cursorEnd === value.length
      ? addValueInTheEnd(value, key)
      : addValueInside(value, key, cursorStart, cursorEnd)
  } else {
    [newValue, cursorStart, cursorEnd] = cursorEnd === value.length
      ? replaceValueInTheEnd(value, key, cursorStart, cursorEnd)
      : replaceValueInside(value, key, cursorStart, cursorEnd)
  }

  moveCursor(textAreaEl, cursorStart, cursorEnd)
  return newValue
}

const onSpecialKeyDown = (textAreaEl, key) => {
  let { value } = textAreaEl
  let [cursorStart, cursorEnd] = cursorPosition
  let newValue = ''

  switch (key) {

    case 'Tab':
      if (cursorStart === cursorEnd) {
        [newValue, cursorStart, cursorEnd] = cursorEnd === value.length
          ? addValueInTheEnd(value, '\t')
          : addValueInside(value, '\t', cursorStart, cursorEnd)
      } else {
        [newValue, cursorStart, cursorEnd] = cursorEnd === value.length
          ? replaceValueInTheEnd(value, '\t', cursorStart, cursorEnd)
          : replaceValueInside(value, '\t', cursorStart, cursorEnd)
      }
      break

    case 'Enter':
      if (cursorStart === cursorEnd) {
        [newValue, cursorStart, cursorEnd] = cursorEnd === value.length
          ? addValueInTheEnd(value, '\n')
          : addValueInside(value, '\n', cursorStart, cursorEnd)
      } else {
        [newValue, cursorStart, cursorEnd] = cursorEnd === value.length
          ? replaceValueInTheEnd(value, '\n', cursorStart, cursorEnd)
          : replaceValueInside(value, '\n', cursorStart, cursorEnd)
      }
      break

    case 'Backspace':
      if (cursorStart === cursorEnd) {
        cursorEnd === value.length
          ? (newValue = value.slice(0, value.length - 1),
            cursorStart = cursorEnd = newValue.length)
          : (newValue = value.slice(0, cursorStart - 1) + value.slice(cursorEnd),
            cursorStart = cursorEnd = cursorEnd - 1)
      } else {
        cursorEnd === value.length
          ? (newValue = value.slice(0, cursorStart),
            cursorStart = cursorEnd = newValue.length)
          : (newValue = value.slice(0, cursorStart) + value.slice(cursorEnd),
            cursorEnd = cursorStart)
      }
      break

    case 'Delete':
      if (cursorStart === cursorEnd) {
        cursorEnd === value.length
          ? (newValue = value,
            cursorStart = cursorEnd = value.length)
          : (newValue = value.slice(0, cursorStart) + value.slice(cursorEnd + 1),
            cursorStart = cursorEnd)
      } else {
        cursorEnd === value.length
          ? (newValue = value.slice(0, cursorStart),
            cursorStart = cursorEnd = newValue.length)
          : (newValue = value.slice(0, cursorStart) + value.slice(cursorEnd),
            cursorEnd = cursorStart)
      }
      break

    // Arrows
    case 'ArrowUp':
      return value += '▲'
    case 'ArrowRight':
      return value += '►'
    case 'ArrowDown':
      return value += '▼'
    case 'ArrowLeft':
      return value += '◄'

    // Other keys
    default: return value

  }

  moveCursor(textAreaEl, cursorStart, cursorEnd)
  return newValue
}



/* Change cursor position & textarea value */
const addValueInTheEnd = (value, key) => {
  let v = value + key
  return [v, v.length, v.length]
}

const addValueInside = (value, key, cursorStart, cursorEnd) => {
  let v = value.slice(0, cursorStart) + key + value.slice(cursorEnd)
  cursorStart = cursorEnd = cursorEnd + 1
  return [v, cursorStart, cursorEnd]
}

const replaceValueInTheEnd = (value, key, cursorStart, cursorEnd) => {
  let v = value.slice(0, cursorStart) + value.slice(cursorEnd) + key
  return [v, value.length, value.length]
}

const replaceValueInside = (value, key, cursorStart, cursorEnd) => {
  let v = value.slice(0, cursorStart) + key + value.slice(cursorEnd, value.length)
  cursorEnd = cursorStart = cursorStart + 1
  return [v, cursorStart, cursorEnd]
}

const moveCursor = (el, start, end) => setTimeout(() => el.setSelectionRange(start, end))


/* ----- START --------------------------------------------------------------------- */

window.onload = () => {

  // Add textarea and keyboard
  createBaseElement()
  addRowToKeyboard()


  /* Find cursor position */
  const textAreaEl = document.getElementsByClassName('screen')[0]
  textAreaEl.focus()

  document.addEventListener('keydown', event => {
    textAreaEl.focus()
    cursorPosition = [event.target.selectionStart, event.target.selectionEnd]
    onKeyDown(event)
    console.log('keydown: ', cursorPosition)
  })

  document.addEventListener('click', () => {
    const { value } = textAreaEl
    cursorPosition = [value.length, value.length]
    console.log('клик вне: ', cursorPosition)
  })

  textAreaEl.addEventListener('click', event => {
    event.stopPropagation()
    cursorPosition = [event.target.selectionStart, event.target.selectionEnd]
    console.log('click: ', cursorPosition)
  })
  /* Find cursor position — End */
}
