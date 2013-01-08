var apiKey = null; // ENTER API KEY HERE
var url = 'https://www.googleapis.com/language/translate/v2?target=en&key=' + apiKey + '&q=';

console.log('Background worker running.');

function translateText(text, tweetId, sendResponse) {
    
    if (apiKey === null) {
        alert("You must provide your own Google API Key to call the Google Translate Service.");
        return;
    }
    
    var request = new XMLHttpRequest();
    var source = url + text;
    request.open("GET", source, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var obj = JSON.parse(request.responseText);
            var translatedTweetText = obj.data.translations[0].translatedText;
            console.log('Returning ' + translatedTweetText + ' to sender');
            sendResponse({tweetId: tweetId, translatedText: translatedTweetText});
        }
    };
    request.send(null);
}


chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Recieved ' + request.tweetText + ' from ' + request.tweetId);
    translateText(request.tweetText, request.tweetId, sendResponse)
    return true;
  });