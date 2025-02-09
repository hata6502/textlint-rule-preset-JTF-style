// LICENSE : MIT
"use strict";

var _nodeUtil = require("./util/node-util");

var _japaneseNumeralsToNumber = _interopRequireDefault(require("japanese-numerals-to-number"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function matchToReplace(text, pattern, matchFn) {
    var match = pattern.exec(text);

    if (match) {
        return matchFn(text, pattern, match);
    }

    return null;
} // http://www.drk7.jp/MT/archives/001587.html

function _num2ja(num, opt) {
    var sign = {
        "+": "",
        "-": "−"
    };
    var zero = "零";
    var point = "点";
    var zero2nine = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var ten2thou = ["", "十", "百", "千"];
    var suffices = [
        "",
        "万",
        "億",
        "兆",
        "京",
        "垓",
        "禾予",
        "穣",
        "溝",
        "澗",
        "正",
        "載,",
        "極",
        "恒河沙",
        "阿僧祇",
        "那由他",
        "不可思議",
        "無量大数"
    ];
    num = num.replace(/,/g, "");
    num.match(/([+-])?(\d+)(?:\.(\d+))?/i);
    var sig = RegExp.$1;
    var int = RegExp.$2;
    var fract = RegExp.$3;
    var seisuu = "";
    var shins = [];

    for (var i = int.length; i > 0; i -= 4) {
        shins.push(int.substring(i, i - 4));
    }

    if (shins.length >= 18) {
        return suffices[17];
    }

    var suffix = 0;

    for (var _i = 0; _i < shins.length; _i++) {
        var shin = shins[_i];

        if (shin == "0000") {
            suffix++;
            continue;
        }

        var sens = "";
        var keta = 0;
        var digits = shin.split("").reverse();

        for (var j = 0; j < digits.length; j++) {
            var digit = digits[j];

            if (opt["fixed4"] || opt["with_arabic"]) {
                if (opt["with_arabic"]) {
                    var flg = 0; // 余分な 0 を削除する

                    if (digit == "0") {
                        for (var k = j + 1; k < digits.length; k++) {
                            flg += digits[k] == "0" ? 0 : 1;
                        }

                        if (flg == 0) {
                            digit = "";
                        }
                    }

                    sens = digit + sens;
                } else {
                    sens = zero2nine[digit] + sens;
                }
            } else {
                var suuji = digit == 1 && !opt["p_one"] && keta > 0 ? "" : zero2nine[digit];

                if (digit != 0) {
                    sens = suuji + ten2thou[keta] + sens;
                }
            }

            keta++;
        }

        seisuu = sens + suffices[suffix++] + seisuu;
    }

    var result = (sign[sig] || "") + seisuu;
    result = result || zero;

    if (fract) {
        result = result + point + fract;
    }

    return result;
}

function reporter(context) {
    var { Syntax, RuleError, report, fixer, getSource } = context;
    return {
        [Syntax.Str](node) {
            if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
                return;
            }

            var text = getSource(node); // 漢数字 -> 算用数字

            var toNumber = (text, pattern, match) => {
                var matchedString = match[0];
                var index = match.index;
                var expected = matchedString.replace(pattern, function(all, match) {
                    return all.replace(match, (0, _japaneseNumeralsToNumber.default)(match));
                });
                var ruleError = new RuleError(
                    ""
                        .concat(matchedString, " => ")
                        .concat(
                            expected,
                            "\n\u6570\u91CF\u3092\u8868\u73FE\u3057\u3001\u6570\u3092\u6570\u3048\u3089\u308C\u308B\u3082\u306E\u306F\u7B97\u7528\u6570\u5B57\u3092\u4F7F\u7528\u3057\u307E\u3059\u3002\u4EFB\u610F\u306E\u6570\u306B\u7F6E\u304D\u63DB\u3048\u3066\u3082\u901A\u7528\u3059\u308B\u8A9E\u53E5\u304C\u3053\u308C\u306B\u8A72\u5F53\u3057\u307E\u3059\u3002"
                        ),
                    {
                        index: index,
                        fix: fixer.replaceTextRange([index, index + matchedString.length], expected)
                    }
                );
                report(node, ruleError);
            };
            /**
             * 算用数字 -> 漢数字
             * @param {string} text
             * @param {RegExp} pattern
             * @param {*[]} match
             */

            var toKanNumber = (text, pattern, match) => {
                var matchedString = match[0];
                var expected = matchedString.replace(pattern, function(all, match) {
                    return all.replace(
                        match,
                        _num2ja(match, {
                            with_arabic: false
                        })
                    );
                });
                var index = match.index;
                report(
                    node,
                    new RuleError(
                        ""
                            .concat(matchedString, " => ")
                            .concat(
                                expected,
                                "\n\u6163\u7528\u7684\u8868\u73FE\u3001\u719F\u8A9E\u3001\u6982\u6570\u3001\u56FA\u6709\u540D\u8A5E\u3001\u526F\u8A5E\u306A\u3069\u3001\u6F22\u6570\u5B57\u3092\u4F7F\u7528\u3059\u308B\u3053\u3068\u304C\u4E00\u822C\u7684\u306A\u8A9E\u53E5\u3067\u306F\u6F22\u6570\u5B57\u3092\u4F7F\u3044\u307E\u3059\u3002"
                            ),
                        {
                            index: index,
                            fix: fixer.replaceTextRange([index, index + matchedString.length], expected)
                        }
                    )
                );
            }; // ignorePatternにマッチしたらmatchFnを呼ばないようにする(エラーを無視する)

            var ignoreWhenMatched = (ignorePatterns, matchFn) => {
                return (text, pattern, match) => {
                    if (ignorePatterns.some(p => p.test(text))) {
                        return null;
                    } else {
                        return matchFn(text, pattern, match);
                    }
                };
            }; // ＊数えられる数字は算用数字を使う
            // 数十万、数百億にマッチしないように"数"という文字から始まるものは除外
            // https://github.com/textlint-ja/textlint-rule-preset-jtf-style/pull/23

            matchToReplace(
                text,
                /([一二三四五六七八九十壱弐参拾百〇]+)[兆億万]/g,
                ignoreWhenMatched([/(数|何)([一二三四五六七八九十壱弐参拾百〇]+)[兆億万]/g], toNumber)
            );
            matchToReplace(
                text,
                /([一二三四五六七八九十壱弐参拾百〇]+)つ/g,
                ignoreWhenMatched(
                    [
                        /[一二三四五六七八九]つ(返事|子|ひとつ|星|編|葉|橋|と[無な]い|に一つ)/g,
                        /(ただ|唯|[女男]手|穴|瓜|馬鹿の)[一二]つ/g
                    ],
                    toNumber
                )
            );
            matchToReplace(text, /([一二三四五六七八九十壱弐参拾百〇]+)回/g, toNumber);
            matchToReplace(text, /([一二三四五六七八九十壱弐参拾百〇]+)か月/g, toNumber);
            matchToReplace(text, /([一二三四五六七八九十壱弐参拾百〇]+)番目/g, toNumber);
            matchToReplace(text, /([一二三四五六七八九十壱弐参拾百〇]+)進法/g, toNumber);
            matchToReplace(text, /([一二三四五六七八九十壱弐参拾百〇]+)次元/g, toNumber);
            matchToReplace(text, /第([一二三四五六七八九十壱弐参拾百〇]+)章/g, toNumber);
            matchToReplace(text, /第([一二三四五六七八九十壱弐参拾百〇]+)節/g, toNumber); // ＊漢数字を使う
            // 慣用的表現、熟語、概数、固有名詞、副詞など、漢数字を使用することが一般的な語句では漢数字を使います。

            matchToReplace(text, /世界(1)/g, toKanNumber);
            matchToReplace(text, /(1)時的/g, toKanNumber);
            matchToReplace(text, /(1)部分/g, toKanNumber);
            matchToReplace(text, /第(3)者/g, toKanNumber); // 1種 -> 一種: 11種類などにはマッチしない

            matchToReplace(text, /[^\d](1)種(?!類)/g, toKanNumber);
            matchToReplace(text, /(1)部の/g, toKanNumber);
            matchToReplace(text, /(1)番に/g, toKanNumber);
            matchToReplace(text, /数(10+)倍/g, toKanNumber);
            matchToReplace(text, /数(10+)[兆億万]/g, toKanNumber);
            matchToReplace(text, /数(10+)年/g, toKanNumber);
            matchToReplace(text, /([0-9]+)次関数/g, toKanNumber);
            matchToReplace(text, /(5)大陸/g, toKanNumber);
        }
    };
} // 2.2.2. 算用数字と漢数字の使い分け

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=2.2.2.js.map
