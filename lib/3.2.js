// LICENSE : MIT
"use strict";
/*
3.2.カタカナ語間のスペースの有無
中黒または半角スペースを用いてカタカナ語を区切ります。
「2.1.7 カタカナ複合語」を参照してください。
 */

var _nodeUtil = require("./util/node-util");

var _matchIndex = require("match-index");

module.exports = function(context) {
    var { Syntax, RuleError, report, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // カタカナ(カタカナ以外)カタカナ のパターンを取り出す

            (0, _matchIndex.matchCaptureGroupAll)(text, /[ァ-ヶー]([^[ァ-ヶー])[ァ-ヶー]/).forEach(match => {
                // カタカナの間を全角スペースでは区切らない
                var { text } = match;

                if (text === "　") {
                    report(
                        node,
                        new RuleError("カタカナ語間は中黒（・）または半角スペースを用いてカタカナ語を区切ります", {
                            index: match.index
                        })
                    );
                }
            });
        }
    };
};
//# sourceMappingURL=3.2.js.map
