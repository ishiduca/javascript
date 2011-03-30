//if (window === this) {

if (! this.ishiduca) ishiduca = {};
if (! this.ishiduca.error) ishiduca.error = function (message, callback) {
    message = [ 'error:', message ].join(' ');
    try {
        console.log(message);
    } catch (e) {
        window.alert(message);
    }
    if (callback) callback();
    return false;
};

if (! this.ishiduca.storage) {
    ishiduca.storage =
    (! window.localStorage)

    ? ishiduca.error('not found "window.localStorage".')

    : function () {
        var F = function () {
            this.keys = function () {
                var i = 0, length = this.length, keys = [];
                for (; i < length; i += 1) {
                    keys[keys.length] = this.key(i);
                }
                return keys;
            };
        };
        F.prototype = window.localStorage;

        return new F;
    } ();
}
//}
