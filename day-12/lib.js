import { adjacentCells, directions, eachCell } from '../lib/direction.js'

export function parseInput(lines) {
  const map = lines.map(
    line => line.split('')
  )
  const width = map[0].length
  const height = map.length
  return { map, width, height }
}

export function findAllContiguousRegions(map) {
  const used = { }
  const regions = [ ]
  eachCell(
    map,
    (letter, x, y) => {
      const region = contiguousRegion(map, letter, x, y, used)
      if (region) {
        regions.push(region)
      }
    }
  )
  return regions
}

function contiguousRegion(map, letter, x, y, used={}) {
  const key = cellKey(x, y)
  if (used[key]) return false

  const queue = [ { x, y } ]
  const cells = [ ]

  while (queue.length) {
    const cell = queue.shift()
    const key = cellKey(cell.x, cell.y)
    if (used[key]) {
      continue
    }
    used[cellKey(cell.x, cell.y)] = true
    cells.push(cell)
    queue.push(
      ...adjacentCells(map, cell.x, cell.y)
        .filter(
          ({ x, y }) => map[y][x] === letter && ! used[cellKey(x, y)]
        )
    )
  }
  const includes = cells.reduce(
    (used, { x, y }) => {
      used[cellKey(x, y)] = true
      return used
    },
    { }
  )
  return { letter, cells, includes }
}

function cellKey(x, y) {
  return `${x},${y}`
}

export function determinePerimeter(region) {
  const { cells, includes } = region
  region.area = cells.length
  const perimeterCells = region.perimeterCells = [ ]
  cells.forEach(
    cell => {
      directions.forEach(
        dir => {
          const adj = {
            x: cell.x + dir.x,
            y: cell.y + dir.y,
            dir: dir.dir
          }
          if (! includes[cellKey(adj.x, adj.y)]) {
            perimeterCells.push(adj)
          }
        }
      )
    }
  )
  region.perimeter = perimeterCells.length
}