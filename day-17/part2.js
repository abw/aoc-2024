#!/usr/bin/env node
import { cmdLineOptions } from '../lib/options.js'
import { run } from '../lib/run.js'
import { parseInput, runComputer, stepComputer } from './lib.js'

await run(
  { day: '17', part: 2, lines: true, exampleFile: 'example2.txt' },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const computer = parseInput(lines)
    debugData('computer:', computer)
    let a = 0
    /*
    while (true) {
      if (tryComputerN(computer, a, 1)) {
        console.log(`first digit match at ${a}`);

      }
      a++
      // if (a % 1_000_000 === 0) {
      //   console.log(a)
      // }
    }
    */
    for (let i = 0; i < 8; i++) {
      stepComputer(computer)
      console.log(`computer #${i}: `, computer);
    }
  }
)

function unlessPrefixMismatch(computer) {
  if (
    computer.output.length &&
    computer.output.join(',') !== computer.program.slice(0, computer.output.length).join(',')
  ) {
    return true
  }
  return false
}

function tryComputer(computer, a) {
  const copy = structuredClone(computer)
  copy.a = a
  runComputer(copy)
  if (copy.program.join(',') === copy.output.join(',')) {
    console.log(`MATCH: `, copy.output.join(','))
    return true
  }
  return false
}

function tryComputerN(computer, a, n) {
  const copy = structuredClone(computer)
  copy.a = a
  runComputer(copy)
  if (copy.program.slice(0, n).join(',') === copy.output.slice(0,n).join(',')) {
    console.log(`MATCH: `, copy.output.slice(0,n).join(','))
    return true
  }
  return false
}