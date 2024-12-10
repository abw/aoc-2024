export function parseInput(lines) {
  return lines.map(
    line => line.split('').map( n => parseInt(n) )
  )
}

export function eachCell(chart, fn) {
  chart.forEach(
    (row, y) => row.forEach(
      (cell, x) => fn(cell, x, y)
    )
  )
}

export function findTrailHeads(cells) {
  const trailHeads = [ ]
  eachCell(
    cells,
    (cell, x, y) => {
      if (cell === 0) {
        trailHeads.push({ x, y })
      }
    }
  )
  return trailHeads
}