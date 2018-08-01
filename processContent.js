

var port= chrome.runtime.connect({name: "myConn"});
var command_flag=0;

$(document).ready(function(){

    port.postMessage({question: "What is flag"});

});

port.onMessage.addListener(function(msg) {

    if (msg.command == "Do it"){
        alert("comm sucess");
        command_flag=1;

    }
    else if(msg.com_flag == 1){
        command_flag=1;
    }

});





$(document).click(function (e) {
    if(command_flag==1){
    var v_text = $(e.target).text();
    port.postMessage({user_click_step: v_text});

    //alert(v_text);
    }

    /*chrome.runtime.sendMessage({myMsg: v_text}, function (response) {
        console.log(response.farewell);
    });*/
});

/*if(){
    $(document).bind("click", function(e){
        var v_text = $(e.target).text();
        alert(v_text);
    });
}*/



