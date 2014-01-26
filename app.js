
var radio = require('./radio-stream');
var $ = require('jQuery').create();

var API_ROOT_URL = 'http://api.jok.io';


function startReadingMetadata(id, url) {
    var stream = radio.createReadStream(url);

    stream.on("metadata", function (metadata) {

        var title = radio.parseMetadata(metadata).StreamTitle;
        if (!title || title == '') return;

        $.post(API_ROOT_URL + '/Music/BroadcastTrack/?channelID=' + id + '&trackInfo=' + title);
    });

    stream.on("error", function (info) {

        $.post(API_ROOT_URL + '/Music/ChannelOffline/?channelID=' + id);
    });


    function reconnect() {

        stream = null;

        setTimeout(function () {

            if (nextTimeoutDelayCount < 30)
                nextTimeoutDelayCount++;

            startReadingMetadata(id, url, nextTimeoutDelayCount);

        }, nextTimeoutDelayCount * 1);
    }
}


$.get(API_ROOT_URL + '/Music/Channels/?includeOfflines=true', function (res) {

    if (!res || !res.IsSuccess) return;

    for (var i = 0; i < res.Data.length; i++) {

        //if (res.Data[i].ID != 43 && res.Data[i].ID != 91) continue;

        startReadingMetadata(res.Data[i].ID, res.Data[i].Source);
    }
})

console.log('Started! :)');

