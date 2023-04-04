function sha512(text) {
  return new Promise((resolve, reject) => {
    let buffer = (new TextEncoder).encode(text);

    crypto.subtle.digest('SHA-512', buffer.buffer).then(result => {
      resolve(Array.from(new Uint8Array(result)).map(
        c => c.toString(16).padStart(2, '0')
      ).join(''));
    }, reject);
  });
}

addEventListener('message', async (event) => {
  begin = Date.now();
  let data = event.data.data;
  let difficulty = event.data.difficulty;

  let hash;
  let nonce = 0;
  do {
    hash = await sha512(data + nonce);
  } while(hash.substr(0, difficulty) !== Array(difficulty + 1).join('0'));

  postMessage({ 
    hash,
    nonce, // add nonce to result
    data,
    difficulty,
    begin
  });
});
