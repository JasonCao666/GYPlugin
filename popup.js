var background = chrome.extension.getBackgroundPage();
$(document).ready(function(){

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/task/listTask",
        dataType: "json",
        success: function(data) {
            $("#temtr").nextAll().remove();

            var json = eval(data);
            for (var i = 0; i < json.length; i++) {
                //var item=json[i]["list"];
                alert(json[i]['name']);
                alert(json[i]['description']);
                var realrow = $("#temtr").clone();
                //给每一行赋值
                realrow.find("#task_name").text(json[i]['name']);
                realrow.find("#task_description").text(json[i]['description']);
                realrow.find("#operation").html("<a href='javascript:void(0)'  onclick='edit(this)' value='edit'>Edit</a><a id='del' style='margin-left:10px;'  href='javascript:void(0)' onclick='del(this)' value='del'>Delete</a>");
                //将新行添加到表格中
                realrow.appendTo("#tem");
            }
        }
    });

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

