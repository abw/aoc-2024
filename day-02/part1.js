#!/usr/bin/env node
import { run } from '../lib/run.js'
import { parseInput, levelReport } from './lib.js'

await run(
  { day: '02', part: 1, lines: true },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const data = parseInput(lines)
    debugData('data:', data)
    const reports = data.map(levelReport)
    debugData('reports:', reports)
    const safe = reports.filter( report => report.safe )
    return safe.length
  }
)
