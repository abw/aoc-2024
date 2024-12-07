#!/usr/bin/env node
import { run } from '../lib/run.js'
import { operators, opKeys, parseInput } from './lib.js'

await run(
  { day: '07', part: 1, lines: true },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const data = parseInput(lines)
    debugData('data:', data)
    const results = data.filter(
      d => findSolution(d, debugData)
    )
    debugData('solutions: ', results)
    return results.reduce(
      (sum, result) => sum + result.result,
      0
    )
  }
)

function findSolution(input, debugData) {
  const nOps = input.nOps = input.rest.length
  const nPermutations = input.nPermutations = 1 << nOps
  debugData('Permutations: ', input)
  for (let n = 0; n < nPermutations; n++)  {
    const result = apply(input, n)
    if (result.match) {
      debugData(`result matches:`, result)
      return result
    }
  }
  return false
}

function apply({ result, first, rest }, operatorKey) {
  const ops = [ ]
  const total = rest.reduce(
    (sum, operand, n) => {
      const bit = (operatorKey & (1 << n)) ? 1 : 0
      const op = operators[bit]
      ops.push(opKeys[bit])
      return op(sum, operand)
    },
    first
  )
  return { total, ops, match: result === total }
}

