var number=0;
var userClick=[];
var selectedTasks=[];
var openFlag=0;
var json;
var time_left;
var current_task_index=0;
var current_tasks=[];
var current_port;

/*chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        userClick=userClick+request.myMsg+",";
        alert(userClick);
        if (request.myMsg != "")
            sendResponse({farewell: "I have recieved"});
    });*/

chrome.runtime.onConnect.addListener(function(port) {
    current_port=port;

});



/*
window.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('click', function(e) {
        if(e.target.id=="proSelect")
        {
            initialTaskPage(e.target.name);
        }
        if(e.target.id=="openTestPage")
        {
            //window.open(e.target.name);
            chrome.tabs.update({url:e.target.name});
        }
    });
});*/

$(document).ready(function(){
    prepare();


});

function prepare(){

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/project/listProject",
        dataType: "json",
        success: function(data) {
            json = eval(data);
            for (var i = 0; i < json.length; i++) {
                var li = document.createElement("li");
                var div_content= document.createElement("div");
                div_content.setAttribute("class","pro_detail")
                var div1 = document.createElement("div");
                div1.setAttribute("class","project_name");
                div1.innerHTML=json[i]['name'];
                var div2 = document.createElement("div");
                div2.setAttribute("class","project_description");
                div2.innerHTML=json[i]['description'];
                var button=document.createElement("input");
                button.setAttribute("type","button");
                button.setAttribute("class","btn btn-sm");
                button.setAttribute("name",json[i]['id']);
                button.setAttribute("id","proSelect");
                //button.setAttribute("onclick","proSelect("+json[i]['id']+");");
                button.value="Select";

                div_content.appendChild(div1);
                div_content.appendChild(div2);
                li.appendChild(div_content);
                li.appendChild(button);
                document.getElementById("projects").appendChild(li);

            }
        }
    });

}
function proSelect(id){

    initialTaskPage(id);
}


function initialTaskPage(proId){

    var pro_json=json;
    for (var i = 0; i < pro_json.length; i++) {
        if(proId==pro_json[i]['id']){
            document.getElementById("tasks-execute").innerHTML="";
            var tasks=eval(pro_json[i]['tasks']);
            tasks.sort(compare);
            current_tasks=tasks;

            var div_task_content= document.createElement("div");
            div_task_content.setAttribute("class","task_content");
            div_task_content.setAttribute("id","task_content");
            div_task_content.innerHTML= "Please open this website: "+"<a id=\"openTestPage\" name=\""+pro_json[i]['websiteURL']+"\">"+pro_json[i]['websiteURL']+"</a>";

            var div_task_opt=document.createElement("div");
            div_task_opt.setAttribute("class","task_opt");
            div_task_opt.setAttribute("id","task_opt");
            var button1=document.createElement("input");
            button1.setAttribute("type","button");
            button1.setAttribute("class","startEvaluateBtn");
            button1.setAttribute("id","startEvaluate");
            button1.value="start";
            div_task_opt.appendChild(button1);

            document.getElementById("tasks-execute").appendChild(div_task_content);
            document.getElementById("tasks-execute").appendChild(div_task_opt);
            /*var div_task_content= document.createElement("div");
            div_task_content.setAttribute("class","task_content");
            div_task_content.innerHTML= tasks[0]['name'];
            var div_task_opt=document.createElement("div");
            div_task_opt.setAttribute("class","task_opt");
            var button1=document.createElement("input");
            button1.setAttribute("type","button");
            button1.setAttribute("class","btn btn-sm");
            button1.setAttribute("name",0);
            button1.setAttribute("id","taskStart");
            button1.value="start";
            var button2=document.createElement("input");
            button2.setAttribute("type","button");
            button2.setAttribute("class","btn btn-sm");
            button2.setAttribute("name",0);
            button2.setAttribute("id","taskComplete");
            button2.value="complete";

            div_task_opt.appendChild(button2);
            div_task_opt.appendChild(button1);
            document.getElementById("tasks-execute").appendChild(div_task_content);
            document.getElementById("tasks-execute").appendChild(div_task_opt);*/



        }

    }
}

function startTaskByIndex(index){
    document.getElementById("task_content").innerHTML="";
    document.getElementById("task_opt").innerHTML="";
    var div_task_name= document.createElement("h4");
    div_task_name.setAttribute("id","h4_task_name");
    div_task_name.innerHTML=current_tasks[current_task_index]['name'];
    var div_task_describe= document.createElement("div");
    div_task_describe.setAttribute("id","div_task_describe");
    div_task_describe.innerHTML=current_tasks[current_task_index]['description'];


    var button1=document.createElement("input");
    button1.setAttribute("type","button");
    button1.setAttribute("class","startEvaluateBtn");
    button1.setAttribute("id","startTask");
    button1.value="start";

    var button2=document.createElement("input");
    button2.setAttribute("type","button");
    button2.setAttribute("class","startEvaluateBtn");
    button2.setAttribute("id","stopTask");
    button2.value="stop";

    document.getElementById("task_content").appendChild(div_task_name);
    document.getElementById("task_content").appendChild(div_task_describe);
    document.getElementById("task_opt").appendChild(button1);
    document.getElementById("task_opt").appendChild(button2);

}

function compare(x,y){
    return (x.id < y.id) ? -1 : 1
}

function remindContentStartTask()
{

    if(current_port.name == "myConn"){
        current_port.postMessage({command: "Do it"});
        
    }
}
