import { fail, isString } from '@abw/badger-utils'

export const directions = [
  { x:  0, y: -1, dir: 'n', arrow: '^' },  // North
  { x:  1, y:  0, dir: 'e', arrow: '>' },  // East
  { x:  0, y:  1, dir: 's', arrow: 'v' },  // South
  { x: -1, y:  0, dir: 'w', arrow: '<' },  // West
]

export const arrowDirection = directions.reduce(
  (arrows, dir, n) => {
    dir.n = n
    arrows[dir.dir] = dir                // e.g. 'n', 'e', etc.
    arrows[dir.arrow] = dir              // e.g. '^', '>', etc.
    arrows[n] = dir                      // e.g. '0', '1', etc.
    arrows[`${dir.x},${dir.y}`] = dir    // e.g. '0,-1', '1,0', etc.
    return arrows
  },
  { }
)

export const turnClockwise = dir => {
  const d = isString(dir)
    ? (arrowDirection[dir] || fail(`Invalid direction: ${dir}`))
    : dir
  const n = (d.n + 1) % 4
  return arrowDirection[n]
}

export const turnAntiClockwise = dir => {
  const d = isString(dir)
    ? (arrowDirection[dir] || fail(`Invalid direction: ${dir}`))
    : dir
  const n = (d.n + 3) % 4
  return arrowDirection[n]
}

export const adjacentCells = (map, x, y) => {
  const height = map.length
  const width = map[0].length
  return directions
    .map(
      dir => ({
        x: x + dir.x,
        y: y + dir.y,
        dir: dir.dir,
      })
    )
    .filter(
      ({ x, y }) => x >= 0 && x < width && y >= 0 && y < height
    )
}

export function eachCell(map, fn) {
  map.forEach(
    (row, y) => row.forEach(
      (cell, x) => fn(cell, x, y)
    )
  )
}
