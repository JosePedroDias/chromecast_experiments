var APPLICATION_ID = 'D452BBEF';
var NAMESPACE = 'urn:x-cast:com.josepedrodias.xpcc.first';

var APP_VERSION = '150216_v4';



var logEl;

var log = function(msg) {
	if (!logEl) {
		logEl = document.getElementById('log');
	}

	var el = document.createElement('div');
	el.appendChild( document.createTextNode( msg ) );
	logEl.appendChild(el);

	logEl.scrollTop = logEl.scrollHeight;
};

var onGeneric = function() {
	var val, i, I = arguments.length, arr = [this];
	for (i = 0; i < I; ++i) {
		try {
			val = JSON.stringify( arguments[i] );
		} catch (ex) {
			val = '??';
		}
		arr.push( val );
	}
	log( arr.join(' ') );
};
