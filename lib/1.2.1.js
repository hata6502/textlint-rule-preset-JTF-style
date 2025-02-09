// LICENSE : MIT
"use strict";

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

var _matchIndex = require("match-index");

var _mergeMatches = _interopRequireDefault(require("./util/merge-matches"));

var _nodeUtil = require("./util/node-util");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject2() {
    var data = _taggedTemplateLiteral(
        ["\n        ", "\n        ([,.])\n    "],
        ["\n        ", "\n        ([,\\.])\n    "]
    );

    _templateObject2 = function _templateObject2() {
        return data;
    };

    return data;
}

function _templateObject() {
    var data = _taggedTemplateLiteral(
        ["\n        ([,.])\n        ", "\n    "],
        ["\n        ([,\\.])\n        ", "\n    "]
    );

    _templateObject = function _templateObject() {
        return data;
    };

    return data;
}

function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } }));
}

var rx = (0, _regx.default)("g");
/*
1.2.1. 句点(。)と読点(、)
句読点には全角の「、」と「。」を使います。和文の句読点としてピリオド(.)とカンマ(,)を使用しません。
「4.1.1 句点(。)」と「4.1.2 読点(、)」を参照してください。
 */

// [,.]{日本語}
var leftTarget = rx(_templateObject(), _regexp.japaneseRegExp); // {日本語}[,.]

var rightTarget = rx(_templateObject2(), _regexp.japaneseRegExp); // . => 。 の置換マップ

var replaceSymbol = {
    ".": "。",
    ",": "、"
};

var reporter = context => {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node);
            var leftMatches = (0, _matchIndex.matchCaptureGroupAll)(text, leftTarget);
            var rightMatches = (0, _matchIndex.matchCaptureGroupAll)(text, rightTarget);
            var matches = (0, _mergeMatches.default)(leftMatches, rightMatches);
            matches.forEach(match => {
                var symbol = replaceSymbol[match.text];
                var indexOfSymbol = match.index;
                report(
                    node,
                    new RuleError(
                        "句読点には全角の「、」と「。」を使います。和文の句読点としてピリオド(.)とカンマ(,)を使用しません。",
                        {
                            index: indexOfSymbol,
                            fix: fixer.replaceTextRange([indexOfSymbol, indexOfSymbol + 1], symbol)
                        }
                    )
                );
            });
        }
    };
};

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=1.2.1.js.map
