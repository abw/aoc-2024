#!/usr/bin/env node
import { run } from '../lib/run.js'
import { attemptRobotMove, parseInput, showMap } from './lib.js'

await run(
  // { day: '15', part: 1, blocks: true, exampleFile: 'small-example.txt' },
  { day: '15', part: 1, blocks: true, },
  ({ blocks, debugging, debugData }) => {
    // debugData('blocks:', blocks)
    const { map, robot, moves } = parseInput(blocks)

    if (debugging) {
      showMap(map)
    }

    moves.forEach(
      move => {
        attemptRobotMove(map, robot, move)
        if (debugging) {
          debugData('move:', move)
          showMap(map)
        }
      }
    )

    return map.reduce(
      (sum, row, y) =>
        sum + row
          .reduce(
            (rowSum, cell, x) => rowSum + (
              cell === 'O'
                ? y * 100 + x
                : 0
            ),
            0
          ),
      0
    )
    //debugData('map:', map)
    //debugData('robot:', robot)
    //debugData('moves:', moves)
    // return 'TODO'
  }
)

