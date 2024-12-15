import { fail } from '@abw/badger-utils'
import { arrowDirection } from '../lib/direction.js'

export function parseInput(blocks) {
  const map = parseMap(blocks[0])
  const robot = findRobot(map)
  const moves = parseMoves(blocks[1])
  return { map, robot, moves }
}

export function parseMap(text) {
  return text
    .split('\n')
    .map( line => line.split('') )
}

export function findRobot(map) {
  const robot = { }
  map.forEach(
    (row, dy) => {
      const dx = row.indexOf('@')
      if (dx >= 0) {
        robot.x = dx
        robot.y = dy
      }
    }
  )
  return robot
}

export function parseMoves(text) {
  return text
    .split('\n')
    .flatMap(
      line => line
        .split('')
        .map( d => arrowDirection[d] )
    )
}

export function attemptRobotMove(map, robot, move) {
  const moved = attemptMove(map, robot.x, robot.y, move)
  if (moved) {
    robot.x += move.x
    robot.y += move.y
  }
}

// part 1 only
export function attemptMove(map, x, y, move) {
  const newx = x + move.x
  const newy = y + move.y

  // move into an empty space
  if (map[newy][newx] === '.') {
    moveCell(map, x, y, newx, newy)
    return true
  }
  // cannot move into a wall
  if (map[newy][newx] === '#') {
    return false
  }
  // there's a box... see if we can move it
  if (map[newy][newx] === 'O') {
    const moved = attemptMove(map, newx, newy, move)
    if (moved) {
      moveCell(map, x, y, newx, newy)
      return true
    }
    return false
  }
  fail(`Don't know how to move to ${newx}, ${newy}`)
}

export function moveCell(map, x, y, newx, newy) {
  // console.log(`moving ${map[y][x]} at ${x},${y} to ${newx},${newy}`)
  map[newy][newx] = map[y][x]
  map[y][x] = '.'
}

export function showMap(map) {
  map.forEach(
    row => console.log(row.join(''))
  )
}