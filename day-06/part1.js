#!/usr/bin/env node
import { run } from '../lib/run.js'
import { countVisitedCells, displayMap, keepMovingGuard, parseInput } from './lib.js'

await run(
  { day: '06', part: 1, lines: true },
  ({ lines, debugData, debugging }) => {
    debugData('lines:', lines)
    const data = parseInput(lines)
    debugData('data:', data)
    if (debugging) {
      displayMap(data.map)
    }
    keepMovingGuard(data, debugging, debugData)
    if (debugging) {
      displayMap(data.map)
    }
    return countVisitedCells(data.map)
  }
)
