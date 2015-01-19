var APPLICATION_ID = 'D452BBEF';
var NAMESPACE = 'urn:x-cast:com.josepedrodias.xpcc.first';



var log = function(msg) {
	var el = document.createElement('div');
	el.appendChild( document.createTextNode( msg ) );
	document.body.appendChild(el);
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
