

(function () {
    //console.log("index.js");
    var socket = io.connect('http://127.0.0.1:8089');
    socket.on('labelsReply', function (TagsArr){
    var labelgroups = [];
    var labelgroupName = [];
    for ( var i=0 ; i < TagsArr.length ; i++ ) {
        labelgroupName.push(TagsArr[i][0]);
        labelgroups.push(TagsArr[i][1]);
        //console.log(labelgroupName[labelgroupName.length-1]);
    }

    var labelList = document.getElementById("labelList");
    labelList.innerHTML = "";
    for (var i=0 ; i<labelgroups.length; i++) {
        var li = document.createElement("li");
        li.className="labelClass";
        var h2 = document.createElement("h2");
        h2.className = "labelClassTitle";
        h2.innerHTML = labelgroupName[i];
        li.appendChild(h2);
        //labelList.appendChild(li);
        for (var j=0; j<labelgroups[i].length; j++) {
            var div = document.createElement("div");
            div.className="label";
            var a = document.createElement("a");
            a.className = "labelSelf";
            a.href = "/search?searchStr=" + labelgroups[i][j];
            a.target = "_blank";
            a.innerHTML = labelgroups[i][j];
            
            div.appendChild(a);
            li.appendChild(div);
        }
        labelList.appendChild(li);
    }
        
    });
})();
