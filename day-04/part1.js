#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput, findLetters } from './lib.js'

// directions to travel with [x, y] deltas
const dirs = {
  n:  { x: 0, y:-1 },
  ne: { x: 1, y:-1 },
  e:  { x: 1, y: 0 },
  se: { x: 1, y: 1 },
  s:  { x: 0, y: 1 },
  sw: { x:-1, y: 1 },
  w:  { x:-1, y: 0 },
  nw: { x:-1, y:-1 },
}

await run(
  { day: '04', part: 1, lines: true },
  ({ lines, debug, debugData }) => {
    debugData('lines:', lines)
    const grid = parseInput(lines)
    debugData('grid:', grid)
    let sum = 0
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const matches = findStringAt(grid, x, y)
        sum += matches.length
        debug(`${matches.length} matches at ${x},${y}`)
      }
    }
    return sum
  }
)

function findStringAt(grid, x, y, string='XMAS') {
  // look for the string starting at x, y, going in all directions
  return Object.entries(dirs)
    .map(
      ([dir, deltas]) => ({
        x, y, dir,
        match: findLetters(grid, x, y, deltas, string.split(''))
      })
    )
    .filter(
      result => result.match
    )
}
