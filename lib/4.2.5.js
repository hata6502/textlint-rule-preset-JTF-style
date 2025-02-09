// LICENSE : MIT
"use strict";
/*
4.2.5.波線(〜)
数値の範囲を示す場合に使用します。
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

function reporter(context) {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // 数値の区切りに半角の~は利用しない

            var matchHanQuestion = /\d(~)\d/g;
            (0, _matchIndex.matchCaptureGroupAll)(text, matchHanQuestion).forEach(match => {
                var { index } = match;
                report(
                    node,
                    new RuleError("数値の範囲を示す場合には全角の〜を使用します。", {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + 1], "〜")
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
//# sourceMappingURL=4.2.5.js.map
