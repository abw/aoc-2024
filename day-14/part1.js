#!/usr/bin/env node
import { run } from '../lib/run.js'
import { moveRobots, parseInput, showRobots, splitQuadrants } from './lib.js'

await run(
  { day: '14', part: 1, lines: true },
  ({ lines, example, debugging, debugData }) => {
    debugData('lines:', lines)

    const width  = example ? 11 : 101
    const height = example ?  7 : 103
    const robots = parseInput(lines)
    debugData('robots initially:', robots)

    for (let n = 0; n < 100; n++) {
      moveRobots(robots, width, height)
    }
    debugData('robots after 100 moves:', robots)
    if (debugging) {
      showRobots(robots, width, height)
    }
    const quadrants = splitQuadrants(robots, width, height)
    debugData(`quadrants:`, quadrants)
    return quadrants.flat().reduce(
      (sum, n) => sum * n,
      1
    )
  }
)
