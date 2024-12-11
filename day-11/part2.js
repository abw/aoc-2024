#!/usr/bin/env node
import { memoize } from '../lib/memoize.js'
import { run } from '../lib/run.js'
import { parseInput } from './lib.js'

// Memoize the result of stoneBlinkCount
const stoneBlinkCountMemo = memoize(
  stoneBlinkCount
)

// How many stones does a stone turn into after a number of blinks?
function stoneBlinkCount(stone, blinks) {
  // If blinks is 0 then there's nothing left to do and there's only one
  // stone. Otherwise we blink and then sum the count of all the new stones.
  return blinks === 0
    ? 1
    : blink(stone).reduce(
      (sum, n) => sum + stoneBlinkCountMemo(n, blinks - 1),
      0
    )
}

// When we blink we turn a single stone into an array of stones.
//   0 => [1]
//   even digits are cleaved in twain, e.g. 2024 => [20, 24]
//   otherwise => n +> [n * 2024]
function blink(stone) {
  if (stone === 0) {
    return [1]
  }
  const str = stone.toString()
  const len = str.length
  if (len % 2 == 0) {
    const half = len / 2
    const n1 = str.substr(0, half)
    const n2 = str.substr(half)
    return [parseInt(n1), parseInt(n2)]
  }
  return [stone * 2024]
}

await run(
  { day: '11', part: 2, lines: true },
  ({ lines, debugData }) => {
    let list = parseInput(lines)
    debugData('list:', list)

    return list.reduce(
      (sum, n) => sum + stoneBlinkCount(n, 75),
      0
    )
  }
)
