#!/usr/bin/env node
import { run } from '../lib/run.js'
import { operators, opKeys, parseInput } from './lib.js'

await run(
  { day: '07', part: 2, lines: true },
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

function ternaryNumber(n) {
  let s = n
  const bits = []
  while (s) {
    let d = Math.floor(s / 3)
    let m = s % 3
    bits.unshift(m)
    s = d
  }
  return bits.join('')
}

function findSolution(input, debugData) {
  const nOps = input.nOps = input.rest.length
  const nPermutations = input.nPermutations = Math.pow(3, nOps)
  debugData(`nOps ${nOps} permutations: `, input)
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
  const ternary = ternaryNumber(operatorKey) || 0
  const ternOps = ternary.toString().split('')
  const total = rest.reduce(
    (sum, operand, n) => {
      const bit = parseInt(ternOps.at(-(n + 1)) || 0)
      const op = operators[bit]
      ops.push(opKeys[bit])
      return op(sum, operand)
    },
    first
  )
  return { total, ops, match: result === total }
}

