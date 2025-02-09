// LICENSE : MIT
"use strict";
/*
2.1.5.カタカナ
カタカナは「全角」で表記します。
半角カタカナは特殊な用途を除いて、原則として使いません。

Halfwidth Katakana variants（半角片仮名）
\uFF65-\uFF9F とする
http://www.asahi-net.or.jp/~ax2s-kmtn/ref/unicode/uff00.html
 */

var _nodeUtil = require("./util/node-util");

var _textlintRulePrh = _interopRequireDefault(require("textlint-rule-prh"));

var _path = _interopRequireDefault(require("path"));

var _matchIndex = require("match-index");

var _moji = _interopRequireDefault(require("moji"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * 半角カタカナを全角カタカナに変換
 *
 * @param {String} str 変換したい文字列
 */
function toZenkaku(string) {
    return (0, _moji.default)(string)
        .convert("HK", "ZK")
        .toString();
}

function reporter(context) {
    var { Syntax, RuleError, fixer, report, getSource } = context; // 辞書ベースのカタカタ表記のチェックを行う

    var dictRule = _textlintRulePrh.default.fixer(context, {
        ruleContents: [
            "# This dictionary is based on http://www.jtf.jp/jp/style_guide/jtfstylechecker.html\n# \u30C6\u30AF\u30CB\u30AB\u30EB\u30B3\u30DF\u30E5\u30CB\u30B1\u30FC\u30BF\u30FC\u5354\u4F1A> \u5916\u6765\u8A9E\uFF08\u30AB\u30BF\u30AB\u30CA\uFF09\u8868\u8A18\u30AC\u30A4\u30C9\u30E9\u30A4\u30F3 http://www.jtca.org/standardization/\n# TODO: [WIP] not complete\nversion: 1\nrules:\n  - expected: \u30A2\u30B8\u30A2\n    patterns: \u30A2\u30B8\u30E4\n\n  - expected: \u30A2\u30C8\u30E9\u30F3\u30C6\u30A3\u30C3\u30AF\n    patterns: \u30A2\u30C8\u30E9\u30F3\u30C1\u30C3\u30AF\n\n  - expected: \u30A2\u30D9\u30EC\u30FC\u30B8\n    patterns: \u30A2\u30F4\u30A7\u30EC\u30FC\u30B8\n\n  - expected: \u30A2\u30D9\u30EC\u30FC\u30B8\n    patterns: \u30A2\u30D9\u30EC\u30A4\u30B8\n\n  - expected: \u30A2\u30F3\u30C1\n    patterns: \u30A2\u30F3\u30C6\u30A3\n\n  - expected: \u30A2\u30F3\u30C6\u30A3\u30FC\u30AF\n    patterns: \u30A2\u30F3\u30C1\u30FC\u30AF\n\n  - expected: \u30A2\u30F3\u30E2\u30CB\u30A2\n    patterns: \u30A2\u30F3\u30E2\u30CB\u30E4\n\n  - expected: \u30A4\u30BF\u30EA\u30A2\n    patterns: \u30A4\u30BF\u30EA\u30E4\n\n  - expected: \u30A4\u30CB\u30B7\u30A2\u30C1\u30D6\n    patterns: \u30A4\u30CB\u30B7\u30A2\u30C6\u30A3\u30D6\n\n  - expected: \u30A4\u30D9\u30F3\u30C8\n    patterns: \u30A4\u30F4\u30A7\u30F3\u30C8\n\n  - expected: \u30A4\u30DF\u30C6\u30FC\u30B7\u30E7\u30F3\n    patterns: \u30A4\u30DF\u30C6\u30A4\u30B7\u30E7\u30F3\n\n  - expected: \u30A4\u30E4\u30DB\u30F3\n    patterns: \u30A4\u30A2\u30DB\u30F3\n\n  - expected: \u30A4\u30E4\u30DB\u30F3\n    patterns: \u30A4\u30E4\u30D5\u30A9\u30F3\n\n  - expected: \u30A4\u30F3\u30B8\u30B1\u30FC\u30BF\u30FC\n    patterns: \u30A4\u30F3\u30C7\u30A3\u30B1\u30FC\u30BF\n\n  - expected: \u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30A4\u30B9\n    patterns: \u30A4\u30F3\u30BF\u30D5\u30A7\u30A4\u30B9\n\n  - expected: \u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30A4\u30B9\n    patterns: \u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30FC\u30B9\n\n  - expected: \u30A4\u30F3\u30BF\u30FC\u30D5\u30A7\u30A4\u30B9\n    patterns: \u30A4\u30F3\u30BF\u30D5\u30A7\u30FC\u30B9\n\n  - expected: \u30A4\u30F3\u30BF\u30FC\u30DB\u30F3\n    patterns: \u30A4\u30F3\u30BF\u30FC\u30D5\u30A9\u30F3\n\n  - expected: \u30A4\u30F3\u30D5\u30A9\u30E1\u30FC\u30B7\u30E7\u30F3\n    patterns: \u30A4\u30F3\u30DB\u30E1\u30FC\u30B7\u30E7\u30F3\n\n  - expected: \u30A6\u30A7\u30A2\n    patterns: \u30A6\u30A8\u30A2\n\n  - expected: \u30A8\u30B8\u30BD\u30F3\n    patterns: \u30A8\u30C7\u30A3\u30BD\u30F3\n\n  - expected: \u30A8\u30B9\u30AB\u30EC\u30FC\u30BF\u30FC\n    patterns: \u30A8\u30B9\u30AB\u30EC\u30A4\u30BF\n\n  - expected: \u30A8\u30E9\u30FC\n    patterns: \u30A8\u30E9\u30A2\n\n  - expected: \u30A8\u30EC\u30D9\u30FC\u30BF\u30FC\n    patterns: \u30A8\u30EC\u30D9\u30A4\u30BF\n\n  - expected: \u30AA\u30FC\u30C7\u30A3\u30AA\n    patterns: \u30AA\u30A6\u30C7\u30A3\u30AA\n\n  - expected: \u30AA\u30FC\u30C8\u30DE\u30C1\u30C3\u30AF\n    patterns: \u30AA\u30FC\u30C8\u30DE\u30C1\u30C3\u30AF\n\n  - expected: \u30AA\u30FC\u30CA\u30FC\n    patterns: \u30AA\u30A6\u30CA\u30FC\n\n  - expected: \u30AA\u30FC\u30D0\u30FC\n    patterns: \u30AA\u30A6\u30D0\u30FC\n\n  - expected: \u30AA\u30FC\u30D0\u30FC\u30B3\u30FC\u30C8\n    patterns: \u30AA\u30A6\u30D0\u30FC\u30B3\u30FC\u30C8\n\n  - expected: \u30AB\u30D0\u30FC\n    patterns: \u30AB\u30D0\u30A2\n\n  - expected: \u30AB\u30D5\u30A7\u30C6\u30EA\u30A2\n    patterns: \u30AB\u30D5\u30A7\u30C6\u30EA\u30E4\n\n  - expected: \u30AB\u30E9\u30FC\n    patterns: \u30AB\u30E9\u30A2\n\n  - expected: \u30AE\u30A2\n    patterns: \u30AE\u30E4\n\n  - expected: \u30AD\u30FC\n    patterns: \u30AD\u30A4\n\n  - expected: \u30AD\u30E3\u30E9\u30D0\u30F3\n    patterns: \u30AD\u30E3\u30E9\u30F4\u30A1\u30F3\n\n  - expected: \u30B0\u30E9\u30D3\u30A2\n    patterns: \u30B0\u30E9\u30D3\u30E4\n\n  - expected: \u30AF\u30EA\u30A8\u30FC\u30C6\u30A3\u30D6\n    patterns: \u30AF\u30EA\u30A8\u30A4\u30C6\u30A3\u30D6\n\n  - expected: \u30B1\u30A2\n    patterns: \u30B1\u30A2\u30FC\n\n  - expected: \u30B1\u30FC\u30B9\n    patterns: \u30B1\u30A4\u30B9\n\n  - expected: \u30B2\u30FC\u30E0\n    patterns: \u30B2\u30A4\u30E0\n\n  - expected: \u30B3\u30D4\u30FC\n    patterns: \u30B3\u30D4\u30A4\n\n  - expected: \u30B3\u30F3\u30C7\u30A3\u30B7\u30E7\u30F3\n    patterns: \u30B3\u30F3\u30C7\u30B7\u30E7\u30F3\n\n  - expected: \u30B5\u30FC\u30D3\u30B9\n    patterns: \u30B5\u30FC\u30F4\u30A3\u30B9\n\n  - expected: \u30B5\u30FC\u30D9\u30A4\n    patterns: \u30B5\u30FC\u30F4\u30A7\u30A4\n\n  - expected: \u30B5\u30E9\u30C0\u30DC\u30A6\u30EB\n    patterns: \u30B5\u30E9\u30C0\u30DC\u30FC\u30EB\n\n  - expected: \u30B7\u30A7\u30FC\u30C9\n    patterns: \u30B7\u30A7\u30A4\u30C9\n\n  - expected: \u30B8\u30D5\u30C6\u30EA\u30A2\n    patterns: \u30B8\u30D5\u30C6\u30EA\u30E4\n\n  - expected: \u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\n    patterns: \u30B7\u30DF\u30E5\u30EC\u30A4\u30B7\u30E7\u30F3\n\n  - expected: \u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\n    patterns: \u30B7\u30E5\u30DF\u30EC\u30FC\u30B7\u30E7\u30F3\n\n  - expected: \u30B7\u30DF\u30E5\u30EC\u30FC\u30BF\u30FC\n    patterns: \u30B7\u30E5\u30DF\u30EC\u30FC\u30BF\n\n  - expected: \u30B7\u30E7\u30FC\n    patterns: \u30B7\u30E7\u30A6\n\n  - expected: \u30B9\u30FC\u30D1\u30FC\n    patterns: \u30B9\u30FC\u30D1\u30A2\n\n  - expected: \u30B9\u30B1\u30FC\u30EB\n    patterns: \u30B9\u30B1\u30A4\u30EB\n\n  - expected: \u30B9\u30BF\u30B8\u30A2\u30E0\n    patterns: \u30B9\u30BF\u30C7\u30A3\u30A2\u30E0\n\n  - expected: \u30B9\u30C8\u30A2\n    patterns: \u30B9\u30C8\u30A2\u30FC\n\n  - expected: \u30B9\u30DA\u30FC\u30B9\n    patterns: \u30B9\u30DA\u30A4\u30B9\n\n  - expected: \u30B9\u30EA\u30C3\u30D1\n    patterns: \u30B9\u30EA\u30C3\u30D1\u30FC\n\n  - expected: \u30BB\u30FC\u30D5\u30C6\u30A3\u30FC\n    patterns: \u30BB\u30A4\u30D5\u30C6\u30A3\u30FC\n\n  - expected: \u30BB\u30D4\u30A2\n    patterns: \u30BB\u30D4\u30E4\n\n  - expected: \u30BB\u30ED\u30CF\u30F3\n    patterns: \u30BB\u30ED\u30D5\u30A1\u30F3\n\n  - expected: \u30BD\u30D5\u30C8\u30A6\u30A7\u30A2\n    patterns: \u30BD\u30D5\u30C8\u30A6\u30A8\u30A2\n\n  - expected: \u30BF\u30A4\u30E4\n    patterns: \u30BF\u30A4\u30A2\n\n  - expected: \u30C0\u30A4\u30E4\u30B0\u30E9\u30E0\n    patterns: \u30C0\u30A4\u30A2\u30B0\u30E9\u30E0\n\n  - expected: \u30C0\u30A4\u30E4\u30E2\u30F3\u30C9\n    patterns: \u30C0\u30A4\u30A2\u30E2\u30F3\u30C9\n\n  - expected: \u30C0\u30A4\u30E4\u30E9\u30FC\n    patterns: \u30C0\u30A4\u30A2\u30E9\n\n  - expected: \u30C0\u30A4\u30E4\u30EB\n    patterns: \u30C0\u30A4\u30A2\u30EB\n\n  - expected: \u30C0\u30DF\u30FC\n    patterns: \u30C0\u30DF\u30A4\n\n  - expected: \u30C1\u30A2\u30DF\u30F3\n    patterns: \u30C6\u30A3\u30A2\u30DF\u30F3\n\n  - expected: \u30C1\u30A7\u30FC\u30F3\n    patterns: \u30C1\u30A7\u30A4\u30F3\n\n  - expected: \u30C1\u30B1\u30C3\u30C8\n    patterns: \u30C6\u30A3\u30B1\u30C3\u30C8\n\n  - expected: \u30C1\u30C3\u30D7\n    patterns: \u30C6\u30A3\u30C3\u30D7\n\n  - expected: \u30C7\u30A3\u30B9\u30AB\u30C3\u30B7\u30E7\u30F3\n    patterns: \u30C7\u30B9\u30AB\u30C3\u30B7\u30E7\u30F3\n\n  - expected: \u30C7\u30A3\u30B9\u30AB\u30D0\u30EA\u30FC\n    patterns: \u30C7\u30B9\u30AB\u30D0\u30EA\n\n  - expected: \u30C7\u30A3\u30BA\u30CB\u30FC\n    patterns: \u30C7\u30BA\u30CB\u30FC\n\n  - expected: \u30C7\u30A3\u30B9\u30D7\u30EC\u30FC\n    patterns: \u30C7\u30A3\u30B9\u30D7\u30EC\u30A4\n\n  - expected: \u30C7\u30A3\u30B9\u30D7\u30EC\u30FC\n    patterns: \u30C7\u30B9\u30D7\u30EC\u30FC\n\n  - expected: \u30C7\u30A3\u30B9\u30D7\u30EC\u30FC\n    patterns: \u30C7\u30B9\u30D7\u30EC\u30A4\n\n  - expected: \u30C7\u30B8\u30BF\u30EB\n    patterns: \u30C7\u30A3\u30B8\u30BF\u30EB\n\n  - expected: \u30C6\u30EC\u30D5\u30A9\u30F3\u30B5\u30FC\u30D3\u30B9\n    patterns: \u30C6\u30EC\u30DB\u30F3\u30B5\u30FC\u30D3\u30B9\n\n  - expected: \u30C9\u30A2\n    patterns: \u30C9\u30A2\u30FC\n\n  - expected: \u30C8\u30CA\u30FC\n    patterns: \u30C8\u30CA\u30A2\n\n  - expected: \u30C9\u30E1\u30A4\u30F3\n    patterns: \u30C9\u30E1\u30FC\u30F3\n\n  - expected: \u30C8\u30E9\u30A4\u30A2\u30EB\n    patterns: \u30C8\u30E9\u30A4\u30E4\u30EB\n\n  - expected: \u30C9\u30EA\u30A2\n    patterns: \u30C9\u30EA\u30E4\n\n  - expected: \u30C8\u30EC\u30FC\u30CA\u30FC\n    patterns: \u30C8\u30EC\u30A4\u30CA\u30FC\n\n  - expected: \u30CB\u30E5\u30FC\u30C8\u30F3\n    patterns: \u30CB\u30E5\u30A6\u30C8\u30F3\n\n  - expected: \u30CD\u30FC\u30C1\u30E3\u30FC\n    patterns: \u30CD\u30A4\u30C1\u30E3\u30FC\n\n  - expected: \u30CD\u30FC\u30E0\n    patterns: \u30CD\u30A4\u30E0\n\n  - expected: \u30CD\u30AC\u30C6\u30A3\u30D6\n    patterns: \u30CD\u30AC\u30C6\u30A3\u30F4\n\n  - expected: \u30D0\u30FC\u30B8\u30E7\u30F3\n    patterns: \u30F4\u30A1\u30FC\u30B8\u30E7\u30F3\n\n  - expected: \u30CF\u30FC\u30C9\u30A6\u30A7\u30A2\n    patterns: \u30CF\u30FC\u30C9\u30A6\u30A8\u30A2\n\n  - expected: \u30D0\u30A4\u30A2\u30B9\n    patterns: \u30D0\u30A4\u30E4\u30B9\n\n  - expected: \u30D0\u30A4\u30AA\u30EA\u30F3\n    patterns: \u30F4\u30A1\u30A4\u30AA\u30EA\u30F3\n\n  - expected: \u30D0\u30AF\u30C6\u30EA\u30A2\n    patterns: \u30D0\u30AF\u30C6\u30EA\u30E4\n\n  - expected: \u30D0\u30CB\u30E9\n    patterns: \u30F4\u30A1\u30CB\u30E9\n\n  - expected: \u30D0\u30EA\u30A8\u30FC\u30B7\u30E7\u30F3\n    patterns: \u30F4\u30A1\u30EA\u30A8\u30FC\u30B7\u30E7\u30F3\n\n  - expected: \u30D0\u30EB\u30D6\n    patterns: \u30F4\u30A1\u30EB\u30D6\n\n  - expected: \u30D0\u30EC\u30A8\n    patterns: \u30D0\u30EC\u30FC\n\n  - expected: \u30CF\u30F3\u30C1\u30F3\u30B0\n    patterns: \u30CF\u30F3\u30C6\u30A3\u30F3\u30B0\n\n  - expected: \u30D4\u30A2\u30CE\n    patterns: \u30D4\u30E4\u30CE\n\n  - expected: \u30D3\u30B8\u30FC\n    patterns: \u30D3\u30B8\u30A4\n\n  - expected: \u30D3\u30C7\u30AA\n    patterns: \u30F4\u30A3\u30C7\u30AA\n\n  - expected: \u30D3\u30EA\u30E4\u30FC\u30C9\n    patterns: \u30D3\u30EA\u30A2\u30FC\u30C9\n\n  - expected: \u30D5\u30A1\u30F3\u30BF\u30B9\u30C6\u30A3\u30C3\u30AF\n    patterns: \u30D5\u30A1\u30F3\u30BF\u30B9\u30C1\u30C3\u30AF\n\n  - expected: \u30D5\u30A9\u30FC\u30AF\u30C0\u30F3\u30B9\n    patterns: \u30DB\u30FC\u30AF\u30C0\u30F3\u30B9\n\n  - expected: \u30D5\u30A9\u30EB\u30C0\u30FC\n    patterns: \u30DB\u30EB\u30C0\u30FC\n\n  - expected: \u30D5\u30A9\u30EF\u30FC\u30C9\n    patterns: \u30DB\u30EF\u30FC\u30C9\n\n  - expected: \u30D7\u30E9\u30B9\u30C1\u30C3\u30AF\n    patterns: \u30D7\u30E9\u30B9\u30C6\u30A3\u30C3\u30AF\n\n  - expected: \u30D7\u30E9\u30C3\u30C8\u30DB\u30FC\u30E0\n    patterns: \u30D7\u30E9\u30C3\u30C8\u30D5\u30A9\u30FC\u30E0\n\n  - expected: \u30D7\u30EC\u30FC\u30E4\u30FC\n    patterns: \u30D7\u30EC\u30A4\u30E4\u30FC\n\n  - expected: \u30DA\u30FC\u30B8\n    patterns: \u30DA\u30A4\u30B8\n\n  - expected: \u30DA\u30FC\u30D1\u30FC\n    patterns: \u30DA\u30A4\u30D1\u30FC\n\n  - expected: \u30D9\u30FC\u30EB\n    patterns: \u30F4\u30A7\u30FC\u30EB\n\n  - expected: \u30D9\u30C6\u30E9\u30F3\n    patterns: \u30F4\u30A7\u30C6\u30E9\u30F3\n\n  - expected: \u30D9\u30CB\u30E4\n    patterns: \u30D9\u30CB\u30A2\n\n  - expected: \u30DC\u30FC\u30AB\u30EB\n    patterns: \u30F4\u30A9\u30FC\u30AB\u30EB\n\n  - expected: \u30DC\u30E9\u30F3\u30C6\u30A3\u30A2\n    patterns: \u30F4\u30A9\u30E9\u30F3\u30C6\u30A3\u30A2\n\n  - expected: \u30DC\u30E9\u30F3\u30C6\u30A3\u30A2\n    patterns: \u30DC\u30E9\u30F3\u30C6\u30A3\u30E4\n\n  - expected: \u30DC\u30EA\u30E5\u30FC\u30E0\n    patterns: \u30F4\u30A9\u30EA\u30E5\u30FC\u30E0\n\n  - expected: \u30DB\u30EB\u30DE\u30EA\u30F3\n    patterns: \u30D5\u30A9\u30EB\u30DE\u30EA\u30F3\n\n  - expected: \u30DE\u30EB\u30C1\n    patterns: \u30DE\u30EB\u30C6\u30A3\n\n  - expected: \u30DF\u30E9\u30FC\n    patterns: \u30DF\u30E9\u30A2\n\n  - expected: \u30E1\u30A4\u30F3\n    patterns: \u30E1\u30FC\u30F3\n\n  - expected: \u30E1\u30FC\u30AB\u30FC\n    patterns: \u30E1\u30A4\u30AB\u30FC\n\n  - expected: \u30E1\u30FC\u30EB\n    patterns: \u30E1\u30A4\u30EB\n\n  - expected: \u30E1\u30AC\u30DB\u30F3\n    patterns: \u30E1\u30AC\u30D5\u30A9\u30F3\n\n  - expected: \u30E1\u30C3\u30BB\u30FC\u30B8\n    patterns: \u30E1\u30C3\u30BB\u30A4\u30B8\n\n  - expected: \u30E1\u30C7\u30A3\u30A2\n    patterns: \u30E1\u30C7\u30A3\u30E4\n\n  - expected: \u30E1\u30F3\u30C6\u30CA\u30F3\u30B9\n    patterns: \u30E1\u30A4\u30F3\u30C6\u30CA\u30F3\u30B9\n\n  - expected: \u30E2\u30EB\u30D2\u30CD\n    patterns: \u30E2\u30EB\u30D5\u30A3\u30CD\n\n  - expected: \u30E6\u30CB\u30D0\u30FC\u30B5\u30EB\n    patterns: \u30E6\u30CB\u30F4\u30A1\u30FC\u30B5\u30EB\n\n  - expected: \u30E6\u30CB\u30D5\u30A9\u30FC\u30E0\n    patterns: \u30E6\u30CB\u30DB\u30FC\u30E0\n\n  - expected: \u30E9\u30B8\u30A2\u30EB\n    patterns: \u30E9\u30B8\u30E4\u30EB\n\n  - expected: \u30E9\u30B8\u30AA\n    patterns: \u30E9\u30C7\u30A3\u30AA\n\n  - expected: \u30EA\u30D0\u30A4\u30D0\u30EB\n    patterns: \u30EA\u30F4\u30A1\u30A4\u30F4\u30A1\u30EB\n\n  - expected: \u30EC\u30A4\u30A2\u30A6\u30C8\n    patterns: \u30EC\u30FC\u30A2\u30A6\u30C8\n\n  - expected: \u30EC\u30A4\u30E4\u30FC\n    patterns: \u30EC\u30A4\u30A2\u30FC\n\n  - expected: \u30EC\u30A4\u30F3\u30B3\u30FC\u30C8\n    patterns: \u30EC\u30FC\u30F3\u30B3\u30FC\u30C8\n\n  - expected: \u30EC\u30FC\u30B6\u30FC\n    patterns: \u30EC\u30A4\u30B6\u30FC\n\n  - expected: \u30EC\u30FC\u30C0\u30FC\n    patterns: \u30EC\u30A4\u30C0\u30FC\n\n  - expected: \u30EC\u30BF\u30FC\n    patterns: \u30EC\u30BF\u30A2\n\n  - expected: \u30EC\u30D3\u30E5\u30FC\n    patterns: \u30EC\u30F4\u30E5\u30FC\n\n  - expected: \u30EC\u30D9\u30EB\n    patterns: \u30EC\u30F4\u30A7\u30EB\n"
        ]
    });

    var originalStrRule = dictRule[Syntax.Str]; // 半角カタカナの使用をチェックする

    dictRule[Syntax.Str] = function(node) {
        originalStrRule(node);

        if (!(0, _nodeUtil.isUserWrittenNode)(node, context)) {
            return;
        }

        var text = getSource(node);
        var matches = (0, _matchIndex.matchCaptureGroupAll)(text, /([\uFF65-\uFF9F]+)/g);
        matches.forEach(match => {
            var { index, text } = match;
            report(
                node,
                new RuleError("カタカナは「全角」で表記します。", {
                    index: index,
                    fix: fixer.replaceTextRange([index, index + text.length], toZenkaku(text))
                })
            );
        });
    };

    return dictRule;
}

module.exports = {
    linter: reporter,
    fixer: reporter
};
//# sourceMappingURL=2.1.5.js.map
