var background = chrome.extension.getBackgroundPage();
var taskList=new Array();
var ps_list = $("#u_tem").html();
var selected_single_task;

window.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('click', function(e) {
        var target = e.target; // click指向的节点
        if(e.target.id=="edit")
        {
            //document.getElementById('test').value=num;
            var edit_task_id=e.target.name.split(",")[0];
            var edit_task_name=e.target.name.split(",")[1];
            var edit_task_description=e.target.name.split(",")[2];
            document.getElementById('edit_taskId').value=edit_task_id;
            document.getElementById('edit_taskName').value=edit_task_name;
            document.getElementById('edit_taskDescription').value=edit_task_description;

        }

        if(e.target.id=="del")
        {
            //document.getElementById('test').value=num;
            var edit_task_id=e.target.name;
            delTaskRequest(edit_task_id);

        }

        if(e.target.id=="select")
        {
            var tr = e.target.parentNode.parentNode;
            var th = tr.cells;
            var str = "you click ";
            var taskJson="";
            var id=e.target.name;
            //alert(th[1].innerHTML);
            //alert(th[2].innerHTML);
            taskJson="[{\"id\":\""+id+"\",\"name\":\""+th[1].innerHTML+"\",\"description\":\""+th[2].innerHTML+"\",\"status\":\""+'unfinished'+"\"}]"

            if (!e.target.checked) {
                for(i=0;i<taskList.length;i++)
                {
                    var jsonObj = eval(JSON.parse(taskList[i]));
                    for(j=0;j<jsonObj.length;j++){

                        if(id==jsonObj[j].id){
                            taskList.splice( taskList.indexOf(i), 1);
                            break;
                        }
                    }
                }

                return;
            }
            else {
                taskList.push(taskJson);
            }

        }

        if(e.target.name=="optionsRadios"){

            selected_single_task=e.target.id;

        }

    })
})


$(document).ready(function(){

    if(background.openFlag==0)
    {
        prepare();
    }
    else{
        RespondAgain();
    }

    var createButton;

    $('#myTabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    $("#stopButton").click(function () {
        $("#userProcedure").html(background.userClick)
        alert(background.userClick);
        background.userClick="";
        addTaskRequest();
    });

    $("#addTaskButton").click(function () {
        addTaskRequest();
        prepare();
    });

    $("#editTaskButton").click(function () {
        editTaskRequest();
        prepare();
    });

    $("#select_tasks").click(function () {

        for(i=0;i<taskList.length;i++){
           if(!existInBackground(taskList[i])) {
               background.selectedTasks.push(taskList[i]);
           }

        }
        alert('select tasks success');
    });

    $("#refresh_tasks").click(function () {
        showSelectTask();
    });

    $("#startButton").click(function () {
        timeInterval();
    });

});

function prepare(){

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/task/listTask",
        dataType: "json",
        success: function(data) {
            $("#temtr").nextAll().remove();

            var json = eval(data);
            background.json=json;
            for (var i = 0; i < json.length; i++) {
                //var item=json[i]["list"];
                var realrow = $("#temtr").clone();
                //给每一行赋值
                realrow.find("#task_select").html("<input type=\"checkbox\" id =\"select\" name=\""+json[i]['id']+"\">");
                realrow.find("#task_name").text(json[i]['name']);
                realrow.find("#task_description").html(json[i]['description']);
                realrow.find("#operation").html("<button type=\"button\" class=\"btn btn-primary\" id=\"edit\" " +
                    "name=\""+ json[i]['id']+","+ json[i]['name']+","+json[i]['description']+
                    "\"onclick=\"edit(this)\" data-toggle=\"modal\" data-target=\"#editModal\">edit</button>" +
                    "<button type=\"button\" class=\"btn btn-primary\" id=\"del\" " +
                    " name=\""+ json[i]['id'] +"\">delete</button>");
                //将新行添加到表格中
                realrow.appendTo("#tem");
            }
        }
    });

    background.openFlag=1;

}


function RespondAgain(){

    var json=background.json;
    for (var i = 0; i <  json.length; i++) {
        var realrow = $("#temtr").clone();
        //给每一行赋值
        realrow.find("#task_select").html("<input type=\"checkbox\" id =\"select\" name=\""+json[i]['id']+"\">");
        realrow.find("#task_name").text(json[i]['name']);
        realrow.find("#task_description").html(json[i]['description']);
        realrow.find("#operation").html("<button type=\"button\" class=\"btn btn-primary\" id=\"edit\" " +
            "name=\""+ json[i]['id']+","+ json[i]['name']+","+json[i]['description']+
            "\"onclick=\"edit(this)\" data-toggle=\"modal\" data-target=\"#editModal\">edit</button>" +
            "<button type=\"button\" class=\"btn btn-primary\" id=\"del\" " +
            " name=\""+ json[i]['id'] +"\">delete</button>");
        //将新行添加到表格中
        realrow.appendTo("#tem");
    }

    var selectTasks=background.selectedTasks;
    taskList=selectTasks;
    alert(selectTasks);
    for(i=0;i<selectTasks.length;i++){
        var json = eval(JSON.parse(selectTasks[i]));
        var realrow = $("#temtr").clone();
        //给每一行赋值
        $("input[name='"+json[0]['id']+"']").each(function(){
            $(this).attr("checked",true);
        });
    }
}


function addTaskRequest() {
    var taskName=document.getElementById("taskName").value;
    var taskDescription=document.getElementById("taskDescription").value;
    taskDescription= taskDescription.replace(/\n|\r\n/g,"<br>");
    //var reg=new RegExp("<br>","g"); var newstr=remContent.replace(reg,"\n");

    $.ajax({
        url: "http://localhost:8080/task/addTask",
        type: "POST",
        dataType: "json",
        data: {
            "taskName": taskName,
            "taskDescription": taskDescription,
        },
        success:function(data){
            alert("add task success");
            prepare();
        },
        error:function(){
            alert("error");
        }
    });
}


function editTaskRequest() {

    var edit_taskId = document.getElementById("edit_taskId").value;
    var edit_taskName = document.getElementById("edit_taskName").value;
    var edit_description = document.getElementById("edit_taskDescription").value;
    $.ajax({
        url: "http://localhost:8080/task/editTask",
        type: "POST",
        dataType: "json",
        data: {
            "taskId": edit_taskId,
            "taskName": edit_taskName,
            "taskDescription": edit_description,
        },
        success: function (data) {
            if ("success" == data.result) {

                alert("edit success");
                prepare();

            }
            else {

                alert("edit fail");
            }
        }
    });
}

function delTaskRequest(id){

    $.ajax({
        url: "http://localhost:8080/task/delTask",
        type: "POST",
        dataType: "json",
        data: {
            "taskId": id,
        },
        success: function (data) {
            if ("success" == data.result) {
                alert("edit success");
                prepare();
            }
            else {
                alert("edit fail");
            }
        }
    });

}

function showSelectTask(){

    var select_task_list=background.selectedTasks;
    /*$("#u_temtr").html("<th id=\"u_task_name\">task name</th> " +
        "<th id=\"u_task_description\">task description</th> " +
        "<th id=\"u_status\">status</th>");*/
    $("#u_tem tr:not(:first)").empty("");

    for(i=0;i<select_task_list.length;i++){
        var realrow = $("#u_temtr").clone();
        var json = eval(JSON.parse(select_task_list[i]));
        realrow.find("#u_select").html("<input type=\"radio\" name=\"optionsRadios\" id=\""+json[0]['id']+"\" " +
           "value=\""+'unfinished'+"\">");
        realrow.find("#u_task_name").html(json[0]['name']);
        realrow.find("#u_task_description").html(json[0]['description']);
        //realrow.find("#u_status").html("<span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\"></span>");
        realrow.find("#u_status").html(json[0]['status']);
        realrow.appendTo("#u_tem");
    }
}

function existInBackground(current_task){
    for(j=0;j<background.selectedTasks.length;j++){

            if(background.selectedTasks[j]==current_task) {
               return true;
            }
    }
    return false;

}

function timeInterval(){
    $("#code_send_btn").html("Time left: 60s");
    background.time_left=59;
    //var timeSec = 59;
    var timeStr = '';
    var codeTime = setInterval(function Internal(){
        if ( background.time_left == 0){
            $("#code_send_btn").html("finished");
            $("#code_send_btn").removeAttr("disabled","disabled");
            clearInterval(codeTime);
            return;
        }
        timeStr = background.time_left+"s";
        $("#code_send_btn").html("Time left: "+timeStr);
        background.time_left--;
    },1000);
}
