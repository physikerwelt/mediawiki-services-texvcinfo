"use strict";
var assert = require('assert');
var texvc = require("texvcjs");
var lister = require('../lib/tokenLister');

var testcases = [
    {in: '', out: []},
    {in: 'a', out: [['TEX_ONLY', 'a']]},
    {in: 'a^2', out: [['TEX_ONLY', 'a'], ['TEX_ONLY', '2']]},
    {
        in: 'a^2+b^{2}',
        out: [['TEX_ONLY', 'a'], ['TEX_ONLY', '2'], ['TEX_ONLY', '+'], ['TEX_ONLY', 'b'], ['TEX_ONLY', '2']]
    },
    {
        in: 'a^{2}+b^{2}',
        out: [['TEX_ONLY', 'a'], ['TEX_ONLY', '2'], ['TEX_ONLY', '+'], ['TEX_ONLY', 'b'], ['TEX_ONLY', '2']]
    },
    {
        in: '\\frac2b',
        out: [['FUN2', '\\frac'], ['TEX_ONLY', '2'], ['TEX_ONLY', 'b']]
    }
];

describe('Render', function () {
    testcases.forEach(function (tc) {
        var input = tc.in;
        var output = tc.out || input;
        it('should correctly render ' + JSON.stringify(input), function () {
            assert.deepEqual(lister(texvc.parse(input)), output);
        });
    });
});