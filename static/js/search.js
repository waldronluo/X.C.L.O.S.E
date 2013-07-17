(function(){
    var socket = io.connect('http://127.0.0.1:8089');
    socket.on('searchPostReply',function(teachPlanList){
        console.log(teachPlanList);
        var resultGroup = document.getElementById("resultGroup");
        resultGroup.innerHTML = "";
        for (var i=0; i < teachPlanList.length; i++) {
            if (teachPlanList[i] == null) break;
            console.log(teachPlanList[i]);

            var result = document.createElement("div");
            result.className = "result";
            
            var resultTitle = document.createElement("a");
            resultTitle.className = "resultTitle";
            resultTitle.href="/teach-plan?post_id="+teachPlanList[i]["_id"];
            resultTitle.innerHTML = teachPlanList[i]["course_title"];
            result.appendChild(resultTitle);

            var resultDescription = document.createElement("p");
            resultDescription.className = "resultDescription";
            resultDescription.innerHTML = teachPlanList[i]["teaching_goal"];
            result.appendChild(resultDescription);


            var dateGroup = document.createElement("div");
            dateGroup.className = "dateGroup";
            
            var postDate = document.createElement("p");
            postDate.className = "resultDate postDate";
            postDate.innerHTML = "发布时间：" + teachPlanList[i]['origin_createTime'];

            var lastEditDate = document.createElement("p");
            postDate.className = "resultDate lastEditDate";
            postDate.innerHTML = "发布时间：" + teachPlanList[i]['post_createTime'];

            dateGroup.appendChild(postDate);
            dateGroup.appendChild(lastEditDate);

            result.appendChild(dateGroup);
            var labelFollowed = document.createElement("div");
            labelFollowed.className = "labelFollowed";
            labelFollowed.innerHTML = "标签：";

            for ( var j=0 ; j < teachPlanList[i]['tags'].length ; j++) {
                var label = document.createElement("a");
                label.className = "label";
                label.href = "/search?searchStr="+teachPlanList[i]['tags'][j] + "&sortWay=LastChange&page=1";
                label.innerHTML = teachPlanList[i]['tags'][j];
                labelFollowed.appendChild(label);
            }

            result.appendChild(labelFollowed);
        resultGroup.appendChild(result);
        }   
    });
})();
