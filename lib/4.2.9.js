// LICENSE : MIT
"use strict";
/*
4.2.9.ダッシュ(-)
原則として和文ではダッシュ(-)を使用しません。
和文でダッシュを使用すると、電子文書として処理する際に不都合が生じる場合があります。

Note: ここでのダッシュはU+2012-U+2015とする
全角 —— のように使われてる事が多い
https://ja.wikipedia.org/wiki/%E3%83%80%E3%83%83%E3%82%B7%E3%83%A5_%28%E8%A8%98%E5%8F%B7%29
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject() {
    var data = _taggedTemplateLiteral(["(?:", ")([\u2012-\u2015])"], ["(?:", ")([\\u2012-\\u2015])"]);

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

module.exports = function(context) {
    var { Syntax, RuleError, report, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // 和文でダッシュは使用しない

            var matchRegExp = rx(_templateObject(), _regexp.japaneseRegExp);
            (0, _matchIndex.matchCaptureGroupAll)(text, matchRegExp).forEach(match => {
                var { index } = match;
                report(
                    node,
                    new RuleError("原則として和文ではダッシュ(―)を使用しません。", {
                        index
                    })
                );
            });
        }
    };
};
//# sourceMappingURL=4.2.9.js.map
