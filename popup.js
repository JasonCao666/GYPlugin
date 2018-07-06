var background = chrome.extension.getBackgroundPage();
var taskList=new Array();

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
            taskJson="[{\"id\":\""+id+"\",\"name\":\""+th[1].innerHTML+"\",\"description\":\""+th[2].innerHTML+"\"}]"

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

                alert(taskList.length);
                return;
            }
            else {
                taskList.push(taskJson);
            }

        }

    })
})


$(document).ready(function(){

    if(background.openFlag==0)
    {
        prepare();
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
        for (i=0;i<taskList.length;i++) {
            background.selectedTasks.push(taskList[i]);
        }
    });

    $("#refresh_tasks").click(function () {
        for(i=0;i<background.selectedTasks.length;i++){
            alert(background.selectedTasks[i]);
        }
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



