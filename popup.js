var background = chrome.extension.getBackgroundPage();

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
});

$(document).ready(function(){
    prepare();

});

function prepare(){

    $.ajax({
        type: "POST",
        url: "http://localhost:8080/project/listProject",
        dataType: "json",
        success: function(data) {
            var json = eval(data);
            background.json=json;
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

function initialTaskPage(proId){
    background.current_step=0;
    var pro_json=background.json;
    for (var i = 0; i < pro_json.length; i++) {
        if(proId==pro_json[i]['id']){
            var tasks=eval(pro_json[i]['tasks']);
            tasks.sort(tasks['id']);
            background.current_tasks=tasks;

            var div_task_content= document.createElement("div");
            div_task_content.setAttribute("class","task_content");
            div_task_content.innerHTML= "Please open this website: "+"<a id=\"openTestPage\" name=\""+pro_json[i]['websiteURL']+"\">"+pro_json[i]['websiteURL']+"</a>";

            var div_task_opt=document.createElement("div");
            div_task_opt.setAttribute("class","task_opt");
            var button1=document.createElement("input");
            button1.setAttribute("type","button");
            button1.setAttribute("class","btn btn-sm");
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

