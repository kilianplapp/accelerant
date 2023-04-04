export function detectSupportedAudioFormats() {
    var audioElement = document.createElement('audio');
    var formats = [
      {ext: 'mp3', type: 'audio/mpeg'},
      {ext: 'ogg', type: 'audio/ogg; codecs="vorbis"'},
      {ext: 'wav', type: 'audio/wav; codecs="1"'},
      {ext: 'aac', type: 'audio/aac'},
      {ext: 'm4a', type: 'audio/mp4; codecs="mp4a.40.2"'},
      {ext: 'webm', type: 'audio/webm; codecs="vorbis"'},
      {ext: 'opus', type: 'audio/opus'},
      {ext: 'flac', type: 'audio/flac'}
    ];
    var supportedFormats = [];
  
    for (var i = 0; i < formats.length; i++) {
      var canPlay = audioElement.canPlayType(formats[i].type);
      if (canPlay === 'probably' || canPlay === 'maybe') {
        supportedFormats.push(formats[i].ext);
      }
    }
  
    return supportedFormats;
  }