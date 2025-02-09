// LICENSE : MIT
"use strict";
/*
1.1.5.図表のキャプション
文章の内容に応じて、敬体、常体、体言止めを使います。
いずれの場合も、複数の文体をできるだけ混在させないことが重要です。
通常、文末に句点(。)を付けませんが、複数の文章になる場合は句点を使用します。

キャプション間で文体が混ざっていないことを確認する。
 */

var _analyzeDesumasuDearu = require("analyze-desumasu-dearu");

module.exports = function(context) {
    var { Syntax, RuleError, report, getSource } = context;
    var desumasuList = [];
    var dearuList = [];

    function resetState() {
        desumasuList = [];
        dearuList = [];
    }

    var imagePaddingLet = 2; // ![ の分paddingを付ける

    function reportResult(list, _ref) {
        var { desumasu, dearu } = _ref;
        list.forEach(_ref2 => {
            var { node, matches } = _ref2;
            matches.forEach(match => {
                var message;

                if (desumasu) {
                    message = '\u56F3\u8868\u306E\u30AD\u30E3\u30D7\u30B7\u30E7\u30F3\u3092\u656C\u4F53(\u3067\u3059\u307E\u3059\u8ABF)\u306B\u7D71\u4E00\u3057\u3066\u4E0B\u3055\u3044\u3002\n\u56F3\u8868\u306E\u30AD\u30E3\u30D7\u30B7\u30E7\u30F3\u5185\u3067\u656C\u4F53\u3001\u5E38\u4F53\u3092\u6DF7\u5728\u3055\u305B\u306A\u3044\u3053\u3068\u304C\u91CD\u8981\u3067\u3059\u3002\n"'.concat(
                        match.value,
                        '"\u304C\u5E38\u4F53(\u3067\u3042\u308B\u8ABF)\u3067\u3059\u3002'
                    );
                } else if (dearu) {
                    message = '\u56F3\u8868\u306E\u30AD\u30E3\u30D7\u30B7\u30E7\u30F3\u3092\u5E38\u4F53(\u3067\u3042\u308B\u8ABF)\u306B\u7D71\u4E00\u3057\u3066\u4E0B\u3055\u3044\u3002\n\u56F3\u8868\u306E\u30AD\u30E3\u30D7\u30B7\u30E7\u30F3\u5185\u3067\u656C\u4F53\u3001\u5E38\u4F53\u3092\u6DF7\u5728\u3055\u305B\u306A\u3044\u3053\u3068\u304C\u91CD\u8981\u3067\u3059\u3002\n"'.concat(
                        match.value,
                        '"\u304C\u656C\u4F53(\u3067\u3059\u307E\u3059\u8ABF)\u3067\u3059\u3002'
                    );
                }

                report(
                    node,
                    new RuleError(message, {
                        line: match.lineNumber - 1,
                        column: match.columnIndex + imagePaddingLet
                    })
                );
            });
        });
    }

    return {
        [Syntax.Document]: resetState,

        [Syntax.Image](node) {
            var text = node.alt; // alt がない場合は無視する

            if (text === undefined || text === null) {
                return;
            }

            var retDesumasu = (0, _analyzeDesumasuDearu.analyzeDesumasu)(text);

            if (retDesumasu.length > 0) {
                desumasuList.push({
                    node: node,
                    matches: retDesumasu
                });
            }

            var retDearu = (0, _analyzeDesumasuDearu.analyzeDearu)(text);

            if (retDearu.length > 0) {
                dearuList.push({
                    node: node,
                    matches: retDearu
                });
            }
        },

        ["".concat(Syntax.Document, ":exit")]() {
            var desumasuCount = desumasuList.reduce((count, _ref3) => {
                var { matches } = _ref3;
                return count + matches.length;
            }, 0);
            var dearuCount = dearuList.reduce((count, _ref4) => {
                var { matches } = _ref4;
                return count + matches.length;
            }, 0);

            if (desumasuCount === 0 || dearuCount === 0) {
                return;
            }

            if (desumasuCount > dearuCount) {
                reportResult(dearuList, {
                    desumasu: true
                });
            } else if (desumasuCount < dearuCount) {
                reportResult(desumasuList, {
                    dearu: true
                });
            } else {
                reportResult(dearuList, {
                    desumasu: true
                });
            }
        }
    };
};
//# sourceMappingURL=1.1.5.js.map
