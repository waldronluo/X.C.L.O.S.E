
var GLOBAL =[];
GLOBAL.socket = io.connect('http://127.0.0.1:8089');

(function (){
    var id = getCookie("post_id");
    GLOBAL.socket.emit("getOnePost", id);    
    GLOBAL.socket.on("getOnePostReply", function(teachPlan) {
        console.log("A");
        console.log(teachPlan);
    });


})();
