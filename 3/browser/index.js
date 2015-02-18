(function() {
	'use strict';



	log('APP VERSION', APP_VERSION);

	var cc = window.setupChromeCastSender(CC_APPLICATION_ID, CC_NAMESPACE);

	window.cc = cc; // TODO TEMP

	cc.on('log', function(text) {
		log(text);
	});

	cc.on('ready', function(data) {
		log('ready', data);

		setTimeout(
			function() {
				log('back from 1s timeout...');
				// cc.send('42 x');

				cc.send({ // https://developers.google.com/cast/docs/reference/messages
					requestId: 1,
					type: 'LOAD',
					media: {
						contentId: 'http://213.13.26.12:1935/live/luz.stream/playlist.m3u8', // http://rd3.videos.sapo.pt/TH7M3zfHJ32rqRpZnV2l/mov/24?all=1
						contentType: 'application/vnd.apple.mpegurl',
						streamType: 'BUFFERED'
						//metadata: 0
					},
					autoplay: true,
					currentTime: 0
				});
			},
			1000
		);
	});

	cc.on('error', function(data) {
		log('error', data);
	});

	cc.on('session_updated', function(data) {
		log('session_updated', data);
	});

	cc.on('session_removed', function(data) {
		log('session_removed', data);
	});

	cc.on('message', function(data) {
		log('message: ', data);
	});



	if (cc.isSupported()) {
		log('chromecast supported!');
		cc.start();
	}
	else {
		log('chromecast not supported!');
	}

})();
