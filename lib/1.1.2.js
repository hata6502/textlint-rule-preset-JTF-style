// LICENSE : MIT
"use strict";
/*
1.1.2.見出し

本文が敬体であっても、見出しには常体や体言止めを使います。
一般向けのマニュアルでは、「~には」や「~とは」などの助詞で止める文形も使います。
見出しの文末には、句点(。)を付けません。

# Header

のみをサポート

Header
=======

は無視する
 */

var _nodeUtil = require("./util/node-util");

function mixer(context) {
    var { Syntax, RuleError, report, getSource, fixer } = context;
    return {
        [Syntax.Header](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // Headerの末尾には。をつけない

            var matchReg = /。(\s*?)$/;
            var index = text.search(matchReg);

            if (index !== -1) {
                report(
                    node,
                    new RuleError("見出しの文末には、句点(。)を付けません。", {
                        index: index,
                        fix: fixer.removeRange([index, index + 1])
                    })
                );
            } // TODO: いずれの場合も、すべての見出しを通して複数の文体をできるだけ混在させないことが重要です。
        }
    };
}

module.exports = {
    linter: mixer,
    fixer: mixer
};
//# sourceMappingURL=1.1.2.js.map
