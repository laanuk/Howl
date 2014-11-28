var wolfram = require('wolfram').createClient("E644RW-T448XKJPY6");
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/query', function(req, res) {
	console.log(req);
	wolfram.query(req.query.input, function(err, result) {
  		if(err) throw err
  		console.log("Result: %j", result);
		res.send(result);
	});
});

app.listen(process.env.PORT || 8000);
