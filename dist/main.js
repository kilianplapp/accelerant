/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/methods/audio-formats.js":
/*!*************************************!*\
  !*** ./js/methods/audio-formats.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"detectSupportedAudioFormats\": () => (/* binding */ detectSupportedAudioFormats)\n/* harmony export */ });\nfunction detectSupportedAudioFormats() {\n    var audioElement = document.createElement('audio');\n    var formats = [\n      {ext: 'mp3', type: 'audio/mpeg'},\n      {ext: 'ogg', type: 'audio/ogg; codecs=\"vorbis\"'},\n      {ext: 'wav', type: 'audio/wav; codecs=\"1\"'},\n      {ext: 'aac', type: 'audio/aac'},\n      {ext: 'm4a', type: 'audio/mp4; codecs=\"mp4a.40.2\"'},\n      {ext: 'webm', type: 'audio/webm; codecs=\"vorbis\"'},\n      {ext: 'opus', type: 'audio/opus'},\n      {ext: 'flac', type: 'audio/flac'}\n    ];\n    var supportedFormats = [];\n  \n    for (var i = 0; i < formats.length; i++) {\n      var canPlay = audioElement.canPlayType(formats[i].type);\n      if (canPlay === 'probably' || canPlay === 'maybe') {\n        supportedFormats.push(formats[i].ext);\n      }\n    }\n  \n    return supportedFormats;\n  }\n\n//# sourceURL=webpack://accelerant/./js/methods/audio-formats.js?");

/***/ }),

/***/ "./js/methods/mouse-movements.js":
/*!***************************************!*\
  !*** ./js/methods/mouse-movements.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"startRecording\": () => (/* binding */ startRecording)\n/* harmony export */ });\nconst mouseData = [];\nlet lastMoveTime = 0;\n\nfunction addMouseMovement(event) {\n    const currentTime = Date.now();\n    if (currentTime - lastMoveTime > 250) {\n        lastMoveTime = currentTime\n        const dataPoint = {\n            x: event.clientX,\n            y: event.clientY,\n            timestamp: currentTime\n          };\n        mouseData.push(dataPoint);\n    }\n\n}\n\nasync function startRecording(length) {\n    document.addEventListener(\"mousemove\", addMouseMovement)\n    while (mouseData.length <= length) {\n        await new Promise(resolve => setTimeout(resolve, 500))\n    }\n    document.removeEventListener(\"mousemove\", addMouseMovement)\n    return mouseData\n}\n\n//# sourceURL=webpack://accelerant/./js/methods/mouse-movements.js?");

/***/ }),

/***/ "./js/methods/webgl.js":
/*!*****************************!*\
  !*** ./js/methods/webgl.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"webgl\": () => (/* binding */ webgl)\n/* harmony export */ });\n/* harmony import */ var _utils_hash_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/hash.js */ \"./js/utils/hash.js\");\n\n\nasync function webgl() {\n\tvar canvas, ctx, width = 256, height = 128;\n\tcanvas = document.createElement(\"canvas\");\n\tcanvas.width = width,\n\t\tcanvas.height = height,\n\t\tctx = canvas.getContext(\"webgl2\") || canvas.getContext(\"experimental-webgl2\") || canvas.getContext(\"webgl\") || canvas.getContext(\"experimental-webgl\") || canvas.getContext(\"moz-webgl\");\n\n\ttry {\n\t\tvar f = \"attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}\";\n\t\tvar g = \"precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}\";\n\t\tvar h = ctx.createBuffer();\n\n\t\tctx.bindBuffer(ctx.ARRAY_BUFFER, h);\n\n\t\tvar i = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .7321, 0]);\n\n\t\tctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW), h.itemSize = 3, h.numItems = 3;\n\n\t\tvar j = ctx.createProgram();\n\t\tvar k = ctx.createShader(ctx.VERTEX_SHADER);\n\n\t\tctx.shaderSource(k, f);\n\t\tctx.compileShader(k);\n\n\t\tvar l = ctx.createShader(ctx.FRAGMENT_SHADER);\n\n\t\tctx.shaderSource(l, g);\n\t\tctx.compileShader(l);\n\t\tctx.attachShader(j, k);\n\t\tctx.attachShader(j, l);\n\t\tctx.linkProgram(j);\n\t\tctx.useProgram(j);\n\n\t\tj.vertexPosAttrib = ctx.getAttribLocation(j, \"attrVertex\");\n\t\tj.offsetUniform = ctx.getUniformLocation(j, \"uniformOffset\");\n\n\t\tctx.enableVertexAttribArray(j.vertexPosArray);\n\t\tctx.vertexAttribPointer(j.vertexPosAttrib, h.itemSize, ctx.FLOAT, !1, 0, 0);\n\t\tctx.uniform2f(j.offsetUniform, 1, 1);\n\t\tctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems);\n\n\t}\n\tcatch (e) { }\n\n\tvar m = \"\";\n\n\tvar n = new Uint8Array(width * height * 4);\n\tctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, n);\n\tm = JSON.stringify(n).replace(/,?\"[0-9]+\":/g, \"\");\n\tconst ext = ctx.getExtension(\"WEBGL_debug_renderer_info\");\n\treturn { \"fngp\": await (0,_utils_hash_js__WEBPACK_IMPORTED_MODULE_0__.hash)(m), \"vrsn\": ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL), \"vndr\": ctx.getParameter(ext.UNMASKED_VENDOR_WEBGL) }\n}\n\n\n//# sourceURL=webpack://accelerant/./js/methods/webgl.js?");

/***/ }),

/***/ "./js/settings.js":
/*!************************!*\
  !*** ./js/settings.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"settings\": () => (/* binding */ settings)\n/* harmony export */ });\n\nconst settings = {\n    API_ENDPOINT: \"https://prod.kilianpl.app/api/accelerant\",\n    PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs0lik0tgWtchY8dy9REk\nQwywEqKdLSD4gY4laTRBKx4dhLSsJk8Goq+iijCtaiMjyKHp1EWTEuq3oTSmCh40\npb7xbKxatl+OVOPoZape3XywywMmzWmmhO7Ak0IUQ9m4OuijLH9BlQ00Jqy4SvTj\nqD17BvTAUqAuBIaNhTPoycJ2hKcYjHZL7x5QaS+dYAekNWGSExvQBDI3VsF0G35a\nyksmeZUrxBZ2WWrl9jc2JhqsPnJvKa/7uAS5pzlfveTRil7yErX8XMFSg/QD91yL\nK6UdQp2VEiJVs6Unii4fReEukgfQjiF/MuHwzMBZTVG4+V+Q/FL5qiABAEjCDqWr\npQIDAQAB\n-----END PUBLIC KEY-----`\n}\n\n//# sourceURL=webpack://accelerant/./js/settings.js?");

/***/ }),

/***/ "./js/utils/get-cookie.js":
/*!********************************!*\
  !*** ./js/utils/get-cookie.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getCookie\": () => (/* binding */ getCookie)\n/* harmony export */ });\nfunction getCookie(name) {\n    // Split cookie string and get all individual name=value pairs in an array\n    var cookieArr = document.cookie.split(\";\");\n    // Loop through the array elements\n    for(var i = 0; i < cookieArr.length; i++) {\n        var cookiePair = cookieArr[i].split(\"=\");\n        /* Removing whitespace at the beginning of the cookie name\n        and compare it with the given string */\n        if(name == cookiePair[0].trim()) {\n            // Decode the cookie value and return\n            return decodeURIComponent(cookiePair[1]);\n        }\n    } \n    // Return null if not found\n    return null;\n}\n\n//# sourceURL=webpack://accelerant/./js/utils/get-cookie.js?");

/***/ }),

/***/ "./js/utils/hash.js":
/*!**************************!*\
  !*** ./js/utils/hash.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"hash\": () => (/* binding */ hash)\n/* harmony export */ });\nfunction hash(string) {\n\tconst utf8 = new TextEncoder().encode(string);\n\treturn crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {\n\t\tconst hashArray = Array.from(new Uint8Array(hashBuffer));\n\t\tconst hashHex = hashArray\n\t\t\t.map((bytes) => bytes.toString(16).padStart(2, '0'))\n\t\t\t.join('');\n\t\treturn hashHex;\n\t});\n}\n\n\n//# sourceURL=webpack://accelerant/./js/utils/hash.js?");

/***/ }),

/***/ "./js/utils/obfuscate.js":
/*!*******************************!*\
  !*** ./js/utils/obfuscate.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"encrypt\": () => (/* binding */ encrypt)\n/* harmony export */ });\n/* harmony import */ var _settings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../settings.js */ \"./js/settings.js\");\n\n\nasync function encrypt(message) {\n\t// Convert the public key from PEM format to CryptoKey format\n\tconst pemKey = _settings_js__WEBPACK_IMPORTED_MODULE_0__.settings.PUBLIC_KEY\n\tconst parsedKey = await window.crypto.subtle.importKey(\n\t  \"spki\",\n\t  pemToBinary(pemKey),\n\t  { name: \"RSA-OAEP\", hash: \"SHA-256\" },\n\t  true,\n\t  [\"encrypt\"]\n\t);\n  \n\t// Encrypt the message using the public key\n\tconst encodedMessage = new TextEncoder().encode(message);\n\tconst encryptedData = await window.crypto.subtle.encrypt(\n\t  { name: \"RSA-OAEP\" },\n\t  parsedKey,\n\t  encodedMessage\n\t);\n  \n\t// Return the encrypted data as a base64-encoded string\n\treturn btoa(String.fromCharCode(...new Uint8Array(encryptedData)));\n  }\n  \n  // Helper function to convert PEM keys to binary format\n  function pemToBinary(pemKey) {\n\tconst lines = pemKey.split(\"\\n\");\n\tconst base64 = lines.slice(1, -1).join(\"\");\n\treturn Uint8Array.from(atob(base64), c => c.charCodeAt(0));\n  }\n\n// export function obfuscate(str) {\n//     const key = settings.KEY\n// \tlet result = \"\";\n// \tfor (let i = 0; i < str.length; i++) {\n// \t\tconst keyChar = key[i % key.length];\n// \t\tconst keyInt = keyChar.charCodeAt(0);\n// \t\tresult += String.fromCharCode(keyInt ^ str.charCodeAt(i));\n// \t}\n// \treturn btoa(result);\n// }\n\n//# sourceURL=webpack://accelerant/./js/utils/obfuscate.js?");

/***/ }),

/***/ "./js/index.mjs":
/*!**********************!*\
  !*** ./js/index.mjs ***!
  \**********************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _settings_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./settings.js */ \"./js/settings.js\");\n/* harmony import */ var _methods_webgl_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./methods/webgl.js */ \"./js/methods/webgl.js\");\n/* harmony import */ var _utils_obfuscate_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/obfuscate.js */ \"./js/utils/obfuscate.js\");\n/* harmony import */ var _methods_mouse_movements_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./methods/mouse-movements.js */ \"./js/methods/mouse-movements.js\");\n/* harmony import */ var _utils_get_cookie_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/get-cookie.js */ \"./js/utils/get-cookie.js\");\n/* harmony import */ var _methods_audio_formats_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./methods/audio-formats.js */ \"./js/methods/audio-formats.js\");\n\n\n\n\n\n\nvar payload = {\n\t\"wbgl\": await (0,_methods_webgl_js__WEBPACK_IMPORTED_MODULE_1__.webgl)(), // webgl information\n\t\"htnm\": window.location.host || false, // hostname\n\t\"page\": window.location.pathname || false, // page\n\t\"otrh\": window.outerHeight || false, // outerheight\n\t\"otrw\": window.outerWidth || false, // outerwidth\n\t\"lang\": navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || false, // en-US\n\t\"dpxr\": window.devicePixelRatio || 1, // device pixel ratio\n\t\"uagt\": window.navigator.userAgent || false, // ua\n\t\"wdrv\": window.navigator.webdriver || false, // always be false\n\t\"lngs\": window.navigator.languages || false,\n\t\"bdid\": window.navigator.buildID || false, // firefox ONLY\n\t\"vvpt\": window.visualViewport.pageTop || 0, // visual viewport page top, check if page scrolled\n\t\"vvpl\": window.visualViewport.pageLeft || 0, // visual viewport page left, page may be zoomed\n\t\"afmt\": (0,_methods_audio_formats_js__WEBPACK_IMPORTED_MODULE_5__.detectSupportedAudioFormats)(), // audio formats\n\t\"msmv\": await (0,_methods_mouse_movements_js__WEBPACK_IMPORTED_MODULE_3__.startRecording)(25) // mouse movements\n}\n\n// Make a POST request to the API endpoint with the obfuscated data as the request body\nfetch(_settings_js__WEBPACK_IMPORTED_MODULE_0__.settings.API_ENDPOINT, {\n\tmethod: 'POST',\n\theaders: { 'Content-Type': 'text/plain' },\n\tbody: JSON.stringify({ 'accelerant': (0,_utils_get_cookie_js__WEBPACK_IMPORTED_MODULE_4__.getCookie)('accelerant'), 'data': await (0,_utils_obfuscate_js__WEBPACK_IMPORTED_MODULE_2__.encrypt)(JSON.stringify(payload)) })\n}).then((response) => response.json())\n\t.then((data) => {\n\t\tdocument.cookie = `accelerant=${data.accelerant}`\n\n\t\tvar star = document.createElement(\"img\")\n\t\tstar.src = _settings_js__WEBPACK_IMPORTED_MODULE_0__.settings.API_ENDPOINT + '/' + data.accelerant + '/star'\n\t\tdocument.body.appendChild(i)\n\t});\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack://accelerant/./js/index.mjs?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && !queue.d) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = 1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/index.mjs");
/******/ 	
/******/ })()
;