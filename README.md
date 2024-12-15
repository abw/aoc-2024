# Advent of Code 2024

These are my solutions to the Advent of Code for 2024

https://adventofcode.com/2024

Solutions are written in Javascript.

To play along at home you'll need to have [Node.js](https://nodejs.org/)
installed.

Then install the dependencies using your favourite package manager.

```bash
# Either...
$ npm install

# ...or...
$ yarn install

# ...or
$ pnpm install
```

The puzzles for each day are in the directories named `day-NN`.  Each of those
directories has a `part1.js` and `part2.js` file.

```bash
$ cd day-01
$ ./part1.js
```

By default the code will process the `files/input.txt` file in the same
directory, hopefully giving the correct answer for the puzzle.  You will
need to download the input.txt file and save it in the `files` directory.

The `-e` (or `--example`) option will run the code using the
`files/example.txt` input.

```bash
$ ./part1.js -e
```

Some of the puzzle have additional debugging which can be enabled with the
`-d` (or `--debugging`) option.

```bash
$ ./part1.js -d
```

The `-h` (or `--help`) option shows help summarising the above options, in
case you didn't read this fine manual.

# New Day

The `bin/new-day.js` script can be used to create a template directory for a
new day.  It copies the files from the `template` directory into a new
directory with the name `day-NN`.

Run it with the `-h` option for further help:

```bash
$ bin/new-day.js -h
```

# Author

Andy Wardley, December 2024
