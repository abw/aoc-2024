#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput } from './lib.js'

await run(
  { day: '<day>', part: 1, lines: true },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const data = parseInput(lines)
    debugData('data:', data)
    return 'TODO'
  }
)
