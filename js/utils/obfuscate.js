import { settings } from '../settings.js'

export async function encrypt(message) {
	// Convert the public key from PEM format to CryptoKey format
	const pemKey = settings.PUBLIC_KEY
	const parsedKey = await window.crypto.subtle.importKey(
	  "spki",
	  pemToBinary(pemKey),
	  { name: "RSA-OAEP", hash: "SHA-256" },
	  true,
	  ["encrypt"]
	);
  
	// Encrypt the message using the public key
	const encodedMessage = new TextEncoder().encode(message);
	const encryptedData = await window.crypto.subtle.encrypt(
	  { name: "RSA-OAEP" },
	  parsedKey,
	  encodedMessage
	);
  
	// Return the encrypted data as a base64-encoded string
	return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  }
  
  // Helper function to convert PEM keys to binary format
  function pemToBinary(pemKey) {
	const lines = pemKey.split("\n");
	const base64 = lines.slice(1, -1).join("");
	return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
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