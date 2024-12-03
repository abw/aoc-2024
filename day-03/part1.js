#!/usr/bin/env node
import { run } from '../lib/run.js'

await run(
  { day: '03', part: 1, lines: true },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const data = lines.flatMap(
      line => {
        const matches = [ ...line.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g) ]
        return matches.map(
          match => [parseInt(match[1]), parseInt(match[2])]
        )
      }
    )
    debugData('data:', data)
    const sum = data.reduce(
      (sum, pair) => sum + pair[0] * pair[1],
      0
    )
    return sum
  }
)
