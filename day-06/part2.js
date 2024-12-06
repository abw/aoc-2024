#!/usr/bin/env node
import { run } from '../lib/run.js'
import { displayMap, guardGetsStuckInALoop, keepMovingGuard, parseInput } from './lib.js'

await run(
  { day: '06', part: 2, lines: true },
  ({ lines, debugData, debug, debugging }) => {
    debugData('lines:', lines)
    const data = parseInput(lines)
    debugData('data:', data)
    if (debugging) {
      displayMap(data.map)
    }

    // We only need to consider putting a block at places the guard visits
    const initialSetup = structuredClone(data)
    keepMovingGuard(initialSetup, debugging, debugData)

    let blocked = 0
    for (let y = 0; y < data.height; y++) {
      for (let x = 0; x < data.width; x++) {
        if (initialSetup.map[y][x] != 2) {
          debug(`Skipping ${x},${y} (guard never visits this cell)`)
          continue
        }
        debug(`Inspecting ${x},${y} of ${data.width},${data.height}`)

        const withBlock = structuredClone(data)
        const { map } = withBlock
        if (map[y][x] !== 0) {
          continue
        }
        map[y][x] = 1
        const looped = guardGetsStuckInALoop(withBlock, debugData)
        if (looped) {
          blocked++
          if (debugging) {
            console.log(`Guard gets stuck in a loop with obstruction at ${x},${y}`)
            displayMap(withBlock.map)
          }
        }
      }
    }

    return blocked
  }
)
