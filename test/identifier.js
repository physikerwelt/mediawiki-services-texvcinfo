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
    {in: 't_a', out: ['t_{a}']},
    {
        in: "\\hat{U}(t,t_0)=\\exp{\\left(-\\frac{i}\\hbar \\int_{t_0}^t \\hat{H}(t')dt'\\right)}",
        out: ['\\hat{U}', 't', 't_{0}', 'i', '\\hbar', 't_{0}', 't', '\\hat{H}', 't\'', 'd', //not rally but...
            't\''
        ]
    },
    {in: "\\begin{align}\n  &[\\mathrm j_k, \\mathrm j_l]\n" +
        "    \\equiv \\mathrm j_k \\mathrm j_l - \\mathrm j_l \\mathrm j_k\n" +
        "    = i \\hbar \\sum_m \\varepsilon_{k, l, m} \\mathrm j_m\n" +
        "    & k, l, m &\\in \\{\\mathrm x, \\mathrm y, \\mathrm z\\}\n" +
        "\\end{align}",
    out:["\\mathrm{j}_{k}","\\mathrm{j}_{l}","\\mathrm{j}_{k}","\\mathrm{j}_{l}","\\mathrm{j}_{l}","\\mathrm{j}_{k}",
        "i","\\hbar","m","\\varepsilon_{k,l,m}","\\mathrm{j}_{m}","k","l","m","\\mathrm{x}","\\mathrm{y}","\\mathrm{z}"]
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