//back + DB

var http = require("http");
var connect = require("connect");
var socketio = require("socket.io");
var mongodb = require('mongodb');		//mongoDB for user

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

	if (firstPathname == '/' || firstPathname == ""){
		mongoDbGetTags(socket);	
	}
	else if (firstPathname == "/search"){
		console.log('search start');
		// searchStr: ????
		// sortWay  : LastChange / CreateTime / AccessCount
		// page		: 1,2,......
		mongoDbSearchPost(socket,
						queryStrArray['searchStr'],
						queryStrArray['sortWay'],
						queryStrArray['page'] );
		
		console.log('start socket on searchPost');
		socket.on('searchPost',function(searchArr){
			mongoDbSearchPost(socket,
						searchArr['searchStr'],
						searchArr['sortWay'],
						searchArr['page'] );
		});
	
	}
	else if (firstPathname == "/teach-plan"){
		mongoDbGetOnePost(socket, queryStrArray['post_id'])
	}
	else if (firstPathname == "teach-plan-edit"){
	}
	else {
	}
		
	// login
	console.log('start socket on login');
	socket.on('login',function(name, password){
		if (mongoDbCheckUser(name, password)){
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
		if ((passwordCon == password) && mongoDbNewUser(name, password, email)){
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

/*	about DB data structure:
	db:	test
		collection:	userlist:
						[_id,  name, password, email]
					postlist:
						[_id,  course_title, .... , tags:['x','1', ... ,'n']]
					tagslist:
						[_id,  name, count, category]
					commentlist:
						[_id,  userName, comment_createTime, post_id, content]
*/

// get tags for first access
function mongoDbGetTags(socket){
	var TagsArr = new Array();

	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver, {safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('tagslist', function (err, collection) {
			collection.find().sort({'category':1}, function(err,result){
				result.toArray(function(err,arr){
					//console.log('Arr = ');
					//console.log(arr);
					var countCat = -1;
					var countTag = 0;
					var nowCat = '';
					for (var i=0; i<arr.length; i++){
						if (nowCat != arr[i].category){
							nowCat = arr[i].category;
							countCat++;
							countTag = 0;
							TagsArr[countCat] = [arr[i].category, []];
						}
						//console.log('-- '+ i + ','+countCat+ ','+ countTag);
						TagsArr[countCat][1][countTag] = arr[i].name;
						countTag++;
					}
					console.log(TagsArr);

					socket.emit('labelsReply', TagsArr);
					return TagsArr;
				});
			});
		});
	});
}

// search post by title
function mongoDbSearchPost(socket, searchStr, sortWay, page){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	  
	 console.log('DB search post---');
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			switch (sortWay){
				case 'LastChange' :{
					console.log('DB search LastChange, get result');
					collection.find({'most_recent':1, 
									$or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}}, {'tags':searchStr}]},
									{'_id':1, 
									'course_title':1, 
									'teaching_goal':1, 
									'origin_createTime':1, 
									'post_createTime':1, 
									'tags':1}).sort({'post_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(10);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else {
									sendArr[i] = arr[(page-1)*10+i];
									// date format : 2010.03.09
									sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
									sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
								}
							}
							socket.emit('searchPostReply', sendArr);
						});
					});
					break;
				}
				case 'CreateTime' :{
					console.log('DB search CreateTime, get result');
					collection.find({'most_recent':1, 
									$or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tags':searchStr}]},
									{'_id':1, 
									'course_title':1, 
									'teaching_goal':1, 
									'origin_createTime':1, 
									'post_createTime':1, 
									'tags':1}).sort({'origin_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(10);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else {
									sendArr[i] = arr[(page-1)*10+i];
									// date format : 2010.03.09
									sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
									sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
								}
							}
							console.log(sendArr);
							socket.emit('searchPostReply', sendArr);
						});
					});
					break;
				}
				case 'AccessCount' :{
					console.log('DB search AccessCount, get result');
					collection.find({'most_recent':1, 
									$or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tags':searchStr}]},
									{'_id':1, 
									'course_title':1, 
									'teaching_goal':1, 
									'origin_createTime':1, 
									'post_createTime':1, 
									'tags':1}).sort({'access_count':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(10);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else {
									sendArr[i] = arr[(page-1)*10+i];
									// date format : 2010.03.09
									sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
									sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
								}
							}
							socket.emit('searchPostReply', sendArr);
						});
					});
					break;
				}
				default :{
					console.log('DB search Default, get result');
					collection.find({'most_recent':1, 
									$or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tags':searchStr}]},
									{'_id':1, 
									'course_title':1, 
									'teaching_goal':1, 
									'origin_createTime':1, 
									'post_createTime':1, 
									'tags':1}).sort({'post_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(10);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else {
									sendArr[i] = arr[(page-1)*10+i];
									// date format : 2010.03.09
									sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
									sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
								}
							}
							socket.emit('searchPostReply', sendArr);
						});
					});
					break;
				}
			}
		});
	});
}

// get one post By _id --->
function mongoDbGetOnePost(socket, post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.update({'_id':post_id}, {'$inc':{'access_count':1}}, function(err){});
			collection.find({'_id':post_id}, function (err,result){
				result.toArray(function(err, arr){
					console.log(arr);
					socket.emit('getOnePostReply', arr);
				});
			});
		});
	});
}


// function for date format :  Date() --> 2010.03.09
function dateFormat(date){
	var str = "";
	var tempM = date.getMonth() +1;
	var tempD = date.getDate();
	
	str += date.getFullYear()+ ".";
	if (tempM <10) str += "0"+tempM +".";
	else str += tempM +".";
	if (tempD <10) str += "0"+tempD;
	else str += tempD;
	
	return str;
}



// new user: return success or failed
// return: T/F 
function mongoDbNewUser(name, password, email){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	  
	mgconnect.open(function (err, db) {	  
		db.collection('userlist', function (err, collection) {
			collection.find({'name':name, 'password':password},{'name':1,'_id':0},function(err,result){
				result.toArray(function(err, arr){
					console.log(arr.length);
					if (arr.length !== 0){
						console.log('already have a user');
						return false;
					}
				});
			});
			collection.save({'name':name, 'password':password, 'email':email});
			console.log('user register success');
			return true;
		});
	});
}

// check user: return success or failed
// return: T/F 
function mongoDbCheckUser(name, password){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	  
	mgconnect.open(function (err, db) {	  
		db.collection('userlist', function (err, collection) {
			collection.find({'name':name, 'password':password},{'name':1,'_id':0},function(err,result){
				result.toArray(function(err, arr){
					console.log(arr.length);
					if (arr.length == 1){
						console.log('user login: '+arr[0]);
						return true;
					} else if (arr.length == 0){
						console.log('login info error');
						return false;
					}
				});
			});
		});
	});
}


// new post by {name, post}
// return: T/F----------------------------
function mongoDbNewPost(newPost){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find({'course_title': (newPost.course_title)} , {'name':1,'_id':1},function(err,result){
				result.toArray(function(err, arr){	
					if (arr.length !== 0){
						console.log('already have a post');
					} else {
						// only 'tags' needs origin name
						// count=0, createFrom=-1, post_id=_id (Auto generated), 
						collection.save({'course_title':newPost.course_title, 
										'template_title':newPost.template_title, 
										'topic':newPost.topic, 
										'course_time':newPost.course_time, 
										'volunteer':newPost.volunteer, 
										'course_class':newPost.course_class, 
										'background':newPost.background, 
										'course_prepare':newPost.course_prepare, 
										'teaching_resource':newPost.teaching_resource, 
										'teaching_goal':newPost.teaching_goal, 
										'lesson_starting_time':newPost.lesson_starting_time, 
										'lesson_starting_content':newPost.lesson_starting_content, 
										'lesson_starting_pattern':newPost.lesson_starting_pattern, 
										'lesson_main_time':newPost.lesson_main_time, 
										'lesson_main_content':newPost.lesson_main_content, 
										'lesson_main_pattern':newPost.lesson_main_pattern, 
										'lesson_ending_time':newPost.lesson_ending_time, 
										'lesson_ending_content':newPost.lesson_ending_content, 
										'lesson_ending_pattern':newPost.lesson_ending_pattern, 
										'lesson_summary':newPost.lesson_summary, 
										'lesson_comment':newPost.lesson_comment, 
										'tags':newPost.post_tag,
										'post_createFrom_id':newPost.post_createFrom_id, 
										'access_count':newPost.access_count});
						console.log('new post success');
					}
				});
			});
		});
	});
}

// change post 
// return: ?????
function mongoDbChangePost(changePost ){
	// -------------
}


// update Tags ------

// update Comments -------

// User struct -- for user construct
User = function(){
	this.name = "";				//key
	this.password = "";
	this.email = "";
	
	this.setUserBasic = function(name,password,email){
		this.name = name;
		this.password = password;
		this.email = email;
	}
}

// post struct -- for post present
Post = function(){
	// base entry
	this.course_title = "";
	this.template_title = "";
	this.topic = "";
	this.course_time = "";
	this.volunteer = "";
	this.course_class = "";
	
	this.background = "";
	this.course_prepare = "";
	this.teaching_resource = "";
	this.teaching_goal = "";
	
	this.lesson_starting_time = "";
	this.lesson_starting_content = "";
	this.lesson_starting_pattern = "";
	
	this.lesson_main_time = "";
	this.lesson_main_content = "";
	this.lesson_main_pattern = "";
	
	this.lesson_ending_time = "";
	this.lesson_ending_content = "";
	this.lesson_ending_pattern = "";
	
	this.lesson_summary = "";
	this.lesson_comment = "";
	
	this.post_tag = [];
	
	// other entry
	this.post_author = "";
	
	// (stable data)x4 : Only Change In Server
	// This post created from post_id=???		-1 means Origin
	this.post_createFrom_id = -1;		
	// hot topic count  						when Access in showpage, count+1
	this.access_count = 0;
	// post ID									Only ID for One saved Post
	this.post_id = 0;		//key
	// Oringi create time						if (createFrom=_id), then (origin_createTime =  post[_id].origin_createTime)
	this.origin_createTime = new Date();
	
	this.post_createTime = new Date();
	// most recent 								1 means newest / 0 means not
	this.most_recent = 1;
	
	
	// for Post-page Block 1 : Title
	this.setPostTitlePart = function(course_title, template_title,
									topic, course_time,
									volunteer, course_class){
		this.course_title = course_title;
		this.template_title = template_title;
		this.topic = topic;
		this.course_time = course_time;
		this.volunteer = volunteer;
		this.course_class = course_class;
	}
	
	// for Post-page Block 2 : Middle
	this.setPostMiddlePart = function(background, course_prepare, teaching_resource, teaching_goal){
		this.background = background;
		this.course_prepare = course_prepare;
		this.teaching_resource = teaching_resource;
		this.teaching_goal = teaching_goal;
	}
	
	// for Post-page Block 3-1 : Lesson Start 
	this.setPostLessonStartPart = function(lesson_starting_time, lesson_starting_content, lesson_starting_pattern){
		this.lesson_starting_time = lesson_starting_time;
		this.lesson_starting_content = lesson_starting_content;
		this.lesson_starting_pattern = lesson_starting_pattern;
	}
	
	// for Post-page Block 3-2 : Lesson Main
	this.setPostLessonMainPart = function(lesson_main_time, lesson_main_content, lesson_main_pattern){
		this.lesson_main_time = lesson_main_time;
		this.lesson_main_content = lesson_main_content;
		this.lesson_main_pattern = lesson_main_pattern;
	}
	
	// for Post-page Block 3-3 : Lesson End
	this.setPostLessonEndPart = function(lesson_ending_time, lesson_ending_content, lesson_ending_pattern){
		this.lesson_ending_time = lesson_ending_time;
		this.lesson_ending_content = lesson_ending_content;
		this.lesson_ending_pattern = lesson_ending_pattern;
	}
	
	// for Post-page Block 3-4 : Summary And Comment
	this.setPostSummaryAndComment = function(lesson_summary, lesson_comment){
		this.lesson_summary = lesson_summary;
		this.lesson_comment = lesson_comment;
	}
	
	// for Post-page Block 4 : Tag
	this.setPostTag = function(tagArr){
		this.post_tag = tagArr;
	}
	
	// Set Create Time
	this.setCreateTime = function(createTime){
		this.post_createTime = createTime;
	}

	// Set Post Author
	this.setPostAuthor = function(postAuthor){
		this.post_author = postAuthor;
	}	

	// Set ID and count data
	this.setIDAndCount = function(post_createFrom_id, access_count, post_id){
		
	}
}

// Comment struct -- for comment saving
Comment = function (){
	this.userName = "";
	this.comment_createTime = new Date();
	this.post_id = 0;
	this.content = "";
	
	//key -> _id
}

// Tags struct -- only for tag count and divide
Tags = function (){
	this.name = "";		//key
	this.count = 0;
	this.category = "";
	
	this.setTagsALL = function(name, count, category){
		this.name = name;
		this.count = count;
		this.category = category;
	}
}




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
