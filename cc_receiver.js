setupChromeCastReceiver = function(APPLICATION_ID, NAMESPACE) {
	'use strict';



	var api = {};
	window.eventEmitter(api);



	// https://developers.google.com/cast/docs/reference/receiver/

	var CRM, MB;

	api.start = function() {
		CRM = cast.receiver.CastReceiverManager.getInstance();

		CRM.onReady = function(ev) {
			api.emit('ready', ev.data);
		};

		CRM.onSenderConnected = function(ev) {
			api.emit('sender_connected', ev.data);
		};

		CRM.onSenderDisconnected = function(ev) {
			api.emit('sender_disconnected', ev.data);

			if (CRM.getSenders().length === 0) { // THIS IS OPTIONAL
				api.emit('closing');
				window.close();
			}
		};


		MB = CRM.getCastMessageBus(NAMESPACE);

		MB.onMessage = function(ev) {
			api.emit('message', {senderId:ev.senderId, data:ev.data});
		};


		CRM.start({statusText:'Application is starting'});
	};

	api.send = function(senderId, data) {
		if (typeof data !== 'string') {
			data = JSON.stringify(data);
		}

		MB.send(senderId, data);
	};

	api.broadcast = function(data) {
		if (typeof data !== 'string') {
			data = JSON.stringify(data);
		}

		var i, I, sender, senders = CRM.getSenders();
		for (i = 0, I = senders.length; i < I; ++i) {
			MB.send(senders[i], data);
		}
	};

	return api;

};
