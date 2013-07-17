(function(){
    console.log("socket.io");
    var socket = io.connect('http://127.0.0.1:8089');
    socket.on('searchPostReply',function(resultArr){
        console.log("at least");
        console.log(resultArr);
    });
})();
