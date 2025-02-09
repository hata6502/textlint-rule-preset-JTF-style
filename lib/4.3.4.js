// LICENSE : MIT
"use strict";
/*
4.3.4.二重かぎかっこ『』
文献の題を示す場合や、かぎかっこの中にさらにかぎかっこを入れる場合に使用します。
 */

var _pairChecker = require("./util/pair-checker");

module.exports = function(context) {
    return (0, _pairChecker.checkPair)(context, {
        left: "『",
        right: "』"
    });
};
//# sourceMappingURL=4.3.4.js.map
