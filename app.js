var express = require('express');
var http = require('http');
var app = express();

// Routes
app.get('/query', function(req, response) {
    var results = [];
    var done = false;
    console.log(req._parsedUrl.query);
    var query = http.get("http://api.wolframalpha.com/v2/query?input=" + req._parsedUrl.query + "&appid=E644RW-T448XKJPY6", function(res) {
        console.log("Got response: " + res.statusCode);
        var completeResponse = '';
        res.on('data', function(chunk) {
            completeResponse += chunk;
        });
        res.on('end', function() {
            var parseString = require('xml2js').parseString;
            var xml = completeResponse;
            parseString(xml, function (err, result) {
                var json1 = JSON.stringify(result);
                var json = JSON.parse(json1);

                var numpods = json.queryresult.$.numpods;

                for (i=0; i < numpods; i++) {
                    results.push(json.queryresult.pod[i].subpod[0].img[0].$.src)
                }
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end(results.join());
            });
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
});

app.use(express.static(__dirname + '/public'));


app.listen(process.env.PORT || 8000);
