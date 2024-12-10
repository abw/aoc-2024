#!/usr/bin/env node
import { run } from '../lib/run.js'
import { findTrailHeads, parseInput } from './lib.js'
import { adjacentCells } from '../lib/direction.js'
import { memoize } from '../lib/memoize.js'

const followTrail = memoize(
  (cells, x, y, seen={}) => {
    const key = `${x},${y}`
    if (seen[key]) {
      return 0
    }
    seen[key] = true

    const n = cells[y][x]
    if (n === 9) {
      return 1
    }

    const nextN = n + 1
    const adjacent = adjacentCells(cells, x, y)
    return adjacent
      .filter(
        ({ x, y }) => cells[y][x] === nextN
      )
      .reduce(
        (sum, { x, y }) => sum + followTrail(cells, x, y, seen),
        0
      )
  }
)

await run(
  { day: '10', part: 1, lines: true },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const cells = parseInput(lines)
    debugData('cells:', cells)

    // find all the trail heads
    const trailHeads = findTrailHeads(cells)

    // calculate the trails from the head and sum
    return trailHeads.reduce(
      (sum, head) => sum + followTrail(cells, head.x, head.y),
      0
    )
  }
)

