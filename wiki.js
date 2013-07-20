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
		model.mongoDbSearchPost(socket,
						searchArr[0],
						searchArr[1],
						searchArr[2] );
	});
	
	// search -- getOnePost;
	console.log('start socket on searchPost');
	socket.on('getOnePost',function(post_id){
		post_id = parseInt(post_id);
		model.mongoDbGetOnePost(socket, post_id);
	});
		
	// teach-plan-edit -- newPost
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
	
	// teach-plan-history -- findHistoryPost
	console.log('start socket on findHistoryPost');
	socket.on('findHistoryPost',function(post_id){
		post_id = parseInt(post_id);
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
		res.end();
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




/*	node.js文件上传
exports.postFile = function(req, res) {
    if (req.headers['content-type'].match(/application\/octet-stream/i)) {
        //文件名字
        var fileExtention = req.headers['x-file-name'];
        var fileStream = fs.createWriteStream(filePath);
        req.pipe(fileStream);
        req.on('end', function() {
            //接收数据完毕，需要给客户端返回值，否则，客户端将一直等待，直到失败（其实上传文件已经成功了）
            res.send({success:true});
        })
    }
};
*/

/*	node.js文件下载
exports.donwloadZip = function(req, res) {
//    require('path').exists(userFile, function(exists) {
//        console.log("exists: ", exists);
//        if (exists) {
//            fs.readFile(userFile, "binary", function(err, data) {
//                res.writeHead(200, {"Content-Type": "application/zip"});
//                res.write(data, "binary");
//                res.end();
//            });
//        }
//    });
//上面的代码可以处理小文件，如果文件太大的话，由于 data 数据会保存在内存中，可能会造成内存不足
	require('path').exists(userFile, function(exists) {
		console.log("exists: ", exists);
		if (exists) {
			res.writeHead(200, {"Content-Type": "application/zip"});
			fileStream.pipe(res);
			fileStream.on("end", function() {
				res.end();
			});
		}
	});
};
*/