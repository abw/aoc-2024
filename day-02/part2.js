#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput, safeLevelRemoval } from './lib.js'

await run(
  { day: '02', part: 2, lines: true },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const data = parseInput(lines)
    debugData('data:', data)
    const safe = data.filter(safeLevelRemoval)
    return safe.length
  }
)
