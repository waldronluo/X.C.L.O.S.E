//front 

$(document).ready(function(){
	var socket = io.connect();
	var cookieSaveTimeMS = 100000;	
	
	socket.on('connect', function(){
		// pre condition: user has log , cookie
		if (getCookie('userName') !== ""){
			
		}
	
		// user operation
		// login
		$(document).on('click', 'a#login', function(){
			socket.emit('login',$('#loginName').val(),$('#loginPassWord').val());
			//save user cookie 
			setCookie('userName',$('#loginName').val(), cookieSaveTimeMS);
			setCookie('userPassword',$('#loginPassWord').val(), cookieSaveTimeMS);
		});
		socket.on('loginReply', function(isSuccess){
			if (isSuccess == true){
//				$().html = ............
				console.log("Login Success");
			} else {
				setCookie('userName','', -1);
				setCookie('userPassword','', -1);
				console.log("Login Failed");
			}				
		});
		
		// logout
		$(document).on('click', 'a#logout', function(){
			var username = getCookie('userName');
			socket.emit('logout', username);
		});
		socket.on('logoutReply', function(isSuccess){
			if (isSuccess == true){
				console.log("Logout Success");
				clearCookie();
			} else {
				console.log("Logout Failed");
			}
			//delete user cookie
		});
		
		// register
		$(document).on('click', 'a#register', function(){
			if ($('#registerPassword').val() == $('#confirmPassword').val()){
				socket.emit('register',$('#registerName').val(),$('#registerPassword').val());
				setCookie('userName',$('#registerName').val(), cookieSaveTimeMS);
				setCookie('userPassword',$('#registerPassword').val(), cookieSaveTimeMS);
			} else {
				console.log("password not the same");
			}
		});
		socket.on('registerReply', function(isSuccess){
			if (isSuccess == true){
				$().html = ............
				console.log("Register Success");
			} else {
				setCookie('userName','', -1);
				setCookie('userPassword','', -1);
				console.log("Register Failed");
			}
		});
		
		// post operation
		// new post
		$(document).on('click', 'a#newPost', function(){
			// construct 'post' and trans
			var newPost = new Post();
			var postDataArr = [];
			
			postDataArr['']
			
			
			newPost.setPostALL()
			
			socket.emit('newPost',newPost);
		});
		socket.on('newPostReply', function(isSuccess){
			if (isSuccess == true){
				console.log("New Post Success");
			} else {
				console.log("New Post Failed");
			}
		});
		
		// change post
		$(document).on('click', 'a#changePost', function(){
			// construct 'post' and trans
			var changePost = new Post();
			changePost.post_title = $('title').val();
			
			socket.emit('changePost',changePost);
		});
		socket.on('changePostReply', function(isSuccess){
			
		});
		
		// search post -- By Title
		$(document).on('click', 'a#searchPost', function(){
			socket.emit('searchPost',$('#title').val());
		});		
		socket.on('searchPostReply', function(postArray){
			// get and show
			
		});
	
	});
	
	function getCookie(c_name) {
        if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf(c_name + "=");
			if (c_start != -1) {
				c_start = c_start + c_name.length + 1;
				c_end = document.cookie.indexOf(";", c_start);
				if (c_end == -1) 
					c_end = document.cookie.length;
				return unescape(document.cookie.substring(c_start, c_end));
			}
		}
		return "";
	}
  	function setCookie(c_name, value, expiretimeMS) {
		var exdate = new Date();
		exdate.setTime(exdate.getTime() + expiretimeMS);
		document.cookie = c_name + "=" + escape(value) + ((expiretimeMS == null) ? "" : ";expires=" + exdate.toGMTString());
	}
});

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
	
	// (stable data)x3 : Only Change In Server
	// This post created from post_id=???		-1 means Origin
	this.post_createFrom_id = -1;		
	// hot topic count  						when Access in showpage, count+1
	this.access_count = 0;
	// post ID									Only ID for One saved Post
	this.post_id = 0;
	
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
	this.setPostMiddlePart = function(background, teaching_resource, teaching_goal){
		this.background = background;
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


