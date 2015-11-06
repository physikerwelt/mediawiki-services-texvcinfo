"use strict";
var texvcjs = require("texvcjs");
var indentifierExtractor = module.exports.treeFromAst = require('./identifier');

module.exports = function (input) {
    var out = {
        success: true
    };
    try {
        // allow user to pass a parsed AST as input, as well as a string
        if (typeof(input) === 'string') {
            input = texvcjs.parse(input, {usemathrm:true});
        }
    } catch (e) {
        out.success = false;
        out.error = e;
        return out;
    }
    out.checked = texvcjs.render(input);
    out.identifiers = indentifierExtractor(input);
    return out;
};