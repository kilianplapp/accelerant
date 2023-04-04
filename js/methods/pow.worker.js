async function sha512(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest("SHA-512", data);
  const hex = Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return hex;
}

addEventListener('message', async (event) => {
  begin = Date.now();
  let data = event.data.data;
  let difficulty = event.data.difficulty;

  let hash;
  let nonce = 0;
  do {
    hash = await sha512(data + nonce++);
  } while(hash.substr(0, difficulty) !== Array(difficulty + 1).join('0'));

  postMessage({ 
    hash,
    nonce, // add nonce to result
    data,
    difficulty,
    begin
  });
});
