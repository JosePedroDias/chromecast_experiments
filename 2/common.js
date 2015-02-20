var CC_APPLICATION_ID = '80F61391';
var CC_NAMESPACE      = 'urn:x-cast:com.josepedrodias.xpcc.second';

var APP_VERSION = '150220_v009';



var log = function() { window.console.log.apply(window.console, arguments); };

var qs = function(sel, from) { return (from || document).querySelector(sel); };

var qsa = function(sel, from) { return (from || document).querySelectorAll(sel); };

var setText = function(el, text) { el.firstChild.nodeValue = text; };
