(function() {

	'use strict';



	// GLOBAL
	var SESSION;
	var QUEUED_MESSAGES = [];



	var noop = function() {};



	// https://developers.google.com/cast/docs/chrome_sender

	

	window.__onGCastApiAvailable = function(loaded, errorInfo) {
		var requestSession;

		if (!loaded) { return log('api failed with error ' + errorInfo); }

		log('api loaded ok!');

		var sessionRequest = new chrome.cast.SessionRequest(APPLICATION_ID);

		var sessionUpdateListener = function(isAlive) {
			var message = (isAlive ? 'session updated' : 'session removed');
		    message += ': ' + SESSION.sessionId;
		    log(message);

		    if (!isAlive) {
		    	SESSION = null;
		    }
		};

		var receiverMessage = function(namespace, message) {
			//log('receiverMessage: ' + namespace + ', ' + message);
			log('<- ' + message);
		};

		var sessionListener = function(ev) {
			//log('sessionListener');
			SESSION = ev;
			log('session id: ' + ev.sessionId);

			SESSION.addUpdateListener(sessionUpdateListener);  

			SESSION.addMessageListener(NAMESPACE, receiverMessage);

			for (var i = 0, I = QUEUED_MESSAGES.length; i < I; ++i) {
				sendMessage( QUEUED_MESSAGES.shift() );
			}
		};

		var receiverListener = function(ev) {
			if (ev === chrome.cast.ReceiverAvailability.AVAILABLE) {
				log('receiver available!');

				requestSession();
			}
			else {
				log('receiver ' + ev);
			}
		};

		var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);

		chrome.cast.initialize(apiConfig, onGeneric.bind('initialize ok:'), onGeneric.bind('initialize error:'));

		var sendMessage = function(message) {
			if (!SESSION) {
				QUEUED_MESSAGES.push(message);
				log('sendMessage: delaying sending for when session is available...');
				return requestSession();
			}

			log('-> ' + message);
			SESSION.sendMessage(
				NAMESPACE,
				message,
				noop, //onGeneric.bind('sendMessage ok:'),
				onGeneric.bind('sendMessage error:')
			);
		};

		requestSession = function() {
			log('requesting session...');
			chrome.cast.requestSession(sessionListener, onGeneric.bind('requestSession error:'));
		};

		//window.requestSession = requestSession; // xTODO
		window.sendMessage = sendMessage;



		var inputEl = document.querySelector('.input-line');
		inputEl.addEventListener('change', function(ev) {
			var v = inputEl.value;
			inputEl.value = '';
			sendMessage(v);
		});
	};



	log('APP VERSION ' + APP_VERSION);

})();
