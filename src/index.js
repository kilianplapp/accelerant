const API_ENDPOINT = "https://kilianpl.app/api/accelerant"

function webgl() {
	var canvas, ctx, width = 256, height = 128;
	canvas = document.createElement("canvas");
	canvas.width = width,
		canvas.height = height,
		ctx = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl") || canvas.getContext("moz-webgl");

	try {
		var f = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
		var g = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
		var h = ctx.createBuffer();

		ctx.bindBuffer(ctx.ARRAY_BUFFER, h);

		var i = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .7321, 0]);

		ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW), h.itemSize = 3, h.numItems = 3;

		var j = ctx.createProgram();
		var k = ctx.createShader(ctx.VERTEX_SHADER);

		ctx.shaderSource(k, f);
		ctx.compileShader(k);

		var l = ctx.createShader(ctx.FRAGMENT_SHADER);

		ctx.shaderSource(l, g);
		ctx.compileShader(l);
		ctx.attachShader(j, k);
		ctx.attachShader(j, l);
		ctx.linkProgram(j);
		ctx.useProgram(j);

		j.vertexPosAttrib = ctx.getAttribLocation(j, "attrVertex");
		j.offsetUniform = ctx.getUniformLocation(j, "uniformOffset");

		ctx.enableVertexAttribArray(j.vertexPosArray);
		ctx.vertexAttribPointer(j.vertexPosAttrib, h.itemSize, ctx.FLOAT, !1, 0, 0);
		ctx.uniform2f(j.offsetUniform, 1, 1);
		ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems);

	}
	catch (e) { }

	var m = "";

	var n = new Uint8Array(width * height * 4);
	ctx.readPixels(0, 0, width, height, ctx.RGBA, ctx.UNSIGNED_BYTE, n);
	m = JSON.stringify(n).replace(/,?"[0-9]+":/g, "");
	const ext = ctx.getExtension("WEBGL_debug_renderer_info");
	return { "fngp": hash(m), "vrsn": ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL), "vndr": ctx.getParameter(ext.UNMASKED_VENDOR_WEBGL) }
}

function hash(string) {
	const utf8 = new TextEncoder().encode(string);
	return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray
			.map((bytes) => bytes.toString(16).padStart(2, '0'))
			.join('');
		return hashHex;
	});
}

function obfuscate(str) {
	const key = "1KxIeFm2bC5xxEk89XGLVwRuDIRCqq0xlQRfYmiWkGXOPzFFsITZwp5RwMe6RWtn";
	let result = "";
	for (let i = 0; i < str.length; i++) {
		const keyChar = key[i % key.length];
		const keyInt = keyChar.charCodeAt(0);
		result += String.fromCharCode(keyInt ^ str.charCodeAt(i));
	}
	return btoa(result);
}
payload = {
	"wbgl": webgl(), // webgl information
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
	"vvpl": window.visualViewport.pageLeft || 0 // visual viewport page left, page may be zoomed
}
const obfuscatedData = obfuscate(JSON.stringify(payload));

// Make a POST request to the API endpoint with the obfuscated data as the request body
fetch(API_ENDPOINT, {
	method: 'POST',
	headers: { 'Content-Type': 'text/plain' },
	body: JSON.stringify({ 'data': obfuscatedData })
})
	.then(response => {
		if (response.ok) {
			console.log(response)
		} else {
			console.error('Failed!');
		}
	})
	.catch(error => {
		console.error('Failed!');
	});

console.log(payload)