// LICENSE : MIT
"use strict";
/*
2.1.10.算用数字の位取りの表記
桁区切りには「カンマ」、小数点には「ピリオド」を使います。
ただし桁区切りの「カンマ」は省略する場合があります。
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

            var text = getSource(node); // 数字,で絞って

            var numberWithComma = /([\d,]+)/g; // 0,xxx な文字列を検出する

            var strictMatchReg = /^0+(,)\d+$/;
            var match;

            while ((match = numberWithComma.exec(text))) {
                // この段階では 10,000 も含まれている
                // ^0,xxx をだけを取り出す
                var matchedString = match[0];
                (0, _matchIndex.matchCaptureGroupAll)(matchedString, strictMatchReg).forEach(subMatch => {
                    var { index } = subMatch;
                    report(
                        node,
                        new RuleError("小数点には「ピリオド」を使います。", {
                            index: match.index + index,
                            fix: fixer.replaceTextRange([match.index + index, match.index + index + 1], ".")
                        })
                    );
                });
            }
        }
    };
}

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=2.1.10.js.map
