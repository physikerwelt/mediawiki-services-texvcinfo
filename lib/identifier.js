// Render an AST.
"use strict";

var ast = require('texvcjs').ast;
var letterMods = require('./letterMods.json');
var literals = require('./literals.json');
var texvc = require('texvcjs');
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

var render = module.exports = function render(e) {
    if (Array.isArray(e)) {
        var out = [].concat.apply([], e.map(render));
        // Workaround to associate '-suffix to the previous variable
        var posititions = [];
        out = out.filter(function (v, i) {
            if (v === "'") {
                posititions.push(i - 1 - posititions.length);
                return false;
            } else {
                return true;
            }
        });
        posititions.forEach(function (p) {
            out[p] = out[p] + '\'';
        });
        return out;
    }
    if (typeof e === 'string' || e instanceof String) {
        return e;
    }
    return e.extractIdentifiers();
};

var curlies = function (t) {
    switch (t.constructor) {
        // constructs which are surrounded by curlies
        case ast.Tex.FUN1:
        case ast.Tex.FUN1hl:
        case ast.Tex.FUN1hf:
        case ast.Tex.DECLh:
        case ast.Tex.FUN2:
        case ast.Tex.FUN2h:
        case ast.Tex.FUN2sq:
        case ast.Tex.CURLY:
        case ast.Tex.INFIX:
        case ast.Tex.INFIXh:
        case ast.Tex.BOX:
        case ast.Tex.BIG:
        case ast.Tex.MATRIX:
            return t.extractIdentifiers();
        case String:
            break;
        default:
            t = t.extractIdentifiers();
    }
    return t;
};

var render_curlies = function (a) {
    if (a.length === 1) {
        return curlies(a[0]);
    }
    return curlies(render(a));
};
var renderArgs = function () {
    var args = Array.prototype.slice.call(arguments);
    return [].concat.apply([], args.map(render));
};

var fun1 =  function (f, a) {
    if (render(a).length && letterMods.indexOf(f) >= 0) {
        return [f + "{" + render(a) + "}"];
    }
    return renderArgs(f, a);
};
ast.Tex.defineVisitor("extractIdentifiers", {
    FQ: function (base, down, up) {
        return renderArgs(base, down, up);
    },
    DQ: function (base, down) {
        var d = render(down),
            b = render(base);
        if (d.length && b.length) {
            return [b + "_{" + d + "}"];
        } else if (b.length && down[0].name === "TEX_ONLY") {
            if (/^[0-9]$/.test(down[0][0])) {
                return [b + "_{" + down[0][0]+"}"];
            }
        }
        return renderArgs(base,down);
    },
    UQ: function (base, up) {
        return renderArgs(base, up);
    },
    FQN: function (down, up) {
        return renderArgs(down, up);
    },
    DQN: function (down) {
        return renderArgs(down);
    },
    UQN: function (up) {
        return renderArgs(up);
    },
    LITERAL: function (r) {
        var s = r.id_part().trim();
        if (/^[a-zA-Z']$/.test(s)) {
            return [s];
        } else if (literals.indexOf(s) >= 0) {
            return [s];
        } else {
            return [];
        }
    },
    FUN1: fun1,
    FUN1nb: fun1,
    FUN1hl: function (f, _, a) {
        return renderArgs(f, a);
    },
    FUN1hf: function (f, _, a) {
        return renderArgs(f, a);
    },
    DECLh: function (f, _, a) {
        return renderArgs(f, a);
    },
    FUN2: function (f, a, b) {
        return renderArgs(a, b);
    },
    FUN2h: function (f, _, a, b) {
        return renderArgs(f, a, b);
    },
    FUN2nb: function (f, a, b) {
        return renderArgs(f, a, b);
    },
    FUN2sq: function (f, a, b) {
        return renderArgs(f, a, b);
    },
    CURLY: function (tl) {
        return render(tl);
    },
    INFIX: function (s, ll, rl) {
        return renderArgs(s, ll, rl);
    },
    INFIXh: function (s, _, ll, rl) {
        return renderArgs(s, ll, rl);
    },
    BOX: function (f, a) {
        return renderArgs(f, a);
    },
    BIG: function (bt, d) {
        return renderArgs(bt, d);
    },
    MATRIX: function (t, m) {
        var render_line = function (l) {
            return l.map(render);
        };
        var render_matrix = function (m) {
            return m.map(render_line);
        };
        return render(render_matrix(m));
    },
    LR: function (l, r, tl) {
        return render(tl);
    }
});
