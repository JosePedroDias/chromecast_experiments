(function() {
	'use strict';



	log('APP VERSION', APP_VERSION);

	var sourceEl, videoEl = document.querySelector('video');

	var cc = window.setupChromeCastReceiver(CC_APPLICATION_ID, CC_NAMESPACE);

	cc.on('ready', function(data) {
		log('ready');
	});

	cc.on('error', function(err) {
		log('error', err);

		cc.broadcast({
			kind: 'error',
			value: err
		});
	});

	cc.on('closing', function(data) {
		log('closing');

		cc.broadcast({
			kind: 'closing'
		});
	});

	cc.on('sender_connected', function(data) {
		log('sender_connected');

		cc.broadcast({
			kind:  'serverversion',
			value: APP_VERSION
		});
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

		if (autoplay) {
			videoEl.setAttribute('autoplay', '');
		}

		if (sourceEl) {
			videoEl.removeChild(sourceEl);
		}

		sourceEl = document.createElement('source');
		sourceEl.setAttribute('type', 'video/mp4');
		sourceEl.setAttribute('src', videoURL);
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

	var onError = function(ev) {
		cc.broadcast({
			kind:  'error', 
			value: ev.target.error.code
		});
	};


	var onLoadedMetadata = function() {
		cc.broadcast({
			kind:       'loadedmetadata', 
			dimensions: [videoEl.videoWidth, videoEl.videoHeight],
			duration:   videoEl.duration
		});
	};

	var onDurationchange = function() {
		cc.broadcast({
			kind:  'durationchange', 
			value: videoEl.duration
		});
	};



	var nearestEnd = function(ct, vBuffered) {
		var s, e;
		for (var i = vBuffered.length - 1; i >= 0; --i) {
			s = vBuffered.start(i);
			e = vBuffered.end(i);
			if (ct >= s && ct <= e) { return i; }
		}
		return -1;
	};

	var calcProgress = function(videoEl) {
		var res = {start:0, end:0, length:0 };

		var ct = videoEl.currentTime;
		var d = videoEl.duration;

		if (!isFinite(ct) || !isFinite(d)) {
			return res;
		}

		var i = nearestEnd(ct, videoEl.buffered);

		if (i !== -1) {
			res.start  = videoEl.buffered.start(i);
			res.end    = videoEl.buffered.end(  i);
			res.length = res.end - res.start;
		}

		return res;
	};

	var onProgress = function() {
		cc.broadcast({
			kind:  'progress', 
			value: calcProgress(videoEl)
		});
	};



	var onTimeupdate = function() {
		cc.broadcast({
			kind:  'timeupdate',
			value: videoEl.currentTime
		});
	};

	var onVolumechange = function() {
		cc.broadcast({
			kind:  'volumechange',
			value: videoEl.volume
		});
	};


	var onEnded   = function() { cc.broadcast({kind:'ended'}); };
	var onPause   = function() { cc.broadcast({kind:'pause'}); };
	var onPlay    = function() { cc.broadcast({kind:'play'}); };

	var onWaiting = function() { cc.broadcast({kind:'waiting'}); };
	var onPlaying = function() { cc.broadcast({kind:'playing'}); };
	var onSeeked  = function() { cc.broadcast({kind:'seeked'}); };



	videoEl.addEventListener('error',          onError);
	
	videoEl.addEventListener('loadedmetadata', onLoadedMetadata);
	videoEl.addEventListener('durationchange', onDurationchange);

	videoEl.addEventListener('progress',       onProgress);

	videoEl.addEventListener('timeupdate',     onTimeupdate);
	videoEl.addEventListener('volumechange',   onVolumechange);

	videoEl.addEventListener('ended',          onEnded);
	videoEl.addEventListener('pause',          onPause);
	videoEl.addEventListener('play',           onPlay);

	videoEl.addEventListener('waiting',        onWaiting);
	videoEl.addEventListener('playing',        onPlaying);
	videoEl.addEventListener('seeked',         onSeeked);




	cc.on('message', function(data) {
		var msg = JSON.parse(data.data);

		switch (msg.kind) {
			case 'ping':
				break;

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

			case 'kill':
				api.end();
				break;

			default:
				console.error(msg);
		}

		cc.broadcast({kind:'echo', value:msg});
	});

	cc.start(false); // trueish exists cc receiver when no more open sessions exist

})();
