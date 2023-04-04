import { settings } from "../settings.js";

export function obfuscate(str) {
    const key = settings.KEY
	let result = "";
	for (let i = 0; i < str.length; i++) {
		const keyChar = key[i % key.length];
		const keyInt = keyChar.charCodeAt(0);
		result += String.fromCharCode(keyInt ^ str.charCodeAt(i));
	}
	return btoa(result);
}