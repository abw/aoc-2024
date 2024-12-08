export const DOT = '.'

export function parseInput(lines) {
  const cells = lines.map(
    line => line.split('')
  )
  const width = cells[0].length
  const height = cells.length
  const locations = grokLocations(cells, width, height)
  return { cells, width, height, locations }
}

export function grokLocations(cells, width, height) {
  const locations = { }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = cells[y][x]
      if (cell !== DOT) {
        const location = locations[cell] ||= [ ]
        location.push({ x, y })
      }
    }
  }
  return locations
}

export function antinodeMap(antinodes) {
  antinodes.forEach(
    row => console.log(
      row.map( cell => cell ? '#' : '.' ).join('')
    )
  )
}

export function countAntinodes(antinodes) {
  return antinodes.reduce(
    (sum, row) => sum + row.filter( cell => cell > 0 ).length,
    0
  )
}