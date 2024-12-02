import { range } from '@abw/badger-utils'

export function parseInput(lines) {
  return lines.map(
    line => line.split(/\s+/).map( item => parseInt(item) )
  )
}

export function levelReport(levels) {
  const deltas = [ ]
  let max = -Infinity
  let min = Infinity

  // compare each pair of numbers
  range(0, levels.length - 2).forEach(
    n => {
      const a = levels[n]
      const b = levels[n + 1]
      // determine the difference
      const delta = b - a
      deltas.push(delta)
      // track the maximum absolute difference
      const ab = Math.abs(delta)
      if (ab > max) {
        max = ab
      }
      if (ab < min) {
        min = ab
      }
    }
  )
  const allNegative = deltas.every( n => n < 0 )
  const allPositive = deltas.every( n => n > 0 )
  const allSame = allNegative || allPositive
  const safe = allSame && min >= 1 && max <= 3
  return { levels, deltas, max, min, allNegative, allPositive, allSame, safe }
}

export function safeLevelRemoval(levels) {
  // first try no levels removed
  let report = levelReport(levels)
  if (report.safe) {
    return true
  }
  // then try removing each level at a time and see if that makes it safe
  for (let i = 0; i < levels.length; i++) {
    report = levelReport(
      levels.toSpliced(i, 1)
    )
    if (report.safe) {
      return true
    }
  }
  return false
}
