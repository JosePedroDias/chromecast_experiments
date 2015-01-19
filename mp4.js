(function() {
	'use strict';

	var v = document.createElement('video');
	document.body.appendChild(v);
	v.src = 'http://vjs.zencdn.net/v/oceans.mp4';

	setTimeout(function() {
		log('play!');
		v.play();

		setTimeout(function() {
			log('pause!');
			v.pause();
		}, 1500);
	}, 500);

})();
