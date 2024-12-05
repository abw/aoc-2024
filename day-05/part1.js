#!/usr/bin/env node
import { run } from '../lib/run.js'
import { middleNumber, parseInput, validSequences } from './lib.js'

await run(
  { day: '05', part: 1, blocks: true },
  ({ blocks, debugData }) => {
    debugData('blocks:', blocks)
    const data = parseInput(blocks)
    debugData('data:', data)
    const valid = validSequences(data, debugData)
    debugData('valid', valid)
    const middles = valid.map(middleNumber)
    debugData('middles', middles)
    return middles.reduce(
      (sum, n) => sum + n
    )
  }
)
