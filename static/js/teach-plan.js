
var GLOBAL =[];
GLOBAL.socket = io.connect('http://127.0.0.1:8089');

(function (){
    var id = getCookie("post_id");
    GLOBAL.socket.emit("getOnePost", id);    
    GLOBAL.socket.on("getOnePostReply", function(teachPlan) {
        console.log(teachPlan);
        var teach_plan_title = document.getElementById ("teach-plan-title");
        teach_plan_title.innerHTML = teachPlan[0]['teach-plan-title'];
        
        var teach_plan_edit_counter = document.getElementById ("teach-plan-edit-counter");
        teach_plan_edit_counter.innerHTML = teachPlan[4]['teach-plan-edit-counter'];
        
        var teach_plan_read_counter = document.getElementById("teach-plan-read-counter");
        teach_plan_read_counter.innerHTML = teachPlan[3]['teach-plan-read-counter'];
        
        var teach_plan_like_counter = document.getElementById("teach-plan-like-counter");
        teach_plan_like_counter.innerHTML = teachPlan[5]['teach-plan-like-counter'];
        
        var teach_plan_download_counter = document.getElementById ("teach-plan-download-counter");
        teach_plan_download_counter.innerHTML = teachPlan[6]['teach-plan-download-counter'];
        
        var teach_plan_update_date = document.getElementById("teach-plan-update-date");
        teach_plan_update_date.innerHTML = teachPlan[2]['teach-plan-update-date'];
        
        var teach_plan_creater = document.getElementById('teach-plan-creater');
        teach_plan_creater.innerHTML = teachPlan[1]['teach-plan-creater'];
        
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
        
        var teach_plan_coursename = document.getElementById("teach-plan-coursename");
        teach_plan_coursename.innerHTML = teachPlan[8]['teach-plan-coursename'];
       
        var teach_plan_template = document.getElementById("teach-plan-template");
        teach_plan_template.innerHTML = teachPlan[9]['teach-plan-template'];
        
        var teach_plan_course = document.getElementById("teach-plan-course");
        teach_plan_course.innerHTML = teachPlan[10]['teach-plan-course'];
        
        var teach_plan_course_last = document.getElementById("teach-plan-course-last");
        teach_plan_course_last.innerHTML = teachPlan[11]['teach-plan-course-last'];
       
        var teach_plan_processing_staff = document.getElementById("teach-plan-processing-staff");
        teach_plan_processing_staff.innerHTML = teachPlan[12]['teach-plan-processing-staff'];
        
        var teach_plan_processing_grade = document.getElementById("teach-plan-processing-grade");
        teach_plan_processing_grade.innerHTML = teachPlan[13]['teach-plan-processing-grade'];
        
        var teach_plan_background = document.getElementById("teach-plan-background");
        teach_plan_background.innerHTML = teachPlan[14]['teach-plan-background'];
       
        var teach_plan_prepare_class = document.getElementById("teach-plan-prepare-class");
        teach_plan_prepare_class.innerHTML = teachPlan[15]['teach-plan-prepare-class'];
       
        var teach_plan_resources = document.getElementById("teach-plan-resources");
        teach_plan_resources.innerHTML = teachPlan[16]['teach-plan-resources'];
        
        var teach_plan_target = document.getElementById("teach-plan-target");
        teach_plan_target.innerHTML = teachPlan[17]['teach-plan-target'];
       
       
        document.getElementById("teach-plan-leading-time").innerHTML = teachPlan[18]['teach-plan-leading-time'];
        document.getElementById("teach-plan-leading-content").innerHTML = teachPlan[19]['teach-plan-leading-content'];
        document.getElementById("teach-plan-leading-requirement").innerHTML = teachPlan[20]['teach-plan-leading-requirement'];
        document.getElementById("teach-plan-ongoing-time").innerHTML = teachPlan[21]['teach-plan-ongoing-time'];
        document.getElementById("teach-plan-ongoing-content").innerHTML = teachPlan[22]['teach-plan-ongoing-content'];
        document.getElementById("teach-plan-ongoing-requirement").innerHTML = teachPlan[23]['teach-plan-ongoing-requirement'];
        document.getElementById("teach-plan-ending-time").innerHTML = teachPlan[24]['teach-plan-ending-time'];
        document.getElementById("teach-plan-ending-content").innerHTML = teachPlan[25]['teach-plan-ending-content'];
        document.getElementById("teach-plan-ending-requirement").innerHTML = teachPlan[26]['teach-plan-ending-requirement'];
        document.getElementById("teach-plan-conclusion-time").innerHTML = teachPlan[24]['teach-plan-conclusion-time'];
        document.getElementById("teach-plan-conclusion-content").innerHTML = teachPlan[25]['teach-plan-conclusion-content'];
        document.getElementById("teach-plan-conclusion-requirement").innerHTML = teachPlan[26]['teach-plan-conclusion-requirement'];
        document.getElementById("teach-plan-description-time").innerHTML = teachPlan[24]['teach-plan-description-time'];
        document.getElementById("teach-plan-description-content").innerHTML = teachPlan[25]['teach-plan-description-content'];
        document.getElementById("teach-plan-description-requirement").innerHTML = teachPlan[26]['teach-plan-description-requirement'];
    
        });



    })();
