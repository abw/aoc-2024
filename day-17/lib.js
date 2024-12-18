import { fail } from '@abw/badger-utils'

export function parseInput(lines) {
  const a = parseRegister(lines[0], 'A')
  const b = parseRegister(lines[1], 'B')
  const c = parseRegister(lines[2], 'C')
  const program = parseProgram(lines[4])
  return { a, b, c, program, ip: 0, output: [ ] }
}

export function parseRegister(line, r) {
  const match = line.match(/^Register (\w):\s(\d+)/)
    || fail(`Cannot parse ${r} register line: ${line}`)
  if (match[1] !== r ) {
    fail(`Cannot parse ${r} register line: ${line}`)
  }
  return parseInt(match[2])
}

export function parseProgram(line) {
  const match = line.match(/^Program:\s(.*)/)
    || fail(`Cannot parse program line: ${line}`)
  return match[1]
    .split(/,\s*/)
    .map( n => parseInt(n) )
}

export const comboOperands = [
  () => 0,
  () => 1,
  () => 2,
  () => 3,
  computer => computer.a,
  computer => computer.b,
  computer => computer.c,
  () => fail('Invalid operand 7'),
]

export const comboOperand = (computer, operand) =>
  comboOperands[operand](computer)

export const adv = (computer, operand) => {
  const num = computer.a
  const cbo = comboOperand(computer, operand)
  const den = Math.pow(2, cbo)
  computer.a = Math.floor(num / den)
  computer.ip += 2
}

export const bxl = (computer, operand) => {
  computer.b ^= operand
  computer.ip += 2
}

export const bst = (computer, operand) => {
  const cbo = comboOperand(computer, operand)
  computer.b = cbo % 8
  computer.ip += 2
}

export const jnz = (computer, operand) => {
  if (computer.a !== 0) {
    computer.ip = operand
  }
  else {
    computer.ip += 2
  }
}

export const bxc = computer => {
  computer.b ^= computer.c
  computer.ip += 2
}

export const out = (computer, operand) => {
  const cbo = comboOperand(computer, operand) % 8
  computer.output.push(cbo)
  computer.ip += 2
}

export const bdv = (computer, operand) => {
  const num = computer.a
  const cbo = comboOperand(computer, operand)
  const den = Math.pow(2, cbo)
  computer.b = Math.floor(num / den)
  computer.ip += 2
}

export const cdv = (computer, operand) => {
  const num = computer.a
  const cbo = comboOperand(computer, operand)
  const den = Math.pow(2, cbo)
  computer.c = Math.floor(num / den)
  computer.ip += 2
}

export const opcodes = [
  adv,
  bxl,
  bst,
  jnz,
  bxc,
  out,
  bdv,
  cdv
]

export function stepComputer(computer) {
  if (computer.ip >= computer.program.length) {
    return false
  }
  const op = computer.program[computer.ip]
  const opcode = opcodes[op]
  const operand = computer.program[computer.ip + 1]
  opcode(computer, operand)
  return true
}

export function runComputer(computer) {
  while (stepComputer(computer)) {
    // do nothing
  }
}

export function runComputerUnless(computer, unless) {
  while (stepComputer(computer)) {
    // check the unless condition and bail out early
    if (unless(computer)) {
      return false
    }
  }
  return true
}

export function testComputer(computer) {
  console.log(`test computer:`, computer)
  computer.a ??= 0
  computer.b ??= 0
  computer.c ??= 0
  computer.ip ??= 0
  computer.output ||= [ ]
  runComputer(computer)
  console.log(` =>`, computer)
}