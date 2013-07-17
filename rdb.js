// use Node.js to start this 
// 

var mongodb = require('mongodb');
var mgserver = new mongodb.Server('127.0.0.1',27017);
var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	  

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
	this.post_createTime = new Date();
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

	  
	  
	  
mgconnect.open(function (err, db) {	 
	// init user		x 4
	db.createCollection('userlist'); 
	db.collection('userlist', function (err, collection) {
		collection.save({'name':'aaa', 'password':'111', 'email':'aaa@qq.com'});
		collection.save({'name':'bbb', 'password':'222', 'email':'bbb@niubi.com'});
		collection.save({'name':'zhang', 'password':'123456', 'email':'hey@qq.com'});
		collection.save({'name':'lou', 'password':'654321', 'email':'hello@niubi.com'});
		console.log('hehe');
	});
	console.log('main 1');
	
	//init post			x 20
	db.createCollection('postlist');
	db.collection('postlist', function (err, collection) {
	
var counter = 100;
var tempDate = new Date();
var staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '家乡大发现';
	newPost.teaching_goal = '让同学们用善于发掘的眼光去发现身边的资源，利用身边的资源，增强学生对连南大麦山乡土认同。';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate = tempDate.getDate() + 20;
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['乡土认同', '自然教育', '社会能力', '大麦山'];
	
	newPost.lesson_starting_content = '1.家乡，是指自己小时候生长的地方或祖籍，又被称为“故乡”、“老家”、“故园”等。，在英文是“hometown” ，简单解释讲了hometown的组成。家乡的概念，那让我了解一下家乡要素有什么，家乡有什么？（5min 讨论时间，5min的总结，分享）\n（ps：因为是两个班合在一起上课，所以有一个班相对来说会比较积极）\n2.家乡是个比较泛的概念，可以很大可以由大到小。由省，市，县，到镇。\n提问：当别人问你们，你们的老家是哪的时候，你们要怎么回答呢？（是回答清远，连南，还是大麦山呢？）（3min）\n学生反映有广东，清远，连南，大麦山；\n那你们知道唯一姐姐的家乡是哪不？我们其他的义工哥哥姐姐是哪里人不？（鼓励回答）（唯一的家乡是潮汕，在她们回答是“四川”的时候，有一个互动）大概介绍了潮汕的地理位置。引出连南与潮汕的不同之处，瑶族与汉族的区别，为下面引出“瑶族文化”的话题；\n 连南瑶族大麦山vs 潮汕\n要素：衣食住行（三个小组讨论，入主义工进行引导）（15mins的讨论）\n学生都很投入地讨论了关于衣食住行的家乡特点，效果较好\n家乡有特殊的语言，特殊的建筑房屋，特殊的服装，特殊的风俗习惯，让我们一起去发现我们大麦山，连南的资源\nA.让学生们试着找一些瑶族歌曲或本地歌曲，或者用家乡话把《家乡》改编，小组任务。\nB.布置作业，以“家乡”为题，个人或小组皆可，完成“发现家乡大麦山的美”的作业。建议：任选大麦山的任何一个方面，可以是历史，歌舞，建筑，房屋，特产等等的展示，可以通过观察或问家人，亲戚，就地取材等等';
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
					'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
					'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
					'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
					'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
					'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
					'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
					'tags':newPost.post_tag,
					'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
					'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, '_id':newPost.post_id});
}

counter = 222;
tempDate = new Date();
staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '家乡特色';
	newPost.teaching_goal = '增强他们对家乡的认同感，以及对家乡的了解。';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate = tempDate.getDate() + 20;
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['乡土认同', '自然教育', '社会能力', '大麦山'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
					'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
					'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
					'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
					'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
					'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
					'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
					'tags':newPost.post_tag,
					'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
					'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, '_id':newPost.post_id});
}

counter = 835;
tempDate = new Date();
staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '特产大变身';
	newPost.teaching_goal = '让学生了解家乡特产变身方法，发挥想象';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate = tempDate.getDate() + 20;
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['乡土认同', '互动游戏', '白湾'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
					'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
					'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
					'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
					'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
					'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
					'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
					'tags':newPost.post_tag,
					'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
					'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, '_id':newPost.post_id});
}

counter = 159;
tempDate = new Date();
staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '基础数学课教案';
	newPost.teaching_goal = '让学生了解基本的数学算术知识';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate = tempDate.getDate() + 20;
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['数理化', '服务学习'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
					'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
					'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
					'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
					'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
					'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
					'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
					'tags':newPost.post_tag,
					'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
					'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, '_id':newPost.post_id});
}

counter = 1057;
tempDate = new Date();
staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '乡土认同';
	newPost.teaching_goal = '学生对自己家乡有具体、全面、系统的了解认知；通过不同形式的课程活动，让学生体验家乡的美丽及魅力，产生对家乡的认同和喜爱之情。';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate = tempDate.getDate() + 20;
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['陪伴成长', '情感教育', '乡土认同', '自然教育'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
					'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
					'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
					'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
					'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
					'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
					'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
					'tags':newPost.post_tag,
					'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
					'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, '_id':newPost.post_id});
}

		console.log('keke');
	});
	console.log('main 2');
	 
	////init tags			x 16
	db.collection('tagslist', function (err, collection) {
		
		var arr = ['灯塔理念',['乡土认同', '陪伴成长', '服务学习']];
		for (var i=0;i<3; i++){
			collection.save({'category': arr[0], 'count':2*i+1, 'name':arr[1][i]})
		}
			
		arr = ['多元课程',['自然教育', '互动游戏', '综合性活动', '戏剧教育', '学生工作']];
		for (var i=0;i<5; i++){
			collection.save({'category': arr[0], 'count':i+1, 'name':arr[1][i]})
		}
		
		arr = ['学科教案',['文史哲', '数理化', '地理', '体育', '英语']];
		for (var i=0;i<5; i++){
			collection.save({'category': arr[0], 'count':i, 'name':arr[1][i]})
		}
		
		arr = ['能力提升',['求职能力', '表达能力', '社会能力']];
		for (var i=0;i<3; i++){
			collection.save({'category': arr[0], 'count':5-i, 'name':arr[1][i]})
		}
		
	});
	console.log('main 3');
	 
	db.collection('postlist_test', function (err, collection) {
		collection.find(function(err, result){
			result.toArray(function(err, arr){
					console.log(arr);
			});
		});
	});
});

/*
post----------------------------------------

家乡大发现
	让同学们用善于发掘的眼光去发现身边的资源，利用身边的资源，增强学生对连南大麦山乡土认同。
	2011.9.10
	2012.8.8
	2013.1.2
	2013.5.6
	乡土认同  自然教育  社会能力  大麦山
	
家乡特色
	增强他们对家乡的认同感，以及对家乡的了解。
	2011.9.17
	2012.9.10
	2013.1.2
	2013.5.2
	乡土认同  自然教育  社会能力  大麦山
	
特产大变身
	让学生了解家乡特产变身方法，发挥想象
	2011.8.12
	2012.8.8
	2012.9.10
	2013.4.26
	乡土认同   互动游戏   白湾
	
乡土认同
	学生对自己家乡有具体、全面、系统的了解认知；通过不同形式的课程活动，让学生体验家乡的美丽及魅力，产生对家乡的认同和喜爱之情。
	2012.1.4
	2012.8.8
	2013.1.2
	2013.4.10
	乡土认同   甘洒   自然教育   陪伴成长   情感教育

我的瑶服我做主之第一课【系列教案】
	增强他们对瑶服的喜欢度，增强家乡的民族意识
	2013.3.1
	2012.9.10
	2013.1.2
	2013.4.2
	乡土认同  桥头  情感教育  社会能力

基础数学课教案
	让学生了解基本的数学算术知识
	2013.1.2
	2013.1.23
	2013.3.10
	2013.4.2
	数理化  服务学习
	*/

/*
tags -----------------------------

灯塔理念
乡土认同
陪伴成长	
服务学习

多元课程
自然教育
戏剧教育
绘本教育
互动游戏
学生工作
综合性活动

学科教案
文史哲
数理化
英语
生物
地理
美术
体育
混搭和跨界

能力提升
求职能力
表达能力
社会能力
*/