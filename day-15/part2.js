#!/usr/bin/env node
import { fail } from '@abw/badger-utils'
import { run } from '../lib/run.js'
import { findRobot, parseInput, showMap } from './lib.js'

const expansion = {
  '#': ['#', '#'],
  'O': ['[', ']'],
  '.': ['.', '.'],
  '@': ['@', '.'],
}
const isBox = {
  '[': true,
  ']': true,
}

await run(
  { day: '15', part: 2, blocks: true, },
  // { day: '15', part: 2, blocks: true, exampleFile: 'small-example2.txt' },
  // { day: '15', part: 2, blocks: true, exampleFile: 'small-example3.txt' },
  ({ blocks, debugging, debugData }) => {
    const { map: map1, moves } = parseInput(blocks)
    if (debugging) {
      showMap(map1)
    }
    const map = expandMap(map1)
    const robot = findRobot(map)
    if (debugging) {
      showMap(map)
    }

    moves.forEach(
      (move, n) => {
        attemptRobotMove(map, robot, move)
        if (debugging) {
          debugData(`move ${n}`, move)
          showMap(map)
        }
      }
    )

    return map.reduce(
      (sum, row, y) =>
        sum + row
          .reduce(
            (rowSum, cell, x) => rowSum + (
              cell === '['
                ? y * 100 + x
                : 0
            ),
            0
          ),
      0
    )
  }
)

function expandMap(map) {
  return map.map(
    row => row.flatMap(
      cell => expansion[cell]
    )
  )
}

export function attemptRobotMove(map, robot, move) {
  const moved = attemptMove(map, robot.x, robot.y, move)
  if (moved) {
    robot.x += move.x
    robot.y += move.y
  }
}

export function attemptMove(map, x, y, move) {
  return move.y
    ? attemptVerticalMove(map, x, y, move)
    : attemptHorizontalMove(map, x, y, move)
}

function attemptVerticalMove(map, x, y, move) {
  // As we move vertically we may hit one side of a box which requires both
  // sides of the box to move.  Either of those box sides may hit other boxes,
  // which in turn can hit other boxes.  We maintain an array of cells that
  // need to be checked to see if they can move.  We iterate through each cell
  // until the array is empty.  If the cell would be moving into a wall then
  // we can return immediately.  Otherwise we have to add cells to the array
  // for any adjacent box cells, or boxes that we might hit.
  const cells = [ { x, y } ]

  // When we find a cell that will need to be moved, we add it to the moves,
  // using the moving object to check that we don't add the same cell twice
  const moves = [ ]
  const moving = { }
  const moveCell = cell => {
    const key = `${cell.x},${cell.y}`
    if (moving[key]) {
      return
    }
    moves.unshift(cell)
    moving[key] = true
  }

  while (cells.length) {
    const cell = cells.shift()
    const newy = cell.y + move.y
    const item = map[newy][cell.x]
    // console.log(`cell at ${cell.x},${newy} is ${item}`)
    if (item === '#') {
      // if any moving cell would hit a wall then we can't move
      return false
    }
    if (item === ']') {
      // if a cell is the right edge of a box then we must also check the left
      cells.push({ x: cell.x, y: newy })
      cells.push({ x: cell.x - 1, y: newy })
      moveCell(cell)
    }
    else if (item === '[') {
      // ditto the left edge
      cells.push({ x: cell.x, y: newy })
      cells.push({ x: cell.x + 1, y: newy })
      moveCell(cell)
    }
    else if (item === '.') {
      // this is a valid move
      moveCell(cell)
    }
    else {
      // should never happen
      fail(`invalid character at ${cell.x},${newy}: ${item}`)
    }
  }
  // console.log(`moves: `, moves)
  moves.forEach(
    cell => {
      map[cell.y + move.y][cell.x] = map[cell.y][cell.x]
      map[cell.y][cell.x] = '.'
    }
  )
  return true
}

function attemptHorizontalMove(map, x, y, move) {
  let newx = x + move.x
  while (isBox[map[y][newx]]) {
    newx += move.x
  }
  // console.log(`horizontal row of boxes from ${newx},${y} to ${x},${y}`);
  // have we hit a wall?
  if (map[y][newx] === '#') {
    // console.log(`hit a wall`)
    return false
  }
  // otherwise shift all the boxes (and the robot) over
  for (let mx = newx; mx !== x; mx += move.x * -1) {
    map[y][mx] = map[y][mx + move.x * -1]
    // console.log(`moved ${map[y][mx]} into ${mx}, ${y}`)
  }
  map[y][x] = '.'
  return true
}
/*

export function attemptMove(map, x, y, move, skip=false) {
  const newx = x + move.x
  const newy = y + move.y
  // showMap(map)
  console.log(`attempt move from ${x},${y} to ${newx},${newy} (${skip}) =`, map[newy]?.[newx])

  // move into an empty space
  if (map[newy][newx] === '.') {
    console.log(`found . at ${newx},${newy}`)
    return () => moveCell(map, x, y, newx, newy)
  }
  // cannot move into a wall
  if (map[newy][newx] === '#') {
    console.log(`found # at ${newx},${newy}`)
    return false
  }
  // there's a box... see if we can move it, but when moving a box we also
  // have to move the other half of it which will be one cell either side
  if (map[newy][newx] === '[') {
    console.log(`found [ at ${newx},${newy}`)
    const move1 = attemptMove(map, newx, newy, move)
    const move2 = skip
      ? doNothing
      : attemptMove(map, newx + 1, newy, move, true)
    if (move1 && move2) {
      console.log(`can move both parts`)
      return () => {
        moveCell(map, x, y, newx, newy)
        move2()
        move1()
      }
    }
    return false
  }
  if (map[newy][newx] === ']') {
    console.log(`found ] at ${newx},${newy}`)
    const move1 = attemptMove(map, newx, newy, move)
    const move2 = skip
      ? doNothing
      : attemptMove(map, newx - 1, newy, move, true)
    if (move1 && move2) {
      console.log(`can move both parts`)
      return () => {
        moveCell(map, x, y, newx, newy)
        move2()
        move1()
      }
    }
    return false
  }
  fail(`Don't know how to move to ${newx}, ${newy}`)
}

*/