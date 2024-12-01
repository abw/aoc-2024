#!/usr/bin/env node
import { fail } from '@abw/badger-utils'
import { chmod } from 'node:fs/promises'
import {
  appStatus, bin, brightWhite, yellow, cmdLineFlags, quit, confirm, green
} from '@abw/badger'

const root = bin(import.meta.url).up()

appStatus(
  async () => {
    const { flags, args } = cmdLineFlags(
      {
        short: {
          y: 'yes',
          v: 'verbose',
          h: 'help',
        },
        on: {
          help,
        }
      },
    )
    const day = args.length && args.shift()

    if (day) {
      const dir = dayDir(day)
      const exists = await dir.exists()
      if (exists) {
        fail(`${dir} already exists`)
      }
      await createDayDir(dir, flags)
    }
    else {
      const dir = await nextDay()
      if (! dir) {
        fail(`You've already got directories for every day!`)
      }
      if (! flags.yes) {
        const ok = await confirm(`Create ${dir}?`)
        if (! ok) {
          fail(`Cancelled`)
        }
      }
      await createDayDir(dir, flags)
    }
  }
)()

function dayDir(n) {
  const day = n.toString().padStart(2, '0')
  return root.dir(`day-${day}`)
}

async function nextDay() {
  for (let n = 1; n <= 25; n++) {
    const dir = dayDir(n)
    const exists = await dir.exists()
    if (! exists) {
      return dir
    }
  }
}

async function createDayDir(dir, options) {
  if (options.verbose) {
    console.log(`Creating ${dir}`)
  }
  const day = dir.name().match(/\d+/)[0]
  await copyDir(root.dir('template'), dir, { ...options, day })
  console.log(green(`✓ created ${dir}`))
}

async function copyDir(src, dest, options) {
  await dest.mustExist({ create: true })
  const entries = await src.entries()

  for (let entry of entries) {
    const file = await entry.isFile()
    if (file) {
      const destFile = dest.file(entry.base())
      await copyFile(entry, destFile, options)
      continue
    }
    const dir = await entry.isDirectory()
    if (dir) {
      const destDir = dest.dir(entry.base())
      if (options.verbose) {
        console.log(yellow(`  → ${destDir}`))
      }
      await copyDir(entry, destDir, options)
      continue
    }
    fail(`Can only copy files and directories: ${entry}`)
  }
}

async function copyFile(src, dest, options) {
  const text = await src.read()
  const repl = text.replaceAll(/<day>/g, options.day)
  await dest.write(repl)
  await chmod(dest.path(), await src.mode())
  if (options.verbose) {
    console.log(green(`  ✓ ${dest} `))
  }
}


function help() {
  const script   = 'bin/new-day.js'
  const usage    = brightWhite('Usage')
  const options  = brightWhite('Options')
  const examples = brightWhite('Examples')
  quit(`${brightWhite(script)}

This script copies the files in the ${yellow('templates')} directory into a new
${yellow('day-NN')} directory.

${usage}
  $ ${script} [options] day

You can specify the day as a command line option:

  $ ${script} day

Otherwise it will assume you want to add a directory for the next day
that you haven't already done.  It will prompt you to confirm the day.
Or you can use the ${yellow('-y')} (or ${yellow('--yes')}) option to just
let it do its thing.

  $ ${script} -y

${options}
  -y / --yes       Yes, do it
  -v / --verbose   Verbose mode
  -h / --help      This help

${examples}
  $ ${script} 3
  $ ${script} -y
`)
}
