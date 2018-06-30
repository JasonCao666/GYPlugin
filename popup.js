var background = chrome.extension.getBackgroundPage();
$(document).ready(function(){

    $("#stopButton").click(function () {
        $("#userProcedure").html(background.userClick)
        alert(background.userClick);
        background.userClick="";
    });


});

