"use strict";
var assert = require('assert');
var texvcinfo = require('../');
var testcases = [
    {input: '', options: '', out: []},
    {
        input: '\\mathbb{x}',
        options: {format: "tree"},
        out: [["FUN1nb", ["\\mathbb"], ["CURLY", [["LITERAL", ["TEX_ONLY", ["x"]]]]]]]
    },
    {
        input: '\\mathbb{x}',
        options: {format: "identifier"},
        out: ['\\mathbb{x}']
    },
    {
        input: '\\mathbb{x}',
        options: {format: "list"},
        out: [["FUN1nb", "\\mathbb"], ["CURLY", ""], ["LITERAL", ""], ["TEX_ONLY", "x"]]
    }, {
        input: '\\mathbb{x}',
        options: {format: "json"},
        out: {
            "name": "root",
            "children": [{
                "name": "FUN1nb",
                "children": [{"name": "\\mathbb"}, {
                    "name": "CURLY",
                    "children": [{
                        "name": "root",
                        "children": [{
                            "name": "LITERAL",
                            "children": [{"name": "TEX_ONLY", "children": [{"name": "x"}]}]
                        }]
                    }]
                }]
            }]
        }

    }, {
        input: '\\mathbb{x}',
        options: {format: "all"},
        out: {
            identifier: ['\\mathbb{x}'],
            tree: [["FUN1nb", ["\\mathbb"], ["CURLY", [["LITERAL", ["TEX_ONLY", ["x"]]]]]]],
            list: [["FUN1nb", "\\mathbb"], ["CURLY", ""], ["LITERAL", ""], ["TEX_ONLY", "x"]]
        }
    }
];

describe('Index', function () {
    testcases.forEach(function (tc) {
        var input = tc.input;
        var options = tc.options;
        var output = tc.out;
        it('should correctly handle ' + JSON.stringify(input) + 'with option' + JSON.stringify(options), function () {
            assert.deepEqual(texvcinfo.texvcinfo(input, options), output);
        });
    });
});