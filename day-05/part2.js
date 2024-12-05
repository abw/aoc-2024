#!/usr/bin/env node
import { run } from '../lib/run.js'
import { invalidSequences, middleNumber, parseInput, printingSequence } from './lib.js'

await run(
  { day: '05', part: 2, blocks: true },
  ({ blocks, debugData }) => {
    debugData('blocks:', blocks)
    const data = parseInput(blocks)
    debugData('data:', data)
    const invalid = invalidSequences(data, debugData)
    debugData('invalid', invalid)
    const valid = correctSequences(invalid, data, debugData)
    debugData('corrected', valid)
    const middles = valid.map(middleNumber)
    debugData('middles', middles)
    return middles.reduce(
      (sum, n) => sum + n
    )
  }
)

function correctSequences(sequences, data, debugData) {
  return sequences.map(
    sequence => correctSequence(sequence, data.before, debugData)
  )
}

function correctSequence(sequence, before, debugData) {
  const printing = printingSequence(sequence)
  const position = sequence.reduce(
    (position, number, i) => {
      position[number] = i
      return position
    },
    { }
  )
  const printed = { }
  debugData('sequence', sequence)
  debugData('printing', printing)
  debugData('position', position)

  for (let n of sequence) {
    const befores = before[n] || [ ]
    for (let b of befores) {
      if (printing[b] && ! printed[b]) {
        debugData(`Sequence invalid: ${b} must be printed before ${n}: `, sequence)
        // swap positions and try again
        sequence[position[b]] = n
        sequence[position[n]] = b
        debugData(`swapped ${b} (at ${position[b]}) and ${n} (at ${position[n]})`, sequence)
        return correctSequence(sequence, before, debugData)
      }
    }
    printed[n] = true
  }
  return sequence
}
