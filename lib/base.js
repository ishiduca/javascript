if (! this.ishiduca) ishiduca = {};
if (! ishiduca.date) ishiduca.date = {};

// queue & stack
ishiduca.create_queue = function (array_) {
    var F = function () {};
    F.prototype = array_ || [];
    F.prototype.work = function (callback) {
        if (this.length > 0) {
            var job = this.shift();
            callback(job);
            return this;
        }
    };
    return new F;
};
ishiduca.create_stack = function (array_) {
    var F = function () {};
    F.prototype = array_ || [];
    F.prototype.work = function (callback) {
        if (this.length > 0) {
            var job = this.pop();
            callback(job);
            return this;
        }
    };
    return new F;
};


// 文字列の配列化
ishiduca.qw = function (str, cut) {
    cut = cut || /\s+/;
    return str  .toString()
                .replace(/^\s*/, '')
                .replace(/\s*$/, '')
                //.replace(cut,    '')
                .split(cut);
};
String.prototype.qw = function (cut) {
    return ishiduca.qw.apply(null, [ this, cut ]);
};

// repeat string(number)
// x('abc', 3); -> "abcabcabc"
// 'abc'.x(3);  -> "abcabcabc"
// (123).x(3);  -> "123123123"
ishiduca.x = function (str, num) {
    str = str.toString();
    return Array(num+1).join(str);
};
String.prototype.x = function (num) {
    return ishiduca.x.apply(null, [ this, num ]);
};
Number.prototype.x = function (num) {
    return ishiduca.x.apply(null, [ this, num ]);
};

// 桁揃え
// ishiduca.keta(3)    || (3).keta()  -> "03"
// ishiduca.keta(7, 3) || (7).keta(3) -> "007"
ishiduca.keta = function (num, repeat_num) {
    repeat_num = repeat_num || 2; // default
    num = num.toString();
    var length = repeat_num - num.length;
    return length > 0 ? ishiduca.x('0', length) + num : num;
};
Number.prototype.keta = function (repeat_num) {
    return ishiduca.keta.apply(null, [ this, repeat_num ]);
};

// 日付フォーマット
// ishiduca.date.format(new Date(), "YYYY/MM/DD hh:mm:ss") 
// (new Date()).format("YYYY.MM.DDThh:mm:ss")
ishiduca.date.format = function (dateObject, pattern) {
    pattern = pattern || 'YYYY-MM-DD hh:mm:ss';
    return pattern
        .replace(/YYYY/, dateObject.getFullYear().toString())
        .replace(/YY/,  (dateObject.getFullYear() - 2000).keta())
        .replace(/MM/,  (dateObject.getMonth() + 1).keta())
        .replace(/DD/,   dateObject.getDate()   .keta())
        .replace(/hh/,   dateObject.getHours()  .keta())
        .replace(/mm/,   dateObject.getMinutes().keta())
        .replace(/ss/,   dateObject.getSeconds().keta());
};
Date.prototype.format = function (pattern) {
    return ishiduca.date.format.apply(null, [ this, pattern ]);
};
