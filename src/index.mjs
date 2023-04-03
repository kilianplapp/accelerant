import { settings } from './settings.js'
import { webgl } from './methods/webgl.js';
import { obfuscate } from './utils/obfuscate.js';
import { startRecording } from './methods/mouse-movements.js';
import { getCookie } from './utils/get-cookie.js'
import { detectSupportedAudioFormats } from './methods/audio-formats.js';
var payload = {
	"wbgl": await webgl(), // webgl information
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
	"msmv": await startRecording(25) // mouse movements
}

// Make a POST request to the API endpoint with the obfuscated data as the request body
fetch(settings.API_ENDPOINT, {
	method: 'POST',
	headers: { 'Content-Type': 'text/plain' },
	body: JSON.stringify({ 'accelerant':getCookie('accelerant'), 'data': obfuscate(JSON.stringify(payload)) })
}).then((response)=> response.json())
.then((data) =>document.cookie = `accelerant=${data.accelerant}`);

