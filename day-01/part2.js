#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput } from './lib.js'

await run(
  { day: '01', part: 2, lines: true },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const [list1, list2] = parseInput(lines)
    debugData('list1:', list1)
    debugData('list2:', list2)
    const l2freq = list2.reduce(
      (freq, n) => {
        freq[n] ||= 0
        freq[n]++
        return freq
      },
      { }
    )
    debugData('l2freq:', l2freq)
    const l1sim = list1.map(
      item => item * l2freq[item] || 0
    )
    debugData('l1sim:', l1sim)
    const total = l1sim.reduce(
      (total, n) => total + n
    )
    return total
  }
)
