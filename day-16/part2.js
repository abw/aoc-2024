#!/usr/bin/env node
import { run } from '../lib/run.js'
import { fail } from '@abw/badger-utils'
import { parseInput } from './lib.js'
import { findCell, showMap } from '../lib/map.js'
import { arrowDirection, turnClockwise, turnAntiClockwise } from '../lib/direction.js'

const isWall = {
  '#': true,
}

// TODO: this is just a copy pasta of part 1.  Need to add the code to store
// the best paths and determine how many cells are on at least one best path.

await run(
  // { day: '16', part: 2, lines: true, exampleFile: 'example2.txt' },
  { day: '16', part: 2, lines: true },
  ({ lines, debugging, debugData }) => {
    const map = parseInput(lines)
    const reindeer = findCell(map, 'S') || fail('no start')
    const end = findCell(map, 'E') || fail('no end')
    debugData('reindeer:', reindeer)
    debugData('end:', end)
    if (debugging) {
      showMap(map)
    }

    const nodes = mapNodes(map)
    walkMap(nodes, reindeer.x, reindeer.y, arrowDirection.e)

    const node = nodes[end.y][end.x]
    debugData(`end node:`, node)

    return Object.values(node.cost).reduce(
      (min, n) => Math.min(min, n),
      Infinity
    )
  }
)


function mapNodes(map) {
  // determine all the valid moves from all non-wall (or blocked off) cells
  return Array.from(
    map,
    (row, y) => Array.from(
      row,
      (cell, x) => isWall[cell]
        ? null
        : {
            x, y,
            cost: { }
          }
    )
  )
}

function walkMap(nodes, x, y, dir) {
  const queue = [ [ x, y, dir ] ]
  const startNode = nodes[y][x]
  startNode.cost[dir.dir] = 0

  while (queue.length) {
    const [ x, y, dir ] = queue.shift()
    const node = nodes[y][x]
    const cw = turnClockwise(dir)
    const acw = turnAntiClockwise(dir)
    const turnCost = node.cost[dir.dir] + 1000
    if (! node.cost[cw.dir] || node.cost[cw.dir] > turnCost) {
      node.cost[cw.dir] = turnCost
    }
    if (! node.cost[acw.dir] || node.cost[acw.dir] > turnCost) {
      node.cost[acw.dir] = turnCost
    }
    // console.log(`${x},${y}`, dir)
    // console.log(`cw: `, cw)
    // console.log(`acw: `, acw)
    // console.log(`node: `, node)

    // For each of the three directions, see if the next cell in that
    // direction is open (i.e. not a wall) and look at the cost of moving
    // to it.  If it's less than the current cost for that cell then update
    // it and add it to the queue
    for (let d of [dir, cw, acw]) {
      const dx = x + d.x
      const dy = y + d.y
      const dn = nodes[dy][dx]
      if (! dn) {
        continue
      }
      const moveCost = node.cost[d.dir] + 1
      if (! dn.cost[d.dir] || dn.cost[d.dir] > moveCost){
        dn.cost[d.dir] = moveCost
        queue.push([ dx, dy, d ])
      }
    }
  }
}

