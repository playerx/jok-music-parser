

var radio = require('./radio-stream')
var http = require('http')

var channelsCount = 0;

http.get('http://api.jok.ge/musicchannel/0/getall', function (res) {

    var st = '';

    res.on('data', function (data) {
        st += data;
    });

    res.on('end', function () {
        var channels = JSON.parse(st);

        console.log('Channels loaded: ', channels.length);
        channelsCount = channels.length;
        
        for (var i = 0; i < channels.length; i++) {
            CreateStream(channels[i].ID, channels[i].Source);
        }
    });
});

function CreateStream(id, url) {
    var stream = radio.createReadStream(url);

    stream.on("metadata", function (metadata) {

        var title = radio.parseMetadata(metadata).StreamTitle;
        if (!title || title == '') return;

        http.get('http://api.jok.ge/musicchannel/' + id + '/addtrack?info=' + title);
    });

    stream.on("error", function (error) {
        console.log(id, error);
    });
}
