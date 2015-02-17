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
				cc.send('42 x');
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



	// setTimeout(function() { // TODO ARGH

		if (cc.isSupported()) {
			log('chromecast supported!');
			cc.start();
		}
		else {
			log('chromecast not supported!');
		}

	// }, 200);

})();
