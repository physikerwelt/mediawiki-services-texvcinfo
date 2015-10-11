// Render an AST.
"use strict";

var ast = module.exports.ast =  require('texvcjs').ast;
var letterMods = require('../letterMods.json');
var literals = require('../literals.json');

ast.RenderT.defineVisitor("id_part", {
    HTMLABLE: function (_, t, _2) {
        return t;
    },
    HTMLABLEM: function (_, t, _2) {
        return t;
    },
    HTMLABLEC: function (_, t, _2) {
        return t;
    },
    MHTMLABLEC: function (_, t, _2, _3, _4) {
        return t;
    },
    HTMLABLE_BIG: function (t, _) {
        return t;
    },
    TEX_ONLY: function (t) {
        return t;
    }
});

var getSub = function (x) {
    var y = [];
    if (x instanceof Array) {
        x.forEach(function (e) {
            y = y.concat(e.extractSubscipts());
        });
        if (x.length === y.length) {
            return y.join('');
        } else {
            return [];
        }
    }
    return x.extractSubscipts();
};
var fun1Sub = function (f, a) {
    var s = getSub(a);
    if (s.length && letterMods.indexOf(f) >= 0) {
        return [f + "{" + s + "}"];
    }
    return [];
};
ast.Tex.defineVisitor("extractSubscipts", {
    LITERAL: function (r) {
        var s = r.id_part().trim();
        if (/^([0-9a-zA-Z\+',\-])$/.test(s)) {
            return [s];
        } else if (literals.indexOf(s) >= 0) {
            return [s];
        } else {
            return [];
        }
    },
    BIG: function () {
        return [];
    },
    BOX: function () {
        return [];
    },
    CURLY: getSub,
    DECLh: function () {
        return [];
    },
    DQ: function () {
        return [];
    },
    DQN: function () {
        return [];
    },
    FQ: function () {
        return [];
    },
    FQN: function () {
        return [];
    },
    FUN1: fun1Sub,
    FUN1hf: function () {
        return [];
    },
    FUN1hl: function () {
        return [];
    },
    FUN1nb: fun1Sub,
    FUN2: function () {
        return [];
    },
    FUN2h: function () {
        return [];
    },
    FUN2nb: function () {
        return [];
    },
    FUN2sq: function () {
        return [];
    },
    INFIX: function () {
        return [];
    },
    INFIXh: function () {
        return [];
    },
    LR: function () {
        return [];
    },
    MATRIX: function () {
        return [];
    },
    UQ: function () {
        return [];
    },
    UQN: function () {
        return [];
    }
});