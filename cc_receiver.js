setupChromeCastReceiver = function(APPLICATION_ID, NAMESPACE) {
	'use strict';



	var api = {};
	window.eventEmitter(api);



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

			if (CRM.getSenders().length === 0) {
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
		MB.send(senderId, data);
	};

	api.broadcast = function(data) {
		var i, I, sender, senders = CRM.getSenders();
		for (i = 0, I = senders.length; i < I; ++i) {
			sender = senders[i];
			MB.send(sender.senderId, data);
		}
	};

	return api;

};
