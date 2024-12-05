import { fail } from '@abw/badger-utils'

export function parseInput(blocks) {
  const rules = parseRules(blocks[0])
  const sequences = parseSequences(blocks[1])
  const before = rules.reduce(
    (before, rule) => {
      const set = before[rule[1]] ||= [ ]
      set.push(rule[0])
      return before
    },
    { }
  )
  return { rules, sequences, before }
}

export function parseRules(rules) {
  return rules
    .split('\n')
    .map(
      line => line.split(/\|/).map( n => parseInt(n) )
    )
}

export function parseSequences(sequences) {
  return sequences
    .split('\n')
    .map(
      line => line.split(',').map( n => parseInt(n) )
    )
}

export function validSequences(data, debugData) {
  return data.sequences.filter(
    sequence => validSequence(sequence, data.before, debugData)
  )
}

export function invalidSequences(data, debugData) {
  return data.sequences.filter(
    sequence => ! validSequence(sequence, data.before, debugData)
  )
}

export function printingSequence(sequence) {
  return sequence.reduce(
    (printing, n) => {
      printing[n] = true
      return printing
    },
    { }
  )
}

export function validSequence(sequence, before, debugData) {
  const printing = printingSequence(sequence)
  const printed = { }
  debugData('sequence', sequence)
  debugData('printing', printing)

  for (let n of sequence) {
    const befores = before[n] || [ ]
    for (let b of befores) {
      if (printing[b] && ! printed[b]) {
        debugData(`Sequence invalid: ${b} must be printed before ${n}: `, sequence)
        return false
      }
    }
    printed[n] = true
  }
  return true
}

export function middleNumber(sequence) {
  const len = sequence.length
  if (len % 2 === 0) {
    console.log(`sequence: `, sequence)
    fail('sequence length is not odd')
  }
  const mid = (len - 1) / 2
  return sequence[mid]
}
