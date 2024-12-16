#!/usr/bin/env node
import { fail } from '@abw/badger-utils'
import { arrowDirection, eachCell, adjacentCells } from '../lib/direction.js'
import { findCell, showMap } from '../lib/map.js'
import { run } from '../lib/run.js'
import { parseInput } from './lib.js'

const isWall = {
  '#': true,
  'X': true,  // used to block off dead ends
}

await run(
  { day: '16', part: 1, lines: true },
  ({ lines, debugData }) => {
    const map = parseInput(lines)
    const reindeer = findCell(map, 'S') || fail('no start')
    const end = findCell(map, 'E') || fail('no end')
    reindeer.direction = arrowDirection.e
    debugData('reindeer:', reindeer)
    debugData('end:', end)
    showMap(map)

    console.log(`Block off dead ends`)
    findDeadEnds(map)
    showMap(map)

    const nodes = mapNodes(map)
    // console.log(`moves 1,2`, nodes[2][1])
    const start = nodes[reindeer.y][reindeer.x]
    start.minCost = 0

    iterateNodes(nodes, reindeer)

    const node = nodes[end.y][end.x]
    console.log(`end node:`, node)
    console.log(`nodes: `, nodes);



    //console.log(`costs: `, costs)
    //const costs = costOfMoves(moves, reindeer)

    return node.minCost
  }
)


function findDeadEnds(map) {
  const queue = [ ]

  // find all the cells that aren't walls
  eachCell(
    map,
    (cell, x, y) => {
      if (cell === '#') {
        return
      }
      queue.push({ x, y })
    }
  )

  // iterate over the queue
  while (queue.length) {
    const { x, y } = queue.shift()

    // count the number of adjacent cells that aren't walls
    const adj = adjacentCells(map, x, y)
      .filter( ({ x, y }) => ! isWall[map[y][x]])

    // if there's only one empty adjacent cell then this is a dead end
    if (adj.length === 1) {
      map[y][x] = 'X'
      // The single adjacent cell might be S or E which we want to keep, so
      // only add it to the queue if it's empty.
      const a = adj[0]
      if (map[a.y][a.x] === '.') {
        queue.push(adj[0])
      }
    }
  }
}

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
            moves: findCellMoves(map, x, y),
            minCost: Infinity,
            visited: { },
          }
    )
  )
}

function findCellMoves(map, ox, oy) {
  return adjacentCells(map, ox, oy)
    .filter(
      ({ x, y }) => ! isWall[map[y][x]]
    )
    .map(
      ({ x, y }) => {
        const dx = x - ox
        const dy = y - oy
        const direction = arrowDirection[`${dx},${dy}`]
        return { x, y, direction }
      }
    )
}

function costOfMoves(moves, reindeer) {
  return moves[reindeer.y][reindeer.x].moves.map(
    move => ({
      move,
      cost: costOfMove(move, reindeer)
    })
  )
}

function costOfMove(move, reindeer) {
  // console.log(`cost of move:`, { reindeer, move })
  const turns = Math.abs(reindeer.direction.n - move.direction.n)
  // 3 turns is the same as 1 turn in the opposite direction
  const minTurns = turns === 3
    ? 1
    : turns
  //if (reindeer.direction.dir === move.direction.dir) {
  //  console.log(`same direction`)
  //  return 1
  //}
  // console.log(`must make ${minTurns} turn`)
  return (minTurns * 1000) + 1
}

function iterateNodes(nodes, reindeer) {
  const traversed = { }
  const queue = [ reindeer ]
  // let max = 5
  // while (queue.length && max--> 0) {
  while (queue.length) {
    const deer = queue.shift()
    const { x, y, direction: { dir } } = deer
    const node = nodes[y][x]
    // console.log(`deer: `, deer)
    console.log(`at: `, { x, y, dir })
    // console.log(`node: `, node)
    const moves = costOfMoves(nodes, deer)
    // console.log(`moves: `, moves)
    for (let move of moves) {
      const { cost, move: { x: tx, y: ty, direction: { dir } } } = move
      console.log(`to: `, { tx, ty, dir })
      const key = `${x},${y}-${dir}-${tx},${ty}`
      if (traversed[key]) {
        continue
      }
      traversed[key] = true
      // console.log(`cost: ${cost} to ${x},${y} going ${dir}`)
      const target = nodes[ty][tx]
      // console.log(`target: `, target);

      const newCost = node.minCost + cost
      // console.log(`minCost at ${x},${y} is ${newCost}, target is `, target)
      if (target.minCost > newCost) {
        console.log(`updating minCost at ${tx},${ty} from ${target.minCost} to ${newCost}`)
        target.minCost = newCost
      }
      // console.log(`pushing move: `, move.move)
      queue.push(move.move)
    }
  }

}