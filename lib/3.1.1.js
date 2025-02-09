// LICENSE : MIT
"use strict";
/*
3.1.1. 全角文字と半角文字の間
原則として、全角文字と半角文字の間にスペースを入れません。

。ただしカタカナ複合語の場合を除きます。「2.1.7 カタカナ複合語」を参照してください。
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

            var text = getSource(node); // アルファベットと全角の間は半角スペースではない

            var betweenHanAndZen = (0, _matchIndex.matchCaptureGroupAll)(
                text,
                /[A-Za-z0-9]( )(?:[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ])/
            );
            var betweenZenAndHan = (0, _matchIndex.matchCaptureGroupAll)(
                text,
                /(?:[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ])( )[A-Za-z0-9]/
            );

            var reportMatch = match => {
                var { index } = match;
                report(
                    node,
                    new RuleError("原則として、全角文字と半角文字の間にスペースを入れません。", {
                        index: match.index,
                        fix: fixer.replaceTextRange([index, index + 1], "")
                    })
                );
            };

            betweenHanAndZen.forEach(reportMatch);
            betweenZenAndHan.forEach(reportMatch);
        }
    };
}

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=3.1.1.js.map
