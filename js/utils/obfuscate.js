export async function encrypt(message, key) {
	const encoder = new TextEncoder();
	const data = encoder.encode(message);
  
	// Convert the key to an ArrayBuffer
	const keyArrayBuffer = encoder.encode(key).buffer;
  
	const cryptoKey = await window.crypto.subtle.importKey(
	  "raw",
	  keyArrayBuffer,
	  "AES-CBC",
	  false,
	  ["encrypt"]
	);
  
	const iv = window.crypto.getRandomValues(new Uint8Array(16));
  
	const encrypted = await window.crypto.subtle.encrypt(
	  {
		name: "AES-CBC",
		iv: iv,
	  },
	  cryptoKey,
	  data
	);
  
	const encryptedArray = new Uint8Array(encrypted);
	const ivArray = new Uint8Array(iv);
	const combined = new Uint8Array(ivArray.length + encryptedArray.length);
  
	combined.set(ivArray);
	combined.set(encryptedArray, ivArray.length);
  
	return btoa(String.fromCharCode.apply(null, combined));
  }
  

// export function obfuscate(str) {
//     const key = settings.KEY
// 	let result = "";
// 	for (let i = 0; i < str.length; i++) {
// 		const keyChar = key[i % key.length];
// 		const keyInt = keyChar.charCodeAt(0);
// 		result += String.fromCharCode(keyInt ^ str.charCodeAt(i));
// 	}
// 	return btoa(result);
// }