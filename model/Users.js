var mongodb = require('mongodb');	

// new user: return success or failed
exports.mongoDbNewUser = function(socket, userArray, name, password, email){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	  
	mgconnect.open(function (err, db) {	  
		db.collection('userlist', function (err, collection) {
			collection.find({'name':name, 'password':password},{'name':1,'_id':0},function(err,result){
				result.toArray(function(err, arr){
					console.log(arr.length);
					if (arr.length !== 0){
						console.log('already have a user');
						socket.emit('registerReply',false);
						db.close();
					}
					else {
						collection.save({'name':name, 'password':password, 'email':email}, function(){
							socket.emit('registerReply',true);
							userArray[userArray.length] = name;
							db.close();
						});
						console.log('user register success');
					}
				});
			});
		});
	});
}

// login user: return success or failed
exports.mongoDbLoginUser = function(socket, userArray, name, password){
	var mgserver = new mongodb.Server('127.0.0.1',27017);
	var mgconnect = new mongodb.Db('test',mgserver,{safe:false});
	  
	mgconnect.open(function (err, db) {	  
		db.collection('userlist', function (err, collection) {
			collection.find({'name':name, 'password':password},{'name':1,'_id':0},function(err,result){
				result.toArray(function(err, arr){
					if (arr.length == 1){
						console.log('user login: '+arr[0]);
						userArray[userArray.length] = name;
						socket.emit('loginReply', true);
						db.close();
					} else if (arr.length == 0){
						console.log('login info error');
						socket.emit('loginReply', false);
						db.close();
					}
					console.log(userArray);
				});
			});
		});
	});
}

