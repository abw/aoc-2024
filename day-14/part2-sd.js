#!/usr/bin/env node
import { run } from '../lib/run.js'
import { moveRobots, parseInput } from './lib.js'

// Smarter second approach which measures the standard deviation of the robot
// population and find the step at which it's smallest

await run(
  { day: '14', part: '2-sd', lines: true },
  async ({ lines, example }) => {
    const width  = example ? 11 : 101
    const height = example ?  7 : 103
    const robots = parseInput(lines)
    const deviations = [ ]

    // move the robots 10k times and measure the standard deviation at each step
    for (let n = 0; n < 10000; n++) {
      const deviation = standardDeviation(robots)
      deviations.push(deviation)
      moveRobots(robots, width, height)
    }

    // find the minimum standard deviation and the step at which it occurred
    const [ , n] = deviations.reduce(
      ([mindev, minn], deviation, n) => {
        return deviation < mindev
          ? [deviation, n]
          : [mindev, minn]
      },
      [Infinity, undefined]
    )

    return n
  }
)

function standardDeviation(robots) {
  // calculate the mean x and y positions
  const [sumx, sumy] = robots.reduce(
    ([sumx, sumy], robot) => [sumx + robot.x, sumy + robot.y],
    [0, 0]
  )
  const meanx = sumx / robots.length
  const meany = sumy / robots.length

  // calculate the sum of the squares of the deviations
  const [devx, devy] = robots.reduce(
    ([devx, devy], robot) => {
      const dx = meanx - robot.x
      const dy = meany - robot.y
      return [devx + dx*dx, devy + dy*dy]
    },
    [0, 0]
  )

  // the variance is the mean of the deviations
  const varx = devx / robots.length
  const vary = devy / robots.length

  // the standard deviation is the square root of the deviations
  return Math.sqrt(varx + vary)
}