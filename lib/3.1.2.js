// LICENSE : MIT
"use strict";

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject() {
    var data = _taggedTemplateLiteral(["", "( )", ""]);

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
3.1.2. 全角文字どうし

原則として、全角文字どうしの間にスペースを入れません。ただしカタカナ複合語の場合を除きます。
「2.1.7 カタカナ複合語」を参照してください。
 */

function reporter(context) {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // 全角同士の間は半角スペースを入れない

            var matchReg = rx(_templateObject(), _regexp.japaneseRegExp, _regexp.japaneseRegExp);
            var katakakana = /[ァ-ヶ]( )[ァ-ヶ]/;
            (0, _matchIndex.matchAll)(text, matchReg).forEach(match => {
                var { input, captureGroups } = match; // ただしカタカナ複合語の場合を除きます。

                if (katakakana.test(input)) {
                    return;
                }

                captureGroups.forEach(captureGroup => {
                    var index = captureGroup.index;
                    report(
                        node,
                        new RuleError("原則として、全角文字どうしの間にスペースを入れません。", {
                            index: index,
                            fix: fixer.replaceTextRange([index, index + 1], "")
                        })
                    );
                });
            });
        }
    };
}

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=3.1.2.js.map
