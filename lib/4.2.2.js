// LICENSE : MIT
"use strict";
/*
4.2.2.疑問符(?)
和文の実務文章の場合、本文では疑問符を多用しません。
原文で疑問符が使われている場合も、和文ではできるだけ句点を使用します。
ただし、見出しや広告関連の文章、読み手の回答を求める質問文など、
疑問符の使用が適切と判断される場合には、疑問符を使用します。
使用する場合は「全角」で表記します。
文末に疑問符を使用し、後に別の 文が続く場合は、直後に全角スペースを挿入します。
文中に疑問符を使用する場合はスペースを挿入しません。
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject() {
    var data = _taggedTemplateLiteral(["", "(?)"], ["", "(\\?)"]);

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

            var text = getSource(node); // 和文で半角の?は利用しない

            var matchRegExp = rx(_templateObject(), _regexp.japaneseRegExp);
            (0, _matchIndex.matchCaptureGroupAll)(text, matchRegExp).forEach(match => {
                var { index } = match;
                return report(
                    node,
                    new RuleError("疑問符(？)を使用する場合は「全角」で表記します。", {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + 1], "？")
                    })
                );
            }); // ？の後ろは全角スペースが推奨
            // 半角スペースである場合はエラーとする

            var matchAfter = /？( )[^\n]/;
            (0, _matchIndex.matchCaptureGroupAll)(text, matchAfter).forEach(match => {
                var { index } = match;
                return report(
                    node,
                    new RuleError("文末に疑問符を使用し、後に別の文が続く場合は、直後に全角スペースを挿入します。", {
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
//# sourceMappingURL=4.2.2.js.map
