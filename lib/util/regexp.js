// LICENSE : MIT
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hanKarakanaRegExp = exports.karakanaRegExp = exports.hiraganaRegExp = exports.kanjiRegExp = exports.japaneseRegExp = void 0;
var japaneseRegExp = /(?:[々〇〻\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ])/; // http://tama-san.com/kanji-regex/ ベース
// "々" は 記号であるため除外
// https://github.com/textlint-ja/textlint-rule-preset-jtf-style/issues/48

exports.japaneseRegExp = japaneseRegExp;
var kanjiRegExp = /(?:[〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF])/;
exports.kanjiRegExp = kanjiRegExp;
var hiraganaRegExp = /[ぁ-ん]/;
exports.hiraganaRegExp = hiraganaRegExp;
var karakanaRegExp = /[ァ-ヶ]/; // 半角カタカナ

exports.karakanaRegExp = karakanaRegExp;
var hanKarakanaRegExp = /[\uFF65-\uFF9F]/;
exports.hanKarakanaRegExp = hanKarakanaRegExp;
//# sourceMappingURL=regexp.js.map
