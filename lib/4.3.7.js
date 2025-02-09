// LICENSE : MIT
"use strict";
/*
4.3.7.山かっこ<>
原則として和文では使用しません。
原文で山かっこが使用されており、原文どおりに使用する必要がある場合のみ使用します。
 */

var _pairChecker = require("./util/pair-checker");

module.exports = function(context) {
    return (0, _pairChecker.checkPair)(context, {
        left: "<",
        right: ">"
    });
};
//# sourceMappingURL=4.3.7.js.map
