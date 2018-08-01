var winBackgroundPage=chrome.extension.getBackgroundPage();
$(document).ready(function(){

    if(winBackgroundPage) {

        document.body.innerHTML=winBackgroundPage.document.body.innerHTML;
    }

});
window.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('click', function(e) {
        if(e.target.id=="proSelect")
        {
            winBackgroundPage.proSelect(e.target.name);
            document.body.innerHTML=winBackgroundPage.document.body.innerHTML;

        }
        if(e.target.id=="openTestPage")
        {
            chrome.tabs.update({url:e.target.name});
        }
        if(e.target.id=="startEvaluate")
        {
            var weburl;
            var valitadeURL=document.getElementById('openTestPage').name;

            chrome.tabs.getSelected(null, function (tab) {
                weburl=tab.url;
                if(weburl==valitadeURL){
                    winBackgroundPage.startTaskByIndex(winBackgroundPage.current_task_index);
                    document.body.innerHTML=winBackgroundPage.document.body.innerHTML;
                }
                else{
                    alert("Please return to "+valitadeURL);
                }
            });


        }
        if(e.target.id=="startTask"){
            winBackgroundPage.remindContentStartTask();
        }
        if(e.target.id=="stopTask"){
            winBackgroundPage.nextTask();
        }
    });


});

