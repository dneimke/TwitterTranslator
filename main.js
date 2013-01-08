function Tweet(originalText) {
    this.originalText = originalText;
}


Object.defineProperty(Tweet, "translatedText", {
    value: null,
    writable: true,
    enumerable: true,
    configurable: true
});

Object.defineProperties(Tweet.prototype, {
    isTranslated: {
        value: function isTranslated() {
            return this.translatedText !== undefined;
        }
    }
});


var ulListNodes = Array.prototype.slice.call(document.getElementsByClassName('js-actions'));
var lookup = [];


for (var i = 0; i <= ulListNodes.length - 1; i++) {
    var ul = ulListNodes[i];
    appendTranslateNode(ul);
}

function appendTranslateNode(ul) {
    var tweetNode = ul.parentNode.parentNode.parentNode;
    var tweetId = tweetNode.dataset.tweetId;

    if (!lookup.hasOwnProperty(tweetId)) {
        var a = document.createElement('a');
        a.href = '#';
        a.id = 'translate_' + tweetId;
        a.dataset.tweetIdentifier = tweetId;
        a.addEventListener("click", translateTweetText);
        var text = document.createTextNode('translate');
        var li = document.createElement('li');
        a.appendChild(text);
        li.appendChild(a);
        ul.appendChild(li);
        
        
        var a1 = document.createElement('a');
        a1.href = '#';
        a1.id = 'revert_' + tweetId;
        a1.dataset.tweetIdentifier = tweetId;
        a1.style.display = 'none';
        a1.addEventListener("click", revertTweetText);
        var text1 = document.createTextNode('original text');
        var li1 = document.createElement('li');
        a1.appendChild(text1);
        li1.appendChild(a1);
        ul.appendChild(li1);

        var tweetText = getTweetText(tweetId);
        lookup[tweetId] = new Tweet(tweetText);
    }
}

function translateTweetText(evt) {

    var tweetId = evt.target.dataset.tweetIdentifier;
    if (lookup.hasOwnProperty(tweetId) && lookup[tweetId].isTranslated()) {
        console.log("cache lookup...");
        var tweet = lookup[tweetId];
        setTweetText(tweetId, tweet.translatedText);
        
        document.getElementById('translate_' + tweetId).style.display = 'none';
        document.getElementById('revert_' + tweetId).style.display = '';
    } else {
        console.log("api lookup...");
        var tweetText = getTweetText(tweetId);
        // translateText(tweetText, tweetId);
        chrome.extension.sendMessage({tweetText: tweetText, tweetId: tweetId}, handleTranslationCallback);
    }
    
}

function revertTweetText(evt) {
    var tweetId = evt.target.dataset.tweetIdentifier;
    if (!lookup.hasOwnProperty(tweetId)) {
        console.log("An error occurred.");
        return;
    }
    
    var tweet = lookup[tweetId];
    setTweetText(tweetId, tweet.originalText);
    document.getElementById('translate_' + tweetId).style.display = ''; 
    document.getElementById('revert_' + tweetId).style.display = 'none';
}

function getTweetText(tweetId) {
    var tweet = document.querySelector('[data-tweet-id="' + tweetId + '"]');
    var para = tweet.querySelector('p.js-tweet-text');
    return para.firstChild.textContent;
}

function setTweetText(tweetId, text) {
    var tweet = document.querySelector('[data-tweet-id="' + tweetId + '"]');
    var para = tweet.querySelector('p.js-tweet-text');
    para.textContent = text;
}


function handleTranslationCallback(message){
    var tweetId = message.tweetId;  
    var translatedTweetText = message.translatedText;  
    
    var tweet = lookup[tweetId];
    tweet.translatedText = translatedTweetText;
    setTweetText(tweetId, translatedTweetText);
    
    document.getElementById('translate_' + tweetId).style.display = 'none';
    document.getElementById('revert_' + tweetId).style.display = '';
}

