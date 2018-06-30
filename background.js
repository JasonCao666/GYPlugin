var number=0;
var userClick=""
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        userClick=userClick+request.myMsg+",";
        alert(userClick);
        if (request.myMsg != "")
            sendResponse({farewell: "I have recieved"});
    });