export const cellDisplay = ['.', '#', 'X']
export const directions = [
  { x:  0, y: -1 },  // North
  { x:  1, y:  0 },  // East
  { x:  0, y:  1 },  // South
  { x: -1, y:  0 },  // West
]

export function parseInput(lines) {
  const guard = { direction: 0 }
  const map = lines.map(
    (line, y) => line.split('').map(
      (char, x) => {
        if (char === '^') {
          guard.x = x
          guard.y = y
          return 2
        }
        return char === '#'
          ? 1
          : 0
      }
    )
  )
  return {
    map,
    guard,
    width: map[0].length,
    height: map.length
  }
}

export function displayMap(lines) {
  lines.forEach(
    line => console.log(
      line
        .map( cell => cellDisplay[cell] )
        .join('')
    )
  )
}

export function keepMovingGuard(data, debugging, debugData) {
  while (moveGuard(data, debugData)) {
    if (debugging) {
      displayMap(data.map)
    }
  }
}

export function moveGuard(data, debugData) {
  const { map, guard } = data
  let n = 0
  while (n < 5) {
    debugData(`guard`, data.guard)
    const next = nextCell(data)
    // If there's no next move then the guard has left the map
    if (! next) {
      return false
    }
    // If the next cell is empty then we move the guard there
    if (map[next.y][next.x] !== 1) {
      guard.x = next.x
      guard.y = next.y
      map[next.y][next.x] = 2
      debugData('moving guard to', next)

      return true
    }
    // otherwise rotate the guard
    guard.direction = (guard.direction + 1) % 4
    debugData('rotating guard', guard)
    n++
  }
  return false
}

export function nextCell({ guard, width, height }) {
  const move = directions[guard.direction]
  const x = guard.x + move.x
  const y = guard.y + move.y
  return (x < 0 || x >= width || y < 0 || y >= height)
    ? false
    : { x, y }
}

export function countVisitedCells(map) {
  return map.reduce(
    (sum, row) => sum + row.filter( cell => cell === 2 ).length,
    0
  )
}

export function guardGetsStuckInALoop(data, debugData) {
  const visited = { }
  const { guard } = data
  while (moveGuard(data, debugData)) {
    const key = `${guard.x}:${guard.y}:${guard.direction}`
    if (visited[key]) {
      return true
    }
    visited[key] = true
  }
  return false
}
