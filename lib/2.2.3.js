// LICENSE : MIT
"use strict";
/*
2.2.3. 一部の助数詞の表記
助数詞にともなう「ヵ」、「か」、「カ」、「ヶ」、「ケ」、「箇」、「個」の表記は、原則として、ひらがなの「か」を使います。
 */

var _textlintRulePrh = _interopRequireDefault(require("textlint-rule-prh"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

module.exports = function(context) {
    return _textlintRulePrh.default.fixer(context, {
        ruleContents: [
            "version: 1\nrules:\n  - expected: $1\u304B$2\n    patterns:\n      - /(\\d+)\u30F6([\u6240\u6708\u56FD\u5E74])/\n    specs:\n      - from: 3\u30F6\u6708\u672A\u6E80\u3002\n        to: 3\u304B\u6708\u672A\u6E80\u3002\n      - from: 10\u30F6\u6240\n        to: 10\u304B\u6240\n      - from: 5\u30F6\u5E74\u8A08\u753B\u3002\n        to: 5\u304B\u5E74\u8A08\u753B\u3002"
        ]
    });
};
//# sourceMappingURL=2.2.3.js.map
