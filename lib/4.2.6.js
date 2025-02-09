// LICENSE : MIT
"use strict";
/*
4.2.6.ハイフン(-)
原則として和文ではハイフン(-)を使用しません。
使用する場合は半角で表記します。原文でハイフンが使われている場合も、和文では使用しません。
例外は、住所や電話番号の区切りに使う場合です。
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

var _mergeMatches = _interopRequireDefault(require("./util/merge-matches"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject2() {
    var data = _taggedTemplateLiteral(["(-)", ""], ["(\\-)", ""]);

    _templateObject2 = function _templateObject2() {
        return data;
    };

    return data;
}

function _templateObject() {
    var data = _taggedTemplateLiteral(["", "(-)"], ["", "(\\-)"]);

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

            var text = getSource(node); // 和文ではハイフン(-)を使用しません
            // right

            var rightMatches = (0, _matchIndex.matchCaptureGroupAll)(
                text,
                rx(_templateObject(), _regexp.japaneseRegExp)
            ); // left

            var leftMatches = (0, _matchIndex.matchCaptureGroupAll)(
                text,
                rx(_templateObject2(), _regexp.japaneseRegExp)
            );
            var matches = (0, _mergeMatches.default)(leftMatches, rightMatches);
            matches.forEach(match => {
                var { index } = match;
                report(
                    node,
                    new RuleError(
                        "\u539F\u5247\u3068\u3057\u3066\u548C\u6587\u3067\u306F\u30CF\u30A4\u30D5\u30F3(-)\u3092\u4F7F\u7528\u3057\u307E\u305B\u3093\u3002\n\u4F8B\u5916\u306F\u3001\u4F4F\u6240\u3084\u96FB\u8A71\u756A\u53F7\u306E\u533A\u5207\u308A\u306B\u4F7F\u3046\u5834\u5408\u3067\u3059\u3002",
                        {
                            index: index
                        }
                    )
                );
            });
        }
    };
};
//# sourceMappingURL=4.2.6.js.map
