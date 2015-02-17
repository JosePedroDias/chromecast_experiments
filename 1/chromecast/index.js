(function() {
	'use strict';



	log('APP VERSION', APP_VERSION);

	var cc = window.setupChromeCastReceiver(CC_APPLICATION_ID, CC_NAMESPACE);

	cc.on('ready', function(data) {
		log('ready');
	});

	cc.on('error', function(data) {
		log('error', data);
	});

	cc.on('closing', function(data) {
		log('closing');
	});

	cc.on('sender_connected', function(data) {
		log('sender_connected');
	});

	cc.on('sender_disconnected', function(data) {
		log('sender_disconnected');
	});

	cc.on('message', function(data) {
		log('message: ', data);
		cc.send(data.senderId, data.data); // ECHO
	});

	cc.start();

})();
