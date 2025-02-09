// LICENSE : MIT
"use strict";
/*
4.2.7.コロン(：)
原則として和文ではコロン(:)を使用しません。
原文でコロンが使われている場合も、和文では使用しません。
ただし和文でも、見出し語とその説明の間にコロンを使う場合があります。使用する場合は全角で表記します。
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject() {
    var data = _taggedTemplateLiteral(["(?:", ")(:)"]);

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

function reporter(context) {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // "和文:" というような半角:は使用しない

            var matchHanQuestion = rx(_templateObject(), _regexp.japaneseRegExp);
            (0, _matchIndex.matchCaptureGroupAll)(text, matchHanQuestion).forEach(match => {
                var { index } = match;
                report(
                    node,
                    new RuleError("コロン(：)を使用する場合は「全角」で表記します。", {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + 1], "：")
                    })
                );
            });
        }
    };
}

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=4.2.7.js.map
