#!/usr/bin/env node
import { run } from '../lib/run.js'
import { antinodeMap, countAntinodes, parseInput } from './lib.js'

await run(
  { day: '08', part: 1, lines: true },
  ({ lines, debugging, debugData }) => {
    debugData('lines:', lines)
    const data = parseInput(lines)
    debugData('data:', data)
    const antinodes = computeAntinodes(data, debugData)
    debugData('antinodes:', antinodes)
    if (debugging) {
      antinodeMap(antinodes)
    }
    return countAntinodes(antinodes)
  }
)

function computeAntinodes(data, debugData) {
  const { width, height, locations } = data
  const antinodes = Array.from(
    Array(height),
    () => Array.from(
      new Array(width),
      () => 0
    )
  )
  Object.entries(locations).forEach(
    entry => {
      const fas = frequencyAntinodes(...entry, debugData)
      fas.forEach(
        ({ x, y }) => {
          if (y >= 0 && y < height && x >= 0 && x < width) {
            antinodes[y][x]++
          }
        }
      )
    }
  )
  return antinodes
}

function frequencyAntinodes(frequency, locations, debugData) {
  debugData(`frequency ${frequency} at`, locations)
  const antinodes = [ ]
  // for each location, pair up with all the other locations
  locations.forEach(
    (a, i) => locations.forEach(
      (b, j) => {
        // ignore the case where we're looking at the same location
        if (i === j) {
          return
        }
        // compute the vector from a to b...
        //   const vector = { x: b.x - a.x, y: b.y - a.y }
        // ...then there must be an antinode at b + vector...
        //   const antinode = { x: b.x + vector.x, y: b.y + vector.y }
        // ...but we can optimise that
        const antinode = { x: b.x * 2 - a.x, y: b.y * 2 - a.y }
        debugData(`${i} -> ${j}:`, { a, b, antinode })
        antinodes.push(antinode)
      }
    )
  )
  return antinodes
}

