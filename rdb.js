// use Node.js to start this 
// 

var mongodb = require('mongodb');
var mgserver = new mongodb.Server('127.0.0.1',27017);
var mgconnect = new mongodb.Db('test',mgserver);
	  

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
	newPost.course_title = EncodeUtf8('�������');
	newPost.teaching_goal = EncodeUtf8('��ͬѧ�������ڷ�����۹�ȥ������ߵ���Դ��������ߵ���Դ����ǿѧ�������ϴ���ɽ������ͬ��');
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + i*2);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = [EncodeUtf8('������ͬ'), EncodeUtf8('��Ȼ����'), EncodeUtf8('�������'), EncodeUtf8('����ɽ')];
	
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
	newPost.course_title = EncodeUtf8('������ɫ');
	newPost.teaching_goal = EncodeUtf8('��ǿ���ǶԼ������ͬ�У��Լ��Լ�����˽⡣');
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + i*4);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = [EncodeUtf8('������ͬ'), EncodeUtf8('��Ȼ����'), EncodeUtf8('�������'), EncodeUtf8('����ɽ')];
	
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
	newPost.course_title = EncodeUtf8('�ز������');
	newPost.teaching_goal = EncodeUtf8('��ѧ���˽�����ز�����������������');
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + i*4);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = [EncodeUtf8('������ͬ'), EncodeUtf8('������Ϸ'), EncodeUtf8('����')];
	
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
	newPost.course_title = EncodeUtf8('������ѧ�ν̰�');
	newPost.teaching_goal = EncodeUtf8('��ѧ���˽��������ѧ����֪ʶ');
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + 5);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = [EncodeUtf8('����'), EncodeUtf8('����ѧϰ')];
	
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
	newPost.course_title = EncodeUtf8('������ͬ');
	newPost.teaching_goal = EncodeUtf8('ѧ�����Լ������о��塢ȫ�桢ϵͳ���˽���֪��ͨ����ͬ��ʽ�Ŀγ̻����ѧ���������������������������Լ������ͬ��ϲ��֮�顣');
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + 5);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = [EncodeUtf8('���ɳ�'), EncodeUtf8('��н���'), EncodeUtf8('������ͬ'), EncodeUtf8('��Ȼ����')];
	
	
	
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
		
var arr = ['��������',['������ͬ', '���ɳ�', '����ѧϰ']];
for (var i=0;i<3; i++){
	collection.save({'name': EncodeUtf8(arr[0]), 'count':2*i+1, 'category':EncodeUtf8(arr[1][i])});
}

arr = ['��Ԫ�γ�',['��Ȼ����', '������Ϸ', '�ۺ��Ի', 'Ϸ�����', 'ѧ������']];
for (var i=0;i<5; i++){
	collection.save({'name': EncodeUtf8(arr[0]), 'count':2*i+1, 'category':EncodeUtf8(arr[1][i])});
}

arr = ['ѧ�ƽ̰�',['��ʷ��', '����', '����', '����', 'Ӣ��']];
for (var i=0;i<5; i++){
	collection.save({'name': EncodeUtf8(arr[0]), 'count':2*i+1, 'category':EncodeUtf8(arr[1][i])});
}

arr = ['��������',['��ְ����', '�������', '�������']];
for (var i=0;i<3; i++){
	collection.save({'name': EncodeUtf8(arr[0]), 'count':2*i+1, 'category':EncodeUtf8(arr[1][i])});
}

	});
	console.log('main 3');
	 
});

/*
var counter = 100;
var tempDate = new Date();
var staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '�������';
	newPost.teaching_goal = '��ͬѧ�������ڷ�����۹�ȥ������ߵ���Դ��������ߵ���Դ����ǿѧ�������ϴ���ɽ������ͬ��';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + i*2);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['������ͬ', '��Ȼ����', '�������', '����ɽ'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
										'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
										'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
										'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
										'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
										'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
										'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
										'tags':newPost.post_tag,
										'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
										'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, 'post_id':newPost.post_id});
}

counter = 222;
tempDate = new Date();
staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '������ɫ';
	newPost.teaching_goal = '��ǿ���ǶԼ������ͬ�У��Լ��Լ�����˽⡣';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + i*4);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['������ͬ', '��Ȼ����', '�������', '����ɽ'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
										'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
										'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
										'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
										'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
										'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
										'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
										'tags':newPost.post_tag,
										'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
										'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, 'post_id':newPost.post_id});
}


counter = 835;
tempDate = new Date();
staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '�ز������';
	newPost.teaching_goal = '��ѧ���˽�����ز�����������������';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + i*4);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['������ͬ', '������Ϸ', '����'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
										'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
										'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
										'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
										'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
										'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
										'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
										'tags':newPost.post_tag,
										'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
										'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, 'post_id':newPost.post_id});
}



counter = 159;
tempDate = new Date();
staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '������ѧ�ν̰�';
	newPost.teaching_goal = '��ѧ���˽��������ѧ����֪ʶ';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + 5);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['����', '����ѧϰ'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
										'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
										'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
										'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
										'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
										'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
										'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
										'tags':newPost.post_tag,
										'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
										'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, 'post_id':newPost.post_id});
}



counter = 1057;
tempDate = new Date();
staticDate = tempDate;
for (var i=0; i<4; i++)
{
	var newPost = new Post();
	newPost.course_title = '������ͬ';
	newPost.teaching_goal = 'ѧ�����Լ������о��塢ȫ�桢ϵͳ���˽���֪��ͨ����ͬ��ʽ�Ŀγ̻����ѧ���������������������������Լ������ͬ��ϲ��֮�顣';
	newPost.post_id = counter + i;
	
	if (i==0) newPost.post_createFrom_id = -1;
	else newPost.post_createFrom_id = counter + i - 1;
	
	newPost.post_createTime = tempDate;
	tempDate.setDate(tempDate.getDate() + 5);
	newPost.origin_createTime = staticDate;
	
	if (i==3) newPost.most_recent = 1; 
	else newPost.most_recent = 0;
	
	newPost.post_tag = ['���ɳ�', '��н���', '������ͬ', '��Ȼ����'];
	
	collection.save({'course_title':newPost.course_title, 'template_title':newPost.template_title, 'topic':newPost.topic, 
										'course_time':newPost.course_time, 'volunteer':newPost.volunteer, 'course_class':newPost.course_class, 
										'background':newPost.background, 'course_prepare':newPost.course_prepare, 'teaching_resource':newPost.teaching_resource, 'teaching_goal':newPost.teaching_goal, 
										'lesson_starting_time':newPost.lesson_starting_time, 'lesson_starting_content':newPost.lesson_starting_content, 'lesson_starting_pattern':newPost.lesson_starting_pattern, 
										'lesson_main_time':newPost.lesson_main_time, 'lesson_main_content':newPost.lesson_main_content, 'lesson_main_pattern':newPost.lesson_main_pattern, 
										'lesson_ending_time':newPost.lesson_ending_time, 'lesson_ending_content':newPost.lesson_ending_content, 'lesson_ending_pattern':newPost.lesson_ending_pattern, 
										'lesson_summary':newPost.lesson_summary, 'lesson_comment':newPost.lesson_comment, 
										'tags':newPost.post_tag,
										'post_createFrom_id':newPost.post_createFrom_id, 'access_count':newPost.access_count,
										'post_createTime':newPost.post_createTime, 'origin_createTime':newPost.origin_createTime, 'most_recent':newPost.most_recent, 'post_id':newPost.post_id});
}


var arr = ['��������',['������ͬ', '���ɳ�', '����ѧϰ']];
for (var i=0;i<3; i++){
	collection.save({'name': arr[0], 'count':2*i+1, 'category':arr[1][i]})
}

arr = ['��Ԫ�γ�',['��Ȼ����', '������Ϸ', '�ۺ��Ի', 'Ϸ�����', 'ѧ������']];
for (var i=0;i<5; i++){
	collection.save({'name': arr[0], 'count':i+1, 'category':arr[1][i]})
}

arr = ['ѧ�ƽ̰�',['��ʷ��', '����', '����', '����', 'Ӣ��']];
for (var i=0;i<5; i++){
	collection.save({'name': arr[0], 'count':i, 'category':arr[1][i]})
}

arr = ['��������',['��ְ����', '�������', '�������']];
for (var i=0;i<3; i++){
	collection.save({'name': arr[0], 'count':5-i, 'category':arr[1][i]})
}
*/

/*
post----------------------------------------

�������
	��ͬѧ�������ڷ�����۹�ȥ������ߵ���Դ��������ߵ���Դ����ǿѧ�������ϴ���ɽ������ͬ��
	2011.9.10
	2012.8.8
	2013.1.2
	2013.5.6
	������ͬ  ��Ȼ����  �������  ����ɽ
	
������ɫ
	��ǿ���ǶԼ������ͬ�У��Լ��Լ�����˽⡣
	2011.9.17
	2012.9.10
	2013.1.2
	2013.5.2
	������ͬ  ��Ȼ����  �������  ����ɽ
	
�ز������
	��ѧ���˽�����ز�����������������
	2011.8.12
	2012.8.8
	2012.9.10
	2013.4.26
	������ͬ   ������Ϸ   ����
	
������ͬ
	ѧ�����Լ������о��塢ȫ�桢ϵͳ���˽���֪��ͨ����ͬ��ʽ�Ŀγ̻����ѧ���������������������������Լ������ͬ��ϲ��֮�顣
	2012.1.4
	2012.8.8
	2013.1.2
	2013.4.10
	������ͬ   ����   ��Ȼ����   ���ɳ�   ��н���

�ҵ�����������֮��һ�Ρ�ϵ�н̰���
	��ǿ���Ƕ�������ϲ���ȣ���ǿ�����������ʶ
	2013.3.1
	2012.9.10
	2013.1.2
	2013.4.2
	������ͬ  ��ͷ  ��н���  �������

������ѧ�ν̰�
	��ѧ���˽��������ѧ����֪ʶ
	2013.1.2
	2013.1.23
	2013.3.10
	2013.4.2
	����  ����ѧϰ
	*/

/*
tags -----------------------------

��������
������ͬ
���ɳ�	
����ѧϰ

��Ԫ�γ�
��Ȼ����
Ϸ�����
�汾����
������Ϸ
ѧ������
�ۺ��Ի

ѧ�ƽ̰�
��ʷ��
����
Ӣ��
����
����
����
����
���Ϳ��

��������
��ְ����
�������
�������
*/


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

