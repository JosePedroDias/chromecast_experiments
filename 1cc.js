(function() {
	'use strict';



	// GLOBALS
	var CRM, MB;

	var lastId;



	// https://developers.google.com/cast/docs/reference/receiver/
	// https://developers.google.com/cast/docs/receiver_apps
	// https://developers.google.com/cast/docs/custom_receiver



	log('Starting Receiver Manager...');
	CRM = cast.receiver.CastReceiverManager.getInstance();

	CRM.onReady = function(ev) {
		log('Received Ready event: ' + JSON.stringify(ev.data));
	};

	CRM.onSenderConnected = function(ev) {
		log('Received Sender Connected event: ' + ev.data);
		log( CRM.getSender(ev.data).userAgent );

		lastId = ev.data;
	};

	CRM.onSenderDisconnected = function(ev) {
		log('Received Sender Disconnected event: ' + ev.data);
		if (CRM.getSenders().length === 0) {

			if (ev.data === lastId) {
				lastId = undefined;
			}

			window.close();
		}
	};



	MB = CRM.getCastMessageBus(NAMESPACE);

	MB.onMessage = function(ev) {
		var from = ev.senderId;
		var mIn = ev.data;
		var mOut;// = mIn; // default is echoing

		log(from + ' <- ' + mIn);

		try {
			/*jshint evil:true*/
			mOut = eval( mIn );

			if (typeof mOut !== 'string') {
				mOut = String(mOut);
			}

			log(from + ' -> ' + mOut);

			MB.send(from, mOut);
		} catch (ex) {
			log(ex);
		}
	};



	window.send = function(data) {
		if (lastId) {
			MB.send(lastId, data);
		}
		else {
			log('no sender to send to!');
		}
	};



	CRM.start({statusText:'Application is starting'});
	log('CRM started?');

	log('APP VERSION ' + APP_VERSION);
    
})();
