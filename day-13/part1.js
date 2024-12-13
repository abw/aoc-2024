#!/usr/bin/env node
import { range } from '@abw/badger-utils'
import { run } from '../lib/run.js'
import { parseGame, playGame } from './lib.js'

await run(
  { day: '13', part: 1, blocks: true },
  ({ blocks, debugData }) => {
    debugData('blocks:', blocks)
    const games = blocks.map(parseGame)
    debugData('games:', games)
    const wins = games
      .map(
        game => bestGame(game, debugData)
      )
      .filter(Boolean)
    return wins.reduce(
      (sum, cost) => sum + cost,
      0,
    )
  }
)

// The brute force approach - try each number of presses on A from 0 to 100
// and see which give a valid solution.

function bestGame(game, debugData) {
  debugData(`playing game:`, game)
  const solutions = range(0, 100)
    .map( pressA => playGame(game, pressA, debugData) )
    .filter(Boolean)

  debugData(`solutions:`, solutions)
  if (! solutions.length) {
    return null
  }
  return solutions.reduce(
    (min, solution) => Math.min(min, solution.cost ),
    Infinity
  )
}