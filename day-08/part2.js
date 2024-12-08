#!/usr/bin/env node
import { run } from '../lib/run.js'
import { antinodeMap, countAntinodes, parseInput } from './lib.js'

await run(
  { day: '08', part: 2, lines: true },
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
      frequencyAntinodes(...entry, antinodes, width, height, debugData)
    }
  )
  return antinodes
}

function frequencyAntinodes(frequency, locations, antinodes, width, height, debugData) {
  debugData(`frequency ${frequency} at`, locations)
  // debugData('map', { antinodes, width, height })
  // for each location, pair up with all the other locations
  locations.forEach(
    (a, i) => {
      // There is an antinode at each antenna
      antinodes[a.y][a.x]++
      locations.forEach(
        (b, j) => {
          // ignore the case where we're looking at the same location
          if (i === j) {
            return
          }
          // compute the vector from a to b...
          const vector = subVectors(b, a)
          let antinode = addVectors(b, vector)
          while (insideMap(antinode, width, height)) {
            antinodes[antinode.y][antinode.x]++
            antinode = addVectors(antinode, vector)
          }
        }
      )
    }
  )
}

function insideMap({ x, y }, width, height) {
  return (x >= 0 && x < width && y >= 0 && y < height)
}

function subVectors(a, b) {
  return { x: a.x - b.x, y: a.y - b.y }
}

function addVectors(a, b) {
  return { x: a.x + b.x, y: a.y + b.y }
}