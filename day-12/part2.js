#!/usr/bin/env node
import { run } from '../lib/run.js'
import { determinePerimeter, findAllContiguousRegions, parseInput } from './lib.js'

// For an edge in the direction relative to a cell (e.g. n is the edge north
// of a cell, and thus running "horizontally" from east to west), this maps
// to the adjacent cells of the perimeter (e.g. for north that's one cell east
// and one west).  Note that north and south are the same (adjacent cells are
// horizontal), as are east and west (vertical)
export const edgeAdjacent = {
  n: [ { x: -1, y:  0 }, { x: 1, y: 0 } ], // North
  e: [ { x:  0, y: -1 }, { x: 0, y: 1 } ], // East
  s: [ { x: -1, y:  0 }, { x: 1, y: 0 } ], // South
  w: [ { x:  0, y: -1 }, { x: 0, y: 1 } ]  // West
}


await run(
  { day: '12', part: 2, lines: true, exampleFile: 'example3.txt' },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const { map, width, height } = parseInput(lines)
    debugData(`${width} x ${height} map:`, map)
    const regions = findAllContiguousRegions(map)
    debugData('regions: ', regions)
    regions.forEach(determinePerimeter)
    regions.forEach( region => countSides(region, debugData))
    debugData('regions: ', regions)
    return regions.reduce(
      (sum, region) => sum + region.area * region.sides,
      0
    )
  }
)

function countSides(region, debugData) {
  const { perimeterCells } = region

  // first create a lookup table so we can tell which cells are included
  const includes = region.includesPerimeter = perimeterCells.reduce(
    (includes, { x, y, dir }) => {
      includes[perimeterKey(x, y, dir)] = true
      return includes
    },
    { }
  )

  // keep track of which cells we've already inspected
  const used = { }

  // iterate over each cell in the perimeter and look for adjacent cells
  // running in the same direction that are included in the perimeter
  // (includes) but haven't already been used in another edge of the same
  // direction (used)
  debugData('perimeterCells:', perimeterCells)
  debugData('includes:', includes)
  // const edge = matchEdge(perimeterCells[0], includes, used, debugData)
  region.sideCells = perimeterCells
    .map(
      cell => matchEdge(cell, includes, used, debugData)
    )
    .filter(Boolean)

  region.sides = region.sideCells.length
}

function matchEdge(cell, includes, used, debugData) {
  if (used[perimeterKey(cell.x, cell.y, cell.dir)]) {
    debugData('already used cell: ', cell)
    return false
  }

  const dirs = edgeAdjacent[cell.dir]
  debugData('adjacent: ', { cell, dirs })

  const edge = [ ]

  dirs.forEach(
    dir => {
      debugData(`cell in direction: `, { cell, dir})
      let x = cell.x
      let y = cell.y
      while (includes[perimeterKey(x, y, cell.dir)]) {
        debugData(`found matching cell: `, { x, y })
        const key = perimeterKey(x, y, cell.dir)
        if (! used[key]) {
          edge.push({ x, y, dir: cell.dir })
          used[key] = true
        }
        x += dir.x
        y += dir.y
      }
    }
  )
  return edge
}

function perimeterKey(x, y, dir) {
  return `${x},${y},${dir}`
}