#!/usr/bin/env node
import { run } from '../lib/run.js'
import { determinePerimeter, findAllContiguousRegions, parseInput } from './lib.js'

await run(
  { day: '12', part: 1, lines: true, exampleFile: 'example3.txt' },
  ({ lines, debugData }) => {
    debugData('lines:', lines)
    const { map, width, height } = parseInput(lines)
    debugData(`${width} x ${height} map:`, map)
    const regions = findAllContiguousRegions(map)
    debugData('regions: ', regions)
    regions.forEach(determinePerimeter)
    debugData('regions: ', regions)
    return regions.reduce(
      (sum, region) => sum + region.area * region.perimeter,
      0
    )
  }
)

