var mongodb = require('mongodb');		//mongoDB for user
var fs = require("fs");
/*	about DB data structure:
	db:	test
		collection:	userlist:
						[_id,  name, password, email]
					postlist:
						[post_id, post_createFrom_id, course_title, .... , tags:['x','1', ... ,'n']]
					tagslist:
						[_id,  name, count, category]
					commentlist:
						[_id,  userName, comment_createTime, post_id, content]
						
	post_id / post_createFrom_id  --- string type
*/
// get tags for first access	----labelsReply
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
					db.close();
					return TagsArr;
				});
			});
		});
	});
}
// get tags when EDIT a teaching plan	----editTagsReply
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
					db.close();
				});
			});
		});
	});
}

// search post by title		----searchPostReply
exports.mongoDbSearchPost = function(socket, searchStr, sortWay, page){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	  
	console.log('DB search post--- (' + searchStr + " , " +sortWay + " , " +page + ")");
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			switch (sortWay){
				case 'LastChange' :{
					console.log('DB search LastChange, get result');
					collection.find({$or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}}, {'tags':searchStr}]},
									{'post_id':1, 
									'course_title':1, 
									'teaching_goal':1, 
									'origin_createTime':1, 
									'post_createTime':1, 
									'tags':1,
									'_id':1}).sort({'post_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							// var sendArr;
							// sendArr = [{'course_title': "123456"}, {'coure':"123456"}, {'ctitle' : "123456"}];
							var sendArr = new Array(14);
							var len = arr.length;
							if (len != 0){
								for (var i=0; i<10; i++){
									if ((page-1)*10+i >= len)
										break;
									else {
										sendArr[i] = arr[(page-1)*10+i];
										console.log(sendArr[i]);
										//date format : 2010.03.09
										sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
										sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
										sendArr[i]._id = sendArr[i].post_id;
									}
								}
							}
							sendArr[10] = searchStr;
							sendArr[11] = sortWay;
							sendArr[12] = page;
							sendArr[13] = Math.ceil(len/10);
							console.log(sendArr);
							socket.emit('searchPostReply', sendArr);
							db.close();
						});
					});
					break;
				}
				case 'CreateTime' :{
					console.log('DB search CreateTime, get result');
					collection.find({$or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tags':searchStr}]},
									{'post_id':1, 
									'course_title':1, 
									'teaching_goal':1, 
									'origin_createTime':1, 
									'post_createTime':1, 
									'tags':1,
									'_id':1}).sort({'origin_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(14);
							var len = arr.length;
							if (len != 0){
								for (var i=0; i<10; i++){
									if ((page-1)*10+i >= len)
										break;
									else {
										sendArr[i] = arr[(page-1)*10+i];
										console.log(sendArr[i]);
										//date format : 2010.03.09
										sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
										sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
										sendArr[i]._id = sendArr[i].post_id;
									}
								}
							}
							sendArr[10] = searchStr;
							sendArr[11] = sortWay;
							sendArr[12] = page;
							sendArr[13] = Math.ceil(len/10);
							console.log(sendArr);
							socket.emit('searchPostReply', sendArr);
							db.close();
						});
					});
					break;
				}
				case 'AccessCount' :{
					console.log('DB search AccessCount, get result');
					collection.find({$or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tags':searchStr}]},
									{'post_id':1, 
									'course_title':1, 
									'teaching_goal':1, 
									'origin_createTime':1, 
									'post_createTime':1, 
									'tags':1,
									'_id':1}).sort({'access_count':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(14);
							var len = arr.length;
							if (len != 0){
								for (var i=0; i<10; i++){
									if ((page-1)*10+i >= len)
										break;
									else {
										sendArr[i] = arr[(page-1)*10+i];
										console.log(sendArr[i]);
										//date format : 2010.03.09
										sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
										sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
										sendArr[i]._id = sendArr[i].post_id;
									}
								}
							}
							sendArr[10] = searchStr;
							sendArr[11] = sortWay;
							sendArr[12] = page;
							sendArr[13] = Math.ceil(len/10);
							console.log(sendArr);
							socket.emit('searchPostReply', sendArr);
							db.close();
						});
					});
					break;
				}
				default :{
					console.log('DB search Default, get result');
					collection.find({$or:[{'course_title':{$regex:searchStr}}, {'teaching_goal':{$regex:searchStr}},{'tags':searchStr}]},
									{'post_id':1, 
									'course_title':1, 
									'teaching_goal':1, 
									'origin_createTime':1, 
									'post_createTime':1, 
									'tags':1,
									'_id':1}).sort({'post_createTime':-1}, function(err,result){
						result.toArray(function(err,arr){
							var sendArr = new Array(14);
							var len = arr.length;
							if (len != 0){
								for (var i=0; i<10; i++){
									if ((page-1)*10+i >= len)
										break;
									else {
										sendArr[i] = arr[(page-1)*10+i];
										console.log(sendArr[i]);
										//date format : 2010.03.09
										sendArr[i].post_createTime = dateFormat(sendArr[i].post_createTime);
										sendArr[i].origin_createTime = dateFormat(sendArr[i].origin_createTime);
										sendArr[i]._id = sendArr[i].post_id;
									}
								}
							}
							sendArr[10] = searchStr;
							sendArr[11] = sortWay;
							sendArr[12] = page;
							sendArr[13] = Math.ceil(len/10);
							console.log(sendArr);
							socket.emit('searchPostReply', sendArr);
							db.close();
						});
					});
					break;
				}
			}
		});
	});
}

// get one post By post_id		----getOnePostReply
exports.mongoDbGetOnePost = function(socket, post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find({'post_id':post_id},function (err,result){
				result.toArray(function(err, arr){
					var sendArr = new Array();
					console.log('get one post:' + post_id);
					console.log(arr);
					if (arr.length != 0){
						arr[0].origin_createTime = dateFormat(arr[0].origin_createTime);
						arr[0].post_createTime = dateFormat(arr[0].post_createTime);
						
						sendArr = [{'teach-plan-title':arr[0].course_title}, 
								{'teach-plan-creater':arr[0].post_author},
								{'teach-plan-update-date':arr[0].post_createTime},
								{'teach-plan-read-counter':arr[0].access_count},
								{'teach-plan-edit-counter':arr[0].edit_count},
								{'teach-plan-like-counter':arr[0].like_count},
								{'teach-plan-download-counter':arr[0].download_count},
								{'teach-plan-label-group':arr[0].tags},			//tags? teach-plan-label-group
								
								{'teach-plan-coursename':arr[0].course_title}, 
								{'teach-plan-template':arr[0].template_title}, 
								{'teach-plan-course':arr[0].topic}, 
								{'teach-plan-course-last':arr[0].course_time}, 
								{'teach-plan-processing-staff':arr[0].volunteer}, 
								{'teach-plan-processing-grade':arr[0].course_class}, 
								{'teach-plan-background':arr[0].background}, 
								{'teach-plan-prepare-class':arr[0].course_prepare}, 
								{'teach-plan-resources':arr[0].teaching_resource}, 
								{'teach-plan-target':arr[0].teaching_goal}, 
								{'teach-plan-leading-time':arr[0].lesson_starting_time}, 
								{'teach-plan-leading-content':arr[0].lesson_starting_content}, 
								{'teach-plan-leading-requirement':arr[0].lesson_starting_pattern}, 
								{'teach-plan-ongoing-time':arr[0].lesson_main_time}, 
								{'teach-plan-ongoing-content':arr[0].lesson_main_content}, 
								{'teach-plan-ongoing-requirement':arr[0].lesson_main_pattern}, 
								{'teach-plan-ending-time':arr[0].lesson_ending_time}, 
								{'teach-plan-ending-content':arr[0].lesson_ending_content}, 
								{'teach-plan-ending-requirement':arr[0].lesson_ending_pattern}, 
								{'teach-plan-conclusion-time':"empty"}, 
								{'teach-plan-conclusion-content':arr[0].lesson_summary}, 
								{'teach-plan-conclusion-requirement':"empty"}, 
								{'teach-plan-description-time':"empty"}, 
								{'teach-plan-description-content':arr[0].lesson_comment}, 
								{'teach-plan-description-requirement':"empty"}, 
								
								{'origin_createTime':arr[0].origin_createTime},
								{'post_createFrom_id':arr[0].post_createFrom_id},
								{'most_recent':arr[0].most_recent},
								{'post_id':arr[0].post_id}
								];				
						console.log(sendArr);
						// add access count
						collection.update({'post_id':post_id}, {'$inc':{'access_count':1}}, function(err){
							console.log(post_id + ': access_count + 1');
						});
					}
					socket.emit('getOnePostReply', sendArr);
					db.close();
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

// history data -- socket, post_id      historyListReply
exports.mongoDbHistoryData = function(socket, post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	var historyListArray = new Array();
	
	console.log('history search start -------');
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find({'post_id':post_id},{'post_createFrom_id':1, '_id':0}, function (err,result){
				result.toArray(function(err,arr){
					if (arr.length != 0){
						collection.find({$or:[{'post_id':arr[0].post_createFrom_id}, {'post_createFrom_id':arr[0].post_createFrom_id}]},
							{'post_id':1, '_id':0, 'course_title':1, 'post_createTime':1, 'like_count':1, 'post_author':1
							}).sort({'post_createTime':-1}, function(err,result){
							result.toArray(function(err,arr){
								for (var i=0; i< arr.length; i++){
									arr[i].post_createTime = dateFormat(arr[i].post_createTime);
									historyListArray[i] = arr[i];
								}
								console.log('get history:');
								console.log(historyListArray);
								socket.emit('historyListReply',historyListArray);
								db.close();
							});
						})
					}
					else {db.close();}
				});
			});
		});
	});
};

// XML document download
exports.downloadOnePostXML = function(post_id, res){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.find({'post_id':post_id},function (err,result){
				result.toArray(function(err, arr){
					console.log(arr);
					if (arr.length != 0){
						arr[0].origin_createTime = dateFormat(arr[0].origin_createTime);
						arr[0].post_createTime = dateFormat(arr[0].post_createTime);
						
						var sendStr = 
							'<?xml version="1.0" encoding="UTF-8"?>' +
							'<xclose>' +
								'<discript>' +
									'<coursename>' + arr[0].course_title +'</coursename>' +
									'<template>' + arr[0].template_title + '</template>' +
									'<course>' + arr[0].topic + '</course>' +
									'<classhour>' + arr[0].course_time + '</classhour>' +
									'<lecturer>' + arr[0].volunteer + '</lecturer>'+
									'<target>' + arr[0].course_class + '</target>' +
								'</discript>'+
	
								'<background>' + arr[0].background + '</background>' +
								'<prepare>' + arr[0].course_prepare + '</prepare>' +
								'<resources>' + arr[0].teaching_resource + '</resources>' +
								'<goals>'+ arr[0].teaching_goal +'</goals>'+
								'<content>'+
									'<prelimnary>'+
										'<time>'+ arr[0].lesson_starting_time +'</time>'+
										'<main>'+ arr[0].lesson_starting_content +'</main>'+
										'<method>'+ arr[0].lesson_starting_pattern +'</method>'+
									'</preliminary>'+
									'<inclass>'+
										'<time>'+ arr[0].lesson_main_time +'</time>'+
										'<main>'+ arr[0].lesson_main_content +'</main>'+
										'<method>'+ arr[0].lesson_main_pattern +'</method>'+
									'</inclass>'+
									'<afterclass>'+
										'<time>'+ arr[0].lesson_ending_time +'</time>'+
										'<main>'+ arr[0].lesson_ending_content +'</main>'+
										'<method>' + arr[0].lesson_ending_pattern +'</method>'+
									'</afterclass>'+
									'<conclusion>'+
										'<time></time>'+
										'<main>'+ arr[0].lesson_summary +'</main>'+
										'<method></method>'+
									'</conclusion>'+
									'<yourcomment>'+
										'<time></time>'+
										'<main>'+ arr[0].lesson_comment +'</main>'+
										'<method></method>'+
									'</yourcomment>'+
									'<lables>'+
										'<time></time>'+
										'<main>' + arr[0].tags +'</main>'+
										'<method></method>'+
									'</lables>'+
								'</content>'+
							'</xclose>' ;		
						res.writeHead(200, {
							"Content-Type": "application/octet-stream",
							"Content-Disposition": "attachment; filename=" + arr[0].course_title + ".xml"
						});
						res.write(sendStr);
						res.end();
					}
					else {
						res.end();
					}
					db.close();
				});
			});
		});
	});
}

// change post --- 
// input: req.body, post_id, username
// output: res.write(/teach-plan)
exports.mongoDbChangePost = function(req, res, post_id, username){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			// change post Init
			var temp_post_createFrom_id = -1;
			var temp_origin_createTime = new Date();
			var temp_post_createTime = new Date();
			var temp_access_count = 0;
			var temp_edit_count = 0;
			var temp_like_count = 0;
			var temp_download_count = 0;
			var temp_most_recent = 1;
			var temp_tags = new Array();
			
			// get username 
			if (username == undefined)
				username = 'default';
			// get tags by array index 27--n
			var counter = 0;
			for (item in req.body){
				counter++;
				if (counter >= 27)
					temp_tags[counter-27] = item;
			}
			console.log(temp_tags);
			// change
			collection.find({'post_id':post_id}, 
							{'name':1, 'origin_createTime':1, 'post_createFrom_id':1, 'post_id':1, 'edit_count':1},function(err,result){
				result.toArray(function(err, arr){
					if (arr.length !== 0){
						console.log('Already have a post, to Change Post');
						temp_post_createFrom_id	= arr[0].post_createFrom_id;
						temp_origin_createTime = arr[0].origin_createTime;
						temp_edit_count = arr[0].edit_count;
						
						// source post is NOT the most recent
						collection.update({'post_id':post_id}, {'$inc':{'most_recent':-1}}, function(err){
							// only 'tags' needs origin name , save post
							collection.save({'course_title':req.body['teach-plan-coursename'], 
									'template_title':req.body['teach-plan-template'], 
									'topic':req.body['teach-plan-course'], 
									'course_time':req.body['teach-plan-course-last'], 
									'volunteer':req.body['teach-plan-processing-staff'], 
									'course_class':req.body['teach-plan-processing-grade'], 
									'background':req.body['teach-plan-background'], 
									'course_prepare':req.body['teach-plan-prepare-class'], 
									'teaching_resource':req.body['teach-plan-resources'], 
									'teaching_goal':req.body['teach-plan-target'], 
									'lesson_starting_time':req.body['teach-plan-leading-time'], 
									'lesson_starting_content':req.body['teach-plan-leading-content'], 
									'lesson_starting_pattern':req.body['teach-plan-leading-requirement'], 
									'lesson_main_time':req.body['teach-plan-ongoing-time'], 
									'lesson_main_content':req.body['teach-plan-ongoing-content'], 
									'lesson_main_pattern':req.body['teach-plan-ongoing-requirement'], 
									'lesson_ending_time':req.body['teach-plan-ending-time'], 
									'lesson_ending_content':req.body['teach-plan-ending-content'], 
									'lesson_ending_pattern':req.body['teach-plan-ending-requirement'], 
									'lesson_summary':req.body['teach-plan-conclusion-content'], 
									'lesson_comment':req.body['teach-plan-description-content'], 
									'tags':temp_tags,
									'post_author':username,
									
									'post_createFrom_id':temp_post_createFrom_id, 
									'access_count':temp_access_count,
									'edit_count':temp_edit_count,
									'like_count':temp_like_count,
									'download_count':temp_download_count,
									'post_createTime':temp_post_createTime, 
									'origin_createTime':temp_origin_createTime, 
									'most_recent':temp_most_recent,
									'post_id':'-1'	// signal for reconstruct
									}, function(){
										collection.find({'post_id':'-1'},{'_id':1},function(err,result){
											result.toArray(function(err,arr){
												console.log('-- REconstruct post_id');		// only the new post can be found
												console.log(arr);
												if (arr.length != 0){
													collection.update({'_id':arr[0]._id},{$set:{'post_id':arr[0]._id.toString()}},
																	function(){
														// return teach-plan after update
														res.writeHead(200, {
															"Set-Cookie": [ "post_id=" + arr[0]._id.toString()],
															"Content-Type": "text/html"
														});
														res.write(fs.readFileSync(__dirname + '/static/teach-plan.html', 'utf-8'));
														res.end();
													});
												}
												else {
													// return index after err
													res.writeHead(200, {"Content-Type": "text/html"});
													res.write(fs.readFileSync(__dirname + '/static/index.html', 'utf-8'));
													res.end();
												}
											});
											collection.update({'_id':arr[0]._id}, {'$inc':{'edit_count':1}}, function(err){
												console.log(post_id + ': edit_count + 1');
											});
										});
									});
						});
					} else {
						console.log('No match id, to New Post');
						// only 'tags' needs origin name 
						collection.save({'course_title':req.body['teach-plan-coursename'], 
									'template_title':req.body['teach-plan-template'], 
									'topic':req.body['teach-plan-course'], 
									'course_time':req.body['teach-plan-course-last'], 
									'volunteer':req.body['teach-plan-processing-staff'], 
									'course_class':req.body['teach-plan-processing-grade'], 
									'background':req.body['teach-plan-background'], 
									'course_prepare':req.body['teach-plan-prepare-class'], 
									'teaching_resource':req.body['teach-plan-resources'], 
									'teaching_goal':req.body['teach-plan-target'], 
									'lesson_starting_time':req.body['teach-plan-leading-time'], 
									'lesson_starting_content':req.body['teach-plan-leading-content'], 
									'lesson_starting_pattern':req.body['teach-plan-leading-requirement'], 
									'lesson_main_time':req.body['teach-plan-ongoing-time'], 
									'lesson_main_content':req.body['teach-plan-ongoing-content'], 
									'lesson_main_pattern':req.body['teach-plan-ongoing-requirement'], 
									'lesson_ending_time':req.body['teach-plan-ending-time'], 
									'lesson_ending_content':req.body['teach-plan-ending-content'], 
									'lesson_ending_pattern':req.body['teach-plan-ending-requirement'], 
									'lesson_summary':req.body['teach-plan-conclusion-content'], 
									'lesson_comment':req.body['teach-plan-description-content'], 
									'tags':temp_tags,
									'post_author':username,
									
									'post_createFrom_id':temp_post_createFrom_id.toString(), 
									'access_count':temp_access_count,
									'edit_count':temp_edit_count,
									'like_count':temp_like_count,
									'download_count':temp_download_count,
									'post_createTime':temp_post_createTime, 
									'origin_createTime':temp_origin_createTime, 
									'most_recent':temp_most_recent,
									'post_id':'-1'			// signal for reconstruct
									}, function(){
										collection.find({'post_id':'-1'},{'_id':1},function(err,result){
											result.toArray(function(err,arr){
												console.log('-- REconstruct post_id');		// only the new post can be found
												console.log(arr);
												if (arr.length != 0){
													collection.update({'_id':arr[0]._id},{$set:{'post_id':arr[0]._id.toString()}},
																	function(){
														// return teach-plan after update
														res.writeHead(200, {
															"Set-Cookie": [ "post_id=" + arr[0]._id.toString()],
															"Content-Type": "text/html"
														});
														res.write(fs.readFileSync(__dirname + '/static/teach-plan.html', 'utf-8'));
														res.end();
													});
												}
												else {
													// return index after err
													res.writeHead(200, {"Content-Type": "text/html"});
													res.write(fs.readFileSync(__dirname + '/static/index.html', 'utf-8'));
													res.end();
												}
											});
											collection.update({'_id':arr[0]._id}, {'$inc':{'edit_count':1}}, function(err){
												console.log(post_id + ': edit_count + 1');
											});
										});
									});
					}
				});
			});
		});
	});
};

// Add post access_count
exports.mongoDbAddAccessCount = function(post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.update({'post_id':post_id}, {'$inc':{'access_count':1}}, function(err){
				console.log(post_id + ': access_count + 1');
			});
		});
	});
};

// Add post edit_count
exports.mongoDbAddEditCount = function(post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.update({'post_id':post_id}, {'$inc':{'edit_count':1}}, function(err){
				console.log(post_id + ': edit_count + 1');
				db.close();
			});
		});
	});
};

// Add post download_count
exports.mongoDbAddDownloadCount = function(post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.update({'post_id':post_id}, {'$inc':{'download_count':1}}, function(err){
				console.log(post_id + ': download_count + 1');
				db.close();
			});
		});
	});
};

// Add post like_count
exports.mongoDbAddLikeCount = function(post_id){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			collection.update({'post_id':post_id}, {'$inc':{'like_count':1}}, function(err){
				console.log(post_id + ': like_count + 1');
				db.close();
			});
		});
	});
};



//--------------------------------------------------test unfinished

// new post -- newPostArr from
exports.mongoDbNewPost = function(newPostArr){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	
	mgconnect.open(function (err, db) {	  
		db.collection('postlist', function (err, collection) {
			// new post Init
			var temp_post_createFrom_id = -1;
			var temp_origin_createTime = new Date();
			var temp_post_createTime = new Date();
			var temp_access_count = 0;
			var temp_edit_count = 0;
			var temp_download_count = 0;
			var temp_most_recent = 1;
			// save
			collection.save({'course_title':newPostArr['teach-plan-coursename'], 
						'template_title':newPostArr['teach-plan-template'], 
						'topic':newPostArr['teach-plan-course'], 
						'course_time':newPostArr['teach-plan-course-last'], 
						'volunteer':newPostArr['teach-plan-processing-staff'], 
						'course_class':newPostArr['teach-plan-processing-grade'], 
						'background':newPostArr['teach-plan-background'], 
						'course_prepare':newPostArr['teach-plan-prepare-class'], 
						'teaching_resource':newPostArr['teach-plan-resources'], 
						'teaching_goal':newPostArr['teach-plan-target'], 
						'lesson_starting_time':newPostArr['teach-plan-leading-time'], 
						'lesson_starting_content':newPostArr['teach-plan-leading-content'], 
						'lesson_starting_pattern':newPostArr['teach-plan-leading-requirement'], 
						'lesson_main_time':newPostArr['teach-plan-ongoing-time'], 
						'lesson_main_content':newPostArr['teach-plan-ongoing-content'], 
						'lesson_main_pattern':newPostArr['teach-plan-ongoing-requirement'], 
						'lesson_ending_time':newPostArr['teach-plan-ending-time'], 
						'lesson_ending_content':newPostArr['teach-plan-ending-content'], 
						'lesson_ending_pattern':newPostArr['teach-plan-ending-requirement'], 
						'lesson_summary':newPostArr['teach-plan-conclusion-content'], 
						'lesson_comment':newPostArr['teach-plan-description-content'], 
						'tags':newPostArr['teach-plan-label-group'], 	//tags? teach-plan-label-group
						
						'post_createFrom_id':temp_post_createFrom_id.toString(), 
						'access_count':temp_access_count,
						'edit_count':temp_edit_count,
						'download_count':temp_download_count,
						'post_createTime':temp_post_createTime, 
						'origin_createTime':temp_origin_createTime, 
						'most_recent':temp_most_recent,
						'post_id':'-1'
						}, function(){
							collection.find({'post_id':'-1'},{'_id':1},function(err,result){
								result.toArray(function(err,arr){
									console.log('-- construct post_id');
									console.log(arr);
									for (var i=0; i<arr.length; i++){
										collection.update({'_id':arr[i]._id},{$set:{'post_id':arr[i]._id.toString()}});
									}
								});
							});
						});
			console.log(newPostArr);
		});
	});
};

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
						db.close();
						return false;
					}
					else {
						collection.save({'name':name, 'password':password, 'email':email}, function(){
							db.close();
						});
						console.log('user register success');
						return true;
					}
				});
			});
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
						db.close();
						return true;
					} else if (arr.length == 0){
						console.log('login info error');
						db.close();
						return false;
					}
				});
			});
		});
	});
}

// update Comments -------

/* ALL Main Structure

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
	this.post_author = "";
	
	// (stable data)x4 : Only Change In Server
	// This post created from post_id=???		-1 means Origin
	this.post_createFrom_id = -1;		
	// show post count  						when Access in showpage, count+1
	this.access_count = 0;
	// edit post count
	this.edit_count = 0;
	// download post count
	this.download_count = 0;
	
	// post ID									Only ID for One saved Post
	this.post_id = '0';		//key--: post_id
	
	// first vaesion create time				if (createFrom=_id), then (origin_createTime =  post[_id].origin_createTime)
	this.origin_createTime = new Date();
	// this post create time
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

*/