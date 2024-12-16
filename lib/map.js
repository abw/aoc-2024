// See also ./direction.js

// map is a 2d array of [y][x]
export function findCell(map, find) {
  for (let y = 0; y < map.length; y++) {
    const x = map[y].indexOf(find)
    if (x >= 0) {
      return { x, y }
    }
  }
  return false
}

export function showMap(map) {
  for (let row of map) {
    console.log(row.join(''))
  }
}

export function mapDimensions(map) {
  const height = map.length
  const width = map[0].length
  return { height, width }
}