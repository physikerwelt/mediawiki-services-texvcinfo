# texvcTokens
[![Build Status][1]][2]

Prints the texvvc tokens idetified by texvcjs.

## Installation

Node version 0.10 are tested to work.

Install the node package dependencies with:
```
npm install
```
Ensure everything works:
```
npm test
```

## Options

- --tree prints the tree structure
- --json prints d3 format (https://github.com/mbostock/d3/wiki/Tree-Layout)

## Visuals
To see the tree structure you can output the result to (vis/data.json).
If you want to see the texvc parse tree of the texvc expression $\frac12$ run
```
./bin/texvcTokens -j \\frac12 > ./vis/data.json
```
.
In the (/vis/index.html) is a 90° rotated version of the interactive Reingold–Tilford tree from
http://bl.ocks.org/mbostock/4339083, that displays (vis/data.json).

## License

Copyright (c) 2015 Moritz Schubotz, C. Scott Ananian

Licensed under GPLv2.


[1]: https://travis-ci.org/physikerwelt/texvcTokens.svg
[2]: https://travis-ci.org/physikerwelt/texvcTokens
