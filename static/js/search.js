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
        setCookie ("searchStr", teachPlanList[10],7);
        setCookie ("sortWay", teachPlanList[11],7);
        setCookie ("page", teachPlanList[12],7);
        setCookie ("pageCount", teachPlanList[13],7);
        console.log(teachPlanList);
        refreshContent (teachPlanList);
        refreshPageCount (teachPlanList[13]);
    });
})();

function changeSortWay (sortWay) {
    console.log("here!");
    GLOBAL.socket.emit( "searchPost",[getCookie("searchStr"), sortWay, getCookie("page")] );
}
function changePage (page) {
    GLOBAL.socket.emit( "searchPost",[getCookie("searchStr"), getCookie("sortWay"), page] );
}

function refreshPageCount (pageCounter) {
    console.log(pageCounter);
    var page = document.getElementById("page");
    page.innerHTML = "";

    if (pageCounter == 0 || pageCounter == "undefined") 
        return;
    else {
        for (var i=0 ; i < pageCounter; i++) {
            var a = document.createElement("a");
            a.className = "page-counter";
            var counter = i+1;
            a.innerHTML = counter;
            a.href="#";
            //a.onclick="";
            a.onclick = function() {changePage(a.innerHTML);};
            page.appendChild(a);
            //今晚写博客
        }
    }

}
function refreshContent (teachPlanList) {
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
}

