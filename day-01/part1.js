#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput } from './lib.js'

await run(
  { day: '01', part: 1, lines: true },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const [list1, list2] = parseInput(lines)
    debugData('list1:', list1)
    debugData('list2:', list2)
    const diffs = list1.map(
      (item1, i) => Math.abs(item1 - list2[i])
    )
    debugData('diffs:', diffs)
    const diff = diffs.reduce(
      (diff, n) => diff + n
    )
    debugData('diff:', diff)
    return diff
  }
)
