// LICENSE : MIT
"use strict";
/*
4.1.1. 句点(。)
句点(。)は「全角」で表記します。
句点は文の終わりに付けます。
文中にかぎかっこが入る場合は、閉じかっこの前に句点を打ちません。
文中に丸かっこが入る場合も閉じかっこの前に句点を打ちません。。
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var brackets = ["」", "）", "\\)"];
var leftBrackets = brackets.map(bracket => {
    return new RegExp("(。)" + bracket, "g");
});

var reporter = function reporter(context) {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node);
            leftBrackets.forEach(pattern => {
                (0, _matchIndex.matchCaptureGroupAll)(text, pattern).forEach(match => {
                    var { index } = match;
                    report(
                        node,
                        new RuleError("文中にかぎかっこが入る場合は、閉じかっこの前に句点を打ちません。", {
                            index: index,
                            fix: fixer.replaceTextRange([index, index + 1], "")
                        })
                    );
                });
            });
        }
    };
};

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=4.1.1.js.map
