var oldChromeVersion = !chrome.runtime;
var apiKey = null; // ENTER API KEY HERE
var url = 'https://www.googleapis.com/language/translate/v2?target=en&key=' + apiKey + '&q=';

if (oldChromeVersion) {
  console.log('detected: old chrome version');
  onInit();
} else {
  console.log('detected: new chrome version');
  chrome.runtime.onInstalled.addListener(onInit);
}


function onInit(){
    console.log('Background worker running.')
}


function translateText(text, tweetId) {
    
    if (apiKey === null) {
        alert("You must provide your own Google API Key to call the Google Translate Service.");
        return;
    }
    
    var request = new XMLHttpRequest();
    var source = url + text;
    request.open("GET", source, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var obj = eval("(" + request.responseText + ")");  // change this to JSON.parse
            var translatedTweetText = obj.data.translations[0].translatedText;
            
           // Send message back to front-end
        }
    };
    request.send(null);
}