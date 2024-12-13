import { fail } from '@abw/badger-utils'

export function parseGame(block) {
  const [la, lb, lp] = block.split('\n')
  return {
    a: parseButton(la),
    b: parseButton(lb),
    prize: parsePrize(lp)
  }
}

function parseButton(line) {
  const match = line.match(/^Button \w:\sX\+(\d+),\s+Y\+(\d+)/)
  if (! match) {
    fail(`Cannot parse button line: ${line}`)
  }
  return { x: parseInt(match[1]), y: parseInt(match[2]) }
}

function parsePrize(line) {
  const match = line.match(/^Prize:\sX=(\d+),\s+Y=(\d+)/)
  if (! match) {
    fail(`Cannot parse button prize: ${line}`)
  }
  return { x: parseInt(match[1]), y: parseInt(match[2]) }
}

// Try playing a game by pressing A a pre-defined number of times (pressA)
// and see if there's a solution that involves pressing B some more times
export function playGame(game, pressA) {
  const { a, b, prize } = game
  // calculate the x and y after pressing A for pressA times
  const ax = a.x * pressA
  const ay = a.y * pressA
  // calculate the remainder
  const dx = prize.x - ax
  const dy = prize.y - ay
  // if we've overshot then this isn't a solution
  if (dx < 0 || dy < 0) {
    return false
  }
  // look to see if there's an integer divisor
  const bx = dx / b.x
  const by = dy / b.y
  const mx = dx % b.x
  const my = dy % b.y

  // check that we've got a match for both x and y, that they're integer
  // solutions (no remainder), and b hasn't been presses more than 100 times
  if (bx !== by || mx !== 0 || my !== 0 || bx > 100) {
    return false
  }

  const costA = 3 * pressA
  const costB = bx
  return {
    pressA,
    pressB: bx,
    costA, costB,
    cost: costA + costB
  }
}

