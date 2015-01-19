(function() {
	'use strict';

	var fsOn = function() {
		var s = this.style;
		s.left = 0;
		s.top  = 0;
		s.width  = '100%';
		s.height = '100%';
		s.backgroundColor = '#000';
	};

	var fsOff = function() {
		var s = this.style;
		s.left = '';
		s.top  = '';
		s.width  = '';
		s.height = '';
		s.backgroundColor = '';
	};

	var enrichVideoElement = function(v) {
		v.fsOn  = fsOn;
		v.fsOff = fsOff;
	};


	var v = document.createElement('video');
	document.body.appendChild(v);
	v.setAttribute('autoplay', '');
	v.src = 'http://vjs.zencdn.net/v/oceans.mp4';
	enrichVideoElement(v);
	window.v = v;

})();
