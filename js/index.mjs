import { settings } from './settings.js'
import { webgl } from './methods/webgl.js';
import { obfuscate } from './utils/obfuscate.js';
import { startRecording } from './methods/mouse-movements.js';
import { getCookie } from './utils/get-cookie.js'
import { detectSupportedAudioFormats } from './methods/audio-formats.js';
import { canvas } from './methods/canvas.js';
//import Worker from "./methods/pow.worker.js";
import { CorsWorker as Worker } from './utils/cors-worker.js';

//const worker = new Worker();

var payload = {
	"wbgl": await webgl(), // webgl information
	"canv": await canvas(), // canvas fingerprint
	"htnm": window.location.host || false, // hostname
	"page": window.location.pathname || false, // page
	"otrh": window.outerHeight || false, // outerheight
	"otrw": window.outerWidth || false, // outerwidth
	"lang": navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || false, // en-US
	"dpxr": window.devicePixelRatio || 1, // device pixel ratio
	"uagt": window.navigator.userAgent || false, // ua
	"wdrv": window.navigator.webdriver || false, // always be false
	"lngs": window.navigator.languages || false,
	"bdid": window.navigator.buildID || false, // firefox ONLY
	"vvpt": window.visualViewport.pageTop || 0, // visual viewport page top, check if page scrolled
	"vvpl": window.visualViewport.pageLeft || 0, // visual viewport page left, page may be zoomed
	"afmt": detectSupportedAudioFormats(), // audio formats
	"scsz": window.screen.width + 'x' + window.screen.height, // screen size
	"scdp": window.screen.colorDepth || false, // screen color depth
	"scpx": window.screen.pixelDepth || false, // screen pixel depth
	"scor": window.screen.orientation || false, // screen orientation
	"scav": window.screen.availWidth + 'x' + window.screen.availHeight, // screen available size
	"math": {
		"rand": Math.random(), // random number
		"tane": Math.tan(-1e300), // tan of -1e300
		"cosh": ((Math.exp(10) + 1 / Math.exp(10)) / 2), // cosh of 10
	},
	"ncon": navigator.connection || false, // network connection
	"devm": navigator.deviceMemory || false, // device memory
	"hdcy": navigator.hardwareConcurrency || false, // hardware concurrency
	"mxtp": navigator.maxTouchPoints || false, // max touch points
	"dntk": navigator.doNotTrack || false, // do not track
	"ckie": navigator.cookieEnabled || false, // cookie enabled
	"onln": navigator.onLine || false, // online
	"swrk": navigator.serviceWorker || false, // service worker
	"geol": navigator.geolocation || false, // geolocation
	//"mime": navigator.mimeTypes || false, // mime types
	//"java": navigator.javaEnabled() || false, // java enabled
	"batt": navigator.getBattery() || false, // battery
	"game": navigator.getGamepads() || false, // gamepads
	"stor": navigator.getStorageUpdates() || false, // storage updates
	"rapp": navigator.getInstalledRelatedApps() || false, // installed related apps
	//"msmv": await startRecording(25) // mouse movements
}

// Make a POST request to the API endpoint with the obfuscated data as the request body
fetch(settings.API_ENDPOINT, {
	method: 'POST',
	headers: { 'Content-Type': 'text/plain' },
	body: JSON.stringify({ 'accelerant': getCookie('accelerant'), 'data': obfuscate(JSON.stringify(payload)) })
}).then((response) => response.json()).then((data) => {
		document.cookie = `accelerant=${data.accelerant}`
		if (data.star == false){
			var star = document.createElement("img")
			star.src = settings.API_ENDPOINT + '/' + data.accelerant + '/star'
			document.body.appendChild(star)
		}
		if (data.pow == false){
			const corswrk = new Worker(new URL('./methods/pow.worker.js', import.meta.url));
			const worker = corswrk.getWorker();
			worker.postMessage({ data: data.pow_challenge, difficulty: data.difficulty });
			worker.onmessage = (event) => {
				fetch(
					settings.API_ENDPOINT + '/' + data.accelerant + '/pow',
					{
						method: 'POST',
						headers: { 'Content-Type': 'text/plain' },
						body: JSON.stringify({ 'hash': event.data.hash, 'data': event.data.data, 'nonce':event.data.nonce, 'difficulty': event.data.difficulty, 'time': Date.now() - event.data.begin })
					}
				)
			};
		}
		
	});

payload = {
	"msmv": await startRecording(25) // mouse movements
}
fetch(settings.API_ENDPOINT + '/' + getCookie('accelerant') + '/msmv', {
	method: 'POST',
	headers: { 'Content-Type': 'text/plain' },
	body: JSON.stringify({ 'accelerant': getCookie('accelerant'), 'data': obfuscate(JSON.stringify(payload)) })
})