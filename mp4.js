(function() {
	'use strict';

	var fsOn = function() {
		document.body.classList.add('video-on-fullscreen');
		var s = this.style;
		s.left = 0;
		s.top  = 0;
		s.width  = '100%';
		s.height = '100%';
		s.backgroundColor = '#000';
		s.zIndex = 10000;
	};

	var fsOff = function() {
		document.body.classList.remove('video-on-fullscreen');
		var s = this.style;
		s.left = '';
		s.top  = '';
		s.width  = '';
		s.height = '';
		s.backgroundColor = '';
		s.zIndex = '';
	};

	var enrichVideoElement = function(v) {
		v.fsOn  = fsOn;
		v.fsOff = fsOff;
	};


	var videoURL  = 'http://rd3.videos.sapo.pt/ZbkSD8f1e3LtndICCztq/mov/39'; var mimeType = 'video/mp4';
	// var videoURL = 'http://213.13.26.12:1935/live/etv_direto/playlist.m3u8'; var mimeType = 'application/vnd.apple.mpegurl';
	var posterURL = 'http://thumbs.web.sapo.io/?p=http://rd3.videos.sapo.pt/ZbkSD8f1e3LtndICCztq/pic/560x420&W=560&H=314&errorpic=transparent&crop=corner_lt&cropcoords=0x53';

	var v = document.createElement('video');
	v.setAttribute('poster', posterURL);
	// v.setAttribute('src',    videoURL);
	//v.setAttribute('autoplay', '');

	var srcEl = document.createElement('source');
	srcEl.setAttribute('type', 'video/mp4');
	srcEl.setAttribute('src',  videoURL);
	v.appendChild(srcEl);
	document.body.appendChild(v);

	enrichVideoElement(v);

	v.addEventListener('loadedmetadata', function() {
		var t = ['duration: ', v.duration.toFixed(2), ' | dimensions: ', v.videoWidth, ' x ', v.videoHeight].join('');
		log(t);
		window.send(t);
	});
	v.addEventListener('play', function() {
		log('play');
		window.send('play');
	});
	v.addEventListener('pause', function() {
		log('pause');
		window.send('pause');
	});
	v.addEventListener('ended', function() {
		log('ended');
		window.send('ended');
	});
	v.addEventListener('timeupdate', function() {
		var t = 'time: ' + v.currentTime.toFixed(2);
		// log(t);
		window.send(t);
	});

	window.v = v;



	window.load = function(videoURL, posterURL) {
		if (posterURL) {
			v.setAttribute('poster', posterURL);
		}

		v.removeChild(srcEl);
		srcEl = document.createElement('source');
		srcEl.setAttribute('type', 'video/mp4');
		srcEl.setAttribute('src',  videoURL);
		v.appendChild(srcEl);

		v.load();
	};




	var div = document.createElement('div');
	div.className = 'mosca';
	document.body.appendChild(div);

})();
