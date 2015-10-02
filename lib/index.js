"use strict";

var json = require('../package.json');

module.exports = {
    name: json.name, // package name
    version: json.version // version # for this package
};

var texvcjs = require("texvcjs");
var lister = module.exports.tokensFromAst = require('./tokenLister');


module.exports.tokens = function(input, options) {
    /* status is one character:
     *  + : success! result is in 'output'
     *  E : Lexer exception raised
     *  F : TeX function not recognized
     *  S : Parsing error
     *  - : Generic/Default failure code. Might be an invalid argument,
     *      output file already exist, a problem with an external
     *      command ...
     */
    try {
        // allow user to pass a parsed AST as input, as well as a string
        if (typeof(input)==='string') {
            input = texvcjs.parse(input);
        }
        var output = lister(input);
        return { status: '+', output: output };
    } catch (e) {
        if (options && options.debug) {
            throw e;
        }
        if (e instanceof texvcjs.SyntaxError) {
            if (e.message === 'Illegal TeX function') {
                return {
                    status: 'F', details: e.found,
                    offset: e.offset, line: e.line, column: e.column
                };
            }
            return {
                status: 'S', details: e.toString(),
                offset: e.offset, line: e.line, column: e.column
            };
        }
        return { status: '-', details: e.toString() };
    }
};
