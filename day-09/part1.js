#!/usr/bin/env node
import { run } from '../lib/run.js'
import { blockMap, parseInput, textBlockMap } from './lib.js'

await run(
  { day: '09', part: 1 },
  ({ text, debugData }) => {
    debugData('text:', text)
    const data = parseInput(text)
    debugData('data:', data)
    const blocks = blockMap(data)
    debugData('blocks:', blocks)
    const textBlocks = textBlockMap(blocks)
    debugData('text:', textBlocks)
    while (shiftBlock(blocks, debugData)) {
      debugData('moved:', textBlockMap(blocks))
    }
    return blocks.reduce(
      (sum, id, pos) => sum + (id * pos),
      0
    )
  }
)

function shiftBlock(blocks, debugData) {
  const firstGap = blocks.indexOf(-1)
  if (firstGap < 0) {
    return false
  }
  const lastBlock = blocks.pop()
  if (lastBlock === -1) {
    return true
  }
  debugData('Moving', { lastBlock, firstGap })
  blocks[firstGap] = lastBlock
  return true
}