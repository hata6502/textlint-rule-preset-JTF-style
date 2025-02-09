// LICENSE : MIT
"use strict";
/*
2.1.2.漢字
漢字は「全角」で表記します。漢字の使用は、平成 22 年 11 月 30 日内閣告示第 2 号の「常用漢字表」に原則として準じます。
ただし、「常用漢字表」にない漢字であっても実務翻訳で慣用的に用いられる語には漢字を使います。
 */

var _nodeUtil = require("./util/node-util");

var _sortedJoyoKanji = require("sorted-joyo-kanji");

var _regexp = require("./util/regexp");

// http://qiita.com/YusukeHirao/items/2f0fb8d5bbb981101be0
function stringToArray(value) {
    return value.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\uD800-\uDFFF]/g) || [];
}

module.exports = function(context) {
    var { Syntax, RuleError, report, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node);
            var strArray = stringToArray(text);

            for (var index = 0; index < strArray.length; index++) {
                var item = strArray[index];

                if (_regexp.kanjiRegExp.test(item) && !(0, _sortedJoyoKanji.isJoyo)(item)) {
                    report(
                        node,
                        new RuleError("「" + item + "」は「常用漢字表」外の漢字です。", {
                            index
                        })
                    );
                }
            }
        }
    };
};
//# sourceMappingURL=2.1.2.js.map
