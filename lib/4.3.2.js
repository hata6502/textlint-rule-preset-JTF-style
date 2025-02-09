// LICENSE : MIT
"use strict";
/*
4.3.2.大かっこ［］
コンピューターの画面用語などの特殊な表記で使用します。
全角の大かっこを使用します
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject() {
    var data = _taggedTemplateLiteral(["(?:", ")([[]])"], ["(?:", ")([\\[\\]])"]);

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

var replaceSymbol = symbol => {
    var newSymbol = {
        "[": "［",
        "]": "］"
    }[symbol];

    if (!newSymbol) {
        throw new Error("fail to replace symbol");
    }

    return newSymbol;
};

function reporter(context) {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            } // 半角のかっこ[]は使用しないで全角のかっこを使用する

            var text = getSource(node);
            var matchRegExp = rx(_templateObject(), _regexp.japaneseRegExp);
            (0, _matchIndex.matchCaptureGroupAll)(text, matchRegExp).forEach(match => {
                var { index } = match;
                report(
                    node,
                    new RuleError("半角の大かっこ[]が使用されています。全角のかっこ［］を使用してください。", {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + 1], replaceSymbol(match.text))
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
//# sourceMappingURL=4.3.2.js.map
