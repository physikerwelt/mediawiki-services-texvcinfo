// Render an AST.
"use strict";

var tokenLister = module.exports = function (e) {
    var result = [];
    if (Array.isArray(e)) {
        return [].concat.apply([], e.map(tokenLister));
    }
    for (var i = 0; i < e.length; i++) {
        if ((typeof e[i] === 'string' || e[i] instanceof String)) {
            result.push([e.name, e[i]]);
        } else {
            result = result.concat(tokenLister(e[i]));
        }
    }
    return result;
};