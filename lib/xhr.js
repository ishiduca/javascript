if (! this.ishiduca) ishiduca = {};
if (! this.ishiduca.error) ishiduca.error = function (message, func) {
    message = [ "error", message ].join(': ');
    try {
        console.log(message);
    } catch (e) {
        window.alert(message);
    }
    if (callback) func ();
    return false;
};
if (! this.ishiduca.xhr) ishiduca.xhr = {};
if (! this.ishiduca.xhr.Request) {
// var request = new ishiduca.xhr.Request;
// request
//     .push(method, uri, callback,  query, async, request_data)
//     .push(method, uri, function (response) {
//         var res = JSON.parse(response['body']);
//         ...
//     }, query2);
// some works
//
// request .on();
    ishiduca.xhr.Request = function  () {};

    function hash2query (hash) {
        if (! hash) return '';
        if (typeof hash === 'string') return hash;
        var querys = [], key;
        for (key in hash) {
            querys[querys.length] =
                [ key, encodeURIComponent(hash[key]) ].join('=');
        }
        return querys.join('&');
    }

    ishiduca.xhr.Request.prototype = {
        client : function () {
            var client;
            if (XMLHttpRequest) {
                client = new XMLHttpRequest();
            } else {
                try {
                    client = new ActiveXObject('MSXML2.XMLHTTP.6.0');
                } catch (e) {
                    try {
                        client = new ActiveXObject('MSXML2.XMLHTTP.3.0');
                    } catch (e) {
                        try {
                            client = new ActiveXObject('MSXML2.XMLHTTP');
                        } catch (e) {
                            ;
                        }
                    }
                }
            }
            return client;
        }(),

        queue : [],
        state : false,

        check : function () {
            var self = this;
            if (self.state) {
                setTimeout(self.check, 1);
            } else {
                self.run();
            }
        },

        push : function (method, uri, callback, query, async, request_headers) {
            var $ = {};
            $['method']   = method;
            $['callback'] = callback;
            $['async']    = async !== false ? true : false;
            $['headers']  = request_headers || {};
            if (method.match(/^post$/i)) {
                $['uri']  = uri;
                $['headers']['Content-Type'] =
                    'application/x-www-form-urlencoded';
                $['body'] = hash2query(query) || null;
            } else {
                $['uri']  = query ? [ uri, hash2query(query) ].join('?') : uri;
                $['body'] = null;
            }
            this.queue.push($);
            return this;
        },

        on    : function () {
            this.check ();
            return this;
        },

        run   : function () {
            var self  = this,
                $,
                key;
            
            if (self.queue.length > 0) {
                $ = self.queue.shift();
                self.state = true;

                self.client.onreadystatechange = function () {
                    var response, message;
                    if (self.client.readyState === 4) {
                        if (self.client.status === 200) {
                            response = {};
                            response.body    = self.client.responseText;
                            response.headers = {};
                            self.client.getAllResponseHeaders().split(/\r\n/)
                            .forEach(function (line) {
                                var kv = line.split(/:\s?/);
                                response.headers[kv[0]] = kv[1];
                            });
                            $.callback(response);
                        } else {
                            message =
                                [ client.status, client.statusText ].join(': ');
                            ishiduca.error(messaga);
                        }
                        self.state = false;
                        self.check();
                    }
                };

                self.client.open($.method, $.uri, $.async);
                if ($.headers) {
                    for (key in $.headers) {
                        self.client.setRequestHeader(key, $.headers[key]);
                    }
                }
                self.client.send($.body);

            }

            return this;
        }
    };
}

