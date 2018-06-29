var page = chrome.extension.getBackgroundPage();
$(document).ready(function(){

    /*var details = chrome.app.getDetails();

    var html =
        "<h2>"+details.name+"</h2>"+
        "<p>版本:v"+details.version+"</p>"+
        "<p>作者:oshine</p>"+
        "<p>@copyright 2016, 不可用于商业用途</p>";
    $("#about-box").html(html);*/

});

$(document).click(function (e) {
    alert(page.number)
});

