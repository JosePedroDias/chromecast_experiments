setupChromeCastSender = function(APPLICATION_ID, NAMESPACE) {
	'use strict';



	var api = {};
	window.eventEmitter(api);



	// https://developers.google.com/cast/docs/reference/chrome/

	api.isSupported = function() {
		return ( ('chrome' in window) && ('cast' in window.chrome) && (!!window.chrome.cast.exists) );
		// return ( ('chrome' in window) && ('cast' in window.chrome) && (!!window.chrome.cast.VERSION) );
	};

	api.start = function() {
		var SESSION;
		var QUEUED_MESSAGES = [];

		var noop = function() {};

		var emitOk = function(arg1) {
			api.emit(this, arg1);
		};

		var emitError = function(arg1) {
			api.emit('error', (typeof arg1 === 'string') ? this + arg1 : arg1);
		};

		window.__onGCastApiAvailable = function(loaded, errorInfo) {
			if (!loaded) {
				api.emit('error', 'api failed with error ' + errorInfo);
				return false;
			}

			// api.emit('log', 'api load ok');

			var sessionRequest = new chrome.cast.SessionRequest(APPLICATION_ID);

			var sessionUpdateListener = function(isAlive) {
				var message = (isAlive ? 'session_updated' : 'session_removed');

				api.emit(message, SESSION.sessionId);

				if (!isAlive) {
					SESSION = null;
				}
			};

			var receiverMessage = function(namespace, message) {
				// api.emit('log', '<- ' + message);

				api.emit('message', message);
			};

			var sessionListener = function(ev) {
				// api.emit('log', 'sessionListener');
				SESSION = ev;

				// api.emit('log', 'session id: ' + ev.sessionId);

				SESSION.addUpdateListener(sessionUpdateListener);  

				SESSION.addMessageListener(NAMESPACE, receiverMessage);

				for (var i = 0, I = QUEUED_MESSAGES.length; i < I; ++i) {
					api.send( QUEUED_MESSAGES.shift() );
				}
			};

			var requestSession = function() {
				// api.emit('log', 'requesting session...');
				chrome.cast.requestSession(sessionListener, emitError.bind('requestSession error:'));
			};

			var receiverListener = function(ev) {
				if (ev === chrome.cast.ReceiverAvailability.AVAILABLE) {
					// api.emit('log', 'receiver available!');

					requestSession();
				}
				/*else {
					api.emit('log', 'receiver ' + ev);
				}*/
			};

			var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sessionListener, receiverListener);

			api.send = function(message) {
				if (!SESSION) {
					QUEUED_MESSAGES.push(message);
					// api.emit('log', 'sendMessage: delaying sending for when session is available...');
					return requestSession();
				}

				// log('-> ' + message);
				SESSION.sendMessage(
					NAMESPACE,
					message,
					noop, //onGeneric.bind('sendMessage ok:'),
					emitError.bind('sendMessage error:')
				);
			};

			chrome.cast.initialize(apiConfig, emitOk.bind('ready'), emitError.bind('ready error:'));

		};
		
	};

	return api;

};
