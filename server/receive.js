
var http = require('http');
var querystring = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');
var Crud = require('./crud.js');

var app = express();

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true
// }));


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","POST,GET,OPTIONS");
    res.header("Access-Control-Allow-Headers","Content-Type");
    // res.header("Content-Type", "application/json");
    next();
});

// 注册新用户
app.post('/register',function(req,res){
	var requests = '';
	req.on('data',function(chunk){
		requests += chunk;
	})
	req.on('end',function(){
		requests = querystring.parse(requests);
		if (requests.id && requests.code && requests.name) {
			var data = {};
			data.id = requests.id;
			data.code = requests.code;
			data.name = requests.name;
			var selector = {
				crud:4,
				query:{id: data.id}
			};
			var insertor = {
				crud:1,
				data:data
			}
			Crud.conn(selector,function(result) {
				if (result == false) {
					Crud.conn(insertor,function(result){
						var msg = {
							ok:result.result.ok,
							Oid:result.insertedIds
						}
						res.send(JSON.stringify(msg));
					})
				}else{
					var msg = {
						ok:-1
					}
					res.send(JSON.stringify(msg));
				}
			})
		}else{
			var msg = {
				ok:-2
			}
			res.send(JSON.stringify(msg))
		}
		// res.end();
	})

} )

// 登录已有账户
app.post('/login',function(req,res){
	var requests = '';
	req.on('data',function(chunk){
		requests += chunk;
	})
	req.on('end',function(){
		requests = querystring.parse(requests);
		if (requests.id && requests.code) {
			var selector = {
				crud:4,
				query:{id: requests.id}
			};
			Crud.conn(selector,function(result) {
				if (result != false) {
					result = result[0];
					if(result.code == requests.code){
						result.status = 1;
						console.log('1',result);
					}else{
						result =  { status:0 };
						console.log('0.5',result);
					}
					res.send(JSON.stringify(result));
				}else{
					result = { status:0 }
					console.log('0',result);
					res.send(JSON.stringify(result));
				}
			})
		}else{
			res.send(JSON.stringify({ status:-1 }))
		}
		// res.end();
	})

} )


http.createServer(app).listen(3000);
console.log('listening on port 3000……');



 

