window.eventEmitter = function(objectToEnrich) {

	'use strict';



	var subscribers = {};

	var emit = function(evName, data) {
		var i, I, item, bag = subscribers[evName];
		if (!bag) { return; }
		for (i = 0, I = bag.length; i < I; ++i) {
			item = bag[i];
			if (typeof item === 'function') { // on
				item(data);
			}
			else { // once
				item(data[0]);
				bag.splice(i, 1); --i;
			}
		}
	};

	var on = function(eventName, cb) {
		var bag = subscribers[eventName];
		if (!bag) { subscribers[eventName] = bag = []; }
		bag.push(cb);
	};

	var once = function(eventName, cb) {
		var bag = subscribers[eventName];
		if (!bag) { subscribers[eventName] = bag = []; }
		bag.push([cb]);
	};

	var off = function(eventName, cb) {
		var i, I, item, killIt, bag = subscribers[eventName];
		if (!bag) { return; }
		for (i = 0, I = bag.length; i < I; ++i) {
			item = bag[i];
			item = (typeof item === 'function') ? item : item[0];
			if (item === cb) {
				bag.splice(i, 1); --i;
			}
		}
	};


	objectToEnrich.emit = emit;
	objectToEnrich.on   = on;
	objectToEnrich.once = once;
	objectToEnrich.off  = off;

};
