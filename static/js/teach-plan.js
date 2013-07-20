
var GLOBAL =[];
GLOBAL.socket = io.connect('http://127.0.0.1:8089');

function editTeachingPlan () {
    document.getElementById("teach-plan-title").style.visibility = "hidden";
    document.getElementById("teach-plan-title").innerHTML = "";
    document.getElementById("teach-plan-info").style.visibility = "hidden";
    document.getElementById("teach-plan-info").innerHTML = "";

    quickAddTextArea ("teach-plan-coursename", 54, 1);
    quickAddTextArea ("teach-plan-template", 54, 1);
    quickAddTextArea ("teach-plan-course", 54, 1);
    quickAddTextArea ("teach-plan-course-last", 54, 1);
    quickAddTextArea ("teach-plan-processing-staff", 54, 1);
    quickAddTextArea ("teach-plan-processing-grade", 54, 1);
    quickAddTextArea ("teach-plan-background", 123, 10);
    quickAddTextArea ("teach-plan-prepare-class", 123, 10);
    quickAddTextArea ("teach-plan-resources", 123, 10);
    quickAddTextArea ("teach-plan-target", 123, 10);
    quickAddTextArea ("teach-plan-leading-time", 4, 10);
    quickAddTextArea ("teach-plan-leading-content", 85, 10);
    quickAddTextArea ("teach-plan-leading-requirement", 29, 10);
    quickAddTextArea ("teach-plan-ongoing-time", 4, 10);
    quickAddTextArea ("teach-plan-ongoing-content", 85, 10);
    quickAddTextArea ("teach-plan-ongoing-requirement", 29, 10);
    quickAddTextArea ("teach-plan-ending-time", 4, 10);
    quickAddTextArea ("teach-plan-ending-content", 85, 10);
    quickAddTextArea ("teach-plan-ending-requirement", 29, 10);
    quickAddTextArea ("teach-plan-conclusion-time", 4, 10);
    quickAddTextArea ("teach-plan-conclusion-content", 85, 10);
    quickAddTextArea ("teach-plan-conclusion-requirement", 29, 10);
    quickAddTextArea ("teach-plan-description-time", 4, 10);
    quickAddTextArea ("teach-plan-description-content", 85, 10);
    quickAddTextArea ("teach-plan-description-requirement", 29, 10);
    GLOBAL.socket.emit("existingLabels");
    GLOBAl.socket.emit("");
}

function quickAddTextArea (elementId, cols, rows) {
    addTextArea ( document.getElementById(elementId),cols,rows,elementId);
}
function addTextArea (element, cols, rows, name) {
    var textarea = document.createElement("textarea");

    textarea.innerHTML = element.innerHTML;
    textarea.rows = rows;
    textarea.cols = cols;
    textarea.name = name;
    element.innerHTML = "";
    element.appendChild(textarea);
}



(function (){
    var id = getCookie("post_id");
    GLOBAL.socket.emit("getOnePost", id);    
    GLOBAL.socket.on("getOnePostReply", function(teachPlan) {
        console.log(teachPlan);
        document.getElementById ("teach-plan-title").innerHTML = teachPlan[0]['teach-plan-title'];
        document.getElementById ("teach-plan-edit-counter").innerHTML = teachPlan[4]['teach-plan-edit-counter'];
        document.getElementById ("teach-plan-read-counter").innerHTML = teachPlan[3]['teach-plan-read-counter'];
        document.getElementById ("teach-plan-like-counter").innerHTML = teachPlan[5]['teach-plan-like-counter'];
        document.getElementById ("teach-plan-download-counter").innerHTML = teachPlan[6]['teach-plan-download-counter'];
        document.getElementById ("teach-plan-update-date").innerHTML = teachPlan[2]['teach-plan-update-date'];
        document.getElementById ('teach-plan-creater').innerHTML = teachPlan[1]['teach-plan-creater'];
        
        var table = document.getElementById("teach-plan-label-group-tb");
        table.innerHTML = "";
        var captain = document.createElement("captain");
        captain.className = "teach-plan-captain";
        captain.innerHTML = "教案标签";
        table.appendChild(captain);

        for ( var i=0 ; i<teachPlan[7]['teach-plan-label-group'].length; i+=2) {
            var tr = document.createElement ("tr");
            for (var j=0 ; j<2; j++ ) {
                td = document.createElement ("td");
                td.className = "wd125 hd35";
                a = document.createElement("a");
                a.className = "teach-plan-label";
                a.innerHTML = teachPlan[7]['teach-plan-label-group'][i+j];
                td.appendChild(a);
                tr.appendChild(td);
            }
            table.appendChild(tr);

        }
        /*!!!!!!!!!!!!!!!!!!!Here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
        
        document.getElementById ("teach-plan-coursename").innerHTML = teachPlan[8]['teach-plan-coursename'];
        document.getElementById ("teach-plan-template").innerHTML = teachPlan[9]['teach-plan-template'];
        document.getElementById ("teach-plan-course").innerHTML = teachPlan[10]['teach-plan-course'];
        document.getElementById ("teach-plan-course-last").innerHTML = teachPlan[11]['teach-plan-course-last'];
        document.getElementById ("teach-plan-processing-staff").innerHTML = teachPlan[12]['teach-plan-processing-staff'];
        document.getElementById ("teach-plan-processing-grade").innerHTML = teachPlan[13]['teach-plan-processing-grade'];
        document.getElementById ("teach-plan-background").innerHTML = teachPlan[14]['teach-plan-background'];
        document.getElementById ("teach-plan-prepare-class").innerHTML = teachPlan[15]['teach-plan-prepare-class'];
        document.getElementById ("teach-plan-resources").innerHTML = teachPlan[16]['teach-plan-resources'];
        document.getElementById ("teach-plan-target").innerHTML = teachPlan[17]['teach-plan-target'];
        document.getElementById ("teach-plan-leading-time").innerHTML = teachPlan[18]['teach-plan-leading-time'];
        document.getElementById ("teach-plan-leading-content").innerHTML = teachPlan[19]['teach-plan-leading-content'];
        document.getElementById ("teach-plan-leading-requirement").innerHTML = teachPlan[20]['teach-plan-leading-requirement'];
        document.getElementById ("teach-plan-ongoing-time").innerHTML = teachPlan[21]['teach-plan-ongoing-time'];
        document.getElementById ("teach-plan-ongoing-content").innerHTML = teachPlan[22]['teach-plan-ongoing-content'];
        document.getElementById ("teach-plan-ongoing-requirement").innerHTML = teachPlan[23]['teach-plan-ongoing-requirement'];
        document.getElementById ("teach-plan-ending-time").innerHTML = teachPlan[24]['teach-plan-ending-time'];
        document.getElementById ("teach-plan-ending-content").innerHTML = teachPlan[25]['teach-plan-ending-content'];
        document.getElementById ("teach-plan-ending-requirement").innerHTML = teachPlan[26]['teach-plan-ending-requirement'];
        document.getElementById ("teach-plan-conclusion-time").innerHTML = teachPlan[27]['teach-plan-conclusion-time'];
        document.getElementById ("teach-plan-conclusion-content").innerHTML = teachPlan[28]['teach-plan-conclusion-content'];
        document.getElementById ("teach-plan-conclusion-requirement").innerHTML = teachPlan[29]['teach-plan-conclusion-requirement'];
        document.getElementById ("teach-plan-description-time").innerHTML = teachPlan[30]['teach-plan-description-time'];
        document.getElementById ("teach-plan-description-content").innerHTML = teachPlan[31]['teach-plan-description-content'];
        document.getElementById ("teach-plan-description-requirement").innerHTML = teachPlan[32]['teach-plan-description-requirement'];
    
        });



    })();
