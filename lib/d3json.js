"use strict";

var tokenTree = module.exports = function (e) {
    if (Array.isArray(e)) {
        return  {name:'root', children: e.map(tokenTree)};
    }
    if (typeof e === 'string' || e instanceof String) {
        return {name:e};
    }
    var result = [];
    for (var i = 0; i < e.length; i++) {
        result.push(tokenTree(e[i]));
    }
    return { name: e.name, children: result };
};
