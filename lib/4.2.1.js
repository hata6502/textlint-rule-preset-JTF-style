// LICENSE : MIT
"use strict";
/*
4.2.1. 感嘆符(!)
和文の実務文章の場合、本文では感嘆符を多用しません。
原文で感嘆符が使われている場合も、和文ではできるだけ句点を使用します。

ただし、見出しや広告関連の文章、強い調子で読者の注意を促す文章など、
感嘆符の使用が適切と判断される場合には、感嘆符を使用します。
使用する場合は「全角」で表記します。
文末に感嘆符を使用し、後に 別の文が続く場合は、直後に全角スペースを挿入します。
文中に感嘆符を使用する場合はスペースを挿入しません。下記を参考にしてください。
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

            var text = getSource(node); // 半角の!は利用しない

            var matchRegExp = /(?:[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ])(!)/;
            (0, _matchIndex.matchCaptureGroupAll)(text, matchRegExp).forEach(match => {
                var { index } = match;
                return report(
                    node,
                    new RuleError("感嘆符(！)を使用する場合は「全角」で表記します。", {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + 1], "！")
                    })
                );
            }); // ！の後ろは全角スペースが推奨
            // 半角スペースである場合

            var matchAfter = /！( )[^\n]/;
            (0, _matchIndex.matchCaptureGroupAll)(text, matchAfter).forEach(match => {
                var { index } = match;
                return report(
                    node,
                    new RuleError("文末に感嘆符を使用し、後に別の文が続く場合は、直後に全角スペースを挿入します。", {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + 1], "　")
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
//# sourceMappingURL=4.2.1.js.map
