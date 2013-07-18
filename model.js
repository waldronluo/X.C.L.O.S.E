var mongodb = require('mongodb');		//mongoDB for user
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
exports.mongoDbGetTags = function(socket){
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
// get tags when EDIT a teaching plan
exports.mongoDbGetTagsForEdit = function(socket){
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

					socket.emit('editTagsReply', TagsArr);
					return TagsArr;
				});
			});
		});
	});
}

// search post by title
exports.mongoDbSearchPost = function(socket, searchStr, sortWay, page){
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
							// var sendArr = new Array(1);
							// sendArr[0] = [{'course_title': "123456"}, {'coure':"123456"}, {'ctitle' : "123456"}];
							var sendArr = new Array(14);
							var len = arr.length;
							for (var i=0; i<10; i++){
								if ((page-1)*10+i >= len)
									break;
								else {
									sendArr[i] = arr[(page-1)*10+i];
									//date format : 2010.03.09
									sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
									sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
								}
							}
							sendArr[10] = searchStr;
							sendArr[11] = sortWay;
							sendArr[12] = page;
							sendArr[13] = Math.ceil(len/10);
							console.log(sendArr);
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
							sendArr[10] = searchStr;
							sendArr[11] = sortWay;
							sendArr[12] = page;
							sendArr[13] = Math.ceil(len/10);
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
							sendArr[10] = searchStr;
							sendArr[11] = sortWay;
							sendArr[12] = page;
							sendArr[13] = Math.ceil(len/10);
							console.log(sendArr);
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
							sendArr[10] = searchStr;
							sendArr[11] = sortWay;
							sendArr[12] = page;
							sendArr[13] = Math.ceil(len/10);
							console.log(sendArr);
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
exports.mongoDbGetOnePost = function(socket, post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.update({'_id':post_id}, {'$inc':{'access_count':1}}, function(err){});
			collection.find({'_id':post_id}, function (err,result){
				result.toArray(function(err, arr){
					arr[0].origin_createTime = dateFormat(arr[0].origin_createTime);
					arr[0].post_createTime = dateFormat(arr[0].post_createTime);
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
exports.mongoDbNewUser = function(name, password, email){
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
exports.mongoDbCheckUser = function(name, password){
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


// new post by {}
// return: T/F----------------------------
exports.mongoDbNewPost = function(newPostArr){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find({'course_title': (newPostArr['course_title']), 'most_recent':1} , 
							{'name':1, 'origin_createTime':1, '_id':1},function(err,result){
				result.toArray(function(err, arr){	
					if (arr.length !== 0){
						console.log('already have a post, to Change Post');
						newPostArr['origin_createTime'] = arr[0].origin_createTime;
						newPostArr['post_createTime'] = new Date();
						newPostArr['post_createFrom_id'] = arr[0]._id;
						collection.update({'_id':arr[0]._id}, {'$inc':{'most_recent':-1}}, function(err){});
					} else {
						console.log('new post start');
						newPostArr['origin_createTime'] = new Date();
						newPostArr['post_createTime'] = new Date();
						newPostArr['post_createFrom_id'] = -1;
					}
					newPostArr['most_recent'] = 1;
					console.log(newPostArr);
					// only 'tags' needs origin name
					// count=0, createFrom=-1, post_id=_id (Auto generated), 
					collection.save({'course_title':newPostArr['course_title'], 
									'template_title':newPostArr['template_title'], 
									'topic':newPostArr['topic'], 
									'course_time':newPostArr['course_time'], 
									'volunteer':newPostArr['volunteer'], 
									'course_class':newPostArr['course_class'], 
									'background':newPostArr['background'], 
									'course_prepare':newPostArr['course_prepare'], 
									'teaching_resource':newPostArr['teaching_resource'], 
									'teaching_goal':newPostArr['teaching_goal'], 
									'lesson_starting_time':newPostArr['lesson_starting_time'], 
									'lesson_starting_content':newPostArr['lesson_starting_content'], 
									'lesson_starting_pattern':newPostArr['lesson_starting_pattern'], 
									'lesson_main_time':newPostArr['lesson_main_time'], 
									'lesson_main_content':newPostArr['lesson_main_content'], 
									'lesson_main_pattern':newPostArr['lesson_main_pattern'], 
									'lesson_ending_time':newPostArr['lesson_ending_time'], 
									'lesson_ending_content':newPostArr['lesson_ending_content'], 
									'lesson_ending_pattern':newPostArr['lesson_ending_pattern'], 
									'lesson_summary':newPostArr['lesson_summary'], 
									'lesson_comment':newPostArr['lesson_comment'], 
									'tags':newPostArr['post_tag'],
									'post_createFrom_id':newPostArr['post_createFrom_id'], 
									'access_count':newPostArr['access_count'],
									'origin_createTime':newPostArr['origin_createTime'],
									'post_createTime':newPostArr['post_createTime'],
									'post_createFrom_id':newPostArr['post_createFrom_id']});
				});
			});
		});
	});
}

// change post 
// return: 
exports.mongoDbChangePost = function(changePostArr){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find({'course_title': (newPostArr['course_title']), 'most_recent':1} , 
							{'name':1, 'origin_createTime':1, '_id':1},function(err,result){
				result.toArray(function(err, arr){	
					if (arr.length !== 0){
						console.log('already have a post, to Change Post');
						newPostArr['origin_createTime'] = arr[0].origin_createTime;
						newPostArr['post_createTime'] = new Date();
						newPostArr['post_createFrom_id'] = arr[0]._id;
						collection.update({'_id':arr[0]._id}, {'$inc':{'most_recent':-1}}, function(err){});
					} else {
						console.log('new post start');
						newPostArr['origin_createTime'] = new Date();
						newPostArr['post_createTime'] = new Date();
						newPostArr['post_createFrom_id'] = -1;
					}
					newPostArr['most_recent'] = 1;
					console.log(newPostArr);
					// only 'tags' needs origin name
					// count=0, createFrom=-1, post_id=_id (Auto generated), 
					collection.save({'course_title':newPostArr['course_title'], 
									'template_title':newPostArr['template_title'], 
									'topic':newPostArr['topic'], 
									'course_time':newPostArr['course_time'], 
									'volunteer':newPostArr['volunteer'], 
									'course_class':newPostArr['course_class'], 
									'background':newPostArr['background'], 
									'course_prepare':newPostArr['course_prepare'], 
									'teaching_resource':newPostArr['teaching_resource'], 
									'teaching_goal':newPostArr['teaching_goal'], 
									'lesson_starting_time':newPostArr['lesson_starting_time'], 
									'lesson_starting_content':newPostArr['lesson_starting_content'], 
									'lesson_starting_pattern':newPostArr['lesson_starting_pattern'], 
									'lesson_main_time':newPostArr['lesson_main_time'], 
									'lesson_main_content':newPostArr['lesson_main_content'], 
									'lesson_main_pattern':newPostArr['lesson_main_pattern'], 
									'lesson_ending_time':newPostArr['lesson_ending_time'], 
									'lesson_ending_content':newPostArr['lesson_ending_content'], 
									'lesson_ending_pattern':newPostArr['lesson_ending_pattern'], 
									'lesson_summary':newPostArr['lesson_summary'], 
									'lesson_comment':newPostArr['lesson_comment'], 
									'tags':newPostArr['post_tag'],
									'post_createFrom_id':newPostArr['post_createFrom_id'], 
									'access_count':newPostArr['access_count'],
									'origin_createTime':newPostArr['origin_createTime'],
									'post_createTime':newPostArr['post_createTime'],
									'post_createFrom_id':newPostArr['post_createFrom_id']});
				});
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
	this.post_id = 0;		//key--: _id
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

