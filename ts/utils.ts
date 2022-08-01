import { Position } from "./minespeeper.js"

function getRandomIndex(array: unknown[]) {
  const index = Math.floor(Math.random() * array.length)
  return index
}

export function getRandomAndRemove<T>(array: T[]) {
  const index = getRandomIndex(array)
  const item = array[index]
  array.splice(index, 1)
  return item
}

export function initMatrix<T>(size: number, value: T) {
  const matrix = Array(size)
  for(let i = 0; i < size; i++) {
    const row = Array(size).fill(value)
    matrix[i] = row
  }
  return matrix
}

export function positionsContain(positions: Position[], [r, c]: Position) {
  return positions.some( ([row, col]) => {
    return r === row && c === col
  })
}

export function removePosition(positions: Position[], [r, c]: Position) {
  const index = positions.findIndex(([row, col]) => {
    return r === row && c === col
  })

  if(index > -1) {
    positions.splice(index, 1)
  }
}
