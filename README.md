# texvcinfo
[![npm version](https://badge.fury.io/js/texvcinfo.svg)](http://badge.fury.io/js/texvcinfo)
[![Build Status][1]][2]
[![Coverage Status](https://coveralls.io/repos/github/physikerwelt/texvcinfo/badge.svg?branch=master)](https://coveralls.io/github/physikerwelt/texvcinfo?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/physikerwelt/texvcinfo/badges/score.svg)](https://www.bithound.io/github/physikerwelt/texvcinfo)
[![Code Climate](https://codeclimate.com/github/physikerwelt/texvcinfo/badges/gpa.svg)](https://codeclimate.com/github/physikerwelt/texvcinfo)

Prints the texvvc tokens identified by texvcjs.

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

## Usage

```
  Usage: texvcinfo [options] <tex input>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -v, --verbose          Show verbose error information
    -D, --debug            Show stack trace on failure.
    -c, --compact          Do not pretty print output.
    -f, --flat             Flattens the tree for elements with only one child
    -o, --output [format]  Output the info in a specific format. Available options are:
    "list": prints all tokens as list
    "tree": prints the texvc AST
    "json": a json object that can be visualized using d3
    "identifier": prints TeX code for all identifiers
    "all": is a combination of list, tree and identifier
    "feedback": returns data to generate user feedback in a ui
```

## Visuals
To see the tree structure you can output the result to (vis/data.json).
If you want to see the texvc parse tree of the texvc expression $\frac12$ run
```
./bin/texvcinfo -j \\frac12 > ./vis/data.json
```
.
In the (/vis/index.html) is a 90° rotated version of the interactive Reingold–Tilford tree from
http://bl.ocks.org/mbostock/4339083, that displays (vis/data.json).

##Error codes
Status is one character:

- "+" : success! result is in 'output'
- "E" : Lexer exception raised
- "F" : TeX function not recognized
- "S" : Parsing error
- "-" : Generic/Default failure code. Might be an invalid argument, output file already exist, a problem with an external command ...

## License

Copyright (c) 2015 Moritz Schubotz, C. Scott Ananian

Licensed under GPLv2.


[1]: https://travis-ci.org/physikerwelt/texvcinfo.svg
[2]: https://travis-ci.org/physikerwelt/texvcinfo
