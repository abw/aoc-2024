#!/usr/bin/env node
import { bin } from '@abw/badger-filesystem'
import { run } from '../lib/run.js'
import { moveRobots, parseInput } from './lib.js'
import { PNG } from 'pngjs'
import fs from 'node:fs'

// This required an ugly, but pragmatic approach.  The first step (when
// CREATE_TILES is set true) is to create tiled images of 10 x 10 maps,
// writing each into a file into the images directory.  Then I visually
// inspected them until I saw the christmas tree in frame 8270.  To confirm
// that I set CREATE_TILES to false and INSPECT_STEP to 8270 to generate a
// solution-8270.png file in the images directory

const TILES = 10
const CREATE_TILES = false
const INSPECT_STEP = 8270

await run(
  { day: '14', part: 2, lines: true },
  async ({ lines, example, debugData }) => {
    debugData('lines:', lines)

    const width  = example ? 11 : 101
    const height = example ?  7 : 103
    const robots = parseInput(lines)
    debugData('robots initially:', robots)

    const outdir = bin(import.meta.url).dir('images')
    await outdir.mustExist({ create: true })

    if (CREATE_TILES) {
      // generate tiles of 100 frames at a time
      const tiles = TILES * TILES
      let start = 0

      for (let n = 0; n < 100; n++) {
        const from = start * tiles
        const to = (start + 1) * tiles - 1
        const range = [from, to]
          .map(
            n => n.toString().padStart(5, '0')
          )
          .join('-')
        const file = outdir.file(`${range}.png`)
        await createTiledImage(file, robots, width, height)
        start++
      }
    }
    else {
      // Run through INSPECT_STEP moves and then generate a single image
      for (let n = 0; n < INSPECT_STEP; n++) {
        moveRobots(robots, width, height)
      }
      const file = outdir.file(`solution-${INSPECT_STEP}.png`)
      createImage(file, robots, width, height)
    }

    return INSPECT_STEP
  }
)

// create a tiled image of TILES x TILES iterations
async function createTiledImage(file, robots, tileWidth, tileHeight) {
  const width = tileWidth * TILES
  const height = tileHeight * TILES
  const png = new PNG({ width, height })

  // Paint it black (well, mostly black with lines denoting the tile borders)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2
      const coly = y % tileHeight == 0 ? 0xff : 0
      const colx = x % tileWidth == 0 ? 0xff : 0
      png.data[idx] = 0
      png.data[idx + 1] = coly
      png.data[idx + 2] = colx
      png.data[idx + 3] = 0xff
    }
  }

  for (let tiley = 0; tiley < TILES; tiley++ ) {
    const orgy = tiley * tileHeight

    for (let tilex = 0; tilex < TILES; tilex++ ) {
      const orgx = tilex * tileWidth

      robots.forEach(
        robot => {
          const { x, y } = robot
          const px = x + orgx
          const py = y + orgy
          const idx = (width * py + px) << 2
          png.data[idx] = 0xff
          png.data[idx + 1] = 0xff
          png.data[idx + 2] = 0xff
          png.data[idx + 3] = 0xff
        }
      )
      moveRobots(robots, tileWidth, tileHeight)
    }
  }
  png
    .pack()
    .pipe(
      fs.createWriteStream(file.path())
    )
    .on(
      'finish',
      () => console.log(`Wrote ${file}`)
    )
}

// Create an image for a single frame
async function createImage(file, robots, width, height) {
  const png = new PNG({ width, height })
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2
      png.data[idx] = 0
      png.data[idx + 1] = 0
      png.data[idx + 2] = 0
      png.data[idx + 3] = 0xff
    }
  }
  robots.forEach(
    robot => {
      const { x, y } = robot
      const idx = (width * y + x) << 2
      png.data[idx] = 0xff
      png.data[idx + 1] = 0xff
      png.data[idx + 2] = 0xff
      png.data[idx + 3] = 0xff
    }
  )
  png
    .pack()
    .pipe(
      fs.createWriteStream(file.path())
    )
    .on(
      'finish',
      () => console.log(`Wrote ${file}`)
    )
}

