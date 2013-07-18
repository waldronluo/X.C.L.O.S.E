var GLOBAL = [];

GLOBAL.socket = io.connect('http://127.0.0.1:8089');


(function(){
    

    searchStr = getCookie("searchStr");
    sortWay = getCookie("sortWay");
    page = getCookie("page");
    console.log(searchStr + " " +
    sortWay + " " +
    page + " " );
    if ( searchStr != "" || 
            sortWay != "" || 
                page != "" ) {
        GLOBAL.socket.emit ('searchPost',[searchStr,sortWay,page]);
                }

    GLOBAL.socket.on('searchPostReply',function(teachPlanList){
        setCookie ("searchStr", teachPlanList[10]);
        setCookie ("searchWay", teachPlanList[11]);
        setCookie ("page", teachPlanList[12]);
        console.log(teachPlanList);
        var resultGroup = document.getElementById("resultGroup");
        resultGroup.innerHTML = "";
        for (var i=0; i < 10; i++) {
            if (teachPlanList[i] == null) break;
            console.log(teachPlanList[i]);

            var result = document.createElement("div");
            result.className = "result";
            
            var resultTitle = document.createElement("a");
            resultTitle.className = "resultTitle";
            resultTitle.href="/teach-plan?post_id="+teachPlanList[i]["_id"];
            resultTitle.target = "_blank";
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
