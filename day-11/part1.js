#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput, repeatIterate } from './lib.js'

await run(
  { day: '11', part: 1, lines: true },
  ({ lines, example, debugData }) => {
    debugData('lines:', lines)
    let list = parseInput(lines)
    debugData('initial list:', list)
    list = repeatIterate(
      list,
      example ? 6 : 25,
      debugData
    )
    return list.length
  }
)
