var CC_APPLICATION_ID = 'D452BBEF';
var CC_NAMESPACE      = 'urn:x-cast:com.josepedrodias.xpcc.first';

var APP_VERSION = '150218_v004';



var logEl;

var log = function() {
	if (!logEl) {
		logEl = document.getElementById('log');
	}

	var l = arguments.length;
	var args = new Array(l);
	--l;
	for (; l >= 0; --l) {
		try {
			args[l] = JSON.stringify( arguments[l] );
		} catch (ex) {
			args[l] = arguments[l];
		}
	}

	var el = document.createElement('div');
	el.appendChild( document.createTextNode( args.join(', ') ) );
	logEl.appendChild(el);
};
