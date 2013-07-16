

(function () {
    console.log("index.js");
    var socket = io.connect('http://127.0.0.1:8089');
    socket.on('labelsReply', function (TagsArr){
        console.log (TagsArr);
        
    });
})();
