export function parseInput(lines) {
  return lines.map(parseLine)
}

export function parseLine(line) {
  const [result, inputs] = line.split(/:\s+/)
  const operands = inputs.split(/\s+/).map( n => parseInt(n) )
  const [first, ...rest] = operands
  return {
    result: parseInt(result),
    operands,
    first,
    rest
  }
}

export const opAdd = (a, b) => a + b
export const opMul = (a, b) => a * b
export const opJoin = (a, b) => parseInt('' + a + b)
export const operators = [opAdd, opMul, opJoin]
export const opKeys = ['+', '*', '||']

