export const directions = [
  { x:  0, y: -1, dir: 'n' },  // North
  { x:  1, y:  0, dir: 'e' },  // East
  { x:  0, y:  1, dir: 's' },  // South
  { x: -1, y:  0, dir: 'w' },  // West
]

export const arrowDirection = {
  '^': directions[0],
  '>': directions[1],
  'v': directions[2],
  '<': directions[3],
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
