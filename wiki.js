// Basic module
var http = require("http");
var connect = require("connect");
var socketio = require("socket.io");
var querystring = require("querystring");
var url = require("url");
var fs = require("fs");

// js file
var Posts = require('./model/Posts');
var Tags = require('./model/Tags');
var Users = require('./model/Users');

// Defaults
var portNumberDefault = process.env.PORT || 8089;
var listenAddr = process.env.NW_ADDR || '127.0.0.1';    // "" ==> INADDR_ANY
var portNumber = portNumberDefault;

// use connect --------------------
var app = connect();
app.use(connect.logger('dev'));
app.use(connect.static(__dirname + '/static'));
app.use(connect.bodyParser());

// http server ---------------------
var server = http.createServer(app);
server.listen(portNumber, listenAddr);
var iolisten = socketio.listen(server);
iolisten.set('log level', 2);
console.log("Server Start on: http "+listenAddr +':'+portNumberDefault);

// Login Users : User{name,password}
var userArray = [];

// for http parameter parser
var firstPathname = "";
var queryStrArray = [];


// io.socket listen
iolisten.sockets.on('connection', function (socket){
	console.log('start connect');
	
	if (firstPathname == "/search"){
		console.log('search start');
		Posts.mongoDbSearchPost(socket,
						queryStrArray['searchStr'],
						queryStrArray['sortWay'],
						queryStrArray['page'] );
	}
	else if (firstPathname == "/teach-plan"){
	}
	else if (firstPathname == "/teach-plan-edit"){
		Tags.mongoDbGetTagsForEdit(socket);
	}
	else if (firstPathname == "/teach-plan-save"){
	}
	else if (firstPathname == "/teach-plan-history"){
		console.log('history start');
		console.log(queryStrArray['post_id']);
		var post_id = queryStrArray['post_id'];			// string
		Posts.mongoDbHistoryData(socket, post_id);
	}
	
	// index -- get labels
	console.log('start socket on labels');
	socket.on('labels',function(){
		Tags.mongoDbGetTags(socket);	
	});
	
	// search -- searchPost;
	console.log('start socket on searchPost');
	socket.on('searchPost',function(searchArr){
		if (searchArr[2] <= 0 || searchArr[2] == undefined){
			console.log('--- page undefined');
			searchArr[2] =1;
		}
		if (searchArr[1] == undefined){
			console.log('--- sortWay undefined');
			searchArr[1] = "";
		}
		if (searchArr[0] == undefined){
			console.log('--- searchStr undefined');
			searchArr[0] = "";
		}
		Posts.mongoDbSearchPost(socket,
						searchArr[0],
						searchArr[1],
						searchArr[2] );
	});
	
	// search -- getOnePost  /teach-plan
	console.log('start socket on searchPost');
	socket.on('getOnePost',function(post_id){
		Posts.mongoDbGetOnePost(socket, post_id);
	});
	/*	
	// --------------------------------------------------------------
	// teach-plan-edit -- newPost  /teach-plan-save
	console.log('start socket on newPost');
	socket.on('newPost',function(postArr, userName){
		// var isLogin = false;
		// for (var i=0; i<userArray.length; i++){
			// if (userArray[i] == userName){
				// isLogin = true;
				// break;
			// }
		// }
		// if (isLogin){
		if (true){			// 'true' for function test
			console.log('New teaching plan -- start');
			postArr['post_author'] = userName;
			Posts.mongoDbNewPost(postArr);
		}
		else {
			console.log('New teaching plan -- not login');
		}
	});
	
	// teach-plan-edit -- changePost	/
	console.log('start socket on changePost');
	socket.on('changePost',function(postArr, userName, post_id){
		var isLogin = false;
		for (var i=0; i<userArray.length; i++){
			if (userArray[i] == userName){
				isLogin = true;
				break;
			}
		}
		if (isLogin){
			console.log('Change teaching plan -- start');
			Posts.mongoDbChangePost(postArr, post_id);
		}
		else {
			console.log('Change teaching plan -- not login');
		}
	});*/
	
	// teach-plan-history -- findHistoryPost
	console.log('start socket on findHistoryPost');
	socket.on('findHistoryPost',function(post_id){
		Posts.mongoDbHistoryData(socket, post_id);
	});
	
	// public -- login
	console.log('start socket on login');
	socket.on('login',function(user){	
		// message struct : user = ['name','password']
		console.log(user);
		Users.mongoDbLoginUser(socket, userArray, user[0], user[1]);
	});	
	
	// public -- logout
	console.log('start socket on logout');
	socket.on('logout',function(name){
		var hasUser = false;
		var i;
		for (i=0; i<userArray.length; i++){
			if (userArray[i] == name){
				hasUser = true;
				break;
			}
		}
		if (hasUser){
			userArray.splice(i,1);
			socket.emit('logoutReply',true);
		}
		else socket.emit('logoutReply',false);
		console.log(userArray);
	});	
	
	// public -- register
	console.log('start socket on register');	
	socket.on('register',function(user){
		// message struct : userArr = [name, password, email]
		console.log(user);
		Users.mongoDbNewUser(socket, userArray, user[0], user[1], user[2]);
	});
	//------------------------------------------------------------------
});

// default page output setting

app.use(function(req, res){	
	var pathname = url.parse(req.url).pathname;
	console.log("Request for " + pathname + " received.");
	console.log("Request for " + firstPathname + " ---received.");
	console.log('-------------------------');
	
	if (pathname == "/" || pathname == ""){
		firstPathname = "/";
	}
	else if (pathname == "/search"){		
		//	url sample:		http://127.0.0.1:8089/search?method=123&searchStr=hello&page=1&sortWay=LastChange
		console.log('-- search.html --');
		firstPathname = "/search";
		
		queryStrArray = new Array();
		queryStrArray['method'] = querystring.parse(url.parse(req.url).query)['method'];
		queryStrArray['searchStr'] = querystring.parse(url.parse(req.url).query)['searchStr'];
		queryStrArray['sortWay'] = querystring.parse(url.parse(req.url).query)['sortWay'];
		queryStrArray['page'] = querystring.parse(url.parse(req.url).query)['page'];
		
		if (queryStrArray['page'] <= 0 || queryStrArray['page'] == undefined){
			console.log('--- page undefined');
			queryStrArray['page'] =1;
		}
		if (queryStrArray['sortWay'] == undefined){
			console.log('--- sortWay undefined');
			queryStrArray['sortWay'] = "";
		}
		if (queryStrArray['searchStr'] == undefined){
			console.log('--- searchStr undefined');
			queryStrArray['searchStr'] = "";
		}
		console.log(queryStrArray);
		
		res.writeHead(200, {
			"Set-Cookie": ["searchStr=" + escape(queryStrArray['searchStr']), "sortWay=" + queryStrArray['sortWay'], "page=" + queryStrArray['page']],
			"Content-Type": "text/html"
		});
		res.write(fs.readFileSync(__dirname + '/static/search.html', 'utf-8'));
		res.end();
	}
	else if (pathname == "/teach-plan"){
		//	url sample:		http://127.0.0.1:8089/teach-plan?post_id=123
		firstPathname = "/teach-plan";
		
		queryStrArray = new Array();
		queryStrArray['post_id'] = querystring.parse(url.parse(req.url).query)['post_id'];
		console.log(queryStrArray);
		
		res.writeHead(200, {
			"Set-Cookie": [ "post_id=" + queryStrArray['post_id'] ],
			"Content-Type": "text/html"
		});
		res.write(fs.readFileSync(__dirname + '/static/teach-plan.html', 'utf-8'));
		res.end();
	}
	else if (pathname == "/teach-plan-edit"){
		//  url sample:	
		//		change mode: http://127.0.0.1:8089/teach-plan-edit?change_id=123
		//		new mode:	 http://127.0.0.1:8089/teach-plan-edit
		firstPathname = "/teach-plan-edit";
		queryStrArray['change_id'] = querystring.parse(url.parse(req.url).query)['change_id'];
		if (queryStrArray['change_id'] == null)
			queryStrArray['change_id'] = '-1';
		res.writeHead(200, {
			"Set-Cookie": [ "change_id=" + queryStrArray['change_id'] ],
			"Content-Type": "text/html"
		});
		res.write(fs.readFileSync(__dirname + '/static/teach-plan-edit.html', 'utf-8'));
		res.end();
	}
	else if (pathname == "/teach-plan-history"){
		//	url sample:		http://127.0.0.1:8089/teach-plan-history?post_id=123
		firstPathname = "/teach-plan-history";
		queryStrArray = new Array();
		queryStrArray['post_id'] = querystring.parse(url.parse(req.url).query)['post_id'];		
		console.log(queryStrArray);
		
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/history.html', 'utf-8'));
		res.end();
	}
	else if (pathname == "/teach-plan-save"){
		//	url sample:		http://127.0.0.1:8089/teach-plan-save      teach-plan-id=123
		firstPathname = "/teach-plan";			//use for show teach-plan after save
		var username = getReqCookie(req, 'name');
		var post_id = req.body['teach-plan-id'];
		
		console.log(userArray);
		console.log(username);
		console.log(post_id);
		
		var hasUser = false;
		for (var i=0; i<userArray.length; i++){
			if (userArray[i] == username){
				hasUser = true;
				break;
			}
		}
		if (hasUser){
			console.log('Pass - save start');
			Posts.mongoDbChangePost(req, res, post_id, username);
		}else {
			console.log('Stop - can\'t save');
			res.writeHead(200, {"Content-Type": "text/html"});
			res.write(fs.readFileSync(__dirname + '/static/teach-plan.html', 'utf-8'));
			res.end();
		}
	}
	else if (pathname == "/teach-plan-download"){
		//	url sample:		http://127.0.0.1:8089/teach-plan-download?post_id=123
		firstPathname = "/teach-plan-download";
		queryStrArray = new Array();
		queryStrArray['post_id'] = querystring.parse(url.parse(req.url).query)['post_id'];		
		console.log(queryStrArray);
		
		Posts.downloadOnePostXML(queryStrArray['post_id'], res);
	}
	
	else if (pathname == "/favicon.ico"){
		res.end();
	}
	else {
		firstPathname = "";
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/index.html', 'utf-8'));
		res.end();
	}
});


//------cookies operation
function getReqCookie(req, c_name) {
	if (req.headers.cookie.length > 0) {
		c_start = req.headers.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = req.headers.cookie.indexOf(";", c_start);
			if (c_end == -1) 
				c_end = req.headers.cookie.length;
			return unescape(req.headers.cookie.substring(c_start, c_end));
		}
	}
	return "";
}