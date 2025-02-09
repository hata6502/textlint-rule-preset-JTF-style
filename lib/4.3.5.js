// LICENSE : MIT
"use strict";
/*
4.3.5.二重引用符""
引用や語句を強調する場合に使用します。和文では多用しません。
 */

var _pairChecker = require("./util/pair-checker");

module.exports = function(context) {
    return (0, _pairChecker.checkPair)(context, {
        left: '"',
        right: '"'
    });
};
//# sourceMappingURL=4.3.5.js.map
