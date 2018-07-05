var background = chrome.extension.getBackgroundPage();

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

    })
})


$(document).ready(function(){
    prepare();



var createButton;
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
                    realrow.find("#task_name").text(json[i]['name']);
                    realrow.find("#task_description").text(json[i]['description']);
                    realrow.find("#operation").html("<button type=\"button\" class=\"btn btn-primary\" id=\"edit\" " +
                        "name=\""+ json[i]['id']+","+ json[i]['name']+","+json[i]['description']+
                        "\"onclick=\"edit(this)\" data-toggle=\"modal\" data-target=\"#editModal\">edit</button>" +
                        "<button type=\"button\" class=\"btn btn-primary\" id=\"del\" name=\""+ json[i]['id'] +"\">delete</button>");
                    //将新行添加到表格中
                    realrow.appendTo("#tem");

                }

            }
        });



    }

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

});

function addTaskRequest() {
    var taskName=document.getElementById("taskName").value;
    var taskDescription=document.getElementById("taskDescription").value;
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
        },
        error:function(){
            alert("error");
        }
    });
}


function editTaskRequest(){

    var edit_taskId=document.getElementById("edit_taskId").value;
    var edit_taskName=document.getElementById("edit_taskName").value;
    var edit_description=document.getElementById("edit_taskDescription").value;
    $.ajax({
        url: "http://localhost:8080/task/editTask",
        type: "POST",
        dataType: "json",
        data: {
            "taskId": edit_taskId,
            "taskName": edit_taskName,
            "taskDescription": edit_description,
        },
        success: function(data) {
            if ("success" == data.result) {

                alert("edit success");

            }
            else {

                alert("edit fail");
            }
        }
});


}