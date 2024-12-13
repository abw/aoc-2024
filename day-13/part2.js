#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseGame } from './lib.js'

await run(
  { day: '13', part: 2, blocks: true },
  ({ blocks, debugData }) => {
    debugData('blocks:', blocks)
    const games = blocks.map(parseGame)

    // Add the offset to the X and Y coordinates of the prize
    games.forEach(
      game => {
        game.prize.x += 10000000000000
        game.prize.y += 10000000000000
      }
    )
    debugData('games:', games)

    // Look for games with a solution
    const wins = games
      .map(
        game => solveGame(game, debugData)
      )
      .filter(Boolean)

    // Sum the total cost
    return wins.reduce(
      (sum, cost) => sum + cost,
      0,
    )
  }
)

// As is common with AOC, part 1 can be brute forced, but part 2 requires a
// deeper understanding.  In this case we need to solve the simultaneous
// linear equations.  Here X and Y are the location of the prize, a and b are
// the buttons with x and y movements, and p is the number of presses for
// each of a and b.
//
// We know that a combination of presses on a and b (p.a and p.b) should take
// us to the prize at X, Y
//
//   X = a.x * p.a + b.x * p.b
//   Y = a.y * p.a + b.y * p.b
//
// Rearrange to get p.a
//
//   X - b.x * p.b = a.x * p.a  ==>  p.a = (X - b.x * p.b) / a.x
//   Y - b.y * p.b = a.y * p.a  ==>  p.a = (Y - b.y * p.b) / a.y
//
// Equate:
//
//   (X - b.x * p.b) / a.x = (Y - b.y * p.b) / a.y
//
// Multiply out:
//
//   a.y * (X - b.x * p.b) = a.x * (Y - b.y * p.b)
//   (a.y * X) - (a.y * b.x * p.b) = (a.x * Y) - (a.x * b.y * p.b)
//
// Rearrange to factor out p.b
//
//   (a.y * X) - (a.x * Y) = (a.y * b.x * p.b) - (a.x * b.y * p.b)
//   (a.y * X) - (a.x * Y) = p.b * ( (a.y * b.x ) - (a.x * b.y) )
//   p.b = ( (a.y * X) - (a.x * Y) ) / ( (a.y * b.x ) - (a.x * b.y) )
//

function solveGame(game, debugData) {
  debugData(`playing game:`, game)

  // unpack the game variables
  const { a, b, prize } = game
  const { x, y } = prize

  // a.x, a.y, b.x and b.y cannot be 0 or we get a divide by 0 error
  if ([a.x, a.y, b.x, b.y].some( n => n === 0)) {
    return false
  }

  // how many presses on B?
  const pb = Math.floor(
    (a.y * x - a.x * y) / (a.y * b.x - a.x * b.y)
  )

  // how many presses on A?
  const pa = Math.floor(
    (x - pb * b.x) / a.x
  )

  // Now check that the values for pa and pb (which have been rounded down)
  // give us the correct integer values for x and y
  const px = a.x * pa + b.x * pb
  const py = a.y * pa + b.y * pb
  debugData(`presses: `, { pa, pb, px, py, x, y })
  if (px !== x || py !== y) {
    return false
  }

  // save the presses and total cost back in the game data (for debugging)
  game.press = { a: pa, b: pb }
  game.cost = pa * 3 + pb
  debugData(`solved game:`, game)

  // return just the cost
  return game.cost
}
