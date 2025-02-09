// LICENSE : MIT
"use strict";
/*
1.1.1.本文

本文の文体は、敬体(ですます調)あるいは常体(である調)のどちらかで統一します。
敬体と常体を混在させないようにします。
敬体と常体のどちらを使うかは、文書の目的や読み手に応じて決めます。

 敬体(ですます調)
一般読者向けの紹介文、パンフレット、マニュアル、ウェブサイトの本文では、基本的に「敬体」を使います。
親しみやすい、柔らかい雰囲気で内容を伝えることができます。

 常体(である調)
常体は、簡潔に、力強い雰囲気で内容を伝えることができる文体です
丁寧ではない印象を読み手に与える場合があるため、通常、一般向けのマニュアルの本文では使われません。
 */

var _analyzeDesumasuDearu = require("analyze-desumasu-dearu");

var _textlintRuleHelper = require("textlint-rule-helper");

module.exports = function(context) {
    var { Syntax, RuleError, report, getSource } = context;
    var helper = new _textlintRuleHelper.RuleHelper(context);
    var desumasuList = [];
    var dearuList = [];

    function reportResult(list, _ref) {
        var { desumasu, dearu } = _ref;
        list.forEach(_ref2 => {
            var { node, matches } = _ref2;
            matches.forEach(match => {
                var message;

                if (desumasu) {
                    message = '\u672C\u6587\u3092\u5E38\u4F53(\u3067\u3042\u308B\u8ABF)\u306B\u7D71\u4E00\u3057\u3066\u4E0B\u3055\u3044\u3002\n\u672C\u6587\u306E\u6587\u4F53\u306F\u3001\u656C\u4F53(\u3067\u3059\u307E\u3059\u8ABF)\u3042\u308B\u3044\u306F\u5E38\u4F53(\u3067\u3042\u308B\u8ABF)\u306E\u3069\u3061\u3089\u304B\u3067\u7D71\u4E00\u3057\u307E\u3059\u3002\n"'.concat(
                        match.value,
                        '"\u304C\u656C\u4F53(\u3067\u3059\u307E\u3059\u8ABF)\u3067\u3059\u3002'
                    );
                } else if (dearu) {
                    message = '\u672C\u6587\u3092\u656C\u4F53(\u3067\u3059\u307E\u3059\u8ABF)\u306B\u7D71\u4E00\u3057\u3066\u4E0B\u3055\u3044\u3002\n\u672C\u6587\u306E\u6587\u4F53\u306F\u3001\u656C\u4F53(\u3067\u3059\u307E\u3059\u8ABF)\u3042\u308B\u3044\u306F\u5E38\u4F53(\u3067\u3042\u308B\u8ABF)\u306E\u3069\u3061\u3089\u304B\u3067\u7D71\u4E00\u3057\u307E\u3059\u3002\n"'.concat(
                        match.value,
                        '"\u304C\u5E38\u4F53(\u3067\u3042\u308B\u8ABF)\u3067\u3059\u3002'
                    );
                }

                report(
                    node,
                    new RuleError(message, {
                        line: match.lineNumber - 1,
                        column: match.columnIndex
                    })
                );
            });
        });
    }

    return {
        [Syntax.Document]() {
            desumasuList = [];
            dearuList = [];
        },

        [Syntax.Str](node) {
            // 本文以外は無視する
            // => isUserWrittenNode
            if (helper.isChildNode(node, [Syntax.Link, Syntax.Image, Syntax.BlockQuote, Syntax.Emphasis])) {
                return;
            } // Listについては1.1.3. 箇条書きで扱う

            if (helper.isChildNode(node, [Syntax.ListItem])) {
                return;
            }

            var text = getSource(node);
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
                    dearu: true
                });
            } else if (desumasuCount < dearuCount) {
                reportResult(desumasuList, {
                    desumasu: true
                });
            } else {
                reportResult(dearuList, {
                    dearu: true
                });
            }
        }
    };
};
//# sourceMappingURL=1.1.1.js.map
