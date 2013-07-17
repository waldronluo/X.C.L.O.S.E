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

// use connect
var app = connect();
app.use(connect.logger('dev'));
app.use(connect.static(__dirname + '/static'));


// http server
var server = http.createServer(app);
server.listen(portNumber, listenAddr);
var io = socketio.listen(server);
io.set('log level', 2);
console.log("Server Start on: http "+listenAddr +':'+portNumberDefault);

// Login Users : User{name,password}
var userArray = [];

// for http parameter parser
var firstPathname = "/";
var queryStrArray = [];

// io.socket
io.sockets.on('connection', function (socket){
	console.log('start connect');
	console.log("firstPathname = " + firstPathname);
	
	// deal with page changes
	console.log('tags start');
	if (firstPathname == "/"){
		mongoDBGetTags(socket);		//input socket to send result after DB finished
		console.log('tags send');
	}
	console.log('search start');
	if (firstPathname == "/search"){
		// search mode : LastChange / CreateTime / AccessCount
		mongoDbSearchPost(socket,
						queryStrArray['searchStr'],
						queryStrArray['sortWay'],
						queryStrArray['page'] );
		console.log('search send');
	}
	if (firstPathname == "/teach-plan"){
		
	}
	if (firstPathname == "/teach-plan-edit"){
	
		
	}
			
	// login
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
	firstPathname = "/"
	console.log("Request for " + pathname + " received.");
	
	if (pathname == "/" || pathname == ""){
		firstPathname = "/";
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/index.html', 'utf-8'));
		res.end();
	}
	if (pathname == "/search"){
		firstPathname = "/search";
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/search.html', 'utf-8'));
		res.end();
		
		//	url sample:		http://127.0.0.1:8089/search?method=123&searchStr=hello&page=1&sortWay=LastChange
		
	//	queryStrArray['method'] = querystring.parse(url.parse(req.url).query)['method'];
		queryStrArray['searchStr'] = querystring.parse(url.parse(req.url).query)['searchStr'];
		queryStrArray['sortWay'] = querystring.parse(url.parse(req.url).query)['sortWay'];
		queryStrArray['page'] = querystring.parse(url.parse(req.url).query)['page'];
		
		console.log(queryStrArray);
	}
	if (pathname == "/teach-plan"){
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/teach-plan.html', 'utf-8'));
		res.end();
		firstPathname = "/teach-plan";
	}
	if (pathname == "/teach-plan-edit"){
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(fs.readFileSync(__dirname + '/static/teach-plan-edit.html', 'utf-8'));
		res.end();
		firstPathname = "/teach-plan-edit";
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
function mongoDBGetTags(socket){
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
	  
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			switch (sortWay){
				case 'LastChange' :{
					collection.find({'most_recent':1, $or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}}, {'tag':searchStr}]},
									{'_id':1, 'course_title':1, 'teaching_goal':1, 'origin_createTime':1, 
									'post_createTime':1, 'post_tag':1}).sort({'post_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(10);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else sendArr[i] = arr[(page-1)*10+i];
							}
							socket.emit('searchPostReply', sendArr);
						});
					});
					break;
				}
				case 'CreateTime' :{
					collection.find({'most_recent':1, $or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tag':searchStr}]},
									{'_id':1, 'course_title':1, 'teaching_goal':1, 'origin_createTime':1, 
									'post_createTime':1, 'post_tag':1}).sort({'origin_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(10);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else sendArr[i] = arr[(page-1)*10+i];
							}
							socket.emit('searchPostReply', sendArr);
						});
					});
					break;
				}
				case 'AccessCount' :{
					collection.find({'most_recent':1, $or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tag':searchStr}]},
									{'_id':1, 'course_title':1, 'teaching_goal':1, 'origin_createTime':1, 
									'post_createTime':1, 'post_tag':1}).sort({'access_count':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(10);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else sendArr[i] = arr[(page-1)*10+i];
							}
							socket.emit('searchPostReply', sendArr);
						});
					});
					break;
				}
				default :{
					collection.find({'most_recent':1, $or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tag':searchStr}]},
									{'_id':1, 'course_title':1, 'teaching_goal':1, 'origin_createTime':1, 
									'post_createTime':1, 'post_tag':1}).sort({'post_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(10);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else sendArr[i] = arr[(page-1)*10+i];
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



// update one post access_count
function mongoDbUpdatePostCount(post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.update({'_id':post_id}, {'$inc':{'access_count':1}}, function(err){
				return;
			});
		});
	});
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


function EncodeUtf8(s1)
  {
      var s = escape(s1);
      var sa = s.split("%");
      var retV ="";
      if(sa[0] != "")
      {
         retV = sa[0];
      }
      for(var i = 1; i < sa.length; i ++)
      {
           if(sa[i].substring(0,1) == "u")
           {
               retV += Hex2Utf8(Str2Hex(sa[i].substring(1,5)));
               
           }
           else retV += "%" + sa[i];
      }
      
      return retV;
  }
function Str2Hex(s)
  {
      var c = "";
      var n;
      var ss = "0123456789ABCDEF";
      var digS = "";
      for(var i = 0; i < s.length; i ++)
      {
         c = s.charAt(i);
         n = ss.indexOf(c);
         digS += Dec2Dig(eval(n));
           
      }
      //return value;
      return digS;
  }
function Dec2Dig(n1)
  {
      var s = "";
      var n2 = 0;
      for(var i = 0; i < 4; i++)
      {
         n2 = Math.pow(2,3 - i);
         if(n1 >= n2)
         {
            s += '1';
            n1 = n1 - n2;
          }
         else
          s += '0';
          
      }
      return s;
      
  }
function Dig2Dec(s)
  {
      var retV = 0;
      if(s.length == 4)
      {
          for(var i = 0; i < 4; i ++)
          {
              retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
          }
          return retV;
      }
      return -1;
  } 
function Hex2Utf8(s)
  {
     var retS = "";
     var tempS = "";
     var ss = "";
     if(s.length == 16)
     {
         tempS = "1110" + s.substring(0, 4);
         tempS += "10" +  s.substring(4, 10); 
         tempS += "10" + s.substring(10,16); 
         var sss = "0123456789ABCDEF";
         for(var i = 0; i < 3; i ++)
         {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i)+1)*8);
            
            
            
            retS += sss.charAt(Dig2Dec(ss.substring(0,4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4,8)));
         }
         return retS;
     }
     return "";
  }

function revertUTF8(szInput)
 {
    var x,wch,wch1,wch2,uch="",szRet="";
    for (x=0; x<szInput.length; x++)
    {
        if (szInput.charAt(x)=="%")
        {
            wch =parseInt(szInput.charAt(++x) + szInput.charAt(++x),16);
            if (!wch) {break;}
            if (!(wch & 0x80))
            {
                wch = wch;
            }
            else if (!(wch & 0x20))
            {
                x++;
                wch1 = parseInt(szInput.charAt(++x) + szInput.charAt(++x),16);
                wch  = (wch & 0x1F)<< 6;
                wch1 = wch1 & 0x3F;
                wch  = wch + wch1;
            }
            else
            {
                x++;
                wch1 = parseInt(szInput.charAt(++x) + szInput.charAt(++x),16);
                x++;
                wch2 = parseInt(szInput.charAt(++x) + szInput.charAt(++x),16);
                wch  = (wch & 0x0F)<< 12;
                wch1 = (wch1 & 0x3F)<< 6;
                wch2 = (wch2 & 0x3F);
                wch  = wch + wch1 + wch2;
            }
            szRet += String.fromCharCode(wch);
        }
        else
        {
            szRet += szInput.charAt(x);
        }
    }
    return(szRet);
}

