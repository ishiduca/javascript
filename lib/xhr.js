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

if (! this.ishiduca.xhr) ishiduca.xhr = {};

// XMLHTTPRequest
// var request = new ishiduca.xhr.Request();
// request.headers['content-type'] = 'application/x-www-form-urlencoded';
// request.body = JSON.stringify({ from_to : 'en|ja', value : 'hello javascript.' });
// request.on('POST', url, function (response) {
//     var response_ = JSON.parse(response.text);
//     alert(response_.to_japanese);
// }, async);

if (! this.ishiduca.xhr.Request) {
    ishiduca.xhr.Request = function (body) {
        this.headers = {};
        this.body    = body || null;
   };

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
        } (),

        on : function (method, url, callback, async) {
            var client = this.client;
            async = async || true;
            client.onreadystatechange = function () {
                if (client.readyState === 4) {
                    if (client.status === 200) {
                        var response = {}, buf;
                        response.headers = {};
                        response.text = client.responseText;
                        buf = client.getAllResponseHeaders().replace(/\r/g, '').split(/\n/);
                        buf.forEach(function (line) {
                            var key_value = line.split(/: /);
                            response.headers[key_value[0]] = key_value[1];
                        });
                        callback(response);
                    } else {
                        ishiduca.error([ client.status, client.statusText ].join(': '));
                    }
                }
            };
            client.open(method, url, async);
            if (this.headers) {
                for (var key in this.headers) {
                    clinet.setRequestHeader(key, this.headers[key]);
                }
            }
            if (! method.match(/POST/i)) this.body = null;
            client.send(this.body);
            return this;
        },

        set_header : function (key, value) {
            if (! value) {
                delete this.headers[key];
            } else {
                this.headers[key] = value;
            }
        },

        set_body : function (data) {
            data = data || null;
            this.body = data;
        },

        clear : function () {
            this.body = null;
            this.headers = {};
        }
    };

}
