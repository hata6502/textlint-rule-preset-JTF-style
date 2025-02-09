// LICENSE : MIT
"use strict";
/*
3.3. かっこ類と隣接する文字の間のスペースの有無
かっこの外側、内側ともにスペースを入れません。
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var brackets = ["\\[", "\\]", "（", "）", "［", "］", "「", "」", "『", "』"];
var leftBrackets = brackets.map(bracket => {
    return new RegExp("([ 　])" + bracket, "g");
});
var rightBrackets = brackets.map(bracket => {
    return new RegExp(bracket + "([ 　])", "g");
});

function reporter(context) {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // 左にスペース

            leftBrackets.forEach(pattern => {
                (0, _matchIndex.matchCaptureGroupAll)(text, pattern).forEach(match => {
                    var { index } = match;
                    report(
                        node,
                        new RuleError("かっこの外側、内側ともにスペースを入れません。", {
                            index: index,
                            fix: fixer.replaceTextRange([index, index + 1], "")
                        })
                    );
                });
            }); // 右にスペース

            rightBrackets.forEach(pattern => {
                (0, _matchIndex.matchCaptureGroupAll)(text, pattern).forEach(match => {
                    var { index, text } = match;
                    report(
                        node,
                        new RuleError("かっこの外側、内側ともにスペースを入れません。", {
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
//# sourceMappingURL=3.3.js.map
