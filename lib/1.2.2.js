// LICENSE : MIT
"use strict";

var _nodeUtil = require("./util/node-util");

/*
1.2.2. ピリオド(.)とカンマ(,)
欧文で表記する組織名などの固有名詞や数字にピリオド(.)やカンマ(,)が含まれる場合は、和文中でもピリオド(.)とカンマ(,)を使用します。
いずれの場合も半角で表記します。「4.1.3 ピリオド(.)、カンマ(,)」を参照してく ださい。
 */
// . => 。 の置換マップ
var replaceSymbol = {
    "．": ".",
    "，": ","
};

function report(context) {
    var { Syntax, RuleError, fixer, report, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // 1.2.2. ピリオド(.)とカンマ(,)

            if (/[．，]/.test(text)) {
                var index = text.search(/[．，]/);
                var symbol = replaceSymbol[text[index]];
                report(
                    node,
                    new RuleError("全角のピリオドとカンマは使用しません。", {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + 1], symbol)
                    })
                );
            }
        }
    };
}

module.exports = {
    linter: report,
    fixer: report
};
//# sourceMappingURL=1.2.2.js.map
