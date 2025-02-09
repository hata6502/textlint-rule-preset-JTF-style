// LICENSE : MIT
"use strict";

module.exports = function mergeMatches() {
    var results = [];

    for (var _len = arguments.length, aMatches = new Array(_len), _key = 0; _key < _len; _key++) {
        aMatches[_key] = arguments[_key];
    }

    aMatches.forEach(matches => {
        matches.forEach(targetMatch => {
            var alreadyHave = results.some(match => {
                var { text, index } = match;
                return targetMatch.index === index && targetMatch.text === text;
            });

            if (!alreadyHave) {
                results.push(targetMatch);
            }
        });
    });
    return results;
};
//# sourceMappingURL=merge-matches.js.map
