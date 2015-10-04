"use strict";
var assert = require('assert');
var texvc = require("texvcjs");
var lister = require('../lib/identifier');
var testcases = [
    {in: '', out: []},
    {in: 'a', out: ['a']},
    {in: 'a^2', out: ['a']},
    {in: 'a^2+b^2', out: ['a', 'b']},
    {in: 'a^{2}+b^{2}', out: ['a', 'b']},
    {in: '\\frac2b', out: ['b']},
    {in: 't_a', out: ['t_a']},
    {
        in: "\\hat{U}(t,t_0)=\\exp{\\left(-\\frac{i}\\hbar \\int_{t_0}^t \\hat{H}(t')dt'\\right)}",
        out: ['\\hat{U}', 't', 't_0', 'i', '\\hbar', 't_0', 't', '\\hat{H}', 't\'', 'd', //not rally but...
            't\''
        ]
    }
];

describe('Identifier', function () {
    testcases.forEach(function (tc) {
        var input = tc.in;
        var output = tc.out;
        it('should correctly render ' + JSON.stringify(input), function () {
            assert.deepEqual(lister(texvc.parse(input)), output);
        });
    });
});