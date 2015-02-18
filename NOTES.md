# NOTES


## Specs

* http://en.wikipedia.org/wiki/Chromecast
* https://www.ifixit.com/Teardown/Chromecast+Teardown/16069


## What does it run

* a google chrome browser. latest user agent is `Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.51 Safari/537.36 CrKey/26653`
* capable of rendering SVG, canvas w/ webGL, video and audio (codecs tested: h264+aac; mp3?)
* window resolution is:
* 1280 x 720 px


## What kinda runs

* other formats via the [media player library](https://developers.google.com/cast/docs/player)


## Not tested yet:

* websockets
* WebRTC


## Limitations

* https://developers.google.com/cast/docs/media <---
* media (video, audio, images) can be server elsewhere via http
* scripts and pages must be hosted in https (I use [divshot](https://divshot.com/) to deploy my stuff).
* AJAX requests are not possible
* there is no full screeen API, not even the legacy one for video. One has to hack the video dims do the screen size
* video elements with opacity do not show up


## Sessions

Apparently if no incoming info is received from an opened session for some seconds, the session is closed.  
I managed to avoid this by sending echo packets periodically with a `setInterval`.


## What I hacked so far

The default cast_sender implementation doesn't populate any useful information synchronously to chome.cast.
I forced a change to it where the look for chromecast extensions occurs via synchronous AJAX requests.
This way one can have an immediate answer wether the CC extension exists or not.
This fires a warning in the console but it pays off nevertheless.

I made two APIs, [cc_sender](cc_sender.js) and [cc_receiver](cc_receiver.js),
using the Event Emitter pattern to simplify the chromecast communication setup.

In order not to be trolled by cached chromecast pages on the device, I added 2 features to my experiences:
* both the browser-side and chromecast-side import common.js, sharing at least CC APPLICATION_ID and NAMESPACE.
* chromecast pages point to a no-cache [cache.manifest](cache.manifest).
* sometimes I get cached files served still, but now I can identify the clearly (cc can send its version back at session startup) and the manifest supposedly minimizes cache hits.


## Debugging

The chromecast exposes a page to use the web developer tools remotely

Go to the chromecast's IP address, port 9222, such as `http://10.134.131.40:9222/`

If you're wondering how to find your chromecast's IP address, simply add an img tag with an URL (can be 404) to the chromecast-running page.
You'll see CC trying to fetch it from your dummy web server (such as `python -m SimpleHTTPServer`)
