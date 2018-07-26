
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
            //background.json=json;
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
                button.setAttribute("class","btn btn-default");
                button.setAttribute("name",json[i]['id']);
                button.setAttribute("onclick","proSelect(this);");
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
