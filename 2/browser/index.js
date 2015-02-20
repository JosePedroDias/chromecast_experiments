(function() {
	'use strict';



	log('APP VERSION', APP_VERSION);

	var cc = window.setupChromeCastSender(CC_APPLICATION_ID, CC_NAMESPACE);

	/*cc.on('log', function(text) {
		log(text);
	});*/

	cc.on('ready', function(data) {
		log('ready', data);

		// to prevent session from expiring ?!
		setInterval(function() {
			cc.send({
				kind:  'ping',
				value: ~~( Math.random() * 10000 )
			});
		}, 1000);

		qs('#load-button').addEventListener('click', function() {
			var videoURL = qs('#video-url').value;
			var posterURL = qs('#poster-url').value;
			var autoplay = qs('#autoplay').checked;

			cc.send({
				kind:      'load',
				videoURL:  videoURL,
				posterURL: posterURL,
				autoplay:  autoplay
			});
		});

		qs('#play-button').addEventListener('click', function() {
			cc.send({
				kind: 'play'
			});
		});

		qs('#pause-button').addEventListener('click', function() {
			cc.send({
				kind: 'pause'
			});
		});

		qs('#current-time-set-button').addEventListener('click', function() {
			var t = parseFloat( qs('#current-time-set').value );
			cc.send({
				kind: 'setCurrentTime',
				value: t
			});
		});

		qs('#volume-set-button').addEventListener('click', function() {
			var v = parseFloat( qs('#volume-set').value );
			cc.send({
				kind: 'setVolume',
				value: v
			});
		});

		qs('#set-badge').addEventListener('click', function() {
			var bTitle = qs('#badge-title').value;
			var bImage = qs('#badge-image').value;
			cc.send({
				kind:  'setBadge',
				title: bTitle,
				image: bImage
			});
		});

		qs('#load-next').addEventListener('click', function() {
			var nTitle    = qs('#next-title').value;
			var nPoster   = qs('#next-poster').value;
			var nDuration = qs('#next-duration').value;
			cc.send({
				kind:    'showNext',
				title:    nTitle,
				poster:   nPoster,
				duration: nDuration
			});
		});

		qs('#unload-next').addEventListener('click', function() {
			cc.send({
				kind: 'hideNext'
			});
		});

		qs('#kill-cc').addEventListener('click', function() {
			cc.send({
				kind: 'kill'
			});
		});
	});

	cc.on('error', function(data) {
		console.error('error', data);
	});

	cc.on('session_updated', function(data) {
		log('session_updated', data);
	});

	cc.on('session_removed', function(data) {
		log('session_removed', data);
	});

	cc.on('message', function(data) {
		var msg = JSON.parse(data);

		switch (msg.kind) {
			case 'timeupdate':
				setText(qs('#current-time'), msg.value.toFixed(2));
				break;

			case 'loadedmetadata':
				setText(qs('#duration'),   msg.duration.toFixed(2));
				setText(qs('#dimensions'), msg.dimensions.join(' x '));
				break;

			case 'ended':
				setText(qs('#current-time'), 'ENDED');
				break;

			case 'serverversion':
				log('server version:', msg.appversion, msg.useragent);
				break;

			case 'progress':
			case 'durationchange':
			case 'loadedmetadata':
			case 'volumechange':

			case 'play':
			case 'pause':

			case 'waiting':
			case 'playing':
			case 'seeked':
				log(msg.kind, msg.value);
				break;

			case 'echo':
				console.warn('echo', JSON.stringify(msg.value) );
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
