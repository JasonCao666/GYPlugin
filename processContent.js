$(document).click(function (e) {
    var v_text = $(e.target).text();
    alert(v_text)

    chrome.runtime.sendMessage({myMsg: v_text}, function(response) {
        console.log(response.farewell);
    });
});

