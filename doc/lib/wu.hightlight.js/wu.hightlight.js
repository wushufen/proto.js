/**
 * 代码高亮插件
 * 
 * c 2015.09.03
 * u 2017.12.04
 * wushufen: 404315887@qq.com
 */
/*
自动
<code lang="js">code</code>

手动
wu.hightlight(element, 'js');

var hightlightCode = wu.hightlight('source code', 'js');
*/
+ function() {
    var language = {
        c: {},
        js: {
            number: /\b\d*\.*\d+\b/,
            type: /\b(var)\b/,
            keyword: /\b(while|if|else|for|in|continue|return|new|this|true|false)\b/,
            'function': /\w+(?=\()/,
            operator: /\^|\$|\+|-|\*|\/|\\|=|!|>|<|&|%|~|\|/,
            string: /"(\\.|[\w\W])*?"|'(\\.|[\w\W])*?'|`(\\.|[\w\W])*?`/,
            reg: /\/(?!\*)(\\.|[^\/\r\n\\])+\/[gim]*(?=\s*[\r\n,.;\}\)\]])/,
            comment: /\/\/.*(?=\n)|\/\*[\w\W]*?\*\//,
        },
        css: {
            string: /"(\\.|[\w\W])*?"|'(\\.|[\w\W])*?'/,
            keyword: /\b(@import|@charset|!important|px|em|rem)\b/i,
            number: /\b\d*\.*\d+(px|ex|em|rem)*\b/,
            color: /#[\w\d]+/,
            comment: /\/\*[\w\W]*?\*\//,
            selecter: /[\w- \.\d,\n]+?(?={)/,
            property: /[\w-]+?(?=\s*:)/,
        },
        html: {
            tag: [/<.*>/, {
                attr: / \w+/,
                value: /=.../
            }], // todo
            tag: /<\w+>?|<\/\w+(?=>)|>/,
            attr: /\w+(?=\=)/,
            value: /"(\\.|[\w\W])*?"|'(\\.|[\w\W])*?'/,
        }
    };
    // 转义
    var escape = function(s) {
        return s
            // .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };
    // 判断缩进字符
    var getIndentChars = function(s) {
        // 行首缩进字符最多的最可能是缩进符
        var indentMap = ['\t', '  ', '   ', '    '];
        var indent = '\t';
        var match = [];
        for (var i = 0; i < indentMap.length; i++) {
            var reg = RegExp('\n' + indentMap[i], 'g');
            var m = s.match(reg);
            if (m && m.length >= match.length) {
                match = m;
                indent = match[0].replace('\n', '');
            };
        }
        return indent;
    };
    var hightlight = function(code, lang) {
        if (lang=='javascript') lang = 'js';

        var regMap = language[lang];
        var newCode = ''; //已处理部分
        var oldCode = code; //未处理部分
        while (oldCode) {
            var index = oldCode.length;
            var matchStr = '';
            var classN = '';
            for (var i in regMap) {
                var match = regMap[i].exec(oldCode);
                if (match) {
                    if (match.index < index || match.index == index && match[0].length > matchStr.length) {
                        index = match.index;
                        matchStr = match[0];
                        classN = i;
                    }
                }
            }
            newCode += escape(oldCode.substr(0, index)) +
                '<span class="' + (lang + '-' + classN) + '">' + escape(matchStr) + '</span>';
            oldCode = oldCode.substr(index + matchStr.length);
        }
        // 缩进  todo (^|\n)\t+
        // newCode = newCode.replace(RegExp(getIndentChars(code), 'g'), '<span class="indent">$&</span>');
        // \n
        // newCode = newCode.replace(/\n/g, '<span style="">$&</span>');
        return newCode;
    };

    wu.hightlight = function(source, lang) {
        var sourceEl;
        // 如果是标签
        if (source.innerHTML) {
            sourceEl = source;
            source = sourceEl.innerHTML;
            if (sourceEl._hili) {
                return source
            } else {
                sourceEl._hili = true
            }
        };

        var hightlightCode = hightlight(source, lang);

        if (sourceEl) {
            sourceEl.innerHTML = hightlightCode;
            // setTimeout(function () {
            //     sourceEl.className += ' wu-hightlight';
            // }, 1)
        };
        return hightlightCode;
    };

    // <code>
    setTimeout(function() {
        var els = document.getElementsByTagName('*');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var parent = el.parentNode;
            if (el.tagName.toLowerCase() == 'code' && !parent._hili) {
                var lang = el.getAttribute('lang');
                wu.hightlight(el, lang || 'js');
            }
        }
    }, 1)
}(this.wu || (wu = {}));