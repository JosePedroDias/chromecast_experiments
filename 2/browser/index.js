(function() {
	'use strict';



	log('APP VERSION', APP_VERSION);

	var cc = window.setupChromeCastSender(CC_APPLICATION_ID, CC_NAMESPACE);

	/*cc.on('log', function(text) {
		log(text);
	});*/

	cc.on('ready', function(data) {
		log('ready', data);

		document.querySelector('#load-button').addEventListener('click', function() {
			var videoURL = document.querySelector('#video-url').value;
			var posterURL = document.querySelector('#poster-url').value;
			var autoplay = document.querySelector('#autoplay').checked;

			cc.send({
				kind:      'load',
				videoURL:  videoURL,
				posterURL: posterURL,
				autoplay:  autoplay
			});
		});

		document.querySelector('#play-button').addEventListener('click', function() {
			cc.send({
				kind: 'play'
			});
		});

		document.querySelector('#pause-button').addEventListener('click', function() {
			cc.send({
				kind: 'pause'
			});
		});

		document.querySelector('#current-time-set-button').addEventListener('click', function() {
			var t = parseFloat( document.querySelector('#current-time-set').value );
			cc.send({
				kind: 'setCurrentTime',
				value: t
			});
		});

		document.querySelector('#volume-set-button').addEventListener('click', function() {
			var v = parseFloat( document.querySelector('#volume-set').value );
			cc.send({
				kind: 'setVolume',
				value: v
			});
		});
	});

	cc.on('error', function(data) {
		console.error('error', data);
		// window.alert(data);
	});

	cc.on('session_updated', function(data) {
		log('session_updated', data);
	});

	cc.on('session_removed', function(data) {
		log('session_removed', data);
	});

	cc.on('message', function(data) {
		var msg = JSON.parse(data.data);
		log('message: ', msg);

		switch (msg.kind) {
			case 'timeupdate':
				document.querySelector('#current-time').innerHTML = msg.value.toFixed(2);
				break;

			case 'loadedmetadata':
				document.querySelector('#duration'  ).innerHTML = msg.duration.toFixed(2);
				document.querySelector('#dimensions').innerHTML = msg.dimensions.join(' x ');
				break;

			case 'ended':
				document.querySelector('#current-time').innerHTML = 'ENDED';
				break;

			case 'echo':
				log(msg);
				break;

			default:
				console.error(msg);
		}
	});



	if (cc.isSupported()) {
		log('chromecast supported!');
		cc.start();
	}
	else {
		window.alert('chromecast not supported!');
	}

})();
