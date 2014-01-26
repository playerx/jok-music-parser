
var radio = require('radio-stream');
var $ = require('jQuery').create();

var API_ROOT_URL = 'http://api.jok.io';


function startReadingMetadata(id, url, nextTimeoutDelayCount) {
    var stream = radio.createReadStream(url);

    stream.on("metadata", function (metadata) {

        nextTimeoutDelayCount = 1;

        var title = radio.parseMetadata(metadata).StreamTitle;
        if (!title || title == '') return;

        console.log(metadata);

        $.get(API_ROOT_URL + '/Music/BroadcastTrack/?channelID=' + id + '&trackInfo=' + title, function () {
            console.log(id, title, 'success');
        });
    });

    stream.on("close", function (info) {
        console.log(id, 'close', info, nextTimeoutDelayCount);
        reconnect();
    });

    stream.on("error", function (info) {
        console.log(id, 'error', info, nextTimeoutDelayCount);
        reconnect();
    });


    function reconnect() {
        setTimeout(function () {

            if (nextTimeoutDelayCount < 30)
                nextTimeoutDelayCount++;

            startReadingMetadata(id, url, nextTimeoutDelayCount);

        }, nextTimeoutDelayCount * 1000);
    }
}


$.get(API_ROOT_URL + '/Music/Channels', function (res) {

    if (!res || !res.IsSuccess) return;

    for (var i = 0; i < res.Data.length; i++) {

        startReadingMetadata(res.Data[i].ID, res.Data[i].Source, 1);
    }
})

console.log('Started! :)');

