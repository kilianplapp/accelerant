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
  
  let nonce = 0;
  while (true) {
    const hash = await sha512(data + nonce);
    if (hash.substr(0, difficulty) === '0'.repeat(difficulty)) {
      postMessage({
        hash,
        nonce,
        data,
        difficulty,
        begin
      });
      break;
    }
    nonce++;
  }
});
