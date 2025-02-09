// LICENSE : MIT
"use strict";
/**
 * 「と」といったペアがちゃんと閉じられているかをチェックします
 * @param {object} context
 * @param {string} left
 * @param {string} right
 * @returns {object}
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkPair = checkPair;

var _assert = _interopRequireDefault(require("assert"));

var _textlintRuleHelper = require("textlint-rule-helper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function checkPair(context, _ref) {
    var { left, right } = _ref;
    (0, _assert.default)(left);
    (0, _assert.default)(right);
    var { Syntax, RuleError, report, getSource } = context;
    var helper = new _textlintRuleHelper.RuleHelper(context);
    var isInParagraph = false;
    var currentStrInParagraph = [];
    /**
     * `Str` nodeの配列を受け取り、pairが見つからないnodeを返す
     * @param {Object} currentStrInParagraph
     * @returns {{node, index}[]}
     */

    var foundMissingPairNodes = currentStrInParagraph => {
        var foundLeft = false;
        var matchParentheses = [];
        currentStrInParagraph.forEach(node => {
            var text = getSource(node); // left を探す

            var leftIndex = -1;

            if (!foundLeft) {
                leftIndex = text.indexOf(left);

                if (leftIndex !== -1) {
                    matchParentheses.push({
                        node,
                        index: leftIndex
                    });
                    foundLeft = true;
                }
            } // right を探す

            var pairIndex = text.indexOf(right, leftIndex + 1);

            if (pairIndex !== -1) {
                matchParentheses.pop();
                foundLeft = false;
            }
        });
        return matchParentheses;
    };

    return {
        [Syntax.Paragraph](node) {
            if (helper.isChildNode(node, [Syntax.BlockQuote])) {
                return;
            }

            currentStrInParagraph = [];
            isInParagraph = true;
        },

        [Syntax.Str](node) {
            if (!isInParagraph) {
                return;
            }

            currentStrInParagraph.push(node);
        },

        ["".concat(Syntax.Paragraph, ":exit")]() {
            var missingPairList = foundMissingPairNodes(currentStrInParagraph); // 探索おわり

            isInParagraph = false; // 全ての対が見つかったなら配列は空になる

            if (missingPairList.length === 0) {
                return;
            }

            missingPairList.forEach(_ref2 => {
                var { node, index } = _ref2;
                report(
                    node,
                    new RuleError(
                        ""
                            .concat(left, "\u306E\u5BFE\u3068\u306A\u308B")
                            .concat(right, "\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002")
                            .concat(left)
                            .concat(right),
                        {
                            index
                        }
                    )
                );
            });
        }
    };
}
//# sourceMappingURL=pair-checker.js.map
