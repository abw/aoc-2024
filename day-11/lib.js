export function parseInput(lines) {
  return lines[0].split(/\s+/).map( n => parseInt(n) )
}

export function repeatIterate(list, blinks, debugData) {
  for (let i = 1; i <= blinks; i++) {
    list = iterate(list)
    debugData(`After ${i}:`, list.length)
  }
  return list
}

export function iterate(list) {
  return list.reduce(
    (list, item) => {
      if (item === 0) {
        list.push(1)
        return list
      }
      const str = item.toString()
      const chars = str.split('')
      const len = chars.length
      if (len % 2 == 0) {
        const half = len / 2
        const n1 = parseInt(chars.slice(0, half).join(''))
        const n2 = parseInt(chars.slice(half).join(''))
        // console.log(`${item} => ${n1} / ${n2}`)
        list.push(n1)
        list.push(n2)
        return list
      }
      list.push(item * 2024)
      return list
    },
    [ ]
  )
}

