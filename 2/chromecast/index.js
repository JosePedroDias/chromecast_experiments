(function() {
	'use strict';



	log('APP VERSION', APP_VERSION);

	var sourceEl, videoEl = document.querySelector('video');

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



	// sender-triggered

	var load = function(videoURL, posterURL, autoplay) {
		if (posterURL) {
			videoEl.setAttribute('poster', posterURL);
		}
		else if (videoEl.hasAttribute('poster')) {
			videoEl.removeAttribute('poster');
		}

		if (sourceEl) {
			videoEl.removeChild(sourceEl);
		}

		sourceEl = document.createElement('source');
		sourceEl.setAttribute('type', 'video/mp4');
		sourceEl.setAttribute('src', videoURL);

		if (autoplay) {
			sourceEl.setAttribute('autoplay', '');
		}

		videoEl.appendChild(sourceEl);

		videoEl.load();
	};

	var play = function() {
		videoEl.play();
	};

	var pause = function() {
		videoEl.pause();
	};

	var setCurrentTime = function(t) {
		videoEl.currentTime = t;
	};

	var setVolume = function(v) {
		videoEl.setVolume(v);
	};



	// triggered by video element

	var onTimeupdate = function() {
		cc.broadcast({
			kind:  'timeupdate',
			value: videoEl.currentTime
		});
	};

	/*var onDurationchange = function() {
		cc.broadcast({
			kind:  'durationchange',
			value: videoEl.duration
		});
	};*/

	var onLoadedMetadata = function() {
		cc.broadcast({
			kind:      'loadedmetadata', 
			imensions: [videoEl.videoWidth, videoEl.videoHeight],
			duration:  videoEl.duration
		});
	};

	var onEnded = function() {
		cc.broadcast({
			kind:'ended'
		});
	};

	videoEl.addEventListener('timeupdate',     onTimeupdate);
	//videoEl.addEventListener('durationchange', onDurationchange);
	videoEl.addEventListener('loadedmetadata', onLoadedMetadata);
	videoEl.addEventListener('ended',          onEnded);




	cc.on('message', function(data) {
		var msg = JSON.parse(data.data);
		log('message: ', msg);

		switch (msg.kind) {
			case 'load':
				load(msg.videoURL, msg.posterURL, msg.autoplay);
				break;

			case 'play':
				play();
				break;

			case 'pause':
				pause();
				break;

			case 'setCurrentTime':
				setCurrentTime(msg.value);
				break;

			case 'setVolume':
				setVolume(msg.value);
				break;
		}

		cc.broadcast({kind:'echo', value:msg});
	});

	cc.start();

})();
