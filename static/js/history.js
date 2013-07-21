
var GLOBAL = [];
GLOBAL.socket = io.connect('http://127.0.0.1:8089');

(function() {
    GLOBAL.socket.on ('historyListReply', function(history){
        console.log(history);
    });
})();
