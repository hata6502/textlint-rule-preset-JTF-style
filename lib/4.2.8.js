// LICENSE : MIT
"use strict";
/*
4.2.8.セミコロン(;)
原則として和文ではセミコロン(;)を使用しません。
原文でセミコロンが使われている場合も、和文では使用しません。
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

var _regx = _interopRequireDefault(require("regx"));

var _regexp = require("./util/regexp");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _templateObject() {
    var data = _taggedTemplateLiteral(["(?:", ")(;)"]);

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

module.exports = function(context) {
    var { Syntax, RuleError, report, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // "和文;" というような半角;は使用しない

            var matchRegExp = rx(_templateObject(), _regexp.japaneseRegExp);
            (0, _matchIndex.matchCaptureGroupAll)(text, matchRegExp).forEach(match => {
                var { index } = match;
                report(
                    node,
                    new RuleError("原則として和文ではセミコロン(;)を使用しません。", {
                        index: index
                    })
                );
            });
        }
    };
};
//# sourceMappingURL=4.2.8.js.map
