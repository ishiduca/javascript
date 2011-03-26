if (! this.ishiduca) ishiduca = {};
if (! this.ishiduca.error) ishiduca.error = function (message, callback) {
    message = [ 'error', message ].join(': ');
    try {
        console.log(message);
    } catch (e) {
        window.alert(message);
    }
    if (callback) callback();
    return false;
};
if (! this.ishiduca.xhr) ishiduca.xhr = {};
if (! this.ishiduca.xhr.Request) {
// var request = new ishiduca.xhr.Request ();
// request.on('GET', url, function (response) {
//     console.log(response.body);
// }, false, data);
    ishiduca.xhr.Request = function () {};

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

        on : function (method, url, callback, async, request_data) {
            var self = this;
            self.queue.push({
                method   : method,
                url      : url,
                callback : callback,
                async    : async        || true,
                request  : request_data || { headers : null, body : null }
            });

            var check = function () {
                if (self.state) {
                    setTimeout(check, 1);
                } else {
                    self.run();
                }
            }

            check();
        },

        queue : [],
        state : false,

        run : function () {
            var self   = this,
                client = self.client,
                data   = self.queue.shift(),
                key,
                headers = data.request.headers || null,
                body    = data.request.body    || null;

            self.state = true;

            client.onreadystatechange = function () {
                if (client.readyState === 4) {
                    if (client.status === 200) {
                        var response = {};
                        response.body = client.responseText;
                        response.headers = {};
                        client.getAllResponseHeaders().split(/\r\n/).forEach(function (line) {
                            var key_value = line.split(': ');
                            response.headers[key_value[0]] = key_value[1];
                        });
                        data.callback(response);
                    } else {
                        return ishiduca.error([
                            client.status, client.statusText ].join(': '));
                    }
                    self.state = false;
                }
            };

            client.open(data.method, data.url, data.async);
            if (headers) {
                for (key in headers) {
                    client.setRequestHeader(key, headers[key]);
                }
            }
            client.send(body);
        }

    };

}
