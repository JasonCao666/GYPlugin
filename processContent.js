

var port= chrome.runtime.connect({name: "myConn"});


port.onMessage.addListener(function(msg) {

    if (msg.command == "Do it"){
        alert("comm sucess");
        port.postMessage({answer: "Madame"});
    }

});




function startListen() {

    $(document).click(function (e) {
        var v_text = $(e.target).text();
        alert(v_text);

        chrome.runtime.sendMessage({myMsg: v_text}, function (response) {
            console.log(response.farewell);
        });
    });
}

