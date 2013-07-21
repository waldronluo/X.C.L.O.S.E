var GLOBAL = [];
GLOBAL.socket = io.connect('http://127.0.0.1:8089');

(function() {
    GLOBAL.socket.on ('historyListReply', function(history){
        console.log(history);
        var table = document.getElementById ("historyTable");
        table.innerHTML = "";
        var caption = document.createElement("caption");
        caption.className = "historyCaption";
        caption.innerHTML = history[0]['course_title'];
        
        table.appendChild (caption);

        var th = document.createElement("tr");
        var ths = [
        "更新时间","wd200",
        "版本","wd100",
        "点赞数","wd100",
        "修改者","wd100",
        "修改原因","wd500"
        ];
        for ( var i=0 ; i < ths.length ; i += 2) {
            var head = document.createElement("th");
            head.className = ths[i+1];
            head.innerHTML = ths[i];
            th.appendChild (head);
        }
        table.appendChild (th);
        for ( var i=0 ; i < history.length; i++) {
            var tr = document.createElement("tr");
            var updateTime = document.createElement("td");
            updateTime.innerHTML = history[i]["post_createTime"];
            var version = document.createElement("td");
            version.innerHTML = "<a href=/search?post_id="+history[i]["post_id"]+">查看</a>";
            var likeCounter = document.createElement("td");
            likeCounter.innerHTML = history[i]["like_count"];
            var author = document.createElement("td");
            author.innerHTML = history[i]["post_author"];
            var reason = document.createElement("td");
            reason.innerHTML = "";
            tr.appendChild (updateTime);
            tr.appendChild (version);
            tr.appendChild (likeCounter);
            tr.appendChild (author);
            tr.appendChild (reason);
            table.appendChild(tr);
        }
    });
})();
