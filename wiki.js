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
		// searchStr: ????
		// sortWay  : LastChange / CreateTime / AccessCount
		// page		: 1,2,......
		model.mongoDbSearchPost(socket,
						queryStrArray['searchStr'],
						queryStrArray['sortWay'],
						queryStrArray['page'] );
	}
	else if (firstPathname == "/teach-plan"){
		console.log(queryStrArray['post_id']);
		var post_id = parseInt(queryStrArray['post_id']);			// string --> int  to find _id
		model.mongoDbGetOnePost(socket, post_id);
	}
	else if (firstPathname == "/teach-plan-edit"){
		model.mongoDbGetTagsForEdit(socket);
	}
	else if (firstPathname == "/teach-plan-save"){
	}
	
	
	// index -- get labels
	console.log('start socket on labels');
	socket.on('labels',function(){
		model.mongoDbGetTags(socket);	
	});
	
	// search -- searchPost;
	console.log('start socket on searchPost');
	socket.on('searchPost',function(searchArr){
		model.mongoDbSearchPost(socket,
						searchArr[0],
						searchArr[1],
						searchArr[2] );
	});
	
	// search -- getOnePost;
	console.log('start socket on searchPost');
	socket.on('getOnePost',function(post_id){
		post_id = parseInt(post_id);
		model.mongoDbSearchPost(socket, post_id);
	});
		
	// teach-plan-edit -- newPost
	console.log('start socket on newPost');
	socket.on('newPost',function(postArr, userName){
		var isLogin = false;
		for (var i=0; i<userArray.length; i++){
			if (userArray[i] == userName){
				isLogin = true;
				break;
			}
		}
		if (isLogin){
			console.log('New teaching plan -- start');
			postArr['post_author'] = userName;
			mongoDbNewPost(postArr);
		}
		else {
			console.log('New teaching plan -- not login');
		}
	});
	
	// teach-plan-edit -- changePost
	console.log('start socket on changePost');
	socket.on('changePost',function(postArr, userName){
		var isLogin = false;
		for (var i=0; i<userArray.length; i++){
			if (userArray[i] == userName){
				isLogin = true;
				break;
			}
		}
		if (isLogin){
			console.log('New teaching plan -- start');
			mongoDbChangePost(postArr);
		}
		else {
			console.log('New teaching plan -- not login');
		}
	});
	
	// public -- login
	console.log('start socket on login');
	socket.on('login',function(name, password){
		if (model.mongoDbCheckUser(name, password)){
			socket.emit('loginReply', true);
			//save User Information for this user
			var count = userArray.length;
			userArray[count] = name;
		}else {
			socket.emit('loginReply', false);
		}
		console.log(userArray);
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
	socket.on('register',function(name, password, passwordCon, email){
		if ((passwordCon == password) && model.mongoDbNewUser(name, password, email)){
			socket.emit('registerReply',true);
			var count = userArray.length;
			userArray[count] = name;

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
	var temarr = req.body;
	console.log(temarr);
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
	
	else if (pathname == "/favicon.ico"){res.end();}
	
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
