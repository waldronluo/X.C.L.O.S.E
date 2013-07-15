//back + DB

var http = require("http");
var connect = require("connect");
var socketio = require("socket.io");
var mongodb = require('mongodb');		//mongoDB for user
var url = require("url");
var fs = require("fs");

// Defaults
var portNumberDefault = process.env.PORT || 8089;
var listenAddr = process.env.NW_ADDR || 127.0.0.1;    // "" ==> INADDR_ANY
var portNumber = portNumberDefault;

// use connect
var app = connect();
app.use(connect.logger('dev'));
app.use(connect.static(__dirname + '/static'));

// default page output setting
app.use(function(req, res){
	var pathname = url.parse(req.url).pathname;
    console.log("Request for " + pathname + " received.");
	if (pathname == "/sb")
		response.end(fs.readFileSync(__dirname + '/static/test.html', 'utf-8'));
	else response.end(fs.readFileSync(__dirname + '/static/index000.html', 'utf-8'));
});

// http server
var server = http.createServer(app);
server.listen(portNumber, listenAddr);
io = socketio.listen(server);
io.set('log level', 2);

// Login Users : User{name,password}
var userArray = [];

// socket.io - on & emit
io.sockets.on('connection', function (socket){
	
	// temp Search Posts
	var searchPostArray = [];
	// search mode : LastChange / CreateTime / AccessCount
	var searchWay = 'LastChange';
	// temp searchTitle
	var searchTitle = '';
	// the counts of one search page
	var pageLength = 10;
	
	// First Page Label Counts
	socket.on('lables',function(){
		sock.emit()
	});
	
	// User operation
	// login
	socket.on('login',function(name, password){
		if (mongoDbCheckUser(name, password)){
			socket.emit('loginReply', true);
			//save User Information for this user
			var count = userArray.length;
			userArray[count] = new User();
			userArray[count].setUserBasic(name, password);
			console.log(userArray);
		}else {
			socket.emit('loginReply', false);
		}
	});	
	// logout
	socket.on('logout',function(name){
		var hasUser = false;
		var i;
		for (i=0; i<userArray.length; i++){
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
	socket.on('register',function(name, password){
		if (mongoDbNewUser(name, password)){
			socket.emit('registerReply',true);
			var count = userArray.length;
			userArray[count] = new User();
			userArray[count].setUserBasic(name, password);
		} else {
			socket.emit('registerReply',false);
		}
		console.log(userArray);
	});
	
	
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
		socket.emit('changePostReply',    );
		console.log();
	});	
	
	// search post - LastChange Mode
	socket.on('searchPost_LastChange',function(title){
	
	});
	
	// search post - CreateTime Mode
	socket.on('searchPost_CreateTime',function(title){
	
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
		mongoDbUpdatePostCount( searchPostArray[postId].post_id, searchPostArray[postId].access_count );
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

// For searchPostArray to Sort 
// 1. By access_count
function sortByAccessCount(a,b){
	return b.access_count - a.access_count;
}
// 2. By access_count

// new user: return success or failed
// return: T/F 
function mongoDbNewUser(name, password){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver);
	  
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
			collection.save({'name':name, 'password':password});
			console.log('user register success');
			return true;
		});
	});
}

// check user: return success or failed
// return: T/F 
function mongoDbCheckUser(name, password){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver);
	  
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
// return: T/F
function mongoDbNewPost(newPost){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver);
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find('post_tile':newPost.post_tile , {'name':1,'_id':1},function(err,result){
				result.toArray(function(err, arr){	
				
					if (arr.length !== 0){
						console.log('already have a post');
						return false;
					} else {
						// only 'tags' needs origin name
						// count=0, createFrom=-1, post_id=_id (Auto generated)
						collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
										'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
										'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
										'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
										'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
										'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
										'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
										'tags':newPost.post_tag,
										'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count});
						console.log('new post success');
						return true;
					}
				});
			});
		});
	});
}

// change post 
// return: ?????
function mongoDbChangePost(changePost, ){
	// -------------
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver);
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find('post_tile':newPost.post_tile , {'name':1,'_id':1},function(err,result){
				result.toArray(function(err, arr){	
				
					if (arr.length !== 0){
						console.log('already have a post');
						return false;
					} else {
						// only 'tags' needs origin name
						// count=0, createFrom=-1, post_id=_id (Auto generated)
						collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
										'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
										'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
										'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
										'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
										'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
										'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
										'tags':newPost.post_tag,
										'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count});
						console.log('new post success');
						return true;
					}
				});
			});
		});
	});
}

// search post by title
// return: arr Post[] 
function mongoDbSearchPost(course_title){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver);
	  
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find({$or:['course_title':{$regex:course_title}, 'tag':course_title ]}, function(err,result){
				result.toArray(function(err, arr){
					console.log(arr);
					var returnPostArray = [];
					for (var i=0; i<arr.length; i++){
						var tempPost = new Post();
						tempPost.set
						returnPostArray.push(tempPost);
					}
					return returnPostArray;
				});
			});
		});
	});
}

// update one post access_count
function mongoDbUpdatePostCount(post_id, access_count){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver);
	
	var count = access_count+1;
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.update('_id':post_id, {'$set':{'access_count':count}}, function(err){
				return;
			});
		});
	});
}
// update Tags ------

// update Comments -------

// mongoDB initialize
function mongoDbInit(){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver);
	  
	mgconnect.open(function (err, db) {
		if (db != undefined){
			//user list
			db.createCollection('userlist');
			db.collection('userlist', function (err, collection) {
				collection.save({'name':'aaa', 'password':'111'});
				collection.save({'name':'bbb', 'password':'222'});
			});
			//post list : easy
			db.createCollection('postlist');
			db.collection('postlist', function (err, collection) {
				collection.save({'course_title':'atest', 'post_author':'aaa'});
				collection.save({'course_title':'btest', 'post_author':'aaa'});
			});
		}
	});
}

// mongoDB clear all data
function mongoDbClear(){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver);
	  
	mgconnect.open(function (err, db) {
		if (db != undefined){
			db.dropCollection('userlist');
			db.dropCollection('postlist');
		}
	});
}


// User struct:
User = function(){
	this.name = "";
	this.password = "";
	
	this.setUserBasic = function(name,password){
		this.name = name;
		this.password = password;
	}
}

// post struct : 
// 
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
	this.post_createTime = new Date();
	this.post_author = "";
	
	// (stable data)x4 : Only Change In Server
	// This post created from post_id=???		-1 means Origin
	this.post_createFrom_id = -1;		
	// hot topic count  						when Access in showpage, count+1
	this.access_count = 0;
	// post ID									Only ID for One saved Post
	this.post_id = 0;
	// Oringi create time						if (createFrom=_id), then (origin_createTime =  post[_id].origin_createTime)
	this.origin_createTime = new Date();
	
	
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
/*
	// make an Array to Match these pattern
	this.setPostALL = function (postItemArray){
		this.course_title = postItemArray["course_title"];
		this.template_title = postItemArray["template_title"];
		this.topic = postItemArray["topic"];
		this.course_time = postItemArray["course_time"];
		this.volunteer = postItemArray["volunteer"];
		this.course_class = postItemArray["course_class"];
		
		this.background = postItemArray["background"];
		this.course_prepare = postItemArray["course_prepare"];
		this.teaching_resource = postItemArray["teaching_resource"];
		this.teaching_goal = postItemArray["teaching_goal"];
		
		this.lesson_starting_time = postItemArray["lesson_starting_time"];
		this.lesson_starting_content = postItemArray["lesson_starting_content"];
		this.lesson_starting_pattern = postItemArray["lesson_starting_pattern"];
		
		this.lesson_main_time = postItemArray["lesson_main_time"];
		this.lesson_main_content = postItemArray["lesson_main_content"];
		this.lesson_main_pattern = postItemArray["lesson_main_pattern"];
		
		this.lesson_ending_time = postItemArray["lesson_ending_time"];
		this.lesson_ending_content = postItemArray["lesson_ending_content"];
		this.lesson_ending_pattern = postItemArray["lesson_ending_pattern"];
		
		this.lesson_summary = postItemArray["lesson_summary"];
		this.lesson_comment = postItemArray["lesson_comment"];
		this.lesson_starting_pattern = postItemArray["lesson_starting_pattern"];
		
		this.post_tag = postItemArray["post_tag"];
	
		this.post_createTime = postItemArray["post_createTime"];
		this.post_createFrom_id = postItemArray["post_createFrom_id"];
		this.post_author = postItemArray["post_author"];
		
		this.access_count = postItemArray["access_count"];
		this.post_id = postItemArray["post_id"];
	}
*/
}


// Comment struct 
Comment = function (){
	this.userName = "";
	this.comment_createTime = new Date();
	this.post_id = 0;
	this.content = "";
}


