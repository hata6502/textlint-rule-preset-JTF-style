// LICENSE : MIT
"use strict";
/*
2.1.8.算用数字
算用数字は「半角」で表記します。
用途によっては全角を許容します。
ただし、表記をできるだけ統一するため、特別な理由がない限り半角での表記を原則とします。
 */

var _nodeUtil = require("./util/node-util");

var _moji = _interopRequireDefault(require("moji"));

var _matchIndex = require("match-index");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function toHankaku(string) {
    return (0, _moji.default)(string)
        .convert("ZE", "HE")
        .toString();
}

function reporter(context) {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node);
            var matchRegExp = /([０-９]+)/;
            (0, _matchIndex.matchCaptureGroupAll)(text, matchRegExp).forEach(match => {
                var { index, text } = match;
                report(
                    node,
                    new RuleError("算用数字は「半角」で表記します。", {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + text.length], toHankaku(text))
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
//# sourceMappingURL=2.1.8.js.map
