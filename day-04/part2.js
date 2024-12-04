#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput, findLetters } from './lib.js'

// directions to travel with [x, y] deltas
const dirs = {
  ne: { x: 1, y:-1 },
  se: { x: 1, y: 1 },
  sw: { x:-1, y: 1 },
  nw: { x:-1, y:-1 },
}

await run(
  { day: '04', part: 2, lines: true },
  ({ lines, debug, debugData }) => {
    debugData('lines:', lines)
    const grid = parseInput(lines)
    debugData('grid:', grid)
    let sum = 0
    for (let y = 1; y < grid.height - 1; y++) {
      for (let x = 1; x < grid.width - 1; x++) {
        if (findXmasAt(grid, x, y)) {
          sum++
          debug(`XMAS matches at ${x},${y}`)
        }
      }
    }
    return sum
  }
)

function findXmasAt(grid, x, y) {
  // Check that there is an A at this point
  if (grid.letters[y][x] !== 'A') {
    return false
  }
  // For each of the diagonals crossing x, y, look for MAS.  Given that we
  // already know the centre letter is A, we can just look for M and A either
  // side of it
  const matches = Object.values(dirs)
    .map(
      deltas => {
        const startX = x - deltas.x
        const startY = y - deltas.y
        const delta2 = { x: deltas.x * 2, y: deltas.y * 2 }
        const match  = findLetters(grid, startX, startY, delta2, ['M', 'S'])
        return { x, y, match }
      }
    )
    .filter(
      result => result.match
    )
  return matches.length === 2
}


