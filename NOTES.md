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

* other formats via media player library https://developers.google.com/cast/docs/player


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
