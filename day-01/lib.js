export function parseInput(lines) {
  const pairs = lines.map(
    line => line
      .split(/\s+/)
      .map( text => parseInt(text) )
  )
  const lists = pairs.reduce(
    (lists, pair) => [
      [ ...lists[0], pair[0] ],
      [ ...lists[1], pair[1] ]
    ],
    [[ ],[ ]]
  )
  return lists.map( list => list.sort() )
}
