import { settings } from './settings.js'
import { webgl } from './methods/webgl.js';
import { obfuscate } from './utils/obfuscate.js';
import { startRecording } from './methods/mouse-movements.js';
import { isServiceWorkerInstallable } from './methods/service-worker.js' 
var payload = {
	"wbgl": await webgl(), // webgl information
	"htnm": window.location.host, // hostname
	"otrh": window.outerHeight, // outerheight
	"otrw": window.outerWidth, // outerwidth
	"lang": navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || '', // en-US
	"dpxr": window.devicePixelRatio || 1, // device pixel ratio
	"uagt": window.navigator.userAgent || '', // ua
	"wdrv": window.navigator.webdriver || '', // always be false
	"lngs": window.navigator.languages || [],
	"bdid": window.navigator.buildID || '', // firefox ONLY
	"vvpt": window.visualViewport.pageTop || 0, // visual viewport page top, check if page scrolled
	"vvpl": window.visualViewport.pageLeft || 0, // visual viewport page left, page may be zoomed
	"svwk": isServiceWorkerInstallable(),
	"msmv": await startRecording(25)
}

// Make a POST request to the API endpoint with the obfuscated data as the request body
fetch(settings.API_ENDPOINT, {
	method: 'POST',
	headers: { 'Content-Type': 'text/plain' },
	body: JSON.stringify({ 'data': obfuscate(JSON.stringify(payload)) })
}).then((response)=> response.json())
.then((data) =>document.cookie = `accelerant=${data.accelerant}`);

