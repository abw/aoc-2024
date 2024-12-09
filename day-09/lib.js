export function parseInput(text) {
  const chars = text.split('')
  return chars.map(
    (c, n) => (n % 2)
      ? { space: true, length: parseInt(c) }
      : { file: Math.floor(n / 2), length: parseInt(c) }
  )
}

export function blockMap(data) {
  return data.flatMap(
    block => Array.from(
      new Array(block.length),
      () => block.file ?? -1
    )
  )
}

export function textBlockMap(data) {
  return data.map(
    block => block < 0
      ? '.'
      : block
  ).join('')
}
