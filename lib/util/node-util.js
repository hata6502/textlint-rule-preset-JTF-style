// LICENSE : MIT
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isUserWrittenNode = isUserWrittenNode;

var _textlintRuleHelper = require("textlint-rule-helper");

/**
 * ユーザーが書いたと推測されるNodeかどうかを判定する
 * ユーザーが管理できないテキストは対象外としたいため。
 * @param node
 * @param context
 * @returns {boolean}
 */
function isUserWrittenNode(node, context) {
    var helper = new _textlintRuleHelper.RuleHelper(context);
    var Syntax = context.Syntax;
    return !helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis]);
}
//# sourceMappingURL=node-util.js.map
