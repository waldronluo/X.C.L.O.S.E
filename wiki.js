//back + DB

var http = require("http");
var connect = require("connect");
var socketio = require("socket.io");
var model = require('./model');

var querystring = require("querystring");
var url = require("url");
var fs = require("fs");


// Defaults
var portNumberDefault = process.env.PORT || 8089;
var listenAddr = process.env.NW_ADDR || '127.0.0.1';    // "" ==> INADDR_ANY
var portNumber = portNumberDefault;

// use connect --------------------
var app = connect();
app.use(connect.logger('dev'));
app.use(connect.static(__dirname + '/static'));


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
		// searchStr: ????
		// sortWay  : LastChange / CreateTime / AccessCount
		// page		: 1,2,......
		model.mongoDbSearchPost(socket,
						queryStrArray['searchStr'],
						queryStrArray['sortWay'],
						queryStrArray['page'] );
	}
	else if (firstPathname == "/teach-plan"){
		model.mongoDbGetOnePost(socket, queryStrArray['post_id'])
	}
	else if (firstPathname == "teach-plan-edit"){
	}
	else {
	}
	
	
	// get labels
	console.log('start socket on labels');
	socket.on('labels',function(){
		model.mongoDbGetTags(socket);	
	});
	
	// searchPost;
	console.log('start socket on searchPost');
	socket.on('searchPost',function(searchArr){
		model.mongoDbSearchPost(socket,
						searchArr['searchStr'],
						searchArr['sortWay'],
						searchArr['page'] );
	});
		
	// login
	console.log('start socket on login');
	socket.on('login',function(name, password){
		if (model.mongoDbCheckUser(name, password)){
			socket.emit('loginReply', true);
			//save User Information for this user
			var count = userArray.length;
			userArray[count] = new User();
			userArray[count].setUserBasic(name, password);
			//userArray[count] = name;
			console.log(userArray);
		}else {
			socket.emit('loginReply', false);
		}
	});	
	
	// logout
	console.log('start socket on logout');
	socket.on('logout',function(name){
		var hasUser = false;
		var i;
		for (i=0; i<userArray.length; i++){
			// if (userArray[i] == name){
				// hasUser = true;
				// break;
			// }
			if (userArray[i].name == name){
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
	
	// register
	console.log('start socket on register');	
	socket.on('register',function(name, password, passwordCon, email){
		if ((passwordCon == password) && model.mongoDbNewUser(name, password, email)){
			socket.emit('registerReply',true);
			var count = userArray.length;
			userArray[count] = new User();
			userArray[count].setUserBasic(name, password, email);
			
			//	userArray[count] = name;
		} else {
			socket.emit('registerReply',false);
		}
		console.log(userArray);
	});
	
});

// default page output setting

app.use(function(req, res){	
	var pathname = url.parse(req.url).pathname;
	console.log("Request for " + pathname + " received.");
	console.log("Request for " + firstPathname + " ---received.");
	
	if (pathname == "/" || pathname == ""){
		firstPathname = "/";
	}
	if (pathname == "/search"){		
		//	url sample:		http://127.0.0.1:8089/search?method=123&searchStr=hello&page=1&sortWay=LastChange
		console.log('-- search.html --');
		firstPathname = "/search";
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/search.html', 'utf-8'));
		res.end();
		
		queryStrArray = new Array();
		queryStrArray['method'] = querystring.parse(url.parse(req.url).query)['method'];
		queryStrArray['searchStr'] = querystring.parse(url.parse(req.url).query)['searchStr'];
		queryStrArray['sortWay'] = querystring.parse(url.parse(req.url).query)['sortWay'];
		queryStrArray['page'] = querystring.parse(url.parse(req.url).query)['page'];
		console.log(queryStrArray);
	}
	
	if (pathname == "/teach-plan"){
		//	url sample:		http://127.0.0.1:8089/teach-plan?post_id=123
		firstPathname = "/teach-plan";
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/teach-plan.html', 'utf-8'));
		res.end();
		
		queryStrArray = new Array();
		queryStrArray['post_id'] = querystring.parse(url.parse(req.url).query)['post_id'];
		console.log(queryStrArray);
	}
	
	if (pathname == "/teach-plan-edit"){
		//  url sample:
		firstPathname = "/teach-plan-edit";
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/teach-plan-edit.html', 'utf-8'));
		res.end();
	}
	if (pathname == "/favicon.ico"){res.end();}
});



/*		-- socket.io     origin
{
	
	// search mode : LastChange / CreateTime / AccessCount
	var searchWay = 'LastChange';

	
	
	// Post operation
	// new post
	socket.on('newPost',function(newPost){
		if (mongoDbNewPost(newPost)){
			socket.emit('newPostReply', true);
			console.log("New Post Success");
		} else {
			socket.emit('newPostReply', false);
			console.log("New Post Failed");
		}
	});	
	// change post
	socket.on('changePost',function(changePost){
		(changePost)
		socket.emit('changePostReply'    );
		console.log();
	});	
		
	// search post - AccessCount Mode
	socket.on('searchPost_AccessCount',function(title, page){
		if (searchTitle != title){
			searchPostArray = mongoDbSearchPost(title);	
			searchPostArray.sort(sortByAccessCount);
			searchWay = 'AccessCount';
			searchTitle = title;
		}
		
		var tempPostArr = [];
		
		socket.emit('searchPostReply', tempPostArr, page);
	});
	
	
	// get one post by ID in SearchArr	
	// post page 	[1,2,3,4,5,......]
	// post ID 		[0,1,2,3,4,......]
	socket.on('getOnePost',function(page, id){
		var postId = (page-1) * pageLength + id;
		// Add access_count when requested
		mongoDbUpdatePostCount( searchPostArray[postId].post_id );
		socket.emit('searchPostReply', searchPostArray[postId]);
	});
	
	// if a user disconnects, reinitialise variables
	socket.on('disconnect', function(){
		var currentPath = process.cwd() + '/';
		refreshDir();
		var links = getDir.parseLinks(dir);
		var directoryDepth = 0;
		// set -  connect.cookie -> null
	});
});

*/
