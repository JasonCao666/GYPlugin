var number=0;
var user_steps=new Array();
var json;
var current_task_index=0;
var current_tasks=[];
var current_port;
var command_flag=0;
var JSON_output="";
var task_complete_time=0;
var time_count;
var current_home_page;
/*chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        userClick=userClick+request.myMsg+",";
        alert(userClick);
        if (request.myMsg != "")
            sendResponse({farewell: "I have recieved"});
    });*/

chrome.runtime.onConnect.addListener(function(port) {
    current_port=port;
    port.onMessage.addListener(function(msg) {
        if (msg.question == "What is flag") {
            port.postMessage({com_flag: command_flag});
        }
        else if(msg.user_click_step!= ""){
            var step=removeAfterBeforeSpace(msg.user_click_step);
            user_steps.push(step);
        }
    });
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        // read changeInfo data and do something with it (like read the url)
        if(changeInfo.url && command_flag==1){
            user_steps.push(changeInfo.url);
        }

    }
);
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
    JSON_output="";
    initialTaskPage(id);

    user_steps=new Array();
    current_task_index=0;
    command_flag=0;
}


function initialTaskPage(proId){


    var pro_json=json;
    for (var i = 0; i < pro_json.length; i++) {
        if(proId==pro_json[i]['id']){
            JSON_output+="{\"proId\":\""+pro_json[i]['id']+"\",";
            current_home_page=pro_json[i]['websiteURL'];
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

    if(current_task_index==0){
        JSON_output+="\"reports\":[{\"taskId\":\""+current_tasks[current_task_index]['id']+"\",";
    }
    else{
        JSON_output+="{\"taskId\":\""+current_tasks[current_task_index]['id']+"\",";
    }

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
    button2.setAttribute("data-toggle","modal");
    button2.setAttribute("data-target","#confirmModal");
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
        command_flag=1;
        current_port.postMessage({command: "Do it"});

    }
    time_count=timer();

}

function nextTask(){

    /*for(var i=0;i<user_steps.length;i++){
        alert(user_steps[i]);
    }*/
    if(current_task_index!=current_tasks.length-1){
        JSON_output+="\"time\":\""+task_complete_time+"\",\"steps\":\""+user_steps.toString()+"\"},";
        current_task_index=current_task_index+1;

        startTaskByIndex(current_task_index);
    }
    else if(current_task_index==current_tasks.length-1){
        JSON_output+="\"time\":\""+task_complete_time+"\",\"steps\":\""+user_steps.toString()+"\"}]}";
        current_task_index=current_task_index+1;
        document.getElementById("tasks-execute").innerHTML="";
        var div_task_content= document.createElement("div");
        div_task_content.setAttribute("class","task_content");
        div_task_content.setAttribute("id","task_content");
        div_task_content.innerHTML="The evaluation has completed. Thanks for participating.";
        document.getElementById("tasks-execute").appendChild(div_task_content);

        $.ajax({
            url: "http://localhost:8080/report/addReport",
            type: "POST",
            dataType: "json",
            data: {
                "reportJson": JSON_output,
            },
            success: function(data) {
                if ("success" == data.result) {
                    alert("evaluation success");
                }
                else{
                    alert("cannot save");
                }
            }
        });

    }
    alert(JSON_output);
    task_complete_time=0;
    clearInterval(time_count);
    user_steps=new Array();
    command_flag=0;
}

function removeAfterBeforeSpace(str)
{
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

/*function timedCount()
{
    task_complete_time=task_complete_time+1;
    time_count=setTimeout("timedCount()",1000);
}*/

function timer() {
    return setInterval(function () {
        task_complete_time++;
    }, 1000);
}