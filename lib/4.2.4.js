// LICENSE : MIT
"use strict";
/*
4.2.4.中黒(・)
カタカナ複合語を区切る場合、同格の語句を並列する場合に使用します。
同一の文書で、カタカナ複合語の区切りに中黒を使い、同格の語句の並列にも中黒を使用するのは、お勧めしません。
読み手の理解を妨げる場合があるからです。「2.1.7 カタカナ複合語」を参照してください

「･」と「・」
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject() {
    var data = _taggedTemplateLiteral(["(?:", "|[a-zA-Z])(\uFF65)(?:", "|[a-zA-Z])"]);

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

            var text = getSource(node); // 和文で半角の･は利用しない

            var matchHanNakaguro = rx(_templateObject(), _regexp.japaneseRegExp, _regexp.japaneseRegExp);
            (0, _matchIndex.matchCaptureGroupAll)(text, matchHanNakaguro).forEach(match => {
                var { index } = match;
                report(
                    node,
                    new RuleError(
                        "カタカナ複合語を区切る場合または同格の語句を並列する場合には全角の中黒（・）を使用します。",
                        {
                            index: index,
                            fix: fixer.replaceTextRange([index, index + 1], "・")
                        }
                    )
                );
            });
        }
    };
}

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=4.2.4.js.map
