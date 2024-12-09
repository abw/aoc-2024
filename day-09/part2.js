#!/usr/bin/env node
import { run } from '../lib/run.js'

await run(
  { day: '09', part: 2, lines: true },
  ({ text, debugData }) => {
    debugData('text:', text)
    const blocks = parseInput(text)
    debugData('data:', blocks)
    debugData(`map: `, blocksMap(blocks))
    while (shiftBlock(blocks, debugData)) {
      debugData(`data: `, blocks)
      debugData('moved:', blocksMap(blocks))
    }
    debugData(`data: `, blocks)
    debugData('moved:', blocksMap(blocks))
    const expanded = expandBlocks(blocks)
    debugData(`expanded: `, expanded)
    return expanded.reduce(
      (sum, id, pos) => sum + (id * pos),
      0
    )
  }
)

export function parseInput(text) {
  const chars = text.split('')
  return chars.map(
    (c, n) => {
      const size = parseInt(c)
      return (n % 2)
        ? { files: [ ], space: size }
        : { files: [ { id: Math.floor(n / 2), size } ], space: 0 }
    }
  )
}

export function blocksMap(blocks) {
  return blocks.flatMap(blockMap).join('')
}

export function expandBlocks(blocks) {
  return blocks.flatMap(
    block => {
      const fileBlocks = block.files.flatMap(
        file => Array.from(
          new Array(file.size),
          () => file.id
        )
      )
      const spaceBlocks = Array.from(
        new Array(block.space),
        () => 0
      )
      return [...fileBlocks, ...spaceBlocks]
    }
  )
}

export function blockMap(block) {
  const files = block.files.flatMap(
    file => Array.from(
      new Array(file.size),
      () => file.id
    )
  ).join('')
  const spaces = '.'.repeat(block.space)
  return files + spaces
}

function shiftBlock(blocks, debugData) {
  // find the last block that has a single file and hasn't failed
  const lastBlockIndex = blocks.findLastIndex(
    block => block.files.length === 1 && ! block.failed
  )
  if (lastBlockIndex < 0) {
    return false
  }
  const lastBlock = blocks[lastBlockIndex]
  const lastFile = lastBlock.files[0]
  debugData('lastBlock to move:', lastBlock)

  // find the first block with enough space that comes before the last block
  const firstGapIndex = blocks.findIndex(
    (block, index) => block.space >= lastFile.size && index < lastBlockIndex
  )

  // if we didn't find a gap for this file, mark the block as failed but
  // then return true to carry on looking for the next candidate
  if (firstGapIndex < 0) {
    debugData('no space for this file:', lastFile)
    lastBlock.failed = true
    return true
  }

  // add the file to the block with the gap and reduce the available space
  const firstGap = blocks[firstGapIndex]
  debugData('adding file to gap block:', firstGap)
  firstGap.files.push(lastFile)
  firstGap.space -= lastFile.size
  debugData('added file to gap block:', firstGap)

  // remove the file from the source block and increase space
  lastBlock.files.shift()
  lastBlock.space += lastFile.size
  return true
}