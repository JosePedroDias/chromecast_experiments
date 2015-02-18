// If you set ?Debug=true in the URL, such as a different App ID in the developer console, include debugging information.
if (window.location.href.indexOf('Debug=true') != -1) {
	cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
	cast.player.api.setLoggerLevel(cast.player.api.LoggerLevel.DEBUG);
}

var mediaElement = document.getElementById('vid');



// Create the media manager. This will handle all media messages by default.
window.mediaManager = new cast.receiver.MediaManager(mediaElement);



// Remember the default value for the Receiver onLoad, so this sample can Play non-adaptive media as well.
window.defaultOnLoad = mediaManager.onLoad;

mediaManager.onLoad = function(event) {
	// The Media Player Library requires that you call player unload between different invocations.
	if (window.player !== null) {
		player.unload();    // Must unload before starting again.
		window.player = null;
	}

	// trivial parser, based on file ext
	if (event.data.media && event.data.media.contentId) {
		console.log('Starting media application');
		var url = event.data.media.contentId;

		// Create the Host - much of your interaction with the library uses the Host and methods you provide to it.
		window.host = new cast.player.api.Host({mediaElement:mediaElement, url:url});
		var ext = url.substring(url.lastIndexOf('.'), url.length);
		var initStart = event.data.media.currentTime || 0;
		var autoplay = event.data.autoplay || true;

		var protocol = null;
		mediaElement.autoplay = autoplay;  // Make sure autoplay get's set
		
		if (url.lastIndexOf('.m3u8') >= 0) { // HLS
			protocol = cast.player.api.CreateHlsStreamingProtocol(host);
		}
		else if (url.lastIndexOf('.mpd') >= 0) { // MPEG-DASH
			protocol = cast.player.api.CreateDashStreamingProtocol(host);
		}
		else if (url.indexOf('.ism/') >= 0) { // SS
			protocol = cast.player.api.CreateSmoothStreamingProtocol(host);
		}

		// How to override a method in Host. I know that it's safe to just provide this method.
		host.onError = function(errorCode) {
			console.log('Fatal Error - ' + errorCode);
			if (window.player) {
				window.player.unload();
				window.player = null;
			}
		};

		// If you need cookies, then set withCredentials = true also set any header information you need.
		/*host.updateSegmentRequestInfo = function(requestInfo) {
			requestInfo.withCredentials = true;
		};*/

		console.log('we have protocol ' + ext);

		if (protocol !== null) {
			console.log('Starting Media Player Library');
			window.player = new cast.player.api.Player(host);
			window.player.load(protocol, initStart);
		}
		else {
			window.defaultOnLoad(event); // do the default process
		}
	}
};


window.player = null;
console.log('Application is ready, starting system');
window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
castReceiverManager.start();
