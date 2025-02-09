// LICENSE : MIT
"use strict";
/*
1.1.3.箇条書き

基本的に本文の文体に合わせます。
ただし、本文が「敬体」である場合、箇条書きに「常体」または「体言止め」も使う場合があります。
一般読者向け の文書で、本文が敬体である場合、多くの場合、箇条書きでも敬体を使います。
本文が「常体」である場合、箇条書きには「常体」または「体言止め」を使います。「敬体」は使いません。
いずれの場合も、ひとまとまりの箇条書きでは、敬体と常体を混在させません。文末に句点(。)を付けるかどうかも統一します。
 */

var _analyzeDesumasuDearu = require("analyze-desumasu-dearu");

module.exports = function(context) {
    var { Syntax, RuleError, report, getSource } = context;
    var desumasuList = [];
    var dearuList = []; // 。付きのListItem

    var withPointList = []; // 。なしのListItem

    var withoutPointList = [];

    function resetList() {
        dearuList = [];
        desumasuList = [];
        withPointList = [];
        withoutPointList = [];
    }

    function reportPointResult(nodeList, _ref) {
        var { shouldUsePoint } = _ref;
        nodeList.forEach(node => {
            var message;

            if (shouldUsePoint) {
                message =
                    "\u7B87\u6761\u66F8\u304D\u306E\u6587\u672B\u306B\u53E5\u70B9(\u3002)\u3092\u4ED8\u3051\u3066\u4E0B\u3055\u3044\u3002\n\u7B87\u6761\u66F8\u304D\u306E\u6587\u672B\u306B\u53E5\u70B9(\u3002)\u3092\u4ED8\u3051\u308B\u304B\u3092\u7D71\u4E00\u3057\u307E\u3059\u3002";
            } else {
                message =
                    "\u7B87\u6761\u66F8\u304D\u306E\u6587\u672B\u304B\u3089\u53E5\u70B9(\u3002)\u3092\u5916\u3057\u3066\u4E0B\u3055\u3044\u3002\n\u7B87\u6761\u66F8\u304D\u306E\u6587\u672B\u306B\u53E5\u70B9(\u3002)\u3092\u4ED8\u3051\u308B\u304B\u3092\u7D71\u4E00\u3057\u307E\u3059\u3002";
            }

            report(node, new RuleError(message));
        });
    }

    function reportDesumaruDearuResult(list, _ref2) {
        var { desumasu, dearu } = _ref2;
        list.forEach(_ref3 => {
            var { node, matches } = _ref3;
            matches.forEach(match => {
                var message;

                if (desumasu) {
                    message = '\u7B87\u6761\u66F8\u304D\u3092\u656C\u4F53(\u3067\u3059\u307E\u3059\u8ABF)\u306B\u7D71\u4E00\u3057\u3066\u4E0B\u3055\u3044\u3002\n\u3072\u3068\u307E\u3068\u307E\u308A\u306E\u7B87\u6761\u66F8\u304D\u3067\u306F\u3001\u656C\u4F53\u3068\u5E38\u4F53\u3092\u6DF7\u5728\u3055\u305B\u307E\u305B\u3093\u3002\n"'.concat(
                        match.value,
                        '"\u304C\u5E38\u4F53(\u3067\u3042\u308B\u8ABF)\u3067\u3059\u3002'
                    );
                } else if (dearu) {
                    message = '\u7B87\u6761\u66F8\u304D\u3092\u5E38\u4F53(\u3067\u3042\u308B\u8ABF)\u306B\u7D71\u4E00\u3057\u3066\u4E0B\u3055\u3044\u3002\n\u3072\u3068\u307E\u3068\u307E\u308A\u306E\u7B87\u6761\u66F8\u304D\u3067\u306F\u3001\u656C\u4F53\u3068\u5E38\u4F53\u3092\u6DF7\u5728\u3055\u305B\u307E\u305B\u3093\u3002\n"'.concat(
                        match.value,
                        '"\u304C\u656C\u4F53(\u3067\u3059\u307E\u3059\u8ABF)\u3067\u3059\u3002'
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
    } // 末尾に。があるかが統一されているのチェック

    function countingPoint(withPointList, withoutPointList) {
        if (withPointList.length === 0 || withoutPointList.length === 0) {
            return;
        }

        if (withPointList.length > withoutPointList.length) {
            // 。ありに統一
            reportPointResult(withoutPointList, {
                shouldUsePoint: true
            });
        } else if (withPointList.length < withoutPointList.length) {
            // 。なしに統一
            reportPointResult(withPointList, {
                shouldUsePoint: false
            });
        } else {
            // 。ありに統一
            reportPointResult(withoutPointList, {
                shouldUsePoint: true
            });
        }
    } // 敬体(ですます調)あるいは常体(である調)なのかのチェック

    function countingDesumasuDearu(desumasuList, dearuList) {
        var desumasuCount = desumasuList.reduce((count, _ref4) => {
            var { matches } = _ref4;
            return count + matches.length;
        }, 0);
        var dearuCount = dearuList.reduce((count, _ref5) => {
            var { matches } = _ref5;
            return count + matches.length;
        }, 0);

        if (desumasuCount === 0 || dearuCount === 0) {
            return;
        } // ですます優先

        if (desumasuCount > dearuCount) {
            reportDesumaruDearuResult(dearuList, {
                desumasu: true
            });
        } else if (desumasuCount < dearuCount) {
            // である優先
            reportDesumaruDearuResult(desumasuList, {
                dearu: true
            });
        } else {
            // 同等の場合はですます優先
            reportDesumaruDearuResult(dearuList, {
                desumasu: true
            });
        }
    }

    return {
        [Syntax.List](node) {
            resetList();
        },

        [Syntax.ListItem](node) {
            var text = getSource(node); // 末尾に。があるかが統一されているのチェック

            var matchPointReg = /。(\s*?)$/;

            if (matchPointReg.test(text)) {
                // 。あり
                withPointList.push(node);
            } else {
                // 。なし
                withoutPointList.push(node);
            } // 敬体(ですます調)あるいは常体(である調)なのかのチェック

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

        ["".concat(Syntax.List, ":exit")](node) {
            countingPoint(withPointList, withoutPointList);
            countingDesumasuDearu(desumasuList, dearuList);
        }
    };
};
//# sourceMappingURL=1.1.3.js.map
