export const directions = [
  { x:  0, y: -1, dir: 'n' },  // North
  { x:  1, y:  0, dir: 'e' },  // East
  { x:  0, y:  1, dir: 's' },  // South
  { x: -1, y:  0, dir: 'w' },  // West
]

export const adjacentCells = (map, x, y) => {
  const height = map.length
  const width = map[0].length
  return directions
    .map(
      dir => ({
        x: x + dir.x,
        y: y + dir.y,
      })
    )
    .filter(
      ({ x, y }) => x >= 0 && x < width && y >= 0 && y < height
    )
}