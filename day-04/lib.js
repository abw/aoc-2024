export function parseInput(lines) {
  const letters = lines.map(
    line => line.split('')
  )
  return {
    letters,
    width: letters[0].length,
    height: letters.length
  }
}

export function findLetters(grid, x, y, deltas, letters) {
  const letter = letters.shift()
  // const deltas = dirs[dir] || fail(`Invalid direction: ${dir}`)
  const lookup = grid.letters[y][x]
  // first letter doesn't match
  if (letter !== lookup) {
    return false
  }
  // first letter does match and there are no more letters to search for
  if (! letters.length) {
    return true
  }
  // determine coordinates of next letter
  const nextx = x + deltas.x
  const nexty = y + deltas.y
  // check it doesn't fall outside grid area
  if (nextx < 0 || nextx >= grid.width || nexty < 0 || nexty >= grid.height) {
    return false
  }
  // recurse!
  return findLetters(grid, nextx, nexty, deltas, letters)
}
