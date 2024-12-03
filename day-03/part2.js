#!/usr/bin/env node
import { run } from '../lib/run.js'

await run(
  { day: '03', part: 2, lines: true, exampleFile: 'example2.txt' },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const data = lines.flatMap(
      line => {
        const matches = [
          ...line.matchAll(
            /(do)\(\)|(don't)\(\)|mul\((\d{1,3}),(\d{1,3})\)/g
          )
        ]
        return matches.map(
          match => match[1]
            || match[2]
            || [ parseInt(match[3]), parseInt(match[4]) ]
        )
      }
    )
    debugData('data:', data)
    const [ , instrs] = data.reduce(
      ([enabled, instrs], instr) => {
        if (instr === 'do') {
          return [true, instrs]
        }
        if (instr === "don't") {
          return [false, instrs]
        }
        if (enabled) {
          return [enabled, [...instrs, instr]]
        }
        return [enabled, instrs]
      },
      [true, []]
    )
    debugData('instrs:', instrs)
    const sum = instrs.reduce(
      (sum, pair) => sum + pair[0] * pair[1],
      0
    )
    return sum
  }
)
