"use strict";
var assert = require('assert');
var ast = require('texvcjs').ast;
var texvc = require("texvcjs");
var lister = require('../lib/identifier').render;
var testcases = [
    {in: '', out: []},
    {in: '.', out: []},
    {in: 'a'},
    {in: 'a.', out: ['a']},
    {in: 'a_\\text{x}', out: ['a']},
    {in: 'a_{bc}'},
    {in: 'a_{b,c}'},
    {in: 'a_{+}'},
    {in: 'a_{\\emptyset}'},
    {in: 'a_{-\\infty}'},
    {in: 'a_b^c', out: ['a', 'b', 'c']},
    {in: '\\int_0^\\infty', out: ['\\infty']},
    {in: 'a_{b\\pm c}', out: ['a', 'b', 'c']},
    {in: "\\mathrm{def}"},
    {in: 'k_{\\mathbf{B}}', out: ['k_{\\mathbf{B}}']},
    {in: "\\boldsymbol{\\sigma}"},
    {in: "\\mathbf{\\hat{n}}"},
    {in: 'a^2', out: ['a']},
    {in: 'a^2+b^2', out: ['a', 'b']},
    {in: 'a^{2}+b^{2}', out: ['a', 'b']},
    {in: '\\frac2b', out: ['b']},
    {in: 't_a', out: ['t_{a}']},
    {in: '\\mathrm{kg}', out: ['\\mathrm{kg}']},
    {in: '\\sqrt[3]{81}', out: []},
    {in: "a'_{k}", out: ['a\'', 'k']},
    {in: "x_n*x_{n-1}", out: ['x_{n}', 'x_{n-1}']},
    {in: 'a_{i_{j}}'},
    {in: '\\operatorname{arg min}', out: []},
    {in: "\\underbrace{x+y}_2", out: ['x', 'y']},
    {
        in: "\\hat{U}(t,t_0)=\\exp{\\left(-\\frac{i}\\hbar \\int_{t_0}^t \\hat{H}(t')dt'\\right)}",
        out: ['\\hat{U}', 't', 't_{0}', 'i', 't_{0}', 't', '\\hat{H}', 't\'', 't\'']
    },
    {
        in: "\\begin{align}\n  &[\\mathrm j_k, \\mathrm j_l]\n" +
        "    \\equiv \\mathrm j_k \\mathrm j_l - \\mathrm j_l \\mathrm j_k\n" +
        "    = i \\hbar \\sum_m \\varepsilon_{k, l, m} \\mathrm j_m\n" +
        "    & k, l, m &\\in \\{\\mathrm x, \\mathrm y, \\mathrm z\\}\n" +
        "\\end{align}",
        out: ["\\mathrm{j}_{k}", "\\mathrm{j}_{l}", "\\mathrm{j}_{k}", "\\mathrm{j}_{l}", "\\mathrm{j}_{l}", "\\mathrm{j}_{k}",
            "i", "m", "\\varepsilon_{k,l,m}", "\\mathrm{j}_{m}", "k", "l", "m", "\\mathrm{x}", "\\mathrm{y}", "\\mathrm{z}"]
    },
    {
        in: "x = \\int_1^y {\\mathrm{d}t \\over t}",
        out: ["x", "y", "t", "t"]
    },
    {
        in: "f'(x) = \\lim_{h \\to 0}{f(x+h) - f(x)\\over{h}}",
        out: ["f'", "x", "h", "f", "x", "h", "f", "x", "h"]
    },
    {
        in: "\\dot m = C_d A \\sqrt{k \\rho_0 P_0 \\left(\\frac{2}{k + 1}\\right)^{\\frac{k + 1}{k - 1}}}",
        out: ["\\dot{m}", "C_{d}", "A", "k", "\\rho_{0}", "P_{0}", "k", "k", "k"]
    },
    {
        in: "\\forall x \\Big(\\forall y (y \\in x \\rightarrow P[y]) \\rightarrow P[x]\\Big) \\rightarrow \\forall x \\, P[x]",
        out: ["x", "y", "y", "x", "P", "y", "P", "x", "x", "P", "x"]
    },
    {
        in: "\\text{Magnetic Reynolds number  }",
        out: []
    },
    {
        in: "\\int_{R_n} \\cdots \\int_{R_2} \\int_{R_1} f(x_1, x_2, \\ldots, x_n)" +
        " \\, dx_1 dx_2\\cdots dx_n \\equiv \\int_R f(\\boldsymbol{x}) \\, d^n\\boldsymbol{x}",
        out: ['R_{n}', 'R_{2}', 'R_{1}', 'f', 'x_{1}', 'x_{2}', 'x_{n}',
            'x_{1}', 'x_{2}', 'x_{n}', 'R', 'f', '\\boldsymbol{x}', 'n', '\\boldsymbol{x}']
    },
    {in: "\\mathbf{M}_{\\rm orb}", out: ['\\mathbf{M}_{\\mathrm{orb}}']},
    {in: "F=\\overline{(A \\wedge B) \\vee (C \\wedge D)}", out: ['F', 'A', 'B', 'C', 'D']},
    {
        in: "\\mathrm{2\\ Squares\\ of\\ Land}"
    },
    {
        in: "\\mathrm{d_k,d^k,d_{klo},\\left(d_{\\begin{matrix}a\\end{matrix}}\\right),\\frac12}",
        out: ['d_{k}', 'd', 'k', 'd_{klo}', 'd', 'a']
    },
    {
        in: "\\mathrm{\\begin{matrix}a\\end{matrix},\\big(,\\mbox{A},{\\rm b},1_2_3,1^2,1^2^3,1_2^3,_1^2}",
        out: ['a', 'b']
    },
    {
        in: "\\mathrm{a \\choose b, \\sqrt{4}}",
        out: ['a', 'b']
    },
    {
        in: "\\sideset{c}{d}e+\\sideset{_\\dagger^*}{_\\dagger^*}\\prod",
        out: ['c', 'd', 'e']
    }, {
        in: "\\mathrm{_a^b}", //FQN
        out: ['a', 'b']
    }, {
        in: "\\mathrm{\\sqrt[3]{81}}", //FUN2sq
        out: []
    }, {
        in: "\\mathrm{\\sideset{c}{d}e}", //FUN2nb
        out: ['c', 'd', 'e']
    }, {
        in: "\\mathrm{{}_c}",
        out: ['c']
    }    , {
        in: "\\mathrm{'_c}",
        out: ['c']
    },
    {
        in: "0_{d_k,d^k,d_{klo},\\left(d_{\\begin{matrix}a\\end{matrix}}\\right),\\frac12}",
        out: ['d_{k}', 'd', 'k', 'd_{klo}', 'd', 'a']
    },
    {
        in: "0_{\\begin{matrix}a\\end{matrix},\\big(,\\mbox{A},{\\rm b},1_2_3,1^2,1^2^3,1_2^3,_1^2}",
        out: ['a', 'b']
    },
    {
        in: "0_{a \\choose b, \\sqrt{4}}",
        out: ['a', 'b']
    },{
        in: "0_{_a^b}", //FQN
        out: ['a', 'b']
    }, {
        in: "0_{\\sqrt[3]{81}}", //FUN2sq
        out: []
    }, {
        in: "0_{\\sideset{c}{d}e}", //FUN2nb
        out: ['c', 'd', 'e']
    },  {
        in: "0_{{}_c}",
        out: ['c']
    }, {
        in:"0_{\\it a}",
        out: ['a']
    }, {
        in:"0_{\\cal a}",
        out: ['a']
    }, {
        in:"0_{\\bf a}",
        out: ['a']
    }, {
        in:"0_{\\bf }",
        out: []
    }, {
        in:"{\\frac {\\operatorname {d} u_{x}}{\\operatorname {d} t}}",
        out: ["u_{x}","t"]
    }
    //{in: "\\reals", out:["\\reals"]},
    //{in: "\\mathrm {MTF}_{display}(\\xi,\\eta)", out: ["\\mathrm{MTF}_{display}", "\\xi", "\\eta"]}
];

var extractions = [
    {
        "fn": [],
        "fp": [],
        "identifier": ["W", "k", "\\varepsilon"],
        "math_inputtex": "W(2, k) > 2^k/k^\\varepsilon",
        "qID": "1",
        "tp": ["W", "k", "\\varepsilon"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["X", "\\Sigma"],
        "math_inputtex": "(X,\\Sigma)",
        "qID": "2",
        "tp": ["X", "\\Sigma"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["p", "n"],
        "math_inputtex": "(p-1)!^n",
        "qID": "3",
        "tp": ["p", "n"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["f_{c}", "z", "c", "c"],
        "math_inputtex": "f_c(z) = z^2 + c",
        "qID": "4",
        "tp": ["f_{c}", "z", "c"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["x", "x", "y", "y", "P"],
        "math_inputtex": "\\forall x \\, \\forall y \\, P(x,y) \\Leftrightarrow \\forall y \\, \\forall x \\, P(x,y)",
        "qID": "5",
        "tp": ["x", "y", "P"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\alpha", "x"],
        "math_inputtex": "\\alpha(x)",
        "qID": "6",
        "tp": ["\\alpha", "x"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\alpha", "\\alpha", "x"],
        "math_inputtex": "\\alpha(x)",
        "qID": "7",
        "tp": ["\\alpha", "x"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\alpha", "\\alpha", "x"],
        "math_inputtex": "\\alpha(x)",
        "qID": "8",
        "tp": ["\\alpha", "x"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\Psi", "i_{1}", "i_{2}", "\\alpha_{1}", "\\alpha_{2}", "\\Gamma", "\\lambda", "\\Phi", "N", "N"],
        "math_inputtex": "|{\\Psi}\\rangle=\\sum_{i_1,i_2,\\alpha_1,\\alpha_2}\\Gamma^{[1]i_1}_{\\alpha_1}\\lambda^{[1]}_{\\alpha_1}\\Gamma^{[2]i_2}_{\\alpha_1\\alpha_2}\\lambda^{[2]}_{{\\alpha}_2}|{i_1i_2}\\rangle|{\\Phi^{[3..N]}_{\\alpha_2}}\\rangle",
        "qID": "9",
        "tp": ["\\Psi", "i_{1}", "i_{2}", "\\alpha_{1}", "\\alpha_{2}", "\\Gamma", "\\lambda", "\\Phi", "N"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["z", "x", "y"],
        "math_inputtex": "z*x\\le y",
        "qID": "10",
        "tp": ["z", "x", "y"]
    }, {
        "fn": [],
        "fp": ["d"],
        "identifier": ["x", "c"],
        "math_inputtex": " \\frac{d}{dx}\\left( \\log_c x\\right) = {1 \\over x \\ln c} , \\qquad c > 0, c \\ne 1",
        "qID": "11",
        "tp": ["x", "c"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\theta", "n"],
        "math_inputtex": "\\theta = n \\times 137.508^\\circ,",
        "qID": "12",
        "tp": ["\\theta", "n"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["s_{V}", "\\mathcal{R}"],
        "math_inputtex": "s_V(\\mathcal{R})",
        "qID": "13",
        "tp": ["s_{V}", "\\mathcal{R}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\ell", "m"],
        "math_inputtex": "\\ell(m)",
        "qID": "14",
        "tp": ["\\ell", "m"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["b", "x"],
        "math_inputtex": "bx-x^2",
        "qID": "15",
        "tp": ["b", "x"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\omega_{k}"],
        "math_inputtex": "\\omega_{k}",
        "qID": "16",
        "tp": ["\\omega_{k}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\mathbf{m}_{1}", "\\mathbf{m}_{1}"],
        "math_inputtex": "\\mathbf{m}_1",
        "qID": "17",
        "tp": ["\\mathbf{m}_{1}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["r_{ij}"],
        "math_inputtex": "r_{ij}",
        "qID": "18",
        "tp": ["r_{ij}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["Z", "Z", "j", "g_{j}", "\\mathrm{e}", "\\beta", "\\beta", "E_{j}"],
        "math_inputtex": " Z = \\sum_{j} g_j \\cdot \\mathrm{e}^{- \\beta E_j}",
        "qID": "19",
        "tp": ["Z", "j", "g_{j}", "\\mathrm{e}", "\\beta", "E_{j}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["S'"],
        "math_inputtex": "S'",
        "qID": "20",
        "tp": ["S'"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["S'", "S'", "S'", "S'", "S'"],
        "math_inputtex": "S'",
        "qID": "21",
        "tp": ["S'"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["k", "l", "i", "j"],
        "math_inputtex": "\\text{Ker} (k_* - l_*) \\cong \\text{Im} (i_*, j_*).",
        "qID": "22",
        "tp": ["k", "l", "i", "j"]
    }, {
        "fn": [],
        "fp": ["F_{i}"],
        "identifier": ["D", "G", "G", "G", "G", "H", "H", "H", "H", "i", "i"],
        "math_inputtex": "D(G,H) = \\sum_{i=1}^{29} | F_i(G) - F_i(H) |",
        "qID": "23",
        "tp": ["D", "G", "H", "i"]
    }, {
        "fn": ["E_{\\mathrm{k}}", "E_{\\mathrm{r}}", "E_{\\mathrm{t}}"],
        "fp": ["E_{t}", "E"],
        "identifier": ["E_{\\mathrm{k}}", "E_{\\mathrm{k}}", "E_{\\mathrm{r}}", "E_{\\mathrm{r}}", "E_{\\mathrm{r}}", "E_{\\mathrm{t}}"],
        "math_inputtex": " E_\\text{k} = E_t + E_\\text{r} \\, ",
        "qID": "24",
        "tp": []
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\lambda", "\\lambda", "L", "L", "B", "d", "d"],
        "math_inputtex": "\\lambda(L(B)) \\leq d",
        "qID": "25",
        "tp": ["\\lambda", "L", "B", "d"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["L", "C", "T"],
        "math_inputtex": "L\\left(C\\right) \\leq L\\left(T\\right)",
        "qID": "26",
        "tp": ["L", "C", "T"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["v", "c", "n"],
        "math_inputtex": "v = \\frac{c}{n}",
        "qID": "27",
        "tp": ["v", "c", "n"]
    }, {
        "fn": ["\\sigma_{y}"],
        "fp": ["y", "\\sigma"],
        "identifier": ["\\sigma_{y}", "\\sigma_{y}", "\\tau", "\\pi", "h_{-2}"],
        "math_inputtex": "\\sigma_y^2(\\tau) = \\frac{2\\pi^2\\tau}{3}h_{-2}",
        "qID": "28",
        "tp": ["\\tau", "\\pi", "h_{-2}"]
    }, {
        "fn": ["R_{\\text{s normal}}"],
        "fp": ["a", "R", "r", "s", "l", "m", "n", "o"],
        "identifier": ["R_{\\text{s normal}}", "\\omega", "\\mu_{0}", "\\sigma"],
        "math_inputtex": " R_{s\\ normal} = \\sqrt{ \\frac{\\omega \\mu_0} {2 \\sigma} }",
        "qID": "29",
        "tp": ["\\omega", "\\mu_{0}", "\\sigma"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\phi_{1}"],
        "math_inputtex": " \\phi_1 = -30^\\circ...+30^\\circ",
        "qID": "30",
        "tp": ["\\phi_{1}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["T_{c}"],
        "math_inputtex": "T_c",
        "qID": "31",
        "tp": ["T_{c}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["T_{c}", "T_{c}"],
        "math_inputtex": "T_c",
        "qID": "32",
        "tp": ["T_{c}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["T_{c}", "T_{c}"],
        "math_inputtex": "T_c",
        "qID": "33",
        "tp": ["T_{c}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["P_{1}", "X", "P", "\\alpha_{1}"],
        "math_inputtex": "P_1(X)=P(X)/(X-\\alpha_1)",
        "qID": "34",
        "tp": ["P_{1}", "X", "P", "\\alpha_{1}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["k", "n"],
        "math_inputtex": "= \\frac{k}{n}.",
        "qID": "35",
        "tp": ["k", "n"]
    }, {
        "fn": ["p_{i}"],
        "fp": ["p"],
        "identifier": ["n", "i", "r", "p_{i}", "a_{i}"],
        "math_inputtex": "n = \\prod_{i=1}^r p_i^{a_i}",
        "qID": "36",
        "tp": ["n", "i", "r", "a_{i}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["H", "H", "H", "j", "\\omega", "\\mathcal{F}", "h", "t"],
        "math_inputtex": "H(j \\omega) = \\mathcal{F}\\{h(t)\\}",
        "qID": "37",
        "tp": ["H", "j", "\\omega", "\\mathcal{F}", "h", "t"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\pi"],
        "math_inputtex": "\\pi/4",
        "qID": "38",
        "tp": ["\\pi"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["x", "y", "n", "k"],
        "math_inputtex": "(x+y)^n = \\sum_{k=0}^n {n \\choose k}x^{n-k}y^k = \\sum_{k=0}^n {n \\choose k}x^{k}y^{n-k}.\n",
        "qID": "39",
        "tp": ["x", "y", "n", "k"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["A", "t", "k"],
        "math_inputtex": "\\ [A]_t = -kt + [A]_0",
        "qID": "40",
        "tp": ["A", "t", "k"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["q"],
        "math_inputtex": "q^{42}",
        "qID": "41",
        "tp": ["q"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\alpha", "d", "\\varepsilon"],
        "math_inputtex": "\\alpha(d) \\le \\left(\\sqrt{3/2} + \\varepsilon\\right)^d",
        "qID": "42",
        "tp": ["\\alpha", "d", "\\varepsilon"]
    }, {
        "fn": ["f^{\\mu}", "\\delta _{\\nu}^{\\mu}", "u^{\\mu}", "u^{\\alpha}", "x^{\\nu}", "u^{\\beta}"],
        "fp": ["\\nu", "\\mu", "\\alpha", "f", "\\delta", "\\beta", "\\pi", "u", "x"],
        "identifier": ["f^{\\mu}", "G", "c", "A", "T_{\\alpha\\beta}", "B", "T", "\\eta_{\\alpha\\beta}", "\\eta_{\\alpha\\beta}", "\\delta _{\\nu}^{\\mu}", "\\delta _{\\nu}^{\\mu}", "u^{\\mu}", "u_{\\nu}", "u^{\\alpha}", "x^{\\nu}", "u^{\\beta}"],
        "math_inputtex": "   f^{\\mu} = - 8\\pi  { G \\over { 3 c^4   }   } \\left (  {A \\over 2} T_{\\alpha \\beta}  + {B \\over 2} T \\eta_{\\alpha \\beta} \\right ) \\left ( \\delta^{\\mu}_{\\nu} + u^{\\mu} u_{\\nu} \\right )  u^{\\alpha} x^{\\nu} u^{\\beta} ",
        "qID": "43",
        "tp": ["G", "c", "A", "T_{\\alpha\\beta}", "B", "T", "\\eta_{\\alpha\\beta}", "u_{\\nu}"]
    }, {
        "fn": [],
        "fp": ["D", "D_{g}"],
        "identifier": ["u_{g}", "t", "f_{0}", "v_{a}", "\\beta", "y", "v_{g}", "v_{g}"],
        "math_inputtex": " \\frac{D_g u_g}{Dt} - f_{0}v_a - \\beta y v_g = 0 ",
        "qID": "44",
        "tp": ["u_{g}", "t", "f_{0}", "v_{a}", "\\beta", "y", "v_{g}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["I_{c}"],
        "math_inputtex": "I_c",
        "qID": "45",
        "tp": ["I_{c}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["A", "M", "M", "\\alpha"],
        "math_inputtex": "\\, A \\mapsto M\\alpha(A)M^{-1} ,",
        "qID": "46",
        "tp": ["A", "M", "\\alpha"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\Gamma_{\\infty}", "\\Gamma_{\\infty}"],
        "math_inputtex": "\\Gamma_{\\infty}",
        "qID": "47",
        "tp": ["\\Gamma_{\\infty}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["Y", "\\beta", "I", "T_{8}", "X"],
        "math_inputtex": "Y = \\beta T_8 + I X",
        "qID": "48",
        "tp": ["Y", "\\beta", "I", "T_{8}", "X"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\mu", "A"],
        "math_inputtex": " \\mu (A)= \\begin{cases} 1 & \\mbox{ if } 0 \\in A \\\\ \n                               0 & \\mbox{ if } 0 \\notin A.\n\\end{cases}",
        "qID": "49",
        "tp": ["\\mu", "A"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\lambda_{in}"],
        "math_inputtex": "\\lambda_{in}",
        "qID": "50",
        "tp": ["\\lambda_{in}"]
    }, {
        "fn": ["\\mathrm{rpm}_{\\text{motor}}"],
        "fp": ["p", "r", "m_{motor}"],
        "identifier": ["\\mathrm{rpm}_{\\text{motor}}"],
        "math_inputtex": "rpm_{motor}",
        "qID": "51",
        "tp": []
    }, {
        "fn": [],
        "fp": ["d"],
        "identifier": ["u_{1}", "\\mathbf{x}", "z_{1}", "v_{1}", "\\dot{u}_{x}", "V_{x}", "g_{x}", "k_{1}", "u_{x}", "e_{1}", "f_{x}", "\\dot{\\mathbf{x}}", "t"],
        "math_inputtex": "\\underbrace{u_1(\\mathbf{x},z_1)=v_1+\\dot{u}_x}_{\\text{By definition of }v_1}=\\overbrace{-\\frac{\\partial V_x}{\\partial \\mathbf{x}}g_x(\\mathbf{x})-k_1(\\underbrace{z_1-u_x(\\mathbf{x})}_{e_1})}^{v_1} \\, + \\, \\overbrace{\\frac{\\partial u_x}{\\partial \\mathbf{x}}(\\underbrace{f_x(\\mathbf{x})+g_x(\\mathbf{x})z_1}_{\\dot{\\mathbf{x}} \\text{ (i.e., } \\frac{\\operatorname{d}\\mathbf{x}}{\\operatorname{d}t} \\text{)}})}^{\\dot{u}_x \\text{ (i.e., } \\frac{ \\operatorname{d}u_x }{\\operatorname{d}t} \\text{)}}",
        "qID": "52",
        "tp": ["u_{1}", "\\mathbf{x}", "z_{1}", "v_{1}", "\\dot{u}_{x}", "V_{x}", "g_{x}", "k_{1}", "u_{x}", "e_{1}", "f_{x}", "\\dot{\\mathbf{x}}", "t"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["E", "\\hat{\\sigma}", "n", "\\sigma"],
        "math_inputtex": "E \\left[ \\hat{\\sigma}^2\\right]= \\frac{n-1}{n} \\sigma^2",
        "qID": "53",
        "tp": ["E", "\\hat{\\sigma}", "n", "\\sigma"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\mathsf{fv}"],
        "math_inputtex": "\\mathsf{fv}",
        "qID": "54",
        "tp": ["\\mathsf{fv}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["x", "y", "I"],
        "math_inputtex": "\\sum_x \\sum_y I(x,y) \\,\\!",
        "qID": "55",
        "tp": ["x", "y", "I"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\boldsymbol{F}_{r}"],
        "math_inputtex": "\\boldsymbol{F}_r",
        "qID": "56",
        "tp": ["\\boldsymbol{F}_{r}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["B", "B", "A", "A"],
        "math_inputtex": "0\\rightarrow B\\rightarrow A\\oplus B\\rightarrow A\\rightarrow0.",
        "qID": "57",
        "tp": ["B", "A"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["Y", "T", "\\alpha_{1}", "\\alpha_{2}", "X_{1}", "X_{2}"],
        "math_inputtex": "(\\nabla_Y T)(\\alpha_1, \\alpha_2, \\ldots, X_1, X_2, \\ldots) =Y(T(\\alpha_1,\\alpha_2,\\ldots,X_1,X_2,\\ldots))",
        "qID": "58",
        "tp": ["Y", "T", "\\alpha_{1}", "\\alpha_{2}", "X_{1}", "X_{2}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["n", "\\mathbb{Z}", "d", "\\psi", "\\psi", "t", "C"],
        "math_inputtex": " \\sum_{n \\in \\mathbb{Z}^d} |\\psi(t,n)|^2 |n| \\leq C ",
        "qID": "59",
        "tp": ["n", "\\mathbb{Z}", "d", "\\psi", "t", "C"]
    }, {
        "fn": [],
        "fp": ["p"],
        "identifier": ["x", "x", "g", "v", "y", "y", "y"],
        "math_inputtex": " p = {\\frac{-x\\pm\\sqrt{x^2-4(\\frac{-gx^2}{2v^2})(\\frac{-gx^2}{2v^2}-y)}}{2(\\frac{-gx^2}{2v^2}) }}",
        "qID": "60",
        "tp": ["x", "g", "v", "y"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["z", "H"],
        "math_inputtex": "\\left\\{ z \\in H: \\left| z \\right| > 1,\\, \\left| \\,\\mbox{Re}(z) \\,\\right| < \\frac{1}{2} \\right\\}",
        "qID": "61",
        "tp": ["z", "H"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["T", "\\lambda", "I", "I"],
        "math_inputtex": "T-\\lambda I",
        "qID": "62",
        "tp": ["T", "\\lambda", "I"]
    }, {
        "fn": [],
        "fp": ["sgn"],
        "identifier": ["y", "x", "\\rho", "\\sigma_{y}", "\\sigma_{x}", "\\mu_{x}", "\\mu_{y}"],
        "math_inputtex": "\n    y\\left( x \\right) = {\\mathop{\\rm sgn}} \\left( {{\\rho }} \\right)\\frac{{{\\sigma _y}}}{{{\\sigma _x}}}\\left( {x - {\\mu _x}} \\right) + {\\mu _y}.\n  ",
        "qID": "63",
        "tp": ["y", "x", "\\rho", "\\sigma_{y}", "\\sigma_{x}", "\\mu_{x}", "\\mu_{y}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["x", "b"],
        "math_inputtex": "x=b \\ ",
        "qID": "64",
        "tp": ["x", "b"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["H", "K"],
        "math_inputtex": "H^1(K)=\\sqrt{2}",
        "qID": "65",
        "tp": ["H", "K"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["P_{i}", "E_{K}", "S_{i-1}", "x", "C_{i}"],
        "math_inputtex": "P_i = \\mbox{head}(E_K (S_{i-1}), x) \\oplus C_i",
        "qID": "66",
        "tp": ["P_{i}", "E_{K}", "S_{i-1}", "x", "C_{i}"]
    }, {
        "fn": [],
        "fp": ["f_{x}"],
        "identifier": ["f", "x"],
        "math_inputtex": "\\frac{ \\partial f}{ \\partial x} = f_x = \\partial_x f.",
        "qID": "67",
        "tp": ["f", "x"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["P_{x}", "P", "a", "x", "x"],
        "math_inputtex": " P_x = P - \\{ a\\mid a \\geq x\\} ",
        "qID": "68",
        "tp": ["P_{x}", "P", "a", "x"]
    }, {
        "fn": ["Q_{1}", "Q_{2}"],
        "fp": ["a", "b", "d", "e", "h", "k", "n", "o", "Q", "r", "s", "t", "w"],
        "identifier": ["\\eta", "Q_{1}", "Q_{2}"],
        "math_inputtex": "\\eta = \\frac{ work\\ done } {heat\\ absorbed}  = \\frac{ Q1-Q2 }{ Q1}",
        "qID": "69",
        "tp": ["\\eta"]
    }, {
        "fn": [],
        "fp": ["d"],
        "identifier": ["f", "x", "y", "p", "v"],
        "math_inputtex": "df = {\\partial f \\over \\partial x}dx + {\\partial f \\over \\partial y}dy = pdx + vdy",
        "qID": "70",
        "tp": ["f", "x", "y", "p", "v"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["h_{r,s}"],
        "math_inputtex": "h_{r,s}",
        "qID": "71",
        "tp": ["h_{r,s}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["k", "K", "T", "M", "a"],
        "math_inputtex": " K^M_*(k) := T^*(k^\\times)/(a\\otimes (1-a)) ",
        "qID": "72",
        "tp": ["k", "K", "T", "M", "a"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["C", "K_{X}", "K_{X}"],
        "math_inputtex": "\\{C : K_X \\cdot C = 0\\}",
        "qID": "73",
        "tp": ["C", "K_{X}"]
    }, {
        "fn": [],
        "fp": ["d"],
        "identifier": ["\\Theta", "n"],
        "math_inputtex": "\\Theta \\wedge\n(d\\Theta)^n \\neq 0",
        "qID": "74",
        "tp": ["\\Theta", "n"]
    }, {
        "fn": [],
        "fp": ["D"],
        "identifier": ["\\rho", "u_{i}", "t"],
        "math_inputtex": "D\\left(\\rho u_i\\right)/Dt\\approx0",
        "qID": "75",
        "tp": ["\\rho", "u_{i}", "t"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["z_{t}", "\\lambda_{1}", "z_{t-1}", "\\varepsilon_{t}"],
        "math_inputtex": " z_{t} = \\lambda_{1}z_{t-1} + \\varepsilon_{t} ",
        "qID": "76",
        "tp": ["z_{t}", "\\lambda_{1}", "z_{t-1}", "\\varepsilon_{t}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["b_{3}"],
        "math_inputtex": "b_3",
        "qID": "77",
        "tp": ["b_{3}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["b_{3}"],
        "math_inputtex": "b_3",
        "qID": "78",
        "tp": ["b_{3}"]
    }, {
        "fn": [],
        "fp": ["\\Delta"],
        "identifier": ["W", "V_{1}", "V_{2}", "p", "V"],
        "math_inputtex": " \\Delta W = \\int_{V_1}^{V_2} p \\mathrm{d}V \\,\\!",
        "qID": "79",
        "tp": ["W", "V_{1}", "V_{2}", "p", "V"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["f", "Z", "n"],
        "math_inputtex": "\\dim f(Z) > n",
        "qID": "80",
        "tp": ["f", "Z", "n"]
    }, {
        "fn": [],
        "fp": ["d"],
        "identifier": ["t", "e"],
        "math_inputtex": "\\frac{d}{dt} \\log_e t = \\frac{1}{t}.",
        "qID": "81",
        "tp": ["t", "e"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["h_{i}", "X"],
        "math_inputtex": "h_i : X \\to \\{-1,+1\\}",
        "qID": "82",
        "tp": ["h_{i}", "X"]
    }, {
        "fn": ["\\mathrm{seqs}"],
        "fp": ["q", "s", "e"],
        "identifier": ["\\mathrm{seqs}", "\\mathrm{seqs}"],
        "math_inputtex": "2\\le seqs \\le6",
        "qID": "83",
        "tp": []
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["F", "x", "y", "\\mathcal{R}", "b", "n"],
        "math_inputtex": " F = \\{ (x,y) : x \\in \\mathcal{R}^b,\\, y \\in \\mathcal{R}^n,\\; x=y \\}.",
        "qID": "84",
        "tp": ["F", "x", "y", "\\mathcal{R}", "b", "n"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["X_{i}", "\\omega", "\\omega_{i}"],
        "math_inputtex": "X_i(\\omega)=\\omega_i",
        "qID": "85",
        "tp": ["X_{i}", "\\omega", "\\omega_{i}"]
    }, {
        "fn": [],
        "fp": ["\\mathrm{d}"],
        "identifier": ["L", "L", "q_{i}", "t", "\\dot{q_{i}}", "\\dot{q_{i}}"],
        "math_inputtex": "\n{\\partial{L}\\over \\partial q_i} = {\\mathrm{d} \\over \\mathrm{d}t}{\\partial{L}\\over \\partial{\\dot{q_i}}}.\n",
        "qID": "86",
        "tp": ["L", "q_{i}", "t", "\\dot{q_{i}}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["x_{7}"],
        "math_inputtex": "x_7",
        "qID": "87",
        "tp": ["x_{7}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\Pi_{n}"],
        "math_inputtex": "\\Pi_n",
        "qID": "88",
        "tp": ["\\Pi_{n}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\sigma", "X", "T", "V"],
        "math_inputtex": "\\sigma^2 = X^TVX,",
        "qID": "89",
        "tp": ["\\sigma", "X", "T", "V"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\mathbb{R}", "n", "f", "x", "B", "x_{0}", "r", "S"],
        "math_inputtex": "\\int_{\\mathbb{R}^n}f\\,dx = \\int_0^\\infty\\left\\{\\int_{\\partial B(x_0;r)} f\\,dS\\right\\}\\,dr.",
        "qID": "90",
        "tp": ["\\mathbb{R}", "n", "f", "x", "B", "x_{0}", "r", "S"]
    }, {
        "fn": [],
        "fp": ["B", "D"],
        "identifier": ["x", "p_{x}", "y", "p_{y}"],
        "math_inputtex": "\n\\{x, p_x\\}_{DB} = \\{y, p_y\\}_{DB} = \\frac{1}{2}\n",
        "qID": "91",
        "tp": ["x", "p_{x}", "y", "p_{y}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["G_{k,\\sigma}", "y", "k", "\\sigma"],
        "math_inputtex": "G_{k, \\sigma} (y)= 1-(1+ky/\\sigma)^{-1/k} ",
        "qID": "92",
        "tp": ["G_{k,\\sigma}", "y", "k", "\\sigma"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["L", "H_{B}", "H_{B}", "C", "X"],
        "math_inputtex": "L(H_B) \\otimes C(X)",
        "qID": "93",
        "tp": ["L", "H_{B}", "C", "X"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\pi_{i}", "N", "i"],
        "math_inputtex": "\\pi_i = 2^{-N} \\tbinom Ni",
        "qID": "94",
        "tp": ["\\pi_{i}", "N", "i"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["p_{1}", "p_{n}"],
        "math_inputtex": "(\\sqrt{p_1}, \\cdots ,\\sqrt{p_n})",
        "qID": "95",
        "tp": ["p_{1}", "p_{n}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\boldsymbol{s}"],
        "math_inputtex": "\\boldsymbol{s}",
        "qID": "96",
        "tp": ["\\boldsymbol{s}"]
    }, {
        "fn": [],
        "fp": ["\\Delta"],
        "identifier": ["J", "T", "W", "y"],
        "math_inputtex": "\\mathbf{J^TW\\  \\Delta y}",
        "qID": "97",
        "tp": ["J", "T", "W", "y"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["\\bar{V}"],
        "math_inputtex": "\\bar V^*",
        "qID": "98",
        "tp": ["\\bar{V}"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["n", "\\delta"],
        "math_inputtex": "\\;\\frac{(n+\\delta-1)(n+\\delta-2)\\cdots n}{(\\delta-1)!}\\;",
        "qID": "99",
        "tp": ["n", "\\delta"]
    }, {
        "fn": [],
        "fp": [],
        "identifier": ["y_{k}", "n"],
        "math_inputtex": "y_k[n]",
        "qID": "100",
        "tp": ["y_{k}", "n"]
    }];


describe('Identifiers', function () {
    testcases.forEach(function (tc) {
        var input = tc.in;
        var output = tc.out || [tc.in];
        it('should be discovered ' + JSON.stringify(input), function () {
            assert.deepEqual(lister(texvc.parse(input)), output);
        });
    });
    it('texonly should not cause an error', function () {
        assert.deepEqual(lister(ast.RenderT.TEX_ONLY('a')), []);
    });
});

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

describe('Gold Identifiers', function () {
    extractions.forEach(function (tc) {
        var input = tc.math_inputtex;
        var output = tc.identifier.filter(onlyUnique);
        tc.fn.forEach(function (fn) {
            var index = output.indexOf(fn);
            if(index > -1){
                output.splice(index, 1);
            }
        });
        it('in qID' + tc.qID + ' should be discovered ' + JSON.stringify(input), function () {
            var extracted = lister(texvc.parse(input)).filter(onlyUnique);
            tc.fp.forEach(function (fp) {
                var index = extracted.indexOf(fp);
                if(index > -1){
                    extracted.splice(index, 1);
                }
            });
            assert.deepEqual(extracted, output);
        });
    });
});

