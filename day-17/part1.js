#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput, runComputer, testComputer } from './lib.js'

await run(
  { day: '17', part: 1, lines: true },
  ({ lines, test, debugData }) => {
    debugData('lines:', lines)
    const computer = parseInput(lines)
    debugData('computer:', computer)

    if (test) {
      console.log(`testing`)
      testComputer({
        c: 9,
        program: [2, 6]
      })
      testComputer({
        a: 10,
        program: [5, 0, 5, 1, 5, 4]
      })
      testComputer({
        a: 2024,
        program: [0, 1, 5, 4, 3, 0]
      })
      testComputer({
        b: 29,
        program: [1, 7]
      })
      testComputer({
        b: 2024,
        c: 43690,
        program: [4, 0]
      })
      return 'TEST MODE'
    }

    runComputer(computer)
    return computer.output.join(',')
  }
)

