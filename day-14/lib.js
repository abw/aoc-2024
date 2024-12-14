import { fail, range } from '@abw/badger-utils'

export function parseInput(lines) {
  return lines.map(parseLine)
}

export function parseLine(line) {
  const match = line.match(/^p=(\d+),(\d+)\s+v=(-?\d+),(-?\d+)$/)
    || fail(`Failed to parse line: ${line}`)
  return {
    x: parseInt(match[1]),
    y: parseInt(match[2]),
    dx: parseInt(match[3]),
    dy: parseInt(match[4])
  }
}

export function moveRobots(robots, width, height) {
  return robots.map(
    robot => moveRobot(robot, width, height)
  )
}

export function moveRobot(robot, width, height) {
  // NOTE: we add the width and height each time to account for negatives
  robot.x = (robot.x + robot.dx + width) % width
  robot.y = (robot.y + robot.dy + height) % height
  return robot
}

export function robotMap(robots, width, height) {
  const map = range(0, height - 1)
    .map(
      () => range(0, width - 1)
        .map( () => 0 )
    )
  robots.forEach(
    robot => map[robot.y][robot.x]++
  )
  return map
}

export function showRobots(robots, width, height) {
  const map = robotMap(robots, width, height)
  map.forEach(
    row => console.log(
      row.map( n => n || '.' ).join('')
    )
  )
}

export function splitQuadrants(robots, width, height) {
  const midx = (width - 1) / 2
  const midy = (height - 1) / 2
  const quadrants = [
    [0, 0],
    [0, 0]
  ]
  robots.forEach(
    robot => {
      const { x, y } = robot
      if (x === midx || y === midy) {
        return
      }
      const qx = x < midx ? 0 : 1
      const qy = y < midy ? 0 : 1
      quadrants[qy][qx]++
    }
  )
  return quadrants
}